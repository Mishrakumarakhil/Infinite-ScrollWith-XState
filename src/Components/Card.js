import React from "react";
import { formattedDate } from "./utils";

const Card = ({ data, loading }) => {
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
