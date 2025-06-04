import coverImage from './../../assets/images/forex.jpeg';
import defaultAvatar from './../../assets/images/default.jpg'
import { BsGenderAmbiguous,  BsTrash3 } from 'react-icons/bs';
import { RiExchangeFundsLine } from 'react-icons/ri';
import { FaUpwork } from 'react-icons/fa6';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import {
    BiPhone,
    BiGlobeAlt,
    BiMapPin,
    BiPlug,
    BiUserCheck,
    BiLogoFlickr
  } from 'react-icons/bi';
import { FaUserTimes } from 'react-icons/fa';
const UserDetail = ({ user, onStatusChange, onDelete, onFund, updating, deleting, statusBadge }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
            <div className="min-h-[150px] bg-cover bg-center relative" style={{ backgroundImage: `url(${coverImage})` }}>
            </div>
            
            <div className="px-6 pb-6 relative">
                <div className="flex justify-center -mt-24 mb-1">
                    <img 
                        src={user.photo && user.photo !== 'default.png' ? user.photo : defaultAvatar} 
                        alt={user.name} 
                        className="h-28 w-28 rounded-full border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-700"
                    />
                </div>
                
                <div className="text-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
                    <div className="mt-2 text-sm">{statusBadge(user.status)}</div>
                </div>
                
               
                {/* User Details */}
                <div className="space-y-1 mb-2 grid md:grid-cols-2">
                    <div className="flex items-center gap-3 text-sm">
                        <BiPhone className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <div className='text-xs'>
                            <p className="text-gray-500 dark:text-gray-400">Phone</p>
                            <p className="font-medium">{user.phone || 'Not provided'}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                        <BiGlobeAlt className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <div className='text-xs'>
                            <p className="text-gray-500 dark:text-gray-400">Country</p>
                            <p className="font-medium">{user.country || 'Not provided'}</p>
                        </div>
                    </div>
                    
                    
                    <div className="flex items-center gap-3 text-sm">
                        <BiMapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <div className='text-xs'>
                            <p className="text-gray-500 dark:text-gray-400">Address</p>
                            <p className="font-medium">{user.firstAddress || 'Not provided'}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                        <BsGenderAmbiguous className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <div className='text-xs'>
                            <p className="text-gray-500 dark:text-gray-400">Gender</p>
                            <p className="font-medium capitalize">{user.gender || 'Not specified'}</p>
                        </div>
                    </div>

                  
                </div>
                
                {/* Action Buttons */}
                <div className="grid grid-cols-3  text-center pb-1   border-t border-t-gray-300 pt-1">
                    {/* Action */}
                    <aside>
                        { (user.status == 'active') ? (<>
                            {/* Pedding Icon */}
                            <button className="bg-red-500 cursor-pointer text-white py-1 px-2 rounded-sm block mx-auto" onClick={() => onStatusChange('deactivate', user)}>
                                {updating ? <LoadingIndicator size={6} /> : <BiPlug  className="h-4 w-4"  /> }
                            </button>
                            <span className="capitallize text-sm">
                                De-Activate
                            </span>
                            </>) : (<>
                            {/* Approved Icon */}
                            <button className="bg-green-500 cursor-pointer text-white py-1 px-2 rounded-sm block mx-auto" onClick={() => onStatusChange('approve', user)}>
                                {updating ? <LoadingIndicator size={6} /> : <BiUserCheck  className="h-4 w-4"  /> }
                            </button>
                            <span className="capitallize text-sm">
                                Activate
                            </span>
                        </>)}
                    </aside>
                    {/* Fund */}
                    <aside>
                    { (user.status == 'pending') ? (<>
                            {/* Deny Icon */}
                            <button className="bg-red-500 cursor-pointer text-white py-1 px-2 rounded-sm block mx-auto"  onClick={() => onStatusChange('deny', user)}>
                                {updating ? <LoadingIndicator size={6} /> : <FaUserTimes  className="h-4 w-4"  /> }
                            </button>
                          
                            <span className="capitallize text-sm">
                                Deny Access
                            </span>
                            </>) : (<>
                                {/* Fund Icon */}
                                
                            <button className="bg-blue-500 cursor-pointer text-white py-1 px-2 rounded-sm block mx-auto" onClick={onFund}>
                                <RiExchangeFundsLine  className="h-4 w-4"  />
                            </button>
                            <span className="capitallize text-sm">
                                Fund
                            </span>
                        </>)}
                    </aside>
                    {/* Delete Account */}
                    <aside>
                        <button className="bg-red-500 cursor-pointer text-white py-1 px-2 rounded-sm block mx-auto" onClick={() => onDelete(user)}>
                            {deleting ? <LoadingIndicator size={6} /> : <BsTrash3  className="h-4 w-4"  /> }
                        </button>
                        <span className="capitallize text-sm">
                            Delete
                        </span>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default UserDetail