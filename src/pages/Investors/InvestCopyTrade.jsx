import LoadingIndicator from '../../components/common/LoadingIndicator';
import React, { useEffect, useState } from 'react';
import { AiOutlineTransaction } from 'react-icons/ai';
import { BiArrowBack } from 'react-icons/bi';
import axios from '../../lib/axios';
import SubmitButton from '../../components/common/SubmitButton';

const InvestCopyTrade = ({ onBack, wallet, onInvestComplete }) => {
    const [user, setUser] = useState();
    const [loadingTrades, setTradeState] = useState(false);
    const [trades, setTrades] = useState([]);
    const [selectedTrade, setSelectedTrade] = useState(null);
    const [fetched, setFetched] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [message, setErrorMessage] = useState('');
    const [amount, setAmount] = useState('');
    const [stopLoss, setStopLoss] = useState('90.0');
    const [totalAmount, setTotalAmount] = useState(0);
    const[errors, setErrors] = useState({})

    const back = () => onBack();

    useEffect(() => {
        fetchTrades();
        getMe();
    }, []);

    useEffect(() => {
        // Calculate total amount when amount or selected trade changes
        if (amount && selectedTrade) {
            const amountNum = parseFloat(amount.replace(/,/g, ''));
            const feeAmount = amountNum * (selectedTrade.fees / 100);
            setTotalAmount(amountNum + feeAmount);
        }
    }, [amount, selectedTrade]);

    const getMe = async () => {
        const res = await axios.get('api/v1/users/me');
        setUser(res.data.data.user);
    };

    const fetchTrades = async () => {
        setTradeState(true);
        try {
            const res = await axios.get('api/v1/copytrades');
            setTrades(res.data.data.copytrades);
            setFetched(true);
        } catch (err) {
            console.error(err);
        } finally {
            setTradeState(false);
        }
    };

    const formatCurrency = (value) => {
        if (!value) return '$0.00';
        const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
        return '$' + num.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const handleAmountChange = (e) => {
        const value = e.target.value.replace(/,/g, '');
        if(!isNaN(value)){
            setAmount(value);
        }
    };

    const invest = async (e) => {
        e.preventDefault();
        const amountNum = parseFloat(amount.replace(/,/g, ''));

        if (!selectedTrade) {
            alert("Please select a copy trade first");
            return;
        }

        if (amountNum <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        if (amountNum < selectedTrade.minDeposit) {
            alert(`Minimum investment amount is ${formatCurrency(selectedTrade.minDeposit)}`);
            return;
        }

        if (user?.wallet?.copytradeBalance < amountNum) {
            alert(`Insufficient copy trading wallet balance. Please fund your copy trading wallet to continue.`);
            return;
        }

        setProcessing(true);
        try {
            const data = {
                copyTradeId: selectedTrade.id,
                amount: amountNum,
                stopLoss: parseFloat(stopLoss),
                fees: selectedTrade.fees
            };
            await axios.post(`api/v1/users/me/copy-trade-investments`, data);
            alert("Copy trade investment successful!");
            onInvestComplete();
        } catch (err) {
            console.error(err);
            // Extract errors from the backend response
            // if (err.response && err.response.data.message && err.response.data.errors) {
            //     setErrors(err.response.data.errors);
            // } else {
            //     setErrors(err);
            //     console.error('Unexpected Error:', err);
            // }
            alert("Investment failed. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6">
            {/* Back Button */}
            <button 
                onClick={back}
                className="flex items-center gap-2 mb-6 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
                <BiArrowBack className="h-5 w-5" />
                <span className="font-medium">Back to Copy Trades</span>
            </button>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Start New Copy Trade
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Select an expert trader by clicking on the trader and enter the amount you want to invest
                </p>
            </div>

            <form onSubmit={invest} className="space-y-8">
                {/* Copy Trades */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Available Expert Traders
                    </h2>
                    
                    {loadingTrades ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 h-48 animate-pulse">
                                    <div className="h-6 w-3/4 bg-gray-200 dark:bg-slate-700 rounded mb-3"></div>
                                    <div className="h-4 w-full bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
                                    <div className="h-4 w-2/3 bg-gray-200 dark:bg-slate-700 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {trades.map((trade) => (
                                <div 
                                    key={trade.id}
                                    onClick={() => setSelectedTrade(trade)}
                                    className={`bg-white dark:bg-slate-800 rounded-xl shadow-md p-5 cursor-pointer transition-all duration-200 border-2 ${
                                        selectedTrade?.id === trade.id 
                                            ? 'border-blue-500 ring-2 ring-blue-500/20' 
                                            : 'border-transparent hover:border-gray-300 dark:hover:border-slate-600'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        {trade.image ? (
                                            <img 
                                                src={trade.image} 
                                                alt={trade.tradeName}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                                                <span className="text-gray-500 dark:text-gray-400 text-lg">
                                                    {trade.tradeName?.charAt(0) || 'T'}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                {trade.tradeName || 'Expert Trader'}
                                            </h3>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                                {trade.tradeUsername}
                                            </p>
                                        </div>
                                    </div>
                                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                        <li className="flex justify-between">
                                            <span>Min. Deposit:</span>
                                            <span className="font-medium">{formatCurrency(trade.minDeposit)}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>1M Return:</span>
                                            <span className={`font-medium ${
                                                trade.monthlyReturn >= 0 
                                                    ? 'text-green-500 dark:text-green-400' 
                                                    : 'text-red-500 dark:text-red-400'
                                            }`}>
                                                {trade.monthlyReturn}%
                                            </span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Investors:</span>
                                            <span className="font-medium">{trade.investors.toLocaleString()}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Fees:</span>
                                            <span className="font-medium">{trade.fees}%</span>
                                        </li>
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Investment Form */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 max-w-lg">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        Copy Trade Details
                    </h2>

                    <div className="space-y-5">
                        {/* Copy Trading Wallet Balance */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Copy Trading Wallet Balance
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    readOnly
                                    value={formatCurrency(user?.wallet?.copytradeBalance)}
                                    className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <span className="absolute right-3 top-3 text-gray-500 dark:text-gray-400">
                                    USD
                                </span>
                            </div>
                            {user?.wallet?.copytradeBalance < parseFloat(amount || 0) && (
                                <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                                    Copy Trading Wallet balance insufficient
                                </p>
                            )}
                        </div>

                        {/* Investment Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Amount (USD) *
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter amount"
                                    value={amount ? amount : ''}
                                    onChange={handleAmountChange}
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-700 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <span className="absolute right-3 top-3 text-gray-500 dark:text-gray-400">
                                    USD
                                </span>
                            </div>
                            {selectedTrade && (
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Min: {formatCurrency(selectedTrade.minDeposit)}
                                </p>
                            )}
                        </div>

                        {/* Stop Loss */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Stop Loss (%) *
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    required
                                    placeholder="Enter stop loss percentage"
                                    value={stopLoss}
                                    onChange={(e) => setStopLoss(e.target.value)}
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-700 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <span className="absolute right-3 top-3 text-gray-500 dark:text-gray-400">
                                    %
                                </span>
                            </div>
                        </div>

                        {/* Selected Trade */}
                        {selectedTrade && (
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                                    Selected Trader
                                </h3>
                                <div className="flex items-center gap-2">
                                    {selectedTrade.image && (
                                        <img 
                                            src={selectedTrade.image} 
                                            alt={selectedTrade.tradeName}
                                            className="h-8 w-8 rounded-full"
                                        />
                                    )}
                                    <p className="text-blue-600 dark:text-blue-400">
                                        {selectedTrade.tradeName} ({selectedTrade.tradeUsername})
                                    </p>
                                </div>
                                <p className="mt-1 text-sm">
                                    <span className="font-medium">Fees:</span> {selectedTrade.fees}%
                                </p>
                            </div>
                        )}

                        {/* Total Amount Summary */}
                        <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                                Summary
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                                    <span className="font-medium">{formatCurrency(amount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Trading Fees ({selectedTrade?.fees || 0}%):</span>
                                    <span className="font-medium">
                                        {amount && selectedTrade ? formatCurrency((parseFloat(amount) * (selectedTrade.fees / 100))) : '$0.00'}
                                    </span>
                                </div>
                                <div className="border-t border-gray-200 dark:border-slate-600 pt-2 mt-2">
                                    <div className="flex justify-between font-semibold">
                                        <span className="text-gray-800 dark:text-gray-200">Total Amount:</span>
                                        <span>{formatCurrency(totalAmount)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {message && (
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                                {message}
                            </div>
                        )}

                        {/* Submit Button */}
                        <SubmitButton
                            onClick={invest}
                            processing={processing}
                            disabled={processing || !selectedTrade || !amount || (user?.wallet?.copytradeBalance < parseFloat(amount))}
                            Icon={AiOutlineTransaction}
                            label={'Confirm Copy Trade'}
                            className='w-full'
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default InvestCopyTrade;