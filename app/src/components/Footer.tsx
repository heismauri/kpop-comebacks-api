import { memo } from "react";

const Footer = () => {
  return (
    <footer className="px-3 text-center opacity-75">
      <p>
        Thanks to the <a href="https://www.reddit.com/r/kpop/">KPop Subreddit</a>'s comeback calendar, which serves as
        the key that unlocks the magic of this web app.
      </p>
    </footer>
  );
};

export default memo(Footer);
