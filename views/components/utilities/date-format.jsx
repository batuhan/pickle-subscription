import React from "react";

function getFormattedDate(dateString, options = {}) {
  let date = new Date(dateString * 1000);
  if (date == "Invalid Date") {
    date = new Date(dateString);
  }
  const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayOfWeek = date.getDay();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  let hour = date.getHours();
  let min = date.getMinutes();

  if (hour < 10) {
    hour = `0${hour}`;
  }
  if (min < 10) {
    min = `0${min}`;
  }

  let myDate = `${monthNames[month]} ${day}, ${year}`;
  if (options.weekday) {
    myDate = `${dayNames[dayOfWeek]} ${monthNames[month]} ${day}, ${year}`;
  } else if (options.time) {
    myDate = `${monthNames[month]} ${day}, ${year} - ${hour}:${min}`;
  } else if (options.weekday && options.time) {
    myDate = `${dayNames[dayOfWeek]} ${monthNames[month]} ${day}, ${year} - ${hour}:${min}`;
  }

  return myDate;
}

class DateFormat extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <span>
        {getFormattedDate(this.props.date, {
          weekday: this.props.weekday,
          time: this.props.time,
        })}
      </span>
    );
  }
}
export { getFormattedDate };
export default DateFormat;
