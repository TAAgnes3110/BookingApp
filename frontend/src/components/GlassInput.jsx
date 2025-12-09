import React from 'react';

const GlassInput = ({ label, type = "text", placeholder, icon: Icon, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2 mb-4 w-full">
      {label && <label className="text-slate-300 text-sm font-medium ml-1">{label}</label>}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
            <Icon size={20} />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={`glass-input ${Icon ? 'pl-11' : ''} ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default GlassInput;
