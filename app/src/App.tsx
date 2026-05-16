import { useEffect, useState } from "react";

import { type Comeback } from "@api/types/comeback";
import ComebackCard from "@app/components/ComebackCard";
import Header from "@app/components/Header";
import Footer from "@app/components/Footer";
import Loader from "@app/components/Loader";

const groupByDate = (comebacks: Comeback[]) => {
  return comebacks.reduce(
    (accumulator, comeback) => {
      const key = new Date(comeback.date).toLocaleDateString();
      accumulator[key] = accumulator[key] || [];
      accumulator[key].push(comeback);
      return accumulator;
    },
    {} as Record<string, Comeback[]>
  );
};

function App() {
  const [comebacks, setComebacks] = useState<Comeback[]>([]);
  const [state, setState] = useState<"loading" | "error" | "success">("loading");
  const [twelveHour, setTwelveHour] = useState(false);

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
        <main id="all-comebacks">
          {state === "loading" ? (
            <Loader />
          ) : state === "error" ? (
            <p className="text-center">Error fetching comebacks.</p>
          ) : comebacks.length === 0 ? (
            <p className="text-center">No upcoming comebacks found.</p>
          ) : (
            <>
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
                  <p>{Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
                </div>
              </div>
              {groupByDate(comebacks) &&
                Object.entries(groupByDate(comebacks)).map(([date, comebacks]) => (
                  <ComebackCard key={date} formattedDate={date} comebacks={comebacks} twelveHour={twelveHour} />
                ))}
            </>
          )}
        </main>
        <hr />
      </div>
      <Footer />
    </>
  );
}

export default App;
