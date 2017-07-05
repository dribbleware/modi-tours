import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Visit from "../Visit";
import "./visits.css";

const Visits = inject("country")(
  observer(
    class Country extends Component {
      handleTabClick(tl) {
        const { country } = this.props;

        const updateVisits = country.visits.map(item => {
          item.shouldRender = item.tl === tl || item.shouldRender;
          item.isDisplayed = item.tl === tl;

          return item;
        });

        country.setVisits(updateVisits, false);
      }

      componentWillMount() {
        const { country } = this.props;

        var lastVisit = country.visits[country.visits.length - 1];
        this.handleTabClick(lastVisit.tl);
      }

      render() {
        const { visits } = this.props.country;

        return (
          <div className="visits">
            <ul className="tabs">
              {visits.map((visit, index) => {
                return (
                  <li
                    key={visit.tl}
                    className={`tab-link ${visit.isDisplayed ? "is-selected" : ""}`}
                    onClick={() => this.handleTabClick(visit.tl)}
                  >
                    {visit.monthYear}
                  </li>
                );
              })}
            </ul>

            {visits.map((visit, index) => {
              return (
                <div key={visit.tl}>
                  {visit.shouldRender ? <Visit visit={visit} /> : ""}
                </div>
              );
            })}
          </div>
        );
      }
    }
  )
);

export default Visits;
