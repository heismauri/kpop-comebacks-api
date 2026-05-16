const ComebackCard = ({ date, titles }: { date: string; titles: string[] }) => {
  const parsedDate = new Date(parseInt(date, 10));

  return (
    <ul key={date} className="calendar-day">
      <li className="calendar-day-date">
        <strong>{parsedDate.toLocaleDateString().replaceAll("/", ".")}</strong>{" "}
        <i>{parsedDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}</i>
      </li>
      <ul className="calendar-day-events">
        {titles.map((title, index) => (
          <li key={index}>{title}</li>
        ))}
      </ul>
    </ul>
  );
};

export default ComebackCard;
