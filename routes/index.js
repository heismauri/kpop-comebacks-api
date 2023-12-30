import { encode } from 'he';

import { getAllComebacks } from './api';

const comebacksToHTML = (comebacks) => {
  return Object.keys(comebacks).map((day) => {
    const title = `<ul class="calendar-day"><li class="calendar-day-date" data-timestamp="${day}">Date</li>`;
    const listElements = comebacks[day].map((comeback) => {
      return `<li>${encode(comeback)}</li>`;
    });
    return [title, '<ul class="calendar-day-events">', ...listElements, '</ul></li></ul>'].join('');
  }).join('');
};

const groupByDate = (comebacks) => {
  return comebacks.reduce((accumulator, comeback) => {
    const key = comeback.date;
    accumulator[key] = accumulator[key] || [];
    accumulator[key].push(comeback.title);
    return accumulator;
  }, {});
};

const buildHTML = async (env) => {
  const googleApisFont = 'https://fonts.googleapis.com/css2?'
    + 'family=Poppins:wght@400;700&family=Noto+Color+Emoji&display=swap';
  const allComebacks = groupByDate(await getAllComebacks(env));
  const page = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>KPop Upcoming Comebacks - heismauri</title>
      <meta name="description" content="Your go-to source for Kpop fans looking for accurate and up-to-date information
        on upcoming comebacks of KPop. Our site displays the date on your local time making it easy for you to not
        get confused about time zones">
      <link rel="icon" href="https://www.heismauri.com/assets/kpop-comebacks/favicon.png" type="image/png">
      <link rel="stylesheet" href="/style.css">
      <script src="/main.js" defer></script>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com">
      <link rel="preload" href="${googleApisFont}" as="style" onload="this.rel='stylesheet'">
      <link rel="stylesheet" href="${googleApisFont}" media="print" onload="this.media='all'">
    </head>
    <body>
      <header>
        <nav class="p-2">
          <ul>
            <li><a href="https://github.com/heismauri/kpop-comebacks-widget">iOS Widget</a></li>
            <li><a href="/api">API</a></li>
            <li><a href="https://github.com/heismauri/kpop-comebacks-api">GitHub</a></li>
            <li><a href="https://ko-fi.com/heismauri">Buy me a Ko-fi</a></li>
            <li><a href="https://www.instagram.com/kda.webp">Collector account</a></li>
          </ul>
        </nav>
        <div class="container">
          <hr class="mt-0">
          <h1>🫰 KPop Upcoming Comebacks</h1>
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
        <main id="all-comebacks">
          ${comebacksToHTML(allComebacks)}
        </main>
        <hr>
      </div>
      <footer class="px-3 text-center opacity-75">
        <p>
          Thanks to the <a href="https://www.reddit.com/r/kpop/">KPop Subreddit</a>'s comeback calendar, which serves as
          the key that unlocks the magic of this web app.
        </p>
      </footer>
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
