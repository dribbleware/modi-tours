import React from "react";
import * as tours from "../../data/index.js";
import "./title.css";

const Title = () => {
  const countriesCount = Object.keys(tours).length;
  const totalCb = (total, pair) => total + pair[1].visits.length;
  const visitsCount = Object.entries(tours).reduce(totalCb, 0);

  return (
    <div className="branding-container">
      <h1 className="branding__title">modi's tours</h1>
      <span>{`${countriesCount} countries`}</span>&nbsp;&nbsp;
      <span>{`${visitsCount} trips`}</span>
    </div>
  );
};

export default Title;
