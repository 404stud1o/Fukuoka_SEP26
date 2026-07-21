import json

DAYS = [
    dict(file="fri28aug.html", short="FRI 28", full="FRIDAY", date="28", month="AUGUST", color="fri"),
    dict(file="sat29aug.html", short="SAT 29", full="SATURDAY", date="29", month="AUGUST", color="sat"),
    dict(file="sun30aug.html", short="SUN 30", full="SUNDAY", date="30", month="AUGUST", color="sun"),
    dict(file="mon31aug.html", short="MON 31", full="MONDAY", date="31", month="AUGUST", color="mon"),
    dict(file="tue01sep.html", short="TUE 01", full="TUESDAY", date="01", month="SEPTEMBER", color="tue"),
    dict(file="wed02sep.html", short="WED 02", full="WEDNESDAY", date="02", month="SEPTEMBER", color="wed"),
]

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{full} {date} {month} — Fukuoka Trip</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="wrap">

  <h1 class="page-title" style="--day-color: var(--{color});">
    <span class="day-tick"></span>{full} {date} {month}
  </h1>

  <nav class="day-nav" id="dayNav" aria-label="Day navigation"></nav>

  <section class="schedule-card">
    <div class="schedule-grid">
      <div class="ruler" id="ruler"></div>
      <div class="track">
        <div class="events-layer" id="eventsLayer"></div>
      </div>
    </div>
  </section>

  <section class="entry-card">
    <h2>New entry</h2>
    <p class="entry-sub">Add an event to {full} {date} {month}</p>
    <form id="entryForm">
      <div class="entry-grid">
        <div class="field wide">
          <label for="title">Title</label>
          <input type="text" id="title" name="title" placeholder="e.g. Laser cutter induction" required>
        </div>
        <div class="field">
          <label for="start">Start</label>
          <input type="time" id="start" name="start" min="08:00" max="23:00" required>
        </div>
        <div class="field">
          <label for="end">End</label>
          <input type="time" id="end" name="end" min="08:00" max="23:00" required>
        </div>
        <div class="field wide">
          <label for="location">Location</label>
          <input type="text" id="location" name="location" placeholder="e.g. Workshop, Founder's Building">
        </div>
        <div class="field wide">
          <label for="mapsUrl">Google Maps link</label>
          <input type="url" id="mapsUrl" name="mapsUrl" placeholder="https://maps.app.goo.gl/...">
        </div>
      </div>
      <div class="entry-actions">
        <button type="submit" class="btn" id="submitBtn">Add to schedule</button>
        <button type="button" class="btn secondary" id="cancelEditBtn" style="display:none;">Cancel edit</button>
        <span class="form-msg" id="formMsg"></span>
      </div>
    </form>

    <details class="export-panel">
      <summary>Export code for this page</summary>
      <p>Entries you add are saved to this browser only. To make them visible to everyone who visits the page, copy the code below and paste it over the <code>EVENTS_DEFAULT</code> list near the bottom of <code>{file}</code>, then commit the file to your GitHub Pages repo.</p>
      <textarea id="exportArea" readonly spellcheck="false"></textarea>
      <button type="button" class="btn secondary" id="exportBtn" style="margin-top:10px;">Copy code</button>
    </details>
  </section>

  <footer class="foot">Fukuoka trip &middot; static schedule &middot; edits are stored in this browser until exported</footer>
</div>

<script src="schedule.js"></script>
<script>
  const EVENTS_DEFAULT = [
    // Paste exported entries here to make them permanent for all visitors.
  ];

  window.TripSchedule.init({{
    file: "{file}",
    color: "var(--{color})",
    defaults: EVENTS_DEFAULT,
  }});
</script>
</body>
</html>
"""

for d in DAYS:
    html = TEMPLATE.format(**d)
    with open(d["file"], "w") as f:
        f.write(html)

print("done")
