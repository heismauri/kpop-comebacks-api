import { useEffect, useMemo, useState } from "react";

import { type Comeback } from "@api/types/comeback";
import ComebackCard from "@app/components/ComebackCard";
import Header from "@app/components/Header";
import Footer from "@app/components/Footer";
import Loader from "@app/components/Loader";

const groupByDate = (comebacks: Comeback[]) => {
  return comebacks.reduce(
    (accumulator, comeback) => {
      const key = new Date(comeback.date).toLocaleDateString().replaceAll("/", ".");
      accumulator[key] = accumulator[key] || [];
      accumulator[key].push(comeback);
      return accumulator;
    },
    {} as Record<string, Comeback[]>
  );
};

const TWELVE_HOUR_RE = /AM|PM/;
const USER_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

const App = () => {
  const [state, setState] = useState<"loading" | "error" | "success">("loading");
  const [comebacks, setComebacks] = useState<Comeback[]>([]);
  const groupedComebacks = useMemo(() => groupByDate(comebacks), [comebacks]);
  const [twelveHour, setTwelveHour] = useState(() =>
    TWELVE_HOUR_RE.test(Intl.DateTimeFormat([], { hour: "numeric" }).format(new Date()).toUpperCase())
  );

  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((data) => {
        setComebacks(data);
        setState("success");
      })
      .catch((error) => {
        console.error("Error fetching comebacks:", error);
        setState("error");
      });
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        <div id="header-box-wrapper" className="header-box__wrapper">
          <div className="toggle-time__wrapper header-box">
            <label className="toggle-time">
              <span className="toggle-time__label cursor-pointer">24 HRS</span>
              <input
                className="toggle-time__input cursor-pointer"
                id="toggle-time"
                type="checkbox"
                checked={!twelveHour}
                onChange={() => setTwelveHour((prev) => !prev)}
              />
            </label>
          </div>
          <div id="country" className="header-box">
            <p>{USER_TIMEZONE}</p>
          </div>
        </div>
        <main id="all-comebacks">
          {state === "loading" ? (
            <Loader />
          ) : state === "error" ? (
            <p className="text-center">Error fetching comebacks.</p>
          ) : comebacks.length === 0 ? (
            <p className="text-center">No upcoming comebacks found.</p>
          ) : (
            Object.entries(groupedComebacks).map(([date, comebacks]) => (
              <ComebackCard key={date} formattedDate={date} comebacks={comebacks} twelveHour={twelveHour} />
            ))
          )}
        </main>
        <hr />
      </div>
      <Footer />
    </>
  );
};

export default App;
