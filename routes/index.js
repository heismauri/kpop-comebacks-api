import { encode } from 'he';

import { getAllReleases } from './api';
import style from '../static/style.css';
import script from '../static/main.js.txt';

const releasesToHTML = (releases) => {
  return Object.keys(releases).map((day) => {
    const title = `<ul class="calendar-day"><li class="calendar-day-date">${day}</li>`;
    const listElements = releases[day].map((release) => {
      return `<li>${encode(release)}</li>`;
    });
    return [title, '<ul class="calendar-day-events">', ...listElements, '</ul></li></ul>'].join('');
  }).join('');
};

const groupByDate = (releases) => {
  return releases.reduce((accumulator, release) => {
    const key = release.date;
    accumulator[key] = accumulator[key] || [];
    accumulator[key].push(release.title);
    return accumulator;
  }, {});
};

const buildHTML = async () => {
  const allReleases = groupByDate(await getAllReleases());
  const page = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>KPop Upcoming Releases - heismauri</title>
      <meta name="description" content="Your go-to source for Kpop fans looking for accurate and up-to-date information on upcoming releases of KPop. Our site displays the date on your local time making it easy for you to not get confused about time zones">
      <link rel="shortcut icon" href="https://i.imgur.com/KSa8gdM.png">
      <style>
        *{box-sizing:border-box}body{margin:0;color:#3c4142;font-size:1rem;font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;line-height:1.5}a{text-decoration:none}.calendar-day{margin:1rem 0;padding:0;list-style-type:none}.calendar-day-events{padding-left:2rem}.container{width: 95%;max-width:30rem;padding: 1rem 2rem;margin:0 auto}h1{color:#ce5891;text-transform:uppercase;font-weight: 600;font-size: 1.5rem;}.calendar-day-date i{font-style:normal;margin-left:.25rem;opacity:.5}@media(prefers-color-scheme:dark){body{background:#201c1c;color:#fff}}footer{padding:.5rem 0;text-align:center}footer a{color:inherit;opacity:.5}
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🫰 KPop Upcoming Releases</h1>
        <label class="switch">
          <span class="toggle-label">24 HRS</span>
          <input type="checkbox">
          <span class="slider round"></span>
        </label>
        ${releasesToHTML(allReleases)}
        <script>${script}</script>
        <footer><a href="https://www.heismauri.com/">www.heismauri.com</a></footer>
      </div>
    </body>
  </html>
  `;
  return new Response(page, {
    headers: {
      'Content-Type': 'text/html; charset=UTF-8'
    },
  });
};

export default buildHTML;
