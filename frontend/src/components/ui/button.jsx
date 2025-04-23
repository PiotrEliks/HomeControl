import React from 'react';

export function Button({ children, className = '', disabled = false, ...props }) {
  return (
    <button
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        cursor-pointer
        text-white font-medium
        disabled:opacity-50 disabled:cursor-not-allowed
        rounded-lg px-4 py-2
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
