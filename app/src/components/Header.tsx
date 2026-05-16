const Header = () => {
  return (
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
            <a href="https://github.com/heismauri/kpop-comebacks-api">GitHub</a>
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
      </div>
    </header>
  );
};

export default Header;
