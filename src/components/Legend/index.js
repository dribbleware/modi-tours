import React from "react";

import "./legend.css";

export default () =>
  <div className="legend">
    <div className="legend__field">
      <span className="legend__square visited" />
      <span className="legend__note">visited</span>
    </div>
    <div className="legend__field">
      <span className="legend__square not-visited" />
      <span className="legend__note">not visited</span>
    </div>
  </div>;
