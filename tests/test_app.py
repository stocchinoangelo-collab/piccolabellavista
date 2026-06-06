import os
import tempfile
import unittest
from datetime import date, timedelta
from pathlib import Path

import app


class AppTestCase(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.original_data_dir = app.DATA_DIR
        self.original_bookings_file = app.BOOKINGS_FILE
        app.DATA_DIR = Path(self.temp_dir.name)
        app.BOOKINGS_FILE = app.DATA_DIR / "bookings.json"

    def tearDown(self):
        app.DATA_DIR = self.original_data_dir
        app.BOOKINGS_FILE = self.original_bookings_file
        self.temp_dir.cleanup()

    def future_dates(self, start_offset=30, nights=2):
        arrival = date.today() + timedelta(days=start_offset)
        departure = arrival + timedelta(days=nights)
        return arrival.isoformat(), departure.isoformat()

    def valid_payload(self, **overrides):
        arrival, departure = self.future_dates()
        payload = {
            "fullName": "Mario Rossi",
            "phone": "+390000000000",
            "email": "mario@example.com",
            "arrival": arrival,
            "departure": departure,
            "guests": "2",
            "notes": "Arrivo in serata",
        }
        payload.update(overrides)
        return payload


class BookingValidationTests(AppTestCase):
    def test_validate_booking_accepts_valid_request(self):
        cleaned, error = app.validate_booking(self.valid_payload(), [])

        self.assertIsNone(error)
        self.assertEqual(cleaned["guests"], 2)
        self.assertEqual(cleaned["email"], "mario@example.com")

    def test_validate_booking_rejects_departure_not_after_arrival(self):
        arrival, _ = self.future_dates()
        cleaned, error = app.validate_booking(
            self.valid_payload(arrival=arrival, departure=arrival),
            [],
        )

        self.assertIsNone(cleaned)
        self.assertEqual(error, "La data di partenza deve essere dopo la data di arrivo.")

    def test_validate_booking_rejects_conflicting_public_booking(self):
        arrival, departure = self.future_dates()
        existing = [
            {
                "id": "abc123",
                "arrival": arrival,
                "departure": departure,
                "status": "confermata",
            }
        ]

        cleaned, error = app.validate_booking(self.valid_payload(arrival=arrival, departure=departure), existing)

        self.assertIsNone(cleaned)
        self.assertEqual(error, "Le date selezionate risultano già occupate.")


if __name__ == "__main__":
    unittest.main()
