import React from 'react';

const Card = ({ 
  children, 
  title, 
  value, 
  icon, 
  trend, 
  trendType = 'success', // success, danger
  className = '', 
  onClick, 
  variant = 'default' 
}) => {
  const isClickable = !!onClick;
  
  if (variant === 'stat') {
    return (
      <div 
        className={`glass-card ${isClickable ? 'cursor-pointer' : ''} ${className}`}
        onClick={onClick}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '120px',
          cursor: isClickable ? 'pointer' : 'default',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {title}
            </p>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '8px', color: 'var(--text-primary)' }} className="glow-text">
              {value}
            </h3>
          </div>
          {icon && (
            <div style={{
              background: 'var(--bg-glass-hover)',
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--accent-primary)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {icon}
            </div>
          )}
        </div>
        
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '12px', fontSize: '0.85rem' }}>
            <span style={{ 
              color: trendType === 'success' ? 'var(--success)' : 'var(--danger)',
              fontWeight: 600,
              marginRight: '6px'
            }}>
              {trend}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>vs last month</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`glass-card ${isClickable ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: isClickable ? 'pointer' : 'default' }}
    >
      {title && (
        <div style={{ 
          borderBottom: '1px solid var(--border)', 
          paddingBottom: '16px', 
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h3>
          {icon && <span style={{ color: 'var(--accent-primary)' }}>{icon}</span>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Card;
