import React, { Component } from 'react';
import ZoomIn from './ZoomIn';
import Reset from './Reset';
import ZoomOut from './ZoomOut';
import './controls.css';

class Controls extends Component {
  render() {
    return (
      <div className="controls noSelect">
        <ZoomIn />
        <Reset />
        <ZoomOut />
      </div>
    );
  }
}

export default Controls;
