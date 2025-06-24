import React from 'react';

const AnimatedLogo = () => {
  return (
    <a href="#" className="animated-logo-container">
      <svg viewBox="0 0 800 600">
        <symbol id="s-text">
          <text
            textAnchor="middle"
            x="50%"
            y="40%"
            className="text--line"
          >
            Cine
          </text>
          <text
            textAnchor="middle"
            x="50%"
            y="80%"
            className="text--line"
          >
            Digital
          </text>
        </symbol>

        <g className="g-ants">
          <use href="#s-text" className="text-copy"></use>
          <use href="#s-text" className="text-copy"></use>
          <use href="#s-text" className="text-copy"></use>
          <use href="#s-text" className="text-copy"></use>
          <use href="#s-text" className="text-copy"></use>
        </g>
      </svg>
    </a>
  );
};

export default AnimatedLogo;
