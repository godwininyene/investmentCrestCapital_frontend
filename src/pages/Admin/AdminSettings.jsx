import { useState, useEffect } from 'react';
import { 
  BiCog,
  BiLock,
  BiUser,
  BiShield,
  BiBell,
  BiCreditCard,
  BiGlobe,
  BiSave,
  BiReset
} from 'react-icons/bi';
import { 
  FaExchangeAlt,
  FaPercentage
} from 'react-icons/fa';
import axios from '../../lib/axios';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import InputField from '../../components/common/InputField';
import SelectField from '../../components/common/SelectField';
import SubmitButton from '../../components/common/SubmitButton';
import Alert from '../../components/common/Alert';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    general: {
      siteName: '',
      siteUrl: '',
      defaultCurrency: 'USD',
      maintenanceMode: false,
      timezone: 'UTC'
    },
    security: {
      twoFactorAuth: true,
      loginAttempts: 5,
      passwordExpiry: 90,
      ipWhitelist: []
    },
    notifications: {
      emailNotifications: true,
      adminEmail: '',
      newUserNotification: true,
      depositNotification: true,
      withdrawalNotification: true
    },
    payment: {
      depositFee: 0,
      withdrawalFee: 0,
      minDeposit: 10,
      minWithdrawal: 20,
      paymentMethods: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [ipAddress, setIpAddress] = useState('');

  const currencies = [
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' },
    { value: 'NGN', label: 'Nigerian Naira (NGN)' },
    { value: 'BTC', label: 'Bitcoin (BTC)' }
  ];

  const timezones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'EST', label: 'Eastern Time (EST)' },
    { value: 'PST', label: 'Pacific Time (PST)' },
    { value: 'GMT', label: 'Greenwich Mean Time (GMT)' },
    { value: 'WAT', label: 'West Africa Time (WAT)' }
  ];

  const paymentMethods = [
    { value: 'bank', label: 'Bank Transfer' },
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'crypto', label: 'Cryptocurrency' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'stripe', label: 'Stripe' }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get('api/v1/admin/settings');
      if (res.data.status === 'success') {
        // setSettings(res.data.data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section, field, value, action = 'add') => {
    setSettings(prev => {
      const currentArray = [...prev[section][field]];
      if (action === 'add') {
        currentArray.push(value);
      } else {
        const index = currentArray.indexOf(value);
        if (index > -1) {
          currentArray.splice(index, 1);
        }
      }
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: currentArray
        }
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setSuccess(false);

    try {
      const res = await axios.post('api/v1/admin/settings', settings);
      if (res.data.status === 'success') {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const addIpAddress = () => {
    if (ipAddress && !settings.security.ipWhitelist.includes(ipAddress)) {
      handleArrayChange('security', 'ipWhitelist', ipAddress);
      setIpAddress('');
    }
  };

  const removeIpAddress = (ip) => {
    handleArrayChange('security', 'ipWhitelist', ip, 'remove');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingIndicator type="dots" size={10} />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BiCog className="text-blue-600 dark:text-blue-400" /> 
          Admin Settings
        </h1>
        {success && (
          <Alert type="success" message="Settings saved successfully!" />
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <BiCog className="h-5 w-5" />
            General
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'security'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <BiLock className="h-5 w-5" />
            Security
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'notifications'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <BiBell className="h-5 w-5" />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'payment'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <BiCreditCard className="h-5 w-5" />
            Payment
          </button>
        </nav>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 space-y-6">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <BiCog className="h-5 w-5" />
              General Settings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Site Name"
                name="siteName"
                value={settings.general.siteName}
                onChange={(e) => handleChange('general', 'siteName', e.target.value)}
                error={errors.siteName}
                required
              />
              
              <InputField
                label="Site URL"
                name="siteUrl"
                value={settings.general.siteUrl}
                onChange={(e) => handleChange('general', 'siteUrl', e.target.value)}
                error={errors.siteUrl}
                required
                type="url"
              />
              
              <SelectField
                label="Default Currency"
                // options={currencies}
                options={['adi']}
                value={settings.general.defaultCurrency}
                onChange={(e) => handleChange('general', 'defaultCurrency', e.target.value)}
                error={errors.defaultCurrency}
              />
              
              <SelectField
                label="Timezone"
                // options={timezones}
                options={['add']}
                value={settings.general.timezone}
                onChange={(e) => handleChange('general', 'timezone', e.target.value)}
                error={errors.timezone}
              />
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
              <div>
                <h3 className="text-sm font-medium">Maintenance Mode</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  When enabled, the site will be unavailable to regular users
                </p>
              </div>
              <ToggleSwitch
                enabled={settings.general.maintenanceMode}
                onChange={(enabled) => handleChange('general', 'maintenanceMode', enabled)}
              />
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 space-y-6">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <BiShield className="h-5 w-5" />
              Security Settings
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Require 2FA for admin access
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.security.twoFactorAuth}
                  onChange={(enabled) => handleChange('security', 'twoFactorAuth', enabled)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Max Login Attempts"
                  name="loginAttempts"
                  value={settings.security.loginAttempts}
                  onChange={(e) => handleChange('security', 'loginAttempts', parseInt(e.target.value) || 0)}
                  error={errors.loginAttempts}
                  type="number"
                  min="1"
                  max="10"
                />
                
                <InputField
                  label="Password Expiry (Days)"
                  name="passwordExpiry"
                  value={settings.security.passwordExpiry}
                  onChange={(e) => handleChange('security', 'passwordExpiry', parseInt(e.target.value) || 0)}
                  error={errors.passwordExpiry}
                  type="number"
                  min="30"
                  max="365"
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">IP Whitelist</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Only these IP addresses will be allowed to access the admin panel
                </p>
                
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    placeholder="Enter IP address"
                    className="flex-1 p-2 border border-gray-300 dark:border-slate-700 rounded-lg dark:bg-slate-700"
                  />
                  <button
                    type="button"
                    onClick={addIpAddress}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                
                {settings.security.ipWhitelist.length > 0 ? (
                  <ul className="space-y-2">
                    {settings.security.ipWhitelist.map((ip) => (
                      <li key={ip} className="flex items-center justify-between bg-gray-50 dark:bg-slate-700 p-3 rounded-lg">
                        <span>{ip}</span>
                        <button
                          type="button"
                          onClick={() => removeIpAddress(ip)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    No IP addresses whitelisted
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 space-y-6">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <BiBell className="h-5 w-5" />
              Notification Settings
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enable all email notifications
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.notifications.emailNotifications}
                  onChange={(enabled) => handleChange('notifications', 'emailNotifications', enabled)}
                />
              </div>
              
              <InputField
                label="Admin Email"
                name="adminEmail"
                value={settings.notifications.adminEmail}
                onChange={(e) => handleChange('notifications', 'adminEmail', e.target.value)}
                error={errors.adminEmail}
                type="email"
                disabled={!settings.notifications.emailNotifications}
              />
              
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">New User Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get notified when new users register
                    </p>
                  </div>
                  <ToggleSwitch
                    enabled={settings.notifications.newUserNotification}
                    onChange={(enabled) => handleChange('notifications', 'newUserNotification', enabled)}
                    disabled={!settings.notifications.emailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Deposit Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get notified when users make deposits
                    </p>
                  </div>
                  <ToggleSwitch
                    enabled={settings.notifications.depositNotification}
                    onChange={(enabled) => handleChange('notifications', 'depositNotification', enabled)}
                    disabled={!settings.notifications.emailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Withdrawal Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get notified when users request withdrawals
                    </p>
                  </div>
                  <ToggleSwitch
                    enabled={settings.notifications.withdrawalNotification}
                    onChange={(enabled) => handleChange('notifications', 'withdrawalNotification', enabled)}
                    disabled={!settings.notifications.emailNotifications}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Settings */}
        {activeTab === 'payment' && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 space-y-6">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <BiCreditCard className="h-5 w-5" />
              Payment Settings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Deposit Fee (%)"
                name="depositFee"
                value={settings.payment.depositFee}
                onChange={(e) => handleChange('payment', 'depositFee', parseFloat(e.target.value) || 0)}
                error={errors.depositFee}
                type="number"
                min="0"
                max="10"
                step="0.1"
                icon={<FaPercentage className="h-4 w-4 text-gray-400" />}
              />
              
              <InputField
                label="Withdrawal Fee (%)"
                name="withdrawalFee"
                value={settings.payment.withdrawalFee}
                onChange={(e) => handleChange('payment', 'withdrawalFee', parseFloat(e.target.value) || 0)}
                error={errors.withdrawalFee}
                type="number"
                min="0"
                max="10"
                step="0.1"
                icon={<FaPercentage className="h-4 w-4 text-gray-400" />}
              />
              
              <InputField
                label="Minimum Deposit ($)"
                name="minDeposit"
                value={settings.payment.minDeposit}
                onChange={(e) => handleChange('payment', 'minDeposit', parseFloat(e.target.value) || 0)}
                error={errors.minDeposit}
                type="number"
                min="1"
              />
              
              <InputField
                label="Minimum Withdrawal ($)"
                name="minWithdrawal"
                value={settings.payment.minWithdrawal}
                onChange={(e) => handleChange('payment', 'minWithdrawal', parseFloat(e.target.value) || 0)}
                error={errors.minWithdrawal}
                type="number"
                min="1"
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Enabled Payment Methods</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Select which payment methods are available to users
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {paymentMethods.map((method) => (
                  <div key={method.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`method-${method.value}`}
                      checked={settings.payment.paymentMethods.includes(method.value)}
                      onChange={(e) => 
                        handleArrayChange(
                          'payment', 
                          'paymentMethods', 
                          method.value, 
                          e.target.checked ? 'add' : 'remove'
                        )
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`method-${method.value}`} className="ml-2 block text-sm">
                      {method.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={fetchSettings}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2"
          >
            <BiReset className="h-5 w-5" />
            Reset
          </button>
          <SubmitButton
            label="Save Settings"
            processing={saving}
            Icon={BiSave}
            className="px-4"
          />
        </div>
      </form>
    </div>
  );
}