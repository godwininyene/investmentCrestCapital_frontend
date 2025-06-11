import LoadingIndicator from '../../components/common/LoadingIndicator';
import React, {useEffect, useState} from 'react';
import { AiOutlineTransaction } from 'react-icons/ai';
import { BiArrowBack } from 'react-icons/bi';
import axios from '../../lib/axios';
import SubmitButton from '../../components/common/SubmitButton';

const Invest = ({onBack, wallet, onInvestComplete}) => {
    const[user, setUser] = useState();
    const [loadingPlans, setPlanState] = useState(false);
    const [plans, loadPlans] = useState([]);
    const [selectedPlan, setSelectPlan] = useState();
    const [fetched, setFetched] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [message, setErrorMessage] = useState('');
    const [amount, setAmount] = useState('');

    const back = () => onBack();

    useEffect(() => {
        
        fetchPlan();
        getMe()
    }, []);

    const getMe = async()=>{
        const res = await axios.get('api/v1/users/me');
        setUser(res.data.data.user)  
    }
    const fetchPlan = async () => {
        setPlanState(true);
        try {
            const res = await axios.get('api/v1/plans');
            loadPlans(res.data.data.plans);
            setFetched(true);
        } catch (err) {
            console.error(err);
        } finally {
            setPlanState(false);
        }
    };

    const invest = async (e) => {
        e.preventDefault();
        const amountNum = parseFloat(amount);

        if (!selectedPlan) {
            alert("Please select a plan first");
            return;
        }
        
        if (user?.wallet?.balance < amountNum) {
            alert(`Insufficient wallet balance. Please enter amount $${user?.wallet?.balance}, or fund your wallet to continue.`);   
            return;
        }
        
        if (amountNum < selectedPlan.minDeposit) {
            alert(`The selected plan requires a minimum deposit of $${selectedPlan.minDeposit}`);
            return;
        } else if (amountNum > selectedPlan.maxDeposit) {
            alert(`You can't invest more than $${selectedPlan.maxDeposit} on this plan`);
            return;
        }

        setProcessing(true);
        try {
            const data = {
                planId: selectedPlan.id,
                amount: amountNum
            };
            await axios.post(`api/v1/users/me/investments`, data);
            alert("Investment successful!");
            onInvestComplete();
        } catch (err) {
            console.error(err);
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
                <span className="font-medium">Back to Investments</span>
            </button>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Start New Investment
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Select an investment plan by clicking on the plan and enter the amount you want to invest
                </p>
            </div>

            <form onSubmit={invest} className="space-y-8">
                {/* Investment Plans */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Available Plans
                    </h2>
                    
                    {loadingPlans ? (
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
                            {plans.map((plan) => (
                                <div 
                                    key={plan.id}
                                    onClick={() => setSelectPlan(plan)}
                                    className={`bg-white dark:bg-slate-800 rounded-xl shadow-md p-5 cursor-pointer transition-all duration-200 border-2 ${
                                        selectedPlan?.id === plan.id 
                                            ? 'border-blue-500 ring-2 ring-blue-500/20' 
                                            : 'border-transparent hover:border-gray-300 dark:hover:border-slate-600'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            {plan.name || `Investment Plan`}
                                        </h3>
                                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-bold px-3 py-1 rounded-full">
                                            {plan.percentage}%
                                        </span>
                                    </div>
                                    <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">
                                        Duration: {plan.planDuration} {plan.timingParameter}
                                    </p>
                                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                        <li className="flex justify-between">
                                            <span>Min. Deposit:</span>
                                            <span className="font-medium">${plan.minDeposit}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Max. Deposit:</span>
                                            <span className="font-medium">${plan.maxDeposit}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Referral Bonus:</span>
                                            <span className="font-medium">{plan.referalBonus}%</span>
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
                        Investment Details
                    </h2>

                    <div className="space-y-5">
                        {/* Available Balance */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Available Balance
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    readOnly
                                    value={`$${user?.wallet?.balance.toLocaleString() || '0'}`}
                                    className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <span className="absolute right-3 top-3 text-gray-500 dark:text-gray-400">
                                    USD
                                </span>
                            </div>
                        </div>

                        {/* Investment Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Investment Amount
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    required
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-700 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <span className="absolute right-3 top-3 text-gray-500 dark:text-gray-400">
                                    USD
                                </span>
                            </div>
                            {selectedPlan && (
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Min: ${selectedPlan.minDeposit} | Max: ${selectedPlan.maxDeposit}
                                </p>
                            )}
                        </div>

                        {/* Selected Plan */}
                        {selectedPlan && (
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                                    Selected Plan
                                </h3>
                                <p className="text-blue-600 dark:text-blue-400">
                                    {selectedPlan.name} ({selectedPlan.percentage}% return)
                                </p>
                            </div>
                        )}

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
                            disabled={processing}
                            Icon={AiOutlineTransaction}
                            label={'  Confirm Investment'}
                            className='w-full'
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Invest;