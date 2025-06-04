import { useState, useEffect } from 'react';

const ToggleSwitch = ({ 
  id, 
  checked = false, 
  onChange, 
  disabled = false,
  label = '',
  className = ''
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleChange = () => {
    if (!disabled) {
      const newValue = !isChecked;
      setIsChecked(newValue);
      if (onChange) onChange(newValue);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        onClick={handleChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          isChecked 
            ? 'bg-blue-600 dark:bg-blue-500' 
            : 'bg-gray-200 dark:bg-slate-600'
        } ${
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isChecked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      {label && (
        <label 
          htmlFor={id} 
          className={`ml-3 text-sm font-medium ${
            disabled 
              ? 'text-gray-400 dark:text-gray-500' 
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default ToggleSwitch;