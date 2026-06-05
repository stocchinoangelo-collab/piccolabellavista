const adminBody = document.querySelector("#adminBookings");
const adminMessage = document.querySelector("#adminMessage");
const refreshButton = document.querySelector("#refreshBookings");

function setAdminMessage(message, type = "") {
  adminMessage.textContent = message;
  adminMessage.className = `form-message ${type}`.trim();
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function inputCell(name, value, type = "text") {
  return `<input name="${name}" type="${type}" value="${escapeHtml(value)}">`;
}

function bookingRow(booking) {
  const tr = document.createElement("tr");
  tr.dataset.id = booking.id;
  tr.innerHTML = `
    <td>
      <select name="status">
        <option value="richiesta"${booking.status === "richiesta" ? " selected" : ""}>richiesta</option>
        <option value="confermata"${booking.status === "confermata" ? " selected" : ""}>confermata</option>
        <option value="cancellata"${booking.status === "cancellata" ? " selected" : ""}>cancellata</option>
      </select>
    </td>
    <td>${inputCell("fullName", booking.fullName)}</td>
    <td>
      ${inputCell("phone", booking.phone, "tel")}
      ${inputCell("email", booking.email, "email")}
    </td>
    <td>
      ${inputCell("arrival", booking.arrival, "date")}
      ${inputCell("departure", booking.departure, "date")}
    </td>
    <td>${inputCell("guests", booking.guests, "number")}</td>
    <td><textarea name="notes" rows="3">${escapeHtml(booking.notes)}</textarea></td>
    <td><button class="button primary admin-save" type="button">Salva</button></td>
  `;

  tr.querySelector(".admin-save").addEventListener("click", () => saveBooking(tr));
  return tr;
}

async function loadAdminBookings() {
  setAdminMessage("Caricamento...");
  try {
    const response = await fetch("/api/admin/bookings");
    const bookings = await response.json();
    adminBody.innerHTML = "";
    if (!bookings.length) {
      adminBody.innerHTML = '<tr><td colspan="7">Nessuna prenotazione presente.</td></tr>';
    } else {
      bookings
        .sort((a, b) => String(a.arrival).localeCompare(String(b.arrival)))
        .forEach((booking) => adminBody.append(bookingRow(booking)));
    }
    setAdminMessage("Prenotazioni aggiornate.", "success");
  } catch (error) {
    setAdminMessage("Impossibile caricare le prenotazioni.", "error");
  }
}

async function saveBooking(row) {
  const payload = {};
  row.querySelectorAll("input, select, textarea").forEach((field) => {
    payload[field.name] = field.value;
  });

  setAdminMessage("Salvataggio...");
  try {
    const response = await fetch(`/api/admin/bookings/${row.dataset.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    setAdminMessage(result.message || (response.ok ? "Prenotazione salvata." : "Errore salvataggio."), response.ok ? "success" : "error");
    if (response.ok) {
      await loadAdminBookings();
    }
  } catch (error) {
    setAdminMessage("Impossibile salvare la prenotazione.", "error");
  }
}

refreshButton.addEventListener("click", loadAdminBookings);
loadAdminBookings();
