import PropTypes from 'prop-types';

const EmptyState = ({ 
  title, 
  description, 
  icon, 
  action, 
  className = '',
  image,
  imageAlt = 'Empty state illustration'
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="max-w-md mx-auto">
        {icon && (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-400 mb-4">
            {icon}
          </div>
        )}
        
        {image && (
          <div className="mb-4">
            <img 
              src={image} 
              alt={imageAlt} 
              className="mx-auto h-32 w-32 object-contain"
            />
          </div>
        )}
        
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {description}
          </p>
        )}
        
        {action && (
          <div className="mt-6">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  icon: PropTypes.node,
  action: PropTypes.node,
  className: PropTypes.string,
  image: PropTypes.string,
  imageAlt: PropTypes.string
};

export default EmptyState;