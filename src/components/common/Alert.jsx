import { useState, useEffect } from 'react';
import { 
  BiCheckCircle, 
  BiErrorCircle, 
  BiInfoCircle, 
  BiX
} from 'react-icons/bi';
import { IoIosWarning } from "react-icons/io";

const Alert = ({
  type = 'info',
  message,
  title,
  dismissible = false,
  autoDismiss = false,
  dismissTime = 5000,
  onDismiss,
  className = '',
  icon,
  show = true
}) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  useEffect(() => {
    if (autoDismiss && visible) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, dismissTime);
      return () => clearTimeout(timer);
    }
  }, [visible, autoDismiss, dismissTime]);

  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) onDismiss();
  };

  if (!visible) return null;

  // Define alert styles based on type
  const alertStyles = {
    info: 'bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    success: 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200',
    warning: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    error: 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200',
    dark: 'bg-gray-50 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  };

  // Default icons for each type
  const defaultIcons = {
    info: <BiInfoCircle className="h-5 w-5" />,
    success: <BiCheckCircle className="h-5 w-5" />,
    warning: <IoIosWarning className="h-5 w-5" />,
    error: <BiErrorCircle className="h-5 w-5" />,
    dark: <BiInfoCircle className="h-5 w-5" />
  };

  // Use custom icon if provided, otherwise use default for type
  const alertIcon = icon || defaultIcons[type];

  return (
    <div 
      className={`rounded-md p-4 mb-4 ${alertStyles[type]} ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        {alertIcon && (
          <div className="flex-shrink-0 mr-3">
            {alertIcon}
          </div>
        )}
       
        
        <div className="flex-1">
          {title && (
            <h3 className={`text-sm font-medium mb-1 ${
              type === 'dark' ? 'text-gray-900 dark:text-white' : ''
            }`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${
            title ? '' : 'mt-1'
          }`}>
            {message}
          </div>
        </div>
        
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="ml-3 flex-shrink-0 focus:outline-none"
            aria-label="Dismiss alert"
          >
            <BiX className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;