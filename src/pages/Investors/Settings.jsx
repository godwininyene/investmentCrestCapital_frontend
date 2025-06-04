import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaUser, FaLock, FaBell, FaEnvelope, FaGlobe } from 'react-icons/fa';
import { BsCreditCard } from 'react-icons/bs';
import { RiDeleteBinLine } from 'react-icons/ri';
import axios from '../../lib/axios';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { toast } from 'react-hot-toast';
import InputField from '../../components/common/InputField';
import defaultAvatar from '../../assets/images/default.jpg';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.photo || defaultAvatar);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      country: user?.country || '',
    }
  });

  const tabs = [
    { id: 'profile', icon: <FaUser />, label: 'Profile' },
    { id: 'security', icon: <FaLock />, label: 'Security' },
    { id: 'notifications', icon: <FaBell />, label: 'Notifications' },
    // { id: 'billing', icon: <BsCreditCard />, label: 'Billing' },
  ];

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitProfile = async (data) => {
    setLoading(true);
    try {
      const response = await axios.put('/api/v1/users/update-profile', data);
      const updatedUser = { ...user, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = async (data) => {
    // Password change logic
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Account Settings</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Sidebar */}
        <div className="w-full lg:w-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 h-fit">
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-light text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Profile Information</h2>
              
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 dark:border-slate-700 mb-3">
                    <img 
                      src={avatarPreview || '/default-avatar.jpg'} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline">
                    Change Photo
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>

                <div className="flex-1">
                  <form onSubmit={handleSubmit(onSubmitProfile)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <InputField
                        name="name"
                        label="Full Name"
                        type="text"
                        register={register}
                        value={user.name}
                        validation={{ required: 'Name is required' }}
                        error={errors.name}
                        placeholder="Enter your full name"
                      />

                      <InputField
                        name="email"
                        label="Email Address"
                        type="email"
                        value={user.email}
                        register={register}
                        validation={{
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        }}
                        error={errors.email}
                        placeholder="Enter your email"
                      />

                      <InputField
                        name="phone"
                        label="Phone Number"
                        type="tel"
                        register={register}
                        error={errors.phone}
                        value={user.phone}
                        placeholder="Enter your phone number"
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Country
                        </label>
                        <div className="relative">
                          <select
                            {...register('country')}
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-700 dark:bg-slate-700 dark:text-white appearance-none"
                          >
                            <option value="">Select Country</option>
                            <option value="US">United States</option>
                            <option value="UK">United Kingdom</option>
                            {/* Add more countries as needed */}
                          </select>
                          <FaGlobe className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? <LoadingIndicator size={5} /> : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Security Settings</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-slate-700 p-5 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Change Password</h3>
                  <form onSubmit={handleSubmit(onChangePassword)}>
                    <div className="space-y-4">
                      <InputField
                        name="currentPassword"
                        label="Current Password"
                        type="password"
                        register={register}
                        validation={{ required: 'Current password is required' }}
                        error={errors.currentPassword}
                        placeholder="Enter current password"
                      />

                      <InputField
                        name="newPassword"
                        label="New Password"
                        type="password"
                        register={register}
                        validation={{ 
                          required: 'New password is required',
                          minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters'
                          }
                        }}
                        error={errors.newPassword}
                        placeholder="Enter new password"
                      />

                      <InputField
                        name="confirmPassword"
                        label="Confirm New Password"
                        type="password"
                        register={register}
                        validation={{ required: 'Please confirm your password' }}
                        error={errors.confirmPassword}
                        placeholder="Confirm new password"
                      />

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="bg-gray-50 dark:bg-slate-700 p-5 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Two-Factor Authentication</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-600 dark:text-gray-300">Add an extra layer of security to your account</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-lg border border-red-200 dark:border-red-800">
                  <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-3">Danger Zone</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-red-600 dark:text-red-300">Permanently delete your account and all associated data</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      <RiDeleteBinLine /> Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

           {/* Notifications Tab */}
           {activeTab === 'notifications' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Notification Preferences</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-slate-700 p-5 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Email Notifications</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white">Account Activity</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Important notifications about your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white">Investment Updates</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Notifications about your investments</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white">Promotional Offers</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Special offers and news</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-slate-700 p-5 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Push Notifications</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white">Transaction Alerts</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Get notified for all transactions</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white">Market Updates</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Important market changes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Billing Information</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-slate-700 p-5 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Payment Methods</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 border border-gray-200 dark:border-slate-600 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-6 bg-blue-500 rounded flex items-center justify-center text-white">
                          VISA
                        </div>
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Expires 04/2025</p>
                        </div>
                      </div>
                      <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                        Remove
                      </button>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                      <span>+ Add New Payment Method</span>
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-slate-700 p-5 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Billing History</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-600">
                      <thead className="bg-gray-100 dark:bg-slate-600">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Description</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-slate-700 divide-y divide-gray-200 dark:divide-slate-600">
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">Jan 15, 2023</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">Premium Plan</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">$29.99</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 dark:text-green-400">Paid</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">Dec 15, 2022</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">Premium Plan</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">$29.99</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 dark:text-green-400">Paid</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}