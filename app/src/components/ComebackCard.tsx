import { memo, useMemo, type JSX } from "react";

import { type Comeback } from "@api/types/comeback";

const groupByTime = (comebacks: Comeback[], twelveHour: boolean): Record<string, string[]> => {
  return comebacks.reduce(
    (accumulator, comeback) => {
      const key = new Date(comeback.date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: twelveHour
      });
      accumulator[key] = accumulator[key] || [];
      accumulator[key].push(comeback.title);
      return accumulator;
    },
    {} as Record<string, string[]>
  );
};

const ComebackCard = ({
  formattedDate,
  comebacks,
  twelveHour
}: {
  formattedDate: string;
  comebacks: Comeback[];
  twelveHour: boolean;
}): JSX.Element => {
  const groupedComebacks = useMemo(() => groupByTime(comebacks, twelveHour), [comebacks, twelveHour]);

  return (
    <ul className="calendar-day">
      <li className="calendar-day-date">
        <strong>{formattedDate}</strong>
      </li>
      <ul className="calendar-day-group">
        {Object.entries(groupedComebacks).map(([time, titles]) => (
          <li key={time} className="calendar-day-date">
            <i>{time}</i>
            <ul className="calendar-day-events">
              {titles.map((title) => (
                <li key={title}>{title}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </ul>
  );
};

export default memo(ComebackCard);
