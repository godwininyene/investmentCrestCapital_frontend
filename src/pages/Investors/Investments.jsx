import { useState, useEffect } from 'react';
import { BiChart, BiWalletAlt, BiPlus } from 'react-icons/bi';
import Invest from './Invest';
import moment from 'moment/moment';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { FaChartLine, FaArrowRight } from 'react-icons/fa';
import axios from '../../lib/axios';

export default function Investments() {
    const [invest, setInvestState] = useState(false);
    const [loadingInvestment, setLoadingInvestmentState] = useState(true);
    const [stats, setStats] = useState({
        amount: 0,
        profit: 0,
        totalInvest: 0
    });
    const [investments, setInvestments] = useState([]);
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState({
        stats: false,
        investments: false
    });
    
    const fetchStats = async () => {
        setLoading(prev => ({...prev, stats: true}));
        try {
            const res = await axios.get('api/v1/stats/users');
            setWallet(res.data.data.stats.wallet);
            setStats({
                totalInvest: res.data.data.stats.total_investment,
                amount: res.data.data.stats.total_amount,
                profit: res.data.data.stats.total_profit.toFixed(2)
            });
        } catch(err) {
            console.error('Failed to fetch stats:', err);
        } finally {
            setLoading(prev => ({...prev, stats: false}));
        }
    };

    const fetchInvestments = async() => {
        setLoading(prev => ({...prev, investments: true}));
        try {
            const res = await axios.get('api/v1/users/me/investments');
            setInvestments(res.data.data.investments);
            setLoadingInvestmentState(false);
        } catch(error) {
            console.error('Failed to fetch investments:', error);
        } finally {
            setLoading(prev => ({...prev, investments: false}));
        }
    };

    useEffect(() => {
        fetchStats();
        fetchInvestments();
    }, []);

    const formatCurrency = (value) => `$${value?.toLocaleString() || '0'}`;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            {invest ? (
                <Invest 
                    onBack={() => setInvestState(false)} 
                    wallet={wallet} 
                    onInvestComplete={() => {
                        fetchInvestments(); 
                        fetchStats();
                        setLoadingInvestmentState(false);
                    }} 
                />
            ) : (
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                            Investment Portfolio
                        </h1>
                        <button 
                            onClick={() => setInvestState(true)}
                            className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 cursor-pointer bg-gradient-to-r from-primary-dark to-primary-light hover:from-primary-light hover:to-primary-dark text-white font-medium rounded-lg shadow transition-all w-full sm:w-auto text-sm sm:text-base"
                        >
                            <BiPlus className="text-lg sm:text-xl" />
                            <span>New Investment</span>
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Total Profit Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Profit</p>
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                                        {loading.stats ? '...' : formatCurrency(stats.profit)}
                                    </h2>
                                </div>
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                                    <FaChartLine className="text-blue-500 dark:text-blue-400 text-xl" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-blue-500 dark:text-blue-400">
                                <span>All time earnings</span>
                                <FaArrowRight className="ml-2" />
                            </div>
                        </div>

                        {/* Total Investments Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Investments</p>
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                                        {loading.stats ? '...' : stats.totalInvest || '0'}
                                    </h2>
                                </div>
                                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg">
                                    <BiWalletAlt className="text-emerald-500 dark:text-emerald-400 text-xl" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-emerald-500 dark:text-emerald-400">
                                <span>Active investments</span>
                                <FaArrowRight className="ml-2" />
                            </div>
                        </div>

                        {/* Total Invested Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Invested</p>
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                                        {loading.stats ? '...' : formatCurrency(stats.amount)}
                                    </h2>
                                </div>
                                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                                    <BiChart className="text-purple-500 dark:text-purple-400 text-xl" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-purple-500 dark:text-purple-400">
                                <span>Capital deployed</span>
                                <FaArrowRight className="ml-2" />
                            </div>
                        </div>
                    </div>

                    {/* Investments Table */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center mb-2 sm:mb-0">
                                <BiChart className="mr-2 text-blue-500" />
                                Investment History
                            </h2>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {investments.length} {investments.length === 1 ? 'record' : 'records'}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                                <thead className="bg-gray-50 dark:bg-slate-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Plan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Profit
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Start Date/Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            End Date/Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                                    {loading.investments ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center">
                                                <LoadingIndicator type="dots" size={8} />
                                            </td>
                                        </tr>
                                    ) : investments.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <BiChart className="text-4xl text-gray-400 mb-4" />
                                                    <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                                                        No Investments Found
                                                    </h3>
                                                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                                                        Start your investment journey today
                                                    </p>
                                                    <button
                                                        onClick={() => setInvestState(true)}
                                                        className="px-6 py-2 bg-primary-light text-white rounded-lg hover:bg-primary-dark cursor-pointer transition-colors"
                                                    >
                                                        Invest Now
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        investments.map((investment) => (
                                            <tr key={investment.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                    {investment?.plan?.name || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {formatCurrency(investment.amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500 dark:text-green-400 font-medium">
                                                    {formatCurrency(investment.profit)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {moment(investment.createdAt).format('MMM D, YYYY h:mm A')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {moment(investment.expiryDate).format('MMM D, YYYY h:mm A')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        investment.status === 'active' || investment.status === 'completed'
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                    }`}>
                                                        {investment.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}