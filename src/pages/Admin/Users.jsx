import { useEffect, useState } from 'react';
import { 
  FaUserClock, 
  FaUserTimes,
  FaUserCheck,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import { 
  BiGridAlt, 
  BiListUl, 
  BiTrashAlt,
  BiUser,
  BiWallet,
} from 'react-icons/bi';
import { IoEye } from 'react-icons/io5';
import { RiExchangeFundsLine } from 'react-icons/ri';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/CustomModal';
import SelectField from '../../components/common/SelectField';
import FundAccount from './FundAccount';
import axios from '../../lib/axios';
import coverImage from './../../assets/images/forex.jpeg';
import defaultAvatar from './../../assets/images/default.jpg'
import UserDetail from './UserDetails';
import { toast } from 'react-toastify';

export default function Users() {
    const [displayStyle, setDisplayStyle] = useState('list');
    const [currentScreen, setCurrentScreen] = useState('users_list');
    const [fetched, setFetched] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [userModal, setUserModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: 'all',
        dateRange: 'all'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, searchTerm, users]);

    const fetchUsers = async () => {
        setProcessing(true);
        try {
            const res = await axios.get('api/v1/users');
            if(res.data.status === 'success') {
                setUsers(res.data.data.users);
                setFetched(true);
            }
        } catch (error) {
            console.error(error.response?.data?.message || error.message);
            setFetched(true);
        } finally {
            setProcessing(false);
        }
    };

    const applyFilters = () => {
        let result = [...users];
        
        // Apply status filter
        if (filters.status !== 'all') {
            result = result.filter(user => user.status === filters.status);
        }
        
        // Apply search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(user => 
                user.firstName.toLowerCase().includes(term) || 
                user.email.toLowerCase().includes(term) ||
                user.phone?.toLowerCase().includes(term)
            );
        }
        
        setFilteredUsers(result);
    };

    const updateUserInList = (user, action = "update") => {
        if (action === "delete") {
            setUsers(prev => prev.filter(u => u.id !== user.id));
        } else {
            setUsers(prev => prev.map(u => u.id === user.id ? user : u));
        }
    };

    const updateAccountStatus = async (status, user) => {
        if (!window.confirm(`Are you sure you want to ${status} this account?`)) return;
        setSelectedUser(user)
        try {
            setUpdating(true);
            const res = await axios.patch(`api/v1/users/${user.id}/status`, { status });
            if (res.data.status === 'success') {
                updateUserInList(res.data.data.user);
                setSelectedUser(res.data.data.user);
                toast.success(`User's status changed successfully!`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
            console.error(error);
        } finally {
            setUpdating(false);
        }
    };

    const deleteUser = async (user) => {
        if (!window.confirm(`Are you sure you want to delete ${user.firstName}? This action will delete all the user related data`)) return;
        
        setDeleting(true);
        try {
            const res = await axios.delete(`api/v1/users/${user.id}`);
            if (res.status === 204) {
                updateUserInList(user, 'delete');
                toast.success("User deleted successfully");
                setUserModal(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete user");
            console.error(error);
        } finally {
            setDeleting(false);
        }
    };
 
    return (
        <div className="space-y-6 ">
             {/* Show Default User List Page */}
             {currentScreen === 'users_list' && <>
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <BiUser className="text-blue-600 dark:text-blue-400" /> 
                        User Management
                    </h1>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setDisplayStyle(prev => prev === "list" ? "grid" : "list")}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600"
                        >
                            {displayStyle === "list" ? 
                                <BiGridAlt className="h-5 w-5" /> : 
                                <BiListUl className="h-5 w-5" />
                            }
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="pl-10 w-full p-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex gap-2">
                            <SelectField
                                options={['all',  'active', 'deactivated']}
                                value={filters.status}
                                onChange={(e) => setFilters({...filters, status: e.target.value})}
                                icon={<FaFilter className="h-4 w-4" />}
                                label={'Status'}
                                variant="outline"
                                classNames="dark:bg-slate-700 dark:border-slate-700"
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
                        <div className="flex lg:items-center lg:justify-between flex-col-reverse lg:flex-row">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                                <p className="text-2xl font-bold">{filteredUsers.length}</p>
                            </div>
                            <div className="p-3 rounded-full h-12 w-12 mb-2 lg:mb-0 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                                <BiUser className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
                          <div className="flex lg:items-center lg:justify-between flex-col-reverse lg:flex-row">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
                                <p className="text-2xl font-bold">
                                    {filteredUsers.filter(u => u.status === 'active').length}
                                </p>
                            </div>
                            <div className="p-3 rounded-full h-12 w-12 mb-2 lg:mb-0 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                                <FaUserCheck className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
                        <div className="flex lg:items-center lg:justify-between flex-col-reverse lg:flex-row">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Pending Users</p>
                                <p className="text-2xl font-bold">
                                    {filteredUsers.filter(u => u.status === 'pending').length}
                                </p>
                            </div>
                            <div className="p-3 rounded-full h-12 w-12 mb-2 lg:mb-0 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300">
                                <FaUserClock className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
                        <div className="flex lg:items-center lg:justify-between flex-col-reverse lg:flex-row">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Balance</p>
                                <p className="text-2xl font-bold">
                                    ${filteredUsers.reduce((sum, user) => sum + (user.wallet[0]?.balance || 0), 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="p-3 rounded-full h-12 w-12 mb-2 lg:mb-0 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                                <BiWallet className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                </div>

            {/* Users Display */}
                {processing && !fetched ? (
                    <div className="flex justify-center p-12">
                        <LoadingIndicator type="dots" size={10} />
                    </div>
                ) : filteredUsers.length > 0 ? (
                    displayStyle === 'list' ? (
                        <ListDisplay 
                            users={filteredUsers} 
                            onView={(user) => { setSelectedUser(user); setUserModal(true); }}
                            onStatusChange={updateAccountStatus}
                            onDelete={deleteUser}
                            updating={updating}
                            deleting={deleting}
                            selectedUser={selectedUser}
                        />
                    ) : (
                        <GridDisplay 
                            users={filteredUsers} 
                            onView={(user) => { setSelectedUser(user); setUserModal(true); }}
                            onStatusChange={updateAccountStatus}
                            onDelete={deleteUser}
                            onFund={(user) => { setSelectedUser(user); setCurrentScreen('fund_user'); }}
                            updating={updating}
                            deleting={deleting}
                            selectedUser={selectedUser}
                        />
                    )
                ) : (
                    <EmptyState 
                        title="No users found"
                        description="Try adjusting your search or filter criteria"
                        icon={<BiUser className="h-12 w-12 text-gray-400" />}
                    />
                )}

                {/* User Detail Modal */}
                <Modal show={userModal} maxWidth="sm" onClose={() => setUserModal(false)}>
                    {selectedUser && (
                         <UserDetail 
                            user={selectedUser}
                            onClose={() => setUserModal(false)}
                            onStatusChange={updateAccountStatus}
                            onDelete={deleteUser}
                            onFund={() => { setCurrentScreen('fund_user'); setUserModal(false); }}
                            updating={updating}
                            deleting={deleting}
                            statusBadge={statusBadge}
                        />
                    )}
                </Modal>
            </>}

            {/* Fund User Screen */}
            {currentScreen === 'fund_user' && (
                <FundAccount 
                    user={selectedUser} 
                    onBack={() => setCurrentScreen('users_list')} 
                    onFunded={(user) => {
                        setSelectedUser(user);
                        updateUserInList(user);
                    }} 
                />
            )}
        </div>
    );
}

// List Display Component
const ListDisplay = ({ users, onView, onStatusChange, onDelete, updating, deleting, selectedUser }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                    <thead className="bg-gray-50 dark:bg-slate-700">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Balance</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                                <td className="px-4 py-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img 
                                                src={user.photo && user.photo !== 'default.png' ? user.photo : defaultAvatar} 
                                                alt={user.firstName} 
                                                className="h-10 w-10 rounded-full"
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                 {`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Unknown'}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {user.phone || 'No phone'}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                                    {user.email}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                                    ${user.wallet?.balance?.toLocaleString() || '0'}
                                </td>
                                <td className="px-4 py-4">
                                    {statusBadge(user.status)}
                                </td>
                                <td className="px-4 py-4 text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => onView(user)}
                                            className="text-blue-600 cursor-pointer dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                                        >
                                            <IoEye className="h-5 w-5" />
                                        </button>
                                        
                                        {user.status=== 'pending' ? (
                                            <button
                                                onClick={() => onStatusChange('approve',user)}
                                                className="text-green-600 cursor-pointer dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                                                disabled={updating && selectedUser?.id === user.id}
                                            >
                                                {updating && selectedUser?.id === user.id ? (
                                                    <LoadingIndicator size={4} />
                                                ) : (
                                                    <FaUserCheck className="h-5 w-5" />
                                                )}
                                            </button>
                                        ) : user.status === 'active' ? (
                                            <button
                                                onClick={() => onStatusChange('deactivate', user)}
                                                className="text-orange-600 cursor-pointer dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-300"
                                                disabled={updating && selectedUser?.id === user.id}
                                            >
                                                {updating && selectedUser?.id === user.id ? (
                                                    <LoadingIndicator size={4} />
                                                ) : (
                                                    <FaUserTimes className="h-5 w-5" />
                                                )}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => onStatusChange('approve', user)}
                                                className="text-green-600 cursor-pointer dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                                                disabled={updating && selectedUser?.id === user.id}
                                            >
                                                {updating && selectedUser?.id === user.id ? (
                                                    <LoadingIndicator size={4} />
                                                ) : (
                                                    <FaUserCheck className="h-5 w-5" />
                                                )}
                                            </button>
                                        )}
                                        
                                        <button
                                            onClick={() => onDelete(user)}
                                            className="text-red-600 cursor-pointer dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                                            disabled={deleting && selectedUser?.id === user.id}
                                        >
                                            {deleting && selectedUser?.id === user.id ? (
                                                <LoadingIndicator size={4} />
                                            ) : (
                                                <BiTrashAlt className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Grid Display Component
const GridDisplay = ({ users, onView, onStatusChange,  onFund, updating, selectedUser }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map(user => (
                <div key={user._id} className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
                    <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${coverImage})` }}></div>
                    <div className="px-4 pb-4 relative">
                        <div className="flex justify-center -mt-16 mb-4">
                            <img 
                                src={user.photo && user.photo !== 'default.png' ? user.photo : defaultAvatar} 
                                alt={user.firstName} 
                                className="h-24 w-24 rounded-full border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-700"
                            />
                        </div>
                        
                        <div className="text-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">  {`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Unknown'}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                            <div className="mt-2">{statusBadge(user.status)}</div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-center mb-4">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Balance</p>
                                <p className="font-medium">${user.wallet?.balance?.toLocaleString() || '0'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Profit</p>
                                <p className="font-medium">${user.wallet?.profit?.toLocaleString() || '0'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Referral</p>
                                <p className="font-medium">${user.wallet?.referralBalance?.toLocaleString() || '0'}</p>
                            </div>
                        </div>
                        
                        <div className="flex justify-between gap-2">
                            <button
                                onClick={() => onView(user)}
                                className="flex-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 py-2 rounded flex items-center justify-center gap-1"
                            >
                                <IoEye className="h-4 w-4" /> View
                            </button>
                            
                            {user.status === 'pending' ? (
                                <button
                                    onClick={() => onStatusChange('approve', user)}
                                    className="flex-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 py-2 rounded flex items-center justify-center gap-1"
                                    disabled={updating && selectedUser?.id === user.id}
                                >
                                    {updating && selectedUser?.id === user.id ? (
                                        <LoadingIndicator size={3} />
                                    ) : (
                                        <>
                                            <FaUserCheck className="h-4 w-4" /> Approve
                                        </>
                                    )}
                                </button>
                            ) : user.status === 'active' ? (
                                <button
                                    onClick={() => onStatusChange('deactivate', user)}
                                    className="flex-1 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-800 py-2 px-2 rounded flex items-center justify-center gap-1"
                                    disabled={updating && selectedUser?.id === user.id}
                                >
                                    {updating && selectedUser?.id === user.id ? (
                                        <LoadingIndicator size={3} />
                                    ) : (
                                        <>
                                            <FaUserTimes className="h-4 w-4" /> Deactivate
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={() => onStatusChange('approve', user)}
                                    className="flex-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 py-2 rounded flex items-center justify-center gap-1"
                                    disabled={updating && selectedUser?.id === user.id}
                                >
                                    {updating && selectedUser?.id === user.id ? (
                                        <LoadingIndicator size={3} />
                                    ) : (
                                        <>
                                            <FaUserCheck className="h-4 w-4" /> Activate
                                        </>
                                    )}
                                </button>
                            )}
                            
                            <button
                                onClick={() => onFund(user)}
                                className="flex-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800 py-2 rounded flex items-center justify-center gap-1"
                            >
                                <RiExchangeFundsLine className="h-4 w-4" /> Fund
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};


// Helper function for status badge
const statusBadge = (status) => {
    const baseClass = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
    switch(status) {
        case 'active':
            return <span className={`${baseClass} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}>
                <FaUserCheck className="h-4 w-4 mr-1" /> Active
            </span>;
        case 'denied':
            return <span className={`${baseClass} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`}>
                <FaUserTimes className="h-4 w-4 mr-1" /> Denied
            </span>;
        case 'pending':
            return <span className={`${baseClass} bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200`}>
                <FaUserClock className="h-4 w-4 mr-1" /> Pending
            </span>;
        case 'deactivated':
            return <span className={`${baseClass} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`}>
                <FaUserTimes className="h-4 w-4 mr-1" /> Deactivated
            </span>;
        default:
            return <span className={`${baseClass} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`}>
                Unknown
            </span>;
    }
};