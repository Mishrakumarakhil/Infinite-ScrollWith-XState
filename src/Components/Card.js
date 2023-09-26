import React from "react";

const Card = ({ data, loading }) => {
  const formattedDate = (time) => {
    const timestamp = time * 1000;
    const date = new Date(timestamp);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const hours = date.getUTCHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = String(date.getUTCMinutes()).padStart(2, "0");

    const formattedDate = `${
      months[date.getUTCMonth()]
    } ${date.getUTCDate()}, ${date.getUTCFullYear()} ${formattedHours}:${formattedMinutes} ${ampm} IST`;

    return formattedDate;
  };

  return (
    <>
      <h1>Infinite Scroll</h1>
      <div className="data-list">
        {data.map((data) => (
          <div className="data" key={data.node.nid}>
            <div className="row">
              <div className="left">
                <img
                  src={data.node.field_photo_image_section}
                  alt={data.node.title}
                />
              </div>
              <div className="right">
                <p className="title">{data.node.title}</p>
                <p className="time">{formattedDate(data.node.last_update)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {loading && <div className="loader"> Fetching More data...</div>}
    </>
  );
};

export default Card;