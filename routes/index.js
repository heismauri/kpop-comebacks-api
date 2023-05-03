import { encode } from 'he';

import { getAllReleases } from './api';

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
      <link rel="icon" href="https://www.heismauri.com/assets/kpop-releases/favicon.png" type="image/png">
      <link rel="stylesheet" href="https://www.heismauri.com/assets/kpop-releases/style.css">
      <script src="https://www.heismauri.com/assets/kpop-releases/countries.js" defer></script>
      <script src="https://www.heismauri.com/assets/kpop-releases/timezone-handler.js" defer></script>
      <script src="https://www.heismauri.com/assets/kpop-releases/main.js" defer></script>
    </head>
    <body>
      <header>
        <nav class="p-2">
          <ul>
            <li><a href="/api">API Endpoint</a></li>
            <li><a href="https://github.com/heismauri/kpop-releases-api">Check this project on GitHub</a></li>
            <li><a href="https://ko-fi.com/heismauri">Buy me a Ko-fi</a></li>
            <li><a href="https://www.heismauri.com">About me</a></li>
          </ul>
        </nav>
        <div class="container">
          <hr class="mt-0">
          <h1>🫰 KPop Upcoming Releases</h1>
          <div id="header-box-wrapper" class="header-box__wrapper">
            <div class="toggle-time__wrapper header-box">
              <label class="toggle-time">
                <span class="toggle-time__label cursor-pointer">24 HRS</span>
                <input class="toggle-time__input cursor-pointer" id="toggle-time" type="checkbox">
              </label>
            </div>
            <div id="country" class="header-box"></div>
          </div>
        </div>
      </header>
      <div class="container">
        <main id="all-releases">
          ${releasesToHTML(allReleases)}
        </main>
        <hr>
      </div>
      <footer class="px-3 text-center opacity-75">
        <p>Thanks to the <a href="https://www.reddit.com/r/kpop/">KPop Subreddit</a>'s release calendar, which serves as the key that unlocks the magic of this web app.</p>
      </footer>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&family=Noto+Color+Emoji&display=swap">
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
