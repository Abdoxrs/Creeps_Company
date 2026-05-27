import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', // primary, secondary, danger, success, outline
  size = 'md', // sm, md, lg
  loading = false,
  disabled = false,
  className = '',
  icon,
  style = {}
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'var(--accent-gradient)',
          color: '#ffffff',
          border: 'none',
          boxShadow: 'var(--shadow-glow)',
        };
      case 'secondary':
        return {
          background: 'var(--bg-glass-hover)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border)',
        };
      case 'danger':
        return {
          background: 'rgba(214, 48, 49, 0.2)',
          color: '#ff7675',
          border: '1px solid rgba(214, 48, 49, 0.4)',
        };
      case 'success':
        return {
          background: 'rgba(0, 184, 148, 0.2)',
          color: '#55efc4',
          border: '1px solid rgba(0, 184, 148, 0.4)',
        };
      case 'outline':
        return {
          background: 'transparent',
          color: 'var(--accent-primary)',
          border: '1px solid var(--accent-primary)',
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '8px 14px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' };
      case 'lg':
        return { padding: '14px 28px', fontSize: '1.05rem', borderRadius: 'var(--radius-md)' };
      default:
        return { padding: '10px 20px', fontSize: '0.9rem', borderRadius: 'var(--radius-sm)' };
    }
  };

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
    opacity: (disabled || loading) ? 0.6 : 1,
    transition: 'all var(--transition-normal)',
    fontFamily: 'inherit',
    gap: '8px',
    outline: 'none',
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={buttonStyle}
      className={`btn-${variant} ${className}`}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          if (variant === 'primary') {
            e.currentTarget.style.background = 'var(--accent-gradient-bright)';
            e.currentTarget.style.boxShadow = '0 0 25px rgba(108, 92, 231, 0.4)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          } else if (variant === 'secondary') {
            e.currentTarget.style.backgroundColor = 'var(--bg-glass-active)';
            e.currentTarget.style.borderColor = 'var(--border-hover)';
          } else if (variant === 'outline') {
            e.currentTarget.style.backgroundColor = 'rgba(108, 92, 231, 0.1)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          } else {
            e.currentTarget.style.opacity = '0.9';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'none';
          if (variant === 'primary') {
            e.currentTarget.style.background = 'var(--accent-gradient)';
            e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
          } else if (variant === 'secondary') {
            e.currentTarget.style.backgroundColor = 'var(--bg-glass-hover)';
            e.currentTarget.style.borderColor = 'var(--border)';
          } else if (variant === 'outline') {
            e.currentTarget.style.backgroundColor = 'transparent';
          } else {
            e.currentTarget.style.opacity = '1';
          }
        }
      }}
    >
      {loading && (
        <span style={{
          width: '14px',
          height: '14px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderTop: '2px solid currentColor',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          marginRight: '2px'
        }} />
      )}
      {!loading && icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
