import React, { Component } from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import Map from "../Map";
import Country from "../Country";
import Title from "../Title";
import "./app.css";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="app" id="app">
          <Map />
          <Route path={`/:id`} component={Country} />
          <Title />
        </div>
      </Router>
    );
  }
}

export default App;
