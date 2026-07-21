/* ============================================================
   Fukuoka Trip — Schedule engine
   One config object per day page (window.PAGE) + this shared
   file renders the ruler grid, nav bar, entry form and events.
   ============================================================ */

(function () {
  "use strict";

  // All day pages, in order — edit this list if the week changes.
  const DAYS = [
    { file: "fri28aug.html", short: "FRI 28", color: "var(--fri)" },
    { file: "sat29aug.html", short: "SAT 29", color: "var(--sat)" },
    { file: "sun30aug.html", short: "SUN 30", color: "var(--sun)" },
    { file: "mon31aug.html", short: "MON 31", color: "var(--mon)" },
    { file: "tue01sep.html", short: "TUE 01", color: "var(--tue)" },
    { file: "wed02sep.html", short: "WED 02", color: "var(--wed)" },
  ];

  const START_HOUR = 8;   // grid starts 08:00
  const END_HOUR = 23;    // grid ends 23:00
  const PX_PER_MIN = 1;   // 60px per hour — keep in sync with style.css .ruler-hour height

  function toMinutes(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  }

  function fmt(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    const period = h < 12 ? "am" : "pm";
    const h12 = ((h + 11) % 12) + 1;
    return m === 0 ? `${h12}${period}` : `${h12}:${String(m).padStart(2, "0")}${period}`;
  }

  function uid() {
    return "e" + Math.random().toString(36).slice(2, 9);
  }

  // ---------------- Nav ----------------

  function renderNav(currentFile) {
    const nav = document.getElementById("dayNav");
    if (!nav) return;
    nav.innerHTML = "";

    DAYS.forEach((d) => {
      const a = document.createElement("a");
      a.href = d.file;
      a.textContent = d.short;
      a.style.setProperty("--pill-color", d.color);
      if (d.file === currentFile) a.classList.add("active");
      nav.appendChild(a);
    });
  }

  // ---------------- Grid scaffold ----------------

  function buildRuler(rulerEl) {
    rulerEl.innerHTML = "";
    for (let h = START_HOUR; h < END_HOUR; h++) {
      const cell = document.createElement("div");
      cell.className = "ruler-hour";
      const label = document.createElement("span");
      label.className = "label";
      label.textContent = String(h).padStart(2, "0") + "00";
      cell.appendChild(label);
      rulerEl.appendChild(cell);
    }
  }

  function totalTrackHeight() {
    return (END_HOUR - START_HOUR) * 60 * PX_PER_MIN;
  }

  // ---------------- Store ----------------

  function storeKey(pageFile) {
    return "fukuoka-trip:" + pageFile;
  }

  function loadEvents(pageFile, defaults) {
    try {
      const raw = localStorage.getItem(storeKey(pageFile));
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore corrupt storage */ }
    return defaults.map((ev) => Object.assign({ id: uid() }, ev));
  }

  function saveEvents(pageFile, events) {
    try {
      localStorage.setItem(storeKey(pageFile), JSON.stringify(events));
    } catch (e) { /* storage unavailable — edits stay in-memory only */ }
  }

  // ---------------- Render events ----------------

  function renderEvents(layerEl, events, dayColorVar, onEdit, onDelete) {
    layerEl.innerHTML = "";
    layerEl.style.height = totalTrackHeight() + "px";

    if (!events.length) {
      const note = document.createElement("div");
      note.className = "empty-note";
      note.textContent = "NO ENTRIES YET — ADD ONE BELOW";
      note.style.position = "absolute";
      note.style.top = "50%";
      note.style.left = "0";
      note.style.right = "0";
      note.style.transform = "translateY(-50%)";
      layerEl.appendChild(note);
      return;
    }

    const sorted = [...events].sort((a, b) => toMinutes(a.start) - toMinutes(b.start));

    sorted.forEach((ev) => {
      const startMin = Math.max(toMinutes(ev.start) - START_HOUR * 60, 0);
      const endMin = Math.min(toMinutes(ev.end) - START_HOUR * 60, totalTrackHeight() / PX_PER_MIN);
      const top = startMin * PX_PER_MIN;
      const height = Math.max((endMin - startMin) * PX_PER_MIN, 22);

      const card = document.createElement("div");
      card.className = "event" + (height < 40 ? " compact" : "");
      card.style.top = top + "px";
      card.style.height = height + "px";
      card.style.setProperty("--ev-color", dayColorVar);

      const title = document.createElement("p");
      title.className = "ev-title";
      title.textContent = ev.title;
      card.appendChild(title);

      const time = document.createElement("div");
      time.className = "ev-time";
      time.textContent = fmt(ev.start) + " \u2013 " + fmt(ev.end);
      card.appendChild(time);

      if (ev.location || ev.mapsUrl) {
        const meta = document.createElement("div");
        meta.className = "ev-meta";
        if (ev.location) {
          const loc = document.createElement("span");
          loc.className = "pin";
          loc.textContent = ev.location;
          meta.appendChild(loc);
        }
        if (ev.mapsUrl) {
          const link = document.createElement("a");
          link.href = ev.mapsUrl;
          link.target = "_blank";
          link.rel = "noopener";
          link.textContent = "Map \u2197";
          meta.appendChild(link);
        }
        card.appendChild(meta);
      }

      const actions = document.createElement("div");
      actions.className = "event-actions";
      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.title = "Edit";
      editBtn.textContent = "\u270E";
      editBtn.addEventListener("click", () => onEdit(ev.id));
      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.title = "Delete";
      delBtn.textContent = "\u2715";
      delBtn.addEventListener("click", () => onDelete(ev.id));
      actions.appendChild(editBtn);
      actions.appendChild(delBtn);
      card.appendChild(actions);

      layerEl.appendChild(card);
    });
  }

  // ---------------- Export ----------------

  function toCodeLiteral(events) {
    const lines = events
      .slice()
      .sort((a, b) => toMinutes(a.start) - toMinutes(b.start))
      .map((ev) => {
        return (
          "    { title: " + JSON.stringify(ev.title) +
          ", start: " + JSON.stringify(ev.start) +
          ", end: " + JSON.stringify(ev.end) +
          ", location: " + JSON.stringify(ev.location || "") +
          ", mapsUrl: " + JSON.stringify(ev.mapsUrl || "") + " },"
        );
      });
    return "const EVENTS_DEFAULT = [\n" + lines.join("\n") + "\n  ];";
  }

  // ---------------- Init ----------------

  function init(page) {
    document.addEventListener("DOMContentLoaded", () => {
      renderNav(page.file);

      const ruler = document.getElementById("ruler");
      const layer = document.getElementById("eventsLayer");
      const form = document.getElementById("entryForm");
      const msg = document.getElementById("formMsg");
      const exportArea = document.getElementById("exportArea");
      const exportBtn = document.getElementById("exportBtn");
      const cancelEditBtn = document.getElementById("cancelEditBtn");
      const submitBtn = document.getElementById("submitBtn");

      buildRuler(ruler);

      let events = loadEvents(page.file, page.defaults || []);
      let editingId = null;

      function paint() {
        renderEvents(layer, events, page.color, startEdit, remove);
        if (exportArea) exportArea.value = toCodeLiteral(events);
      }

      function startEdit(id) {
        const ev = events.find((e) => e.id === id);
        if (!ev) return;
        editingId = id;
        form.title.value = ev.title;
        form.start.value = ev.start;
        form.end.value = ev.end;
        form.location.value = ev.location || "";
        form.mapsUrl.value = ev.mapsUrl || "";
        submitBtn.textContent = "Update entry";
        cancelEditBtn.style.display = "inline-block";
        msg.textContent = "Editing \u201c" + ev.title + "\u201d";
        form.title.focus();
      }

      function resetForm() {
        editingId = null;
        form.reset();
        submitBtn.textContent = "Add to schedule";
        cancelEditBtn.style.display = "none";
        msg.textContent = "";
      }

      function remove(id) {
        events = events.filter((e) => e.id !== id);
        saveEvents(page.file, events);
        if (editingId === id) resetForm();
        paint();
      }

      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const data = {
            title: form.title.value.trim(),
            start: form.start.value,
            end: form.end.value,
            location: form.location.value.trim(),
            mapsUrl: form.mapsUrl.value.trim(),
          };
          if (!data.title || !data.start || !data.end) {
            msg.textContent = "Title, start and end are required.";
            return;
          }
          if (toMinutes(data.end) <= toMinutes(data.start)) {
            msg.textContent = "End time must be after start time.";
            return;
          }
          if (toMinutes(data.start) < START_HOUR * 60 || toMinutes(data.end) > END_HOUR * 60) {
            msg.textContent = `Times must fall between ${String(START_HOUR).padStart(2, "0")}:00 and ${String(END_HOUR).padStart(2, "0")}:00.`;
            return;
          }
          if (editingId) {
            events = events.map((e) => (e.id === editingId ? Object.assign({ id: e.id }, data) : e));
          } else {
            events.push(Object.assign({ id: uid() }, data));
          }
          saveEvents(page.file, events);
          resetForm();
          paint();
        });
      }

      if (cancelEditBtn) {
        cancelEditBtn.addEventListener("click", resetForm);
      }

      if (exportBtn) {
        exportBtn.addEventListener("click", () => {
          exportArea.value = toCodeLiteral(events);
          exportArea.select();
          if (navigator.clipboard) {
            navigator.clipboard.writeText(exportArea.value).then(() => {
              exportBtn.textContent = "Copied \u2713";
              setTimeout(() => (exportBtn.textContent = "Copy code"), 1600);
            });
          }
        });
      }

      paint();
    });
  }

  window.TripSchedule = { init, DAYS, renderNav };
})();
