import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaUser, FaLock, FaBell, FaEnvelope } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';
import axios from '../../lib/axios';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { toast } from 'react-hot-toast';
import InputField from '../../components/common/InputField';
import defaultAvatar from '../../assets/images/default.jpg';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const initialUser = JSON.parse(localStorage.getItem('user'));
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(initialUser?.photo || defaultAvatar);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Profile form
  const { 
    register: registerProfile, 
    handleSubmit: handleProfileSubmit, 
    formState: { errors: profileErrors, isDirty: profileIsDirty },
    reset: resetProfile
  } = useForm({
    defaultValues: {
      firstName: initialUser?.firstName || '',
      lastName: initialUser?.lastName || '',
      email: initialUser?.email || '',
      phone: initialUser?.phone || '',
    }
  });

  // Password form
  // const { 
  //   register: registerPassword, 
  //   handleSubmit: handlePasswordSubmit, 
  //   // formState: { errors: passwordErrors }, 
  //   reset: resetPassword,
  //   watch
  // } = useForm();

  const[passwordErrors, setPasswordErrors] = useState({
    password:'',
    passwordCurrent:'',
    passwordConfirm:''
  })

  const tabs = [
    { id: 'profile', icon: <FaUser />, label: 'Profile' },
    { id: 'security', icon: <FaLock />, label: 'Security' },
    { id: 'notifications', icon: <FaBell />, label: 'Notifications' },
  ];

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitProfile = async (e) => {
    setLoading(true);
    e.preventDefault();
    
    try {
      const formData = new FormData(e.target);
      if (selectedFile) {
        formData.append('photo', selectedFile);
      }

      const response = await axios.patch('/api/v1/users/updateMe', formData);
      
      if(response.data.status === 'success'){
        const updatedUser = response.data.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        resetProfile({
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          phone: updatedUser.phone
        }, { keepDirty: false });
        setAvatarPreview(updatedUser.photo || defaultAvatar);
        setSelectedFile(null);
        toast.success('Profile updated successfully');
        alert('Profile updated successfully')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      alert(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    setPasswordErrors({})
    const data = new FormData(e.target);
    const dataToSend = Object.fromEntries(data)
    setLoading(true);
    try {
      const response = await axios.patch('/api/v1/users/updateMyPassword',dataToSend);

      if (response.data.status === 'success') {
        toast.success('Password updated successfully');
        alert('Password updated successfully')
        e.target.reset();
      }
    } catch (error) {
      console.log('ERROR', error);
      
      toast.error(error.response?.data?.message || 'Failed to update password');
      alert(error.response?.data?.message || 'Failed to update password')
      if(error.response?.data?.errors){
        setPasswordErrors(error.response.data.errors)
      }
    } finally {
      setLoading(false);
    }
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
                      src={avatarPreview} 
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
                  <form onSubmit={onSubmitProfile}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <InputField
                        name="firstName"
                        label="Firstname"
                        defaultValue={initialUser.firstName}
                        type="text"
                        register={registerProfile}
                        error={profileErrors.firstName}
                        placeholder="Enter your firstname"
                      />

                      <InputField
                        name="lastName"
                        label="Lastname"
                         defaultValue={initialUser.lastName}
                        type="text"
                        register={registerProfile}
                        error={profileErrors.lastName}
                        placeholder="Enter your lastname"
                      />

                      <InputField
                        name="email"
                        label="Email Address"
                        type="email"
                         defaultValue={initialUser.email}
                        register={registerProfile}
                        validation={{
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        }}
                        error={profileErrors.email}
                        placeholder="Enter your email"
                      />

                      <InputField
                        name="phone"
                        label="Phone Number"
                        type="tel"
                         defaultValue={initialUser.phone}
                        register={registerProfile}
                        error={profileErrors.phone}
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading }
                        className={`px-6 py-2 cursor-pointer rounded-lg transition-colors ${
                          loading 
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
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
                  <form onSubmit={onChangePassword}>
                    <div className="space-y-4">
                      <InputField
                        name="passwordCurrent"
                        label="Current Password"
                        type="password"
                        // register={registerPassword}
                        // validation={{ required: 'Current password is required' }}
                        error={passwordErrors.passwordCurrent}
                        placeholder="Enter current password"
                      />

                      <InputField
                        name="password"
                        label="New Password"
                        type="password"
                        // register={registerPassword}
                        // validation={{ 
                        //   required: 'New password is required',
                        //   minLength: {
                        //     value: 8,
                        //     message: 'Password must be at least 8 characters'
                        //   }
                        // }}
                        error={passwordErrors.password}
                        placeholder="Enter new password"
                      />

                      <InputField
                        name="passwordConfirm"
                        label="Confirm New Password"
                        type="password"
                        // register={registerPassword}
                        // validation={{ 
                        //   required: 'Please confirm your password',
                        //   validate: value => 
                        //     value === watch('password') || 'Passwords do not match'
                        // }}
                        error={passwordErrors.passwordConfirm}
                        placeholder="Confirm new password"
                      />

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {loading ? <LoadingIndicator size={5} /> : 'Update Password'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* <div className="bg-gray-50 dark:bg-slate-700 p-5 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Two-Factor Authentication</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-600 dark:text-gray-300">Add an extra layer of security to your account</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                </div> */}

                {/* <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-lg border border-red-200 dark:border-red-800">
                  <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-3">Danger Zone</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-red-600 dark:text-red-300">Permanently delete your account and all associated data</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      <RiDeleteBinLine /> Delete Account
                    </button>
                  </div>
                </div> */}
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
        </div>
      </div>
    </div>
  );
}