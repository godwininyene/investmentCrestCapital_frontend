import coverImage from './../../assets/images/forex.jpeg';
import defaultAvatar from './../../assets/images/default.jpg'
import { BsGenderAmbiguous, BsTrash3 } from 'react-icons/bs';
import { RiExchangeFundsLine } from 'react-icons/ri';
import {FaUserTimes } from 'react-icons/fa';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import {
    BiPhone,
    BiGlobeAlt,
    BiMapPin,
    BiPlug,
    BiUserCheck,
    BiLogoFlickr
} from 'react-icons/bi';

const UserDetail = ({ user, onStatusChange, onDelete, onFund, updating, deleting, statusBadge }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-slate-700 transition-colors duration-200">
            {/* Cover Image */}
            <div className="min-h-[150px] bg-cover bg-center relative" style={{ backgroundImage: `url(${coverImage})` }}>
                <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
            </div>
           
            
            <div className="px-6 pb-6 relative">
                {/* Profile Avatar */}
                <div className="flex justify-center -mt-24 mb-1">
                    <img 
                        src={user.photo && user.photo !== 'default.png' ? user.photo : defaultAvatar} 
                        alt={user.firstName} 
                        className="h-28 w-28 rounded-full border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-700 object-cover shadow-md transition-all duration-200 hover:scale-105"
                    />
                </div>
                
                {/* User Info */}
                <div className="text-center mb-4">
                    <h3 className="text-xl font-semibold dark:text-white">{user.firstName} {user.lastName}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
                    <div className="mt-2 text-sm">{statusBadge(user.status)}</div>
                </div>
                
                {/* User Details */}
                <div className="space-y-3 mb-4 grid md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                        <BiGlobeAlt className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                        <div className='text-sm'>
                            <p className="text-gray-500 dark:text-gray-400">Firstname</p>
                            <p className="font-medium dark:text-white">{user.firstName || 'Not provided'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                        <BiGlobeAlt className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                        <div className='text-sm'>
                            <p className="text-gray-500 dark:text-gray-400">Lastname</p>
                            <p className="font-medium dark:text-white">{user.lastName || 'Not provided'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                        <BiPhone className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                        <div className='text-sm'>
                            <p className="text-gray-500 dark:text-gray-400">Phone</p>
                            <p className="font-medium dark:text-white">{user.phone || 'Not provided'}</p>
                        </div>
                    </div>
                </div>
                
                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2 text-center border-t border-gray-200 dark:border-slate-700 pt-4">
                    {/* Status Toggle */}
                    <div className="flex flex-col items-center">
                        {user.status === 'active' ? (
                            <>
                                <button 
                                    className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white p-2 rounded-full transition-colors duration-200"
                                    onClick={() => onStatusChange('deactivate', user)}
                                    disabled={updating}
                                >
                                    {updating ? <LoadingIndicator size={6} /> : <BiPlug className="h-4 w-4" />}
                                </button>
                                <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">
                                    Deactivate
                                </span>
                            </>
                        ) : (
                            <>
                                <button 
                                    className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white p-2 rounded-full transition-colors duration-200"
                                    onClick={() => onStatusChange('approve', user)}
                                    disabled={updating}
                                >
                                    {updating ? <LoadingIndicator size={6} /> : <BiUserCheck className="h-4 w-4" />}
                                </button>
                                <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">
                                    Activate
                                </span>
                            </>
                        )}
                    </div>

                    {/* Fund/Deny */}
                    <div className="flex flex-col items-center">
                        {user.status === 'pending' ? (
                            <>
                                <button 
                                    className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white p-2 rounded-full transition-colors duration-200"
                                    onClick={() => onStatusChange('deny', user)}
                                    disabled={updating}
                                >
                                    {updating ? <LoadingIndicator size={6} /> : <FaUserTimes className="h-4 w-4" />}
                                </button>
                                <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">
                                    Deny Access
                                </span>
                            </>
                        ) : (
                            <>
                                <button 
                                    className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white p-2 rounded-full transition-colors duration-200"
                                    onClick={onFund}
                                >
                                    <RiExchangeFundsLine className="h-4 w-4" />
                                </button>
                                <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">
                                    Fund
                                </span>
                            </>
                        )}
                    </div>

                    {/* Delete */}
                    <div className="flex flex-col items-center">
                        <button 
                            className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white p-2 rounded-full transition-colors duration-200"
                            onClick={() => onDelete(user)}
                            disabled={deleting}
                        >
                            {deleting ? <LoadingIndicator size={6} /> : <BsTrash3 className="h-4 w-4" />}
                        </button>
                        <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">
                            Delete
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;