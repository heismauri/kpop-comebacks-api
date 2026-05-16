import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <header>
        <nav className="p-2">
          <ul>
            <li>
              <a href="https://github.com/heismauri/kpop-comebacks-widget">
                iOS Widget
              </a>
            </li>
            <li>
              <a href="/api">API</a>
            </li>
            <li>
              <a href="https://github.com/heismauri/kpop-comebacks-api">
                GitHub
              </a>
            </li>
            <li>
              <a href="https://ko-fi.com/heismauri">Buy me a Ko-fi</a>
            </li>
            <li>
              <a href="https://www.instagram.com/kda.webp">Collector account</a>
            </li>
          </ul>
        </nav>
        <div className="container">
          <hr className="mt-0" />
          <h1>🫰 KPop Upcoming Comebacks</h1>
          <div id="header-box-wrapper" className="header-box__wrapper">
            <div className="toggle-time__wrapper header-box">
              <label className="toggle-time">
                <span className="toggle-time__label cursor-pointer">
                  24 HRS
                </span>
                <input
                  className="toggle-time__input cursor-pointer"
                  id="toggle-time"
                  type="checkbox"
                />
              </label>
            </div>
            <div id="country" className="header-box"></div>
          </div>
        </div>
      </header>
      <div className="container">
        <main id="all-comebacks"></main>
        <hr />
      </div>
      <footer className="px-3 text-center opacity-75">
        <p>
          Thanks to the{' '}
          <a href="https://www.reddit.com/r/kpop/">KPop Subreddit</a>'s comeback
          calendar, which serves as the key that unlocks the magic of this web
          app.
        </p>
      </footer>
    </>
  );
}

export default App;
