import { useEffect, useState } from 'react';

import { Comeback } from '../../src/types/comeback';
import ComebackCard from './components/ComebackCard';
import Header from './components/Header';
import Footer from './components/Footer';

const groupByDate = (comebacks: Comeback[]) => {
  return comebacks.reduce(
    (accumulator, comeback) => {
      const key = comeback.date;
      accumulator[key] = accumulator[key] || [];
      accumulator[key].push(comeback.title);
      return accumulator;
    },
    {} as Record<string, string[]>
  );
};

function App() {
  const [comebacks, setComebacks] = useState<Comeback[]>([]);

  useEffect(() => {
    fetch('/api')
      .then((response) => response.json())
      .then((data) => {
        setComebacks(data);
      })
      .catch((error) => {
        console.error('Error fetching comebacks:', error);
      });
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        <main id="all-comebacks">
          {comebacks.length === 0 ? (
            <p className="text-center">No upcoming comebacks found.</p>
          ) : (
            <>
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
                <div id="country" className="header-box">
                  <p>{Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
                </div>
              </div>
              {groupByDate(comebacks) &&
                Object.entries(groupByDate(comebacks)).map(([date, titles]) => (
                  <ComebackCard key={date} date={date} titles={titles} />
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
