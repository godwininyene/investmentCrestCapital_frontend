import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiArrowBack, BiCheckCircle } from 'react-icons/bi';
import axios from '../../lib/axios';
import SubmitButton from '../../components/common/SubmitButton';

const Withdrawal = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [step, setStep] = useState(1);
  const [walletType, setWalletType] = useState('balance');
  const [amount, setAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const availableBalance = user?.wallet?.[walletType] || 0;

  const fetchBankAccounts = async () => {
    try {
      const res = await axios.get('api/v1/users/me/banks');
      setAccounts(res.data.data.accounts);
    } catch (err) {
      console.error('Error fetching bank accounts:', err);
    }
  };

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  console.log(accounts);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('type', 'withdrawal');
      formData.append('amount', amount);
      formData.append('pay_option', walletType);
      formData.append('bank_id', bankAccount);

      await axios.post('api/v1/users/me/transactions', formData);
      setSuccess(true);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Withdrawal failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-6 cursor-pointer"
      >
        <BiArrowBack className="text-xl" />
        Back to Transactions
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {step === 1 && 'Select Withdrawal Source'}
          {step === 2 && 'Enter Withdrawal Details'}
          {step === 3 && 'Withdrawal Requested'}
        </h1>
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${step * 33}%` }}
          ></div>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div 
            onClick={() => {
              setWalletType('balance');
              setStep(2);
            }}
            className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">💰</span>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Wallet Balance</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Available: ${user?.wallet?.balance?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => {
              setWalletType('profit');
              setStep(2);
            }}
            className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">📈</span>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Investment Profit</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Available: ${user?.wallet?.profit?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => {
              setWalletType('referralBalance');
              setStep(2);
            }}
            className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">👥</span>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Referral Earnings</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Available: ${user?.wallet?.referralBalance?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <form  className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Withdrawal From {walletType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </h3>
            <div className="flex justify-between py-2">
              <span className="text-sm text-blue-700 dark:text-blue-300">Available:</span>
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                ${availableBalance.toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount to Withdraw
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={availableBalance}
                className="w-full pl-8 pr-4 py-3 bg-white dark:bg-slate-700 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                required
                min="10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bank Account
            </label>
            <select
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              className="w-full py-3 px-4 bg-white dark:bg-slate-700 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Bank Account</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.bankName} - {account.accountNumber}
                </option>
              ))}
            </select>
            {accounts.length === 0 && (
              <p className="text-sm text-red-500 mt-1">
                No bank accounts found. Please add a bank account first.
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}
          <SubmitButton
            label="Request Withdrawal"
            processing={processing}
            Icon={''}
            className="px-4 w-full"
            onClick={handleSubmit}
          />
         
        </form>
      )}

      {step === 3 && (
        <div className="text-center py-8">
          <BiCheckCircle className="mx-auto text-6xl text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Withdrawal Requested!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your withdrawal of ${amount} is being processed. You'll receive a confirmation email shortly.
          </p>
          <button
            onClick={() => navigate('/manage/investor/transactions')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Transactions
          </button>
        </div>
      )}
    </div>
  );
};

export default Withdrawal;