import React from 'react';

const ValidatedInput = ({
  type = 'text',
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  maxLength,
  rows,
  placeholder,
  className = ''
}) => {
  const showError = touched && error;
  const InputComponent = type === 'textarea' ? 'textarea' : 'input';
  const remaining = maxLength ? maxLength - (value?.length || 0) : null;
  const isNearLimit = remaining !== null && remaining < 20;

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {maxLength && (
          <span className={`text-xs ${isNearLimit ? 'text-amber-600 font-medium' : 'text-gray-400'}`}>
            {value?.length || 0}/{maxLength}
          </span>
        )}
      </div>
      
      <InputComponent
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        maxLength={maxLength}
        rows={rows}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
          showError
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        } ${className}`}
      />
      
      {showError && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default ValidatedInput;