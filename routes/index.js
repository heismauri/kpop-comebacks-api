import { encode } from 'he';

import { getAllReleases } from './api';
import styleCSS from '../public/style.css';
import mainJS from '../public/main.js.txt';
import countriesJS from '../public/countries.js.txt';
import timezoneHandler from '../public/timezone-handler.js.txt';

const releasesToHTML = (releases) => {
  return Object.keys(releases).map((day) => {
    const title = `<ul class="calendar-day"><li class="calendar-day-date" data-timestamp="${day}">Date</li>`;
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
  <html lang="en">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>KPop Upcoming Releases - heismauri</title>
      <meta name="description" content="Your go-to source for Kpop fans looking for accurate and up-to-date information on upcoming releases of KPop. Our site displays the date on your local time making it easy for you to not get confused about time zones">
      <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🫰</text></svg>">
      <style>
        ${styleCSS}
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h1>🫰 KPop Upcoming Releases</h1>
          <div id="header-box-wrapper" class="header-box__wrapper">
            <div class="toggle-time__wrapper header-box">
              <label class="toggle-time">
                <span class="toggle-time__label">24 HRS</span>
                <input class="toggle-time__input" id="toggle-time" type="checkbox">
              </label>
            </div>
            <div id="country" class="header-box"></div>
          </div>
        </header>
        <main id="all-releases">
          ${releasesToHTML(allReleases)}
        </main>
        <hr>
          <p>Thanks to <a href="https://www.reddit.com/r/kpop/">KPop Subreddit</a> who provides a releases calendar with useful information which brings life to this web app.</p>
        <hr>
      </div>
      <footer>
        <ul>
          <li><a href="/api">API Endpoint</a></li>
          <li><a href="https://github.com/heismauri/kpop-releases-api">Check this project on GitHub</a></li>
          <li><a href="https://ko-fi.com/heismauri">Buy me a Ko-fi</a></li>
          <li><a href="https://www.heismauri.com">About me</a></li>
        </ul>
      </footer>
      <script>${countriesJS}</script>
      <script>${timezoneHandler}</script>
      <script>${mainJS}</script>
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
