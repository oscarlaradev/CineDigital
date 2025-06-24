import React from 'react';

const AnimatedLogo = () => {
  return (
    <a href="/" className="animated-logo-container">
      <svg viewBox="0 0 800 150">
        <text
          className="animated-logo-text-base"
          x="50%"
          y="50%"
          dy=".35em"
          textAnchor="middle"
        >
          Cine Digital
        </text>
        <text
          className="animated-logo-text-highlight"
          x="50%"
          y="50%"
          dy=".35em"
          textAnchor="middle"
        >
          Cine Digital
        </text>
      </svg>
    </a>
  );
};

export default AnimatedLogo;
