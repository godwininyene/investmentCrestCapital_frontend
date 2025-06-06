import { Link } from 'react-router-dom';
import { BiTransferAlt, BiWallet } from 'react-icons/bi';
import { FaUsers} from 'react-icons/fa';
import { FaUsersLine } from "react-icons/fa6";
import { BsBank, BsCashCoin, BsQuestionCircle } from 'react-icons/bs';
import { ImPieChart } from 'react-icons/im';
import { useEffect, useState } from 'react';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import moment from 'moment/moment';
import { HiPresentationChartBar } from 'react-icons/hi';
import axios from '../../lib/axios';
import { useRef } from 'react';
import StatusBadge from '../../components/common/StatusBadge';

export default function Dashboard() {
    const [transactions, setTransactions] = useState([]);
    const [investments, setInvestments] = useState([]);
    const [fetched, setFetched] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [stats, setStats] = useState(null);
  

    const fetchStats = async () => {
        setProcessing(true);
        try {
            const res = await axios.get('api/v1/stats/admin');
            setStats(res.data.data.stats);
            setTransactions(res.data.data.latest_transactions);
            setInvestments(res.data.data.latest_investments);  
            setFetched(true);      
        } catch (error) {
            console.log(error);
            setFetched(true); 
        } finally {
            setProcessing(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);


    return (
        <div className="space-y-6">
           
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Users Card */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex-col lg:flex-row flex items-start">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-slate-700 lg:mr-4 mb-2 lg:mb-0">
                        <FaUsers className="text-blue-600 dark:text-blue-400 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats?.users || 0}</h3>
                        <div className="mt-2">
                            <Link 
                                to="/manage/admin/users" 
                                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Manage Users →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Balance Card */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex-col lg:flex-row flex items-start">
                    <div className="p-3 rounded-full bg-green-100 dark:bg-slate-700 lg:mr-4 mb-2 lg:mb-0">
                        <BiWallet className="text-green-600 dark:text-green-400 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Balance</p>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                            ${stats?.total_balance?.toLocaleString() || 0}
                        </h3>
                        <div className="mt-2">
                            <Link 
                                to="/manage/admin/transactions" 
                                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                View Transactions →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Profit Card */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex-col lg:flex-row flex items-start">
                    <div className="p-3 rounded-full bg-purple-100 dark:bg-slate-700 lg:mr-4 mb-2 lg:mb-0">
                        <BsCashCoin className="text-purple-600 dark:text-purple-400 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Profits</p>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                            ${stats?.total_profit?.toLocaleString() || 0}
                        </h3>
                        <div className="mt-2">
                            <Link 
                                to="/manage/admin/investments" 
                                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                View Investments →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Referral Card */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex-col lg:flex-row flex items-start">
                    <div className="p-3 rounded-full bg-amber-100 dark:bg-slate-700 lg:mr-4 mb-2 lg:mb-0">
                        <FaUsersLine className="text-amber-600 dark:text-amber-400 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Referral Balance</p>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                            ${stats?.total_referral_balance?.toLocaleString() || 0}
                        </h3>
                        <div className="mt-2">
                            <Link 
                                to="" 
                                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                View Referrals →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pending Actions Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Pending Transactions */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden lg:col-span-2">
                    <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
                        <h3 className="font-semibold text-lg flex items-center">
                            <BiTransferAlt className="mr-2" /> Pending Transactions
                        </h3>
                        <Link 
                            to="/manage/admin/transactions" 
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            View All
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-slate-700">
                        {processing && !fetched ? (
                            <div className="p-4 text-center">
                                <LoadingIndicator type="dots" size={8} />
                            </div>
                        ) : transactions?.filter(t => t.status === 'pending').slice(0, 5).map(transaction => (
                            <div key={transaction.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium"> {`${transaction.user?.firstName || ''} ${transaction.user?.lastName || ''}`.trim() || 'Unknown'}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{transaction.type}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">${transaction.amount?.toLocaleString()}</p>
                                        <StatusBadge status={transaction.status} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {!processing && fetched && transactions?.filter(t => t.status === 'pending').length === 0 && (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                No pending transactions
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                        <h3 className="font-semibold text-lg">Quick Actions</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-2">
                        <Link 
                            to="/manage/admin/plans" 
                            className="p-3 rounded-lg bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors text-center"
                        >
                            <ImPieChart className="mx-auto text-xl mb-2 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium">Manage Plans</span>
                        </Link>
                        <Link 
                            to="/manage/admin/payment_options" 
                            className="p-3 rounded-lg bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors text-center"
                        >
                            <BsBank className="mx-auto text-xl mb-2 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-medium">Payment Options</span>
                        </Link>
                        <Link 
                            to="/manage/admin/investments" 
                            className="p-3 rounded-lg bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors text-center"
                        >
                            <HiPresentationChartBar className="mx-auto text-xl mb-2 text-purple-600 dark:text-purple-400" />
                            <span className="text-sm font-medium">Investments</span>
                        </Link>
                        <Link 
                            to="/manage/admin/manage_faq" 
                            className="p-3 rounded-lg bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors text-center"
                        >
                            <BsQuestionCircle className="mx-auto text-xl mb-2 text-amber-600 dark:text-amber-400" />
                            <span className="text-sm font-medium">Manage FAQ</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Recent Transactions */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
                        <h3 className="font-semibold text-lg">Recent Transactions</h3>
                        <Link 
                            to="/manage/admin/transactions" 
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            View All
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                            <thead className="bg-gray-50 dark:bg-slate-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                               {processing && !fetched ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-6 text-center">
                                            <LoadingIndicator type="dots" size={8} />
                                        </td>
                                    </tr>
                                ) : transactions?.length ? (
                                    transactions.slice(0, 5).map(transaction => (
                                        <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                               {`${transaction.user?.firstName || ''} ${transaction.user?.lastName || ''}`.trim() || 'Unknown'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">
                                                {transaction.type}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                                ${Number(transaction.amount).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {moment(transaction.createdAt).format('MMM D, h:mm A')}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="p-4 text-center text-gray-500 dark:text-gray-400">
                                            No recent transactions.
                                        </td>
                                    </tr>
                                )}

                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Investments */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
                        <h3 className="font-semibold text-lg">Recent Investments</h3>
                        <Link 
                            to="/manage/admin/investments" 
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            View All
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                            <thead className="bg-gray-50 dark:bg-slate-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Plan</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                                {processing && !fetched ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-6 text-center">
                                            <LoadingIndicator type="dots" size={8} />
                                        </td>
                                    </tr>
                                ) : investments?.length ? (
                                    investments.slice(0, 5).map(investment => (
                                        <tr key={investment.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                               {`${investment.user?.firstName || ''} ${investment.user?.lastName || ''}`.trim() || 'Unknown'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {investment.plan?.name || 'N/A'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                                ${Number(investment.amount).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                <StatusBadge status={investment.status} />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="p-4 text-center text-gray-500 dark:text-gray-400">
                                            No recent investments.
                                        </td>
                                    </tr>
                                )}

                            </tbody>
                        </table>
                    </div>
                </div> 
            </div>
        </div>
    );
}