import React from 'react';

const Badge = ({ children, type = 'default', className = '' }) => {
  const getStyles = () => {
    switch (type) {
      case 'admin':
        return {
          backgroundColor: 'rgba(108, 92, 231, 0.15)',
          color: '#a29bfe',
          border: '1px solid rgba(108, 92, 231, 0.3)',
        };
      case 'user':
        return {
          backgroundColor: 'rgba(0, 206, 201, 0.15)',
          color: '#00cec9',
          border: '1px solid rgba(0, 206, 201, 0.3)',
        };
      case 'Male':
      case 'male':
        return {
          backgroundColor: 'rgba(9, 132, 227, 0.15)',
          color: '#74b9ff',
          border: '1px solid rgba(9, 132, 227, 0.3)',
        };
      case 'Female':
      case 'female':
        return {
          backgroundColor: 'rgba(232, 67, 147, 0.15)',
          color: '#fd79a8',
          border: '1px solid rgba(232, 67, 147, 0.3)',
        };
      case 'success':
        return {
          backgroundColor: 'var(--success-bg)',
          color: 'var(--success)',
          border: '1px solid rgba(0, 184, 148, 0.3)',
        };
      case 'danger':
        return {
          backgroundColor: 'var(--danger-bg)',
          color: 'var(--danger)',
          border: '1px solid rgba(214, 48, 49, 0.3)',
        };
      case 'warning':
        return {
          backgroundColor: 'var(--warning-bg)',
          color: 'var(--warning)',
          border: '1px solid rgba(253, 203, 110, 0.3)',
        };
      default:
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border)',
        };
    }
  };

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px 10px',
    fontSize: '0.75rem',
    fontWeight: 600,
    borderRadius: '100px',
    textTransform: 'capitalize',
    letterSpacing: '0.02em',
    ...getStyles(),
  };

  return (
    <span style={badgeStyle} className={className}>
      {children}
    </span>
  );
};

export default Badge;
