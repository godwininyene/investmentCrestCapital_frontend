import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BiArrowBack, BiCheckCircle } from 'react-icons/bi';
import axios from '../../lib/axios';
import SubmitButton from '../../components/common/SubmitButton';
import { BiSave } from 'react-icons/bi';
import { toast } from 'react-toastify'

const Deposit = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [amount, setAmount] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const[depositType, setDepositType] = useState()

  const fetchPaymentOptions = async () => {
    try {
      const response = await axios.get('api/v1/paymentOptions');
      setPaymentOptions(response.data.data.paymentOptions);
    } catch (err) {
      console.error('Failed to fetch payment options:', err);
      setError('Failed to load payment options. Please try again later.');
    }
  };

  useEffect(() => {
    fetchPaymentOptions();
  }, []);

  const getPaymentIcon = (payOption) => {
    switch (payOption.toLowerCase()) {
      case 'bank':
        return '🏦';
      case 'mobile wallet':
        return '📱';
      case 'crypto wallet':
        return '🪙';
      default:
        return '💳';
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    if(!receipt){
      alert("Please provide receipt");
      return;
    }

    setProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('type', depositType);
      formData.append('amount', amount);
      formData.append('receipt', receipt);
      formData.append('paymentChannel', paymentMethod.payOption.toLowerCase());

      await axios.post('api/v1/users/me/transactions', formData);
      setSuccess(true);
      setStep(4);
    } catch (err) {
      setError('Deposit failed. Please try again.');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
   <div className="max-w-md mx-auto p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
    <button 
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-blue-600 cursor-pointer dark:text-blue-400 mb-6"
    >
      <BiArrowBack className="text-xl" />
      Back to Transactions
    </button>

    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {step === 1 && 'Select Deposit Type'}
        {step === 2 && 'Select Payment Method'}
        {step === 3 && 'Enter Deposit Details'}
        {step === 4 && 'Deposit Successful'}
      </h1>
      <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
        <div 
          className="bg-primary-light h-2 rounded-full" 
          style={{ width: `${step * 25}%` }}
        ></div>
      </div>
    </div>


      {step === 1 && (
        <div className="space-y-4">
          <div 
            onClick={() => {
              setDepositType('investment deposit');
              setStep(2);
            }}
            className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">💰</span>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Investment Deposit</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                 Will be use to investment in a plan
                </p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => {
              setDepositType('copytrade deposit');
              setStep(2);
            }}
            className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">📈</span>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Copytrade Deposit</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                   Will be use to investment in a copytrade
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          {paymentOptions.map(option => (
            <div
              key={option._id}
              onClick={() => {
                setPaymentMethod(option);
                setStep(3);
              }}
              className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{getPaymentIcon(option.payOption)}</span>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {option.payOption === 'bank' ? 'Bank Transfer' : 
                     option.payOption === 'mobile wallet' ? 'Mobile Wallet' : 
                     option.payOption === 'Crypto Wallet' ? 'Crypto Wallet' : option.payOption}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {option.payOption === 'Crypto Wallet' ? 'Get' : ' '} {option.bank} {' '} {option.payOption === 'Crypto Wallet' ? 'wallet address' : ' '}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {step === 3 && paymentMethod && (
        <form className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              {paymentMethod.payOption === 'bank' ? 'Bank Transfer' : 
               paymentMethod.payOption === 'mobile wallet' ? 'Mobile Wallet' : 
               paymentMethod.payOption === 'crypto wallet' ? 'Crypto Wallet' : paymentMethod.payOption} Details
            </h3>
            
            {paymentMethod.payOption === 'Crypto Wallet' ? (
              <div className="space-y-4">
                {/* Warning message at the top */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border border-yellow-200 dark:border-yellow-800">
                  <p className="text-yellow-700 dark:text-yellow-300 text-sm font-medium">
                    Send only {paymentMethod.bank} to this address.
                  </p>
                </div>

                <div className="flex justify-between py-2 border-b border-blue-100 dark:border-blue-900/30">
                  <span className="text-sm text-blue-700 dark:text-blue-300">Network:</span>
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    {paymentMethod.bank}
                  </span>
                </div>
                
                <div className="py-2">
                 
                  <span className="text-sm text-blue-700 dark:text-blue-300 block mb-1">
                    Wallet Address:
                  </span>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-700 p-2 rounded border border-gray-200 dark:border-slate-600">
                    <span 
                      className="text-sm font-mono break-all" 
                      style={{ wordBreak: 'break-all' }}
                    >
                      {paymentMethod.accountNumber}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        copyToClipboard(paymentMethod.accountNumber);
                      }}
                      className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Copy to clipboard"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                  {copied && (
                    <div className="text-xs text-green-500 mt-1">Address copied!</div>
                  )}
                </div>

                {paymentMethod.image && (
                  <div className="py-2">
                    <span className="text-sm text-blue-700 dark:text-blue-300 block mb-2">
                      Wallet QR Code:
                    </span>
                    <div className="flex justify-center bg-white p-3 rounded-lg">
                      <img 
                        src={paymentMethod.image} 
                        alt="Crypto Wallet QR Code" 
                        className="w-40 h-40 object-contain"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                      Scan this QR code with your crypto wallet
                    </p>
                  </div>
                )}

                {/* Warning message at the bottom */}
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
                  <h4 className="text-red-700 dark:text-red-300 text-sm font-semibold mb-1">
                    To avoid loss of funds:
                  </h4>
                  <ul className="text-red-600 dark:text-red-300 text-xs space-y-1">
                    <li className="flex items-start">
                      <span className="mr-1">•</span>
                      Only send {paymentMethod.bank} to this address
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1">•</span>
                      Make sure to copy the wallet address above and paste it into your crypto wallet
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1">•</span>
                      In your crypto wallet, select the {paymentMethod.bank} network when transferring
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1">•</span>
                      Incorrect transfers may result in the loss of funds
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between py-2 border-b border-blue-100 dark:border-blue-900/30">
                  <span className="text-sm text-blue-700 dark:text-blue-300">Bank:</span>
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    {paymentMethod.bank}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-blue-100 dark:border-blue-900/30">
                  <span className="text-sm text-blue-700 dark:text-blue-300">Account Number:</span>
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    {paymentMethod.accountNumber}
                  </span>
                </div>
                {paymentMethod.extra && (
                  <div className="py-2 text-sm text-blue-700 dark:text-blue-300">
                    {paymentMethod.extra}
                  </div>
                )}
              </>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount to Deposit
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-white dark:bg-slate-700 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                required
                min="10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Upload Payment Proof
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-slate-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600/50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {receipt ? (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {receipt.name}
                    </span>
                  ) : (
                    <>
                      <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG (MAX. 2MB)
                      </p>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  name='receipt'
                  className="hidden" 
                  onChange={(e) => setReceipt(e.target.files[0])}
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}
         
          <SubmitButton
            label="Complete Deposit"
            processing={processing}
            Icon={BiSave}
            className="px-4 w-full"
            onClick={handleSubmit}
          />
        </form>
      )}

      {step === 4 && (
        <div className="text-center py-8">
          <BiCheckCircle className="mx-auto text-6xl text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Deposit Submitted!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your deposit of ${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} is being processed. You'll receive a confirmation email shortly.
          </p>
          <Link
            onClick={() => navigate('/transactions')}
            to="/manage/investor/transactions"
            className="px-6 py-2 bg-primary-light cursor-pointer text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            View Transactions
          </Link>
        </div>
      )}
    </div>
  );
};

export default Deposit;