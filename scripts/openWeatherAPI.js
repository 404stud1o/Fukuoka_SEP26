const WEATHER_KEY = "ffdea6baff981b86318b58a3e28478a5";
const WEATHER_LOCATIONS = [
    { name: "赤坂（福岡市）<br>Akasaka, Fukuoka", lat: 33.5912646, lon: 130.3986278 },
    { name: "志摩桜井（糸島市）<br>Shimasakurai, Itoshima", lat: 33.6281963, lon: 130.1919889 },
    { name: "八幡東（北九州市）<br>Yahatahigashi, Kitakyushu", lat: 33.8719980, lon: 130.8081860 },
];

function groupByDay(list) {
    const days = {};
    list.forEach((entry) => {
        const date = entry.dt_txt.split(" ")[0];
        if (!days[date]) days[date] = [];
        days[date].push(entry);
    });
    // prefer the reading closest to midday for each date
    return Object.entries(days).map(([date, entries]) => {
        const midday = entries.reduce((best, e) => {
            const hour = Number(e.dt_txt.split(" ")[1].split(":")[0]);
            const bestHour = Number(best.dt_txt.split(" ")[1].split(":")[0]);
            return Math.abs(hour - 12) < Math.abs(bestHour - 12) ? e : best;
        });
        return { date, entry: midday };
    });
}

function renderWeatherCity(container, loc) {
    const card = document.createElement("div");
    card.className = "weather-city";
    card.innerHTML =
        '<div class="wx-city-name">' + loc.name + '</div>' +
        '<div class="wx-days" data-loading>Loading forecast&hellip;</div>';
    container.appendChild(card);

    const url = "https://api.openweathermap.org/data/2.5/forecast" +
        "?lat=" + loc.lat + "&lon=" + loc.lon +
        "&units=metric&appid=" + WEATHER_KEY;

    fetch(url)
        .then((res) => { if (!res.ok) throw new Error(res.status); return res.json(); })
        .then((data) => {
            const days = groupByDay(data.list).slice(0, 5);
            const daysEl = card.querySelector(".wx-days");
            daysEl.removeAttribute("data-loading");
            daysEl.innerHTML = days.map(({ date, entry }) => {
                const d = new Date(date + "T00:00:00");
                const label = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric" });
                const icon = entry.weather[0].icon;
                const desc = entry.weather[0].main;
                const temp = Math.round(entry.main.temp);
                return (
                    '<div class="wx-day">' +
                    '<span class="wx-day-label">' + label + '</span>' +
                    '<img class="wx-icon" src="https://openweathermap.org/img/wn/' + icon + '.png" alt="' + desc + '" width="34" height="34">' +
                    '<span class="wx-temp">' + temp + '&deg;C</span>' +
                    '</div>'
                );
            }).join("");
        })
        .catch(() => {
            const daysEl = card.querySelector(".wx-days");
            daysEl.removeAttribute("data-loading");
            daysEl.textContent = "Forecast unavailable.";
        });
}

const weatherGrid = document.getElementById("weatherGrid");
WEATHER_LOCATIONS.forEach((loc) => renderWeatherCity(weatherGrid, loc));