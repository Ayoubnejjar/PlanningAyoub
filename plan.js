// ======== INIT ========
const calendarGrid = document.getElementById("calendar-grid");
const currentMonth = document.getElementById("current-month");
const prevBtn = document.getElementById("prev-month");
const nextBtn = document.getElementById("next-month");
const toggleTheme = document.getElementById("toggle-theme");
const eventModal = document.getElementById("event-modal");
const closeModal = document.getElementById("close-modal");
const eventForm = document.getElementById("event-form");

let date = new Date();
let events = JSON.parse(localStorage.getItem("events")) || [];

// ============ Fonctions ==============

// Affiche le mois dans le haut
function renderHeader() {
  const options = { month: "long", year: "numeric" };
  currentMonth.textContent = date.toLocaleDateString("fr-FR", options);
}

// Génère le calendrier
function renderCalendar() {
  calendarGrid.innerHTML = "";

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    calendarGrid.appendChild(empty);
  }

  for (let d = 1; d <= lastDate; d++) {
    const cell = document.createElement("div");
    const span = document.createElement("span");
    span.textContent = d;
    cell.appendChild(span);

    const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    
    // Afficher les événements du jour
    events
      .filter(ev => ev.date === fullDate)
      .forEach(ev => {
        const eventDiv = document.createElement("div");
        eventDiv.className = "event";
        eventDiv.textContent = `${ev.time} - ${ev.title}`;
        cell.appendChild(eventDiv);
      });

    cell.addEventListener("click", () => openModal(fullDate));
    calendarGrid.appendChild(cell);
  }
}

function openModal(dateStr) {
  eventModal.classList.remove("hidden");
  eventForm.dataset.date = dateStr;
}

function closeModalWindow() {
  eventModal.classList.add("hidden");
  eventForm.reset();
}

// Enregistrer un événement
eventForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newEvent = {
    date: eventForm.dataset.date,
    title: document.getElementById("event-title").value,
    time: document.getElementById("event-time").value,
    description: document.getElementById("event-desc").value,
    category: document.getElementById("event-category").value,
  };
  events.push(newEvent);
  localStorage.setItem("events", JSON.stringify(events));
  closeModalWindow();
  renderCalendar();
});

closeModal.addEventListener("click", closeModalWindow);

// Boutons navigation
prevBtn.addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderHeader();
  renderCalendar();
});

nextBtn.addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderHeader();
  renderCalendar();
});

// Thème sombre / clair
toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Initialisation
renderHeader();
renderCalendar();