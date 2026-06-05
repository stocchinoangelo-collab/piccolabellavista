from __future__ import annotations

import json
import os
import smtplib
import tempfile
import uuid
from datetime import date, datetime
from email.message import EmailMessage
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
BOOKINGS_FILE = DATA_DIR / "bookings.json"
PUBLIC_STATUSES = {"richiesta", "confermata"}
ALL_STATUSES = {"richiesta", "confermata", "cancellata"}


def ensure_storage() -> None:
    DATA_DIR.mkdir(exist_ok=True)
    if not BOOKINGS_FILE.exists():
        save_bookings([])


def load_bookings() -> list[dict]:
    ensure_storage()
    try:
        with BOOKINGS_FILE.open("r", encoding="utf-8") as file:
            data = json.load(file)
    except json.JSONDecodeError:
        return []
    return data if isinstance(data, list) else []


def save_bookings(bookings: list[dict]) -> None:
    DATA_DIR.mkdir(exist_ok=True)
    fd, temp_name = tempfile.mkstemp(dir=DATA_DIR, prefix="bookings_", suffix=".json")
    with os.fdopen(fd, "w", encoding="utf-8") as file:
        json.dump(bookings, file, ensure_ascii=False, indent=2)
    os.replace(temp_name, BOOKINGS_FILE)


def parse_iso_date(value: str) -> date:
    return datetime.strptime(value, "%Y-%m-%d").date()


def ranges_overlap(start_a: date, end_a: date, start_b: date, end_b: date) -> bool:
    return start_a < end_b and start_b < end_a


def has_conflict(arrival: str, departure: str, bookings: list[dict], ignore_id: str | None = None) -> bool:
    new_start = parse_iso_date(arrival)
    new_end = parse_iso_date(departure)

    for booking in bookings:
        if booking.get("id") == ignore_id or booking.get("status") not in PUBLIC_STATUSES:
            continue
        old_start = parse_iso_date(booking["arrival"])
        old_end = parse_iso_date(booking["departure"])
        if ranges_overlap(new_start, new_end, old_start, old_end):
            return True
    return False


def validate_booking(payload: dict, existing: list[dict], ignore_id: str | None = None) -> tuple[dict | None, str | None]:
    required = ["fullName", "phone", "email", "arrival", "departure", "guests"]
    cleaned = {key: str(payload.get(key, "")).strip() for key in required}
    cleaned["notes"] = str(payload.get("notes", "")).strip()

    if any(not cleaned[key] for key in required):
        return None, "Compila tutti i campi obbligatori."

    try:
        arrival = parse_iso_date(cleaned["arrival"])
        departure = parse_iso_date(cleaned["departure"])
    except ValueError:
        return None, "Le date non sono valide."

    if arrival < date.today():
        return None, "La data di arrivo non può essere nel passato."
    if departure <= arrival:
        return None, "La data di partenza deve essere dopo la data di arrivo."

    try:
        guests = int(cleaned["guests"])
    except ValueError:
        return None, "Il numero ospiti non è valido."
    if guests < 1 or guests > 4:
        return None, "Il numero ospiti deve essere tra 1 e 4."

    if "@" not in cleaned["email"] or "." not in cleaned["email"]:
        return None, "Inserisci un indirizzo email valido."

    if has_conflict(cleaned["arrival"], cleaned["departure"], existing, ignore_id):
        return None, "Le date selezionate risultano già occupate."

    cleaned["guests"] = guests
    return cleaned, None


def public_bookings(bookings: list[dict]) -> list[dict]:
    return [
        {
            "id": booking["id"],
            "arrival": booking["arrival"],
            "departure": booking["departure"],
            "status": booking["status"],
        }
        for booking in bookings
        if booking.get("status") in PUBLIC_STATUSES
    ]


def send_booking_email(booking: dict) -> bool:
    host = os.getenv("PB_SMTP_HOST")
    port = int(os.getenv("PB_SMTP_PORT", "587"))
    user = os.getenv("PB_SMTP_USER")
    password = os.getenv("PB_SMTP_PASSWORD")
    recipient = os.getenv("PB_NOTIFY_EMAIL")

    if not all([host, user, password, recipient]):
        return False

    message = EmailMessage()
    message["Subject"] = "Nuova richiesta Piccola Bellavista"
    message["From"] = user
    message["To"] = recipient
    message.set_content(
        "\n".join(
            [
                "Nuova richiesta di prenotazione",
                f"Nome: {booking['fullName']}",
                f"Telefono: {booking['phone']}",
                f"Email: {booking['email']}",
                f"Arrivo: {booking['arrival']}",
                f"Partenza: {booking['departure']}",
                f"Ospiti: {booking['guests']}",
                f"Note: {booking.get('notes') or '-'}",
            ]
        )
    )

    with smtplib.SMTP(host, port, timeout=10) as smtp:
        smtp.starttls()
        smtp.login(user, password)
        smtp.send_message(message)
    return True


class PiccolaBellavistaHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(BASE_DIR), **kwargs)

    def do_GET(self) -> None:
        path = urlparse(self.path).path
        if path == "/api/bookings":
            self.send_json(public_bookings(load_bookings()))
            return
        if path == "/api/admin/bookings":
            self.send_json(load_bookings())
            return
        super().do_GET()

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        if path == "/api/bookings":
            self.create_booking()
            return
        self.send_error(HTTPStatus.NOT_FOUND, "Endpoint non trovato")

    def do_PUT(self) -> None:
        path = urlparse(self.path).path
        if path.startswith("/api/admin/bookings/"):
            booking_id = path.rsplit("/", 1)[-1]
            self.update_booking(booking_id)
            return
        self.send_error(HTTPStatus.NOT_FOUND, "Endpoint non trovato")

    def read_json_body(self) -> dict:
        length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(length).decode("utf-8")
        return json.loads(raw_body or "{}")

    def send_json(self, payload: object, status: HTTPStatus = HTTPStatus.OK) -> None:
        encoded = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)

    def create_booking(self) -> None:
        try:
            payload = self.read_json_body()
        except json.JSONDecodeError:
            self.send_json({"ok": False, "message": "Richiesta non valida."}, HTTPStatus.BAD_REQUEST)
            return

        bookings = load_bookings()
        cleaned, error = validate_booking(payload, bookings)
        if error:
            self.send_json({"ok": False, "message": error}, HTTPStatus.BAD_REQUEST)
            return

        booking = {
            "id": uuid.uuid4().hex[:10],
            "createdAt": datetime.now().isoformat(timespec="seconds"),
            "status": "richiesta",
            **cleaned,
        }
        bookings.append(booking)
        save_bookings(bookings)

        email_sent = False
        try:
            email_sent = send_booking_email(booking)
        except Exception:
            email_sent = False

        self.send_json(
            {
                "ok": True,
                "message": "Richiesta inviata correttamente. Ti risponderemo al più presto.",
                "booking": booking,
                "emailSent": email_sent,
            },
            HTTPStatus.CREATED,
        )

    def update_booking(self, booking_id: str) -> None:
        try:
            payload = self.read_json_body()
        except json.JSONDecodeError:
            self.send_json({"ok": False, "message": "Richiesta non valida."}, HTTPStatus.BAD_REQUEST)
            return

        bookings = load_bookings()
        for index, booking in enumerate(bookings):
            if booking.get("id") != booking_id:
                continue

            updated = {**booking, **payload}
            status = str(updated.get("status", "")).strip()
            if status not in ALL_STATUSES:
                self.send_json({"ok": False, "message": "Stato prenotazione non valido."}, HTTPStatus.BAD_REQUEST)
                return

            cleaned, error = validate_booking(updated, bookings, ignore_id=booking_id)
            if error and status != "cancellata":
                self.send_json({"ok": False, "message": error}, HTTPStatus.BAD_REQUEST)
                return

            updated.update(cleaned or {})
            updated["status"] = status
            updated["updatedAt"] = datetime.now().isoformat(timespec="seconds")
            bookings[index] = updated
            save_bookings(bookings)
            self.send_json({"ok": True, "booking": updated})
            return

        self.send_json({"ok": False, "message": "Prenotazione non trovata."}, HTTPStatus.NOT_FOUND)


def main() -> None:
    ensure_storage()
    port = int(os.getenv("PORT", "8080"))
    server = ThreadingHTTPServer(("127.0.0.1", port), PiccolaBellavistaHandler)
    print(f"Piccola Bellavista avviato su http://127.0.0.1:{port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
