import React from 'react';

const Loader = ({ size = 'md', color = 'var(--accent-primary)' }) => {
  const sizes = {
    sm: '24px',
    md: '40px',
    lg: '64px',
  };

  const borderSizes = {
    sm: '2px',
    md: '3px',
    lg: '4px',
  };

  const actualSize = sizes[size] || sizes.md;
  const borderSize = borderSizes[size] || borderSizes.md;
  const spinnerStyle = {
    width: actualSize,
    height: actualSize,
    border: `${borderSize} solid rgba(255, 255, 255, 0.05)`,
    borderTop: `${borderSize} solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    boxShadow: `0 0 15px ${color}33`,
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={spinnerStyle}></div>
    </div>
  );
};

export default Loader;
