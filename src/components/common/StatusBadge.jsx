import { FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
const StatusBadge = ({ status }) => {
    const statusConfig = {
        success: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: <FaCheckCircle className="mr-1" /> },
        pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: <FaClock className="mr-1" /> },
        declined: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: <FaTimesCircle className="mr-1" /> },
        active: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: <FaCheckCircle className="mr-1" /> },
        completed: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: <FaCheckCircle className="mr-1" /> },
        denied: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: <FaTimesCircle className="mr-1" /> }
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' };
    
    return (
        <span className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-full ${config.color}`}>
            {config.icon} {status}
        </span>
    );
};

export default StatusBadge;