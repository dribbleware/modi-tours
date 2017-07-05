import React, { Component } from "react";
import Collection from "../Collection";
import Cities from "./Cities";
import Purpose from "./Purpose";
import Dates from "./Dates";

class Visit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visit: this.props.visit
    };
    this.onDidRender = this.onDidRender.bind(this);
  }

  onDidRender() {
    const { visit } = this.state;
    visit.isRendered = true;

    this.setState({ visit });
  }

  render() {
    const {
      from,
      to,
      type,
      city,
      tl,
      isRendered,
      isDisplayed
    } = this.state.visit;
    const renderedClass = isRendered ? "tweets--rendered" : "is-hidden";
    const spinnerClass = isRendered ? "hidden" : "";
    const displayClass = isDisplayed? "is-displayed": "";

    return (
      <div className={`tab-content visit ${displayClass} ${renderedClass}`}>
        <div className="backdrop" />
        <Purpose types={type} />
        <Cities cities={city} />
        <Dates from={from} to={to} />
        <div className={`spinner visit-spinner ${spinnerClass}`} />
        <div className={`visit-tweets ${renderedClass}`}>
          <Collection timeline={tl} onRender={this.onDidRender} />
        </div>
      </div>
    );
  }
}

export default Visit;
