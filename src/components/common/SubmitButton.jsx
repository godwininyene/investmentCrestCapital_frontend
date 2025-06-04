import LoadingIndicator from "./LoadingIndicator";
import { FaUserPlus } from 'react-icons/fa6';
const SubmitButton = ({
  className = '',
  onClick,
  processing,
  disabled,
  label,
  type = 'submit',
  Icon = FaUserPlus,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || processing}
      className={`inline-flex items-center justify-center gap-x-2 bg-primary-light transition-all duration-100 hover:bg-primary-dark text-white rounded-md px-5 py-2 ${
        disabled || processing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`} // Added className at the end
    >
      {processing ? (
        <LoadingIndicator size={5} />
      ) : Icon && (
        <Icon className="w-6 h-6" />
      )}
      {label}
    </button>
  );
};

export default SubmitButton