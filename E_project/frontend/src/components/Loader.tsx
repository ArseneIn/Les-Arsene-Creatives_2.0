import React from 'react';
import './Loader.css';

export default function Loader() {
  return (
    <div className="nexus-loader-overlay">
      <div className="loader-content">
        <div className="radar-system">
          <div className="radar-ring outer"></div>
          <div className="radar-ring middle"></div>
          <div className="radar-ring inner">
            <div className="loader-logo">AC</div>
          </div>
          <div className="scanning-beam"></div>
        </div>

        <div className="loader-status">
          <span className="status-text">LOADING DATA</span>
          <div className="status-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>

        <div className="loader-metrics font-numeric">
          <span>SECURE_AUTH: OK</span>
          <span className="sep">|</span>
          <span>ASSETS: LOADED</span>
        </div>
      </div>
    </div>
  );
}