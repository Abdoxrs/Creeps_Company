import React from 'react';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  error,
  required = false,
  disabled = false,
  icon,
  className = '',
  ...props
}) => {
  const containerStyle = {
    marginBottom: '20px',
    width: '100%',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '0.85rem',
    fontWeight: 500,
    color: error ? 'var(--danger)' : 'var(--text-secondary)',
    transition: 'color var(--transition-normal)',
  };

  const inputWrapperStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const iconStyle = {
    position: 'absolute',
    left: '14px',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    paddingLeft: icon ? '42px' : '16px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    fontFamily: 'inherit',
    fontSize: '0.95rem',
    transition: 'all var(--transition-normal)',
  };

  const errorStyle = {
    marginTop: '6px',
    fontSize: '0.8rem',
    color: 'var(--danger)',
    fontWeight: 500,
  };

  return (
    <div style={containerStyle} className={className}>
      {label && (
        <label style={labelStyle}>
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      <div style={inputWrapperStyle}>
        {icon && <div style={iconStyle}>{icon}</div>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          disabled={disabled}
          required={required}
          style={inputStyle}
          onFocus={(e) => {
            if (!error) {
              e.target.style.borderColor = 'var(--accent-primary)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              e.target.style.boxShadow = '0 0 0 3px rgba(108, 92, 231, 0.15)';
            }
          }}
          onBlur={(e) => {
            if (!error) {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.background = 'rgba(255, 255, 255, 0.02)';
              e.target.style.boxShadow = 'none';
            }
          }}
          {...props}
        />
      </div>
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
};

export default Input;
