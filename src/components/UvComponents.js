import React from 'react';

/**
 * Premium Button Component
 * @param {('primary'|'outline')} variant 
 */
export const UvButton = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClass = variant === 'primary' ? 'uv-btn' : 'uv-btn uv-btn-outline';
  return (
    <button className={`${baseClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

/**
 * Premium Panel Component
 */
export const UvPanel = ({ children, title, headerActions, className = '' }) => {
  return (
    <div className={`uv-panel ${className}`}>
      {title && (
        <div className="uv-panel-header">
          <h2>{title}</h2>
          {headerActions && <div>{headerActions}</div>}
        </div>
      )}
      <div className="uv-panel-body">
        {children}
      </div>
    </div>
  );
};

/**
 * Premium Tag Component
 * @param {('orange'|'blue'|'green'|'purple')} color 
 */
export const UvTag = ({ children, color = 'blue', className = '' }) => {
  return (
    <span className={`uv-tag uv-tag-${color} ${className}`}>
      {children}
    </span>
  );
};

/**
 * Premium Badge Component
 * @param {('pending'|'answered')} status 
 */
export const UvBadge = ({ children, status = 'pending', className = '' }) => {
  return (
    <span className={`uv-badge uv-badge-${status} ${className}`}>
      {children}
    </span>
  );
};

/**
 * Premium Input Component
 */
export const UvInput = ({ label, className = '', ...props }) => {
  return (
    <div className="uv-form-group">
      {label && <label>{label}</label>}
      <input className={`uv-input ${className}`} {...props} />
    </div>
  );
};

/**
 * Premium Textarea Component
 */
export const UvTextarea = ({ label, className = '', ...props }) => {
  return (
    <div className="uv-form-group">
      {label && <label>{label}</label>}
      <textarea className={`uv-textarea ${className}`} {...props} />
    </div>
  );
};

/**
 * Premium Loading Component
 */
export const UvLoading = ({ size = 'md', label = 'INITIALIZING...' }) => {
  const sizeMap = {
    sm: { s: '24px', f: '10px' },
    md: { s: '40px', f: '12px' },
    lg: { s: '64px', f: '14px' }
  };
  const { s, f } = sizeMap[size];
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '16px' }}>
      <div style={{ 
        width: s, height: s, 
        border: '3px solid var(--uv-border)', 
        borderTopColor: 'var(--uv-primary)', 
        borderRadius: '50%',
        animation: 'uv-spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite'
      }} className="uv-spinner"></div>
      <div className="uv-mono-xs" style={{ fontSize: f, letterSpacing: '2px', color: 'var(--uv-muted)' }}>{label}</div>
    </div>
  );
};

/**
 * Premium Empty State Component
 */
export const UvEmptyState = ({ icon = '🔍', title = 'No Data Found', message = 'Check back later for updates.' }) => (
  <div style={{ 
    padding: '60px 40px', 
    textAlign: 'center', 
    background: 'white', 
    borderRadius: '16px', 
    border: '1px solid var(--uv-border)',
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center' 
  }}>
    <div style={{ fontSize: '48px', marginBottom: '20px' }}>{icon}</div>
    <div className="uv-mono-sm" style={{ marginBottom: '8px', color: '#1a1a1a' }}>{title.toUpperCase()}</div>
    <p style={{ color: 'var(--uv-muted)', fontSize: '14px', maxWidth: '300px', lineHeight: 1.6 }}>{message}</p>
  </div>
);

/**
 * Premium Hover Card
 */
export const UvCard = ({ children, padding = '24px', style = {} }) => (
  <div style={{ 
    background: 'white', 
    borderRadius: '16px', 
    border: '1px solid var(--uv-border)', 
    padding, 
    boxShadow: 'var(--uv-shadow-sm)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    ...style 
  }} className="uv-card-interactive">
    {children}
  </div>
);
