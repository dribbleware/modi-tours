import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";
import * as visits from "../../data/index.js";
import Close from "../Close";
import Visits from "../Visits";
import "./country.css";

const Country = inject("country")(
  observer(
    class Country extends Component {
      constructor(props) {
        super(props);

        this.setCountry = this.setCountry.bind(this);
      }

      componentWillMount() {
        const id = this.props.match.params.id;
        this.setCountry(id);

        document.body.classList.add("noScroll");
      }

      componentWillReceiveProps(nextProps) {
        const id = nextProps.match.params.id;
        this.setCountry(id);
      }

      componentWillUnmount() {
        document.body.classList.remove("noScroll");
      }

      setCountry(id) {
        const { country } = this.props;
        const item = visits[id];

        country.setId(id);
        country.setName(item.name);
        country.setVisits(item.visits, true);
      }

      render() {
        const { country } = this.props;

        return (
          <div className="country-overlay">
            <div
              className="country-wrapper"
              ref={wrapper => {
                this.wrapper = wrapper;
              }}
            >
              <div className="country__nav">
                <Link to="/">
                  <div className="country__nav--icon">
                    <svg
                      fill="#000000"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z" />
                      <path d="M0-.5h24v24H0z" fill="none" />
                    </svg>
                  </div>
                </Link>
              </div>
              <div className="country__header">
                <h2>
                  {country.name}
                </h2>
                <img
                  className="country__flag"
                  src={`http://www.geonames.org/flags/x/${country.id.toLowerCase()}.gif`}
                  alt=""
                />
              </div>
              <div className="country__body">
                <Visits />
              </div>
              <Link to="/">
                <Close />
              </Link>
            </div>
          </div>
        );
      }
    }
  )
);

export default Country;
