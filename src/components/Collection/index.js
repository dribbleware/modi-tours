import React, { Component } from "react";
import { Timeline } from "react-twitter-widgets";

const options = {
  chrome: "noheader noborders transparent nofooter noscrollbar",
  linkColor: "#062f4f",
  width: 1200
};

class Collection extends Component {
  render() {
    return (
      <Timeline
        dataSource={{
          sourceType: "collection",
          id: this.props.timeline
        }}
        options={options}
        onLoad={this.props.onRender}
      />
    );
  }
};

export default Collection;
