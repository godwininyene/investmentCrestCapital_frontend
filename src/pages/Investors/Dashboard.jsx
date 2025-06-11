import { Link } from 'react-router-dom';
import { BiWallet, BiMoneyWithdraw, BiCopy } from 'react-icons/bi';
import { FaMoneyBillTransfer, FaUsersLine } from 'react-icons/fa6';
import { BsCashCoin } from 'react-icons/bs';
import defaulAvatar from '../../assets/images/default.jpg';
import { FaChartLine, FaHistory } from 'react-icons/fa';
import { useRef, useState, useEffect } from 'react';
import { HiPresentationChartBar } from 'react-icons/hi';
import axios from '../../lib/axios';
import moment from 'moment/moment';

export default function Dashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [showTip, setShowTip] = useState(false);
    const [deposits, setDeposits] = useState();
    const[total_copytrade_deposit, setCopytradeDeposits] =useState()
    const [investments, setInvestments] = useState([]);
    const [wallet, setWallet] = useState(null);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [fetched, setFetched] = useState(false);
    const [processing, setProcessing] = useState(false);
    const reffid = useRef();

    const copyReffLink = () => {
        setShowTip(true);
        reffid.current.select();
        navigator.clipboard.writeText(reffid.current.value);
        setTimeout(() => setShowTip(false), 3000);
    };

    const fetchStats = async () => {
        setProcessing(true);
        try {
            const [statsRes, transactionsRes] = await Promise.all([
                axios.get('api/v1/stats/users'),
                axios.get('api/v1/transactions/recent')
            ]);
            setInvestments(statsRes.data.data.stats.investments);
            setDeposits(statsRes.data.data.stats.total_deposit);
            setCopytradeDeposits(statsRes.data.data.stats.total_copytrade_deposit);
            setWallet(statsRes.data.data.stats.wallet);
            setRecentTransactions(transactionsRes.data.data.transactions);
            setFetched(true);
        } catch (err) {
            setFetched(true);
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    useEffect(() => {
        const doMining = async () => {
            await axios.patch('api/v1/investments/mine');
            await axios.get('api/v1/users/me').then(res => console.log(res.data));
        };
        fetchStats();
        doMining();
    }, []);


    return (
        <div className="min-h-screen">
            {/* User Profile Section */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <img
                        src={user.photo && user.photo !== 'default.png' ? user.photo : defaulAvatar}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 dark:border-slate-700"
                    />
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{user.name}</h1>
                        <p className="text-primary-light dark:text-blue-400">{user.email}</p>
                        <div className="mt-4">
                            <label className="block text-sm text-gray-600 dark:text-gray-400">Referral Link</label>
                            <div className="flex items-center mt-1">
                                <input
                                    type="text"
                                    ref={reffid}
                                    readOnly
                                    value={`${import.meta.env.VITE_APP_URL}/users/register?refid=${user.accountId}`}
                                    className="flex-1 min-w-0 p-2 rounded-l-lg border border-gray-300 dark:border-slate-700 dark:bg-slate-700 dark:text-white truncate"
                                />
                                <button
                                    onClick={copyReffLink}
                                    className="p-2 bg-primary-light cursor-pointer text-white rounded-r-lg hover:bg-primary-dark transition-colors"
                                >
                                    <BiCopy className="w-6 h-6" />
                                </button>
                            </div>
                            {showTip && (
                                <div className="text-sm text-green-600 mt-1">Copied to clipboard!</div>
                            )}
                        </div>
                        <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
                            <Link
                                to="/manage/investor/investments"
                                className="flex items-center gap-2 px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary-dark transition-colors"
                            >
                                <FaChartLine className="w-5 h-5" /> Investments
                            </Link>
                            <Link
                                to="/manage/investor/transactions"
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <FaMoneyBillTransfer className="w-5 h-5" /> Transactions
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard
                    icon={<BiWallet className="w-8 h-8" />}
                    title="Account Balance"
                    value={`$${wallet?.balance.toLocaleString() || 0}`}
                    description="Current Balance Amount"
                />
                <StatCard
                    icon={<BiWallet className="w-8 h-8" />}
                    title="Copytrade Balance"
                    value={`$${wallet?.copytradeBalance.toLocaleString() || 0}`}
                    description="Current  Balance Amount"
                />
                <StatCard
                    icon={<FaUsersLine className="w-8 h-8" />}
                    title="Referral Balance"
                    value={`$${wallet?.referralBalance.toLocaleString() || 0}`}
                    description="Referral Earnings"
                />
                <StatCard
                    icon={<BsCashCoin className="w-8 h-8" />}
                    title="Total Deposit"
                    value={`$${deposits?.toLocaleString() || 0}`}
                    description="Total Deposits"
                />

                <StatCard
                    icon={<BsCashCoin className="w-8 h-8" />}
                    title="Total Copytrade Deposit"
                    value={`$${total_copytrade_deposit?.toLocaleString() || 0}`}
                    description="Current Deposits"
                />
                <StatCard
                    icon={<BiMoneyWithdraw className="w-8 h-8" />}
                    title="Total Accrued Profit"
                    value={`$${wallet?.profit.toLocaleString() || 0}`}
                    description="Total Profits"
                />

                <StatCard
                    icon={<BiMoneyWithdraw className="w-8 h-8" />}
                    title="Copytrade Profit"
                    value={`$${wallet?.copytradeProfit.toLocaleString() || 0}`}
                    description="Current Profits"
                />
            </div>

            {/* Main Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Transactions Section */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <FaHistory className="inline-block w-5 h-5" /> Recent Transactions
                        </h2>
                        <Link 
                            to="/manage/investor/transactions" 
                            className="text-sm text-primary-light hover:underline"
                        >
                            View All
                        </Link>
                    </div>
                    
                    {recentTransactions.length > 0 ? (
                        <div className="space-y-4">
                            {recentTransactions.slice(0, 5).map((transaction) => (
                                <TransactionItem key={transaction.id} transaction={transaction} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                            No recent transactions found
                        </div>
                    )}
                </div>

                {/* Investments Section */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <HiPresentationChartBar className="inline-block w-5 h-5" /> Recent Investments
                        </h2>
                        <Link 
                            to="/manage/investor/investments" 
                            className="text-sm text-primary-light hover:underline"
                        >
                            View All
                        </Link>
                    </div>
                    
                    {investments.length > 0 ? (
                        <div className="space-y-4">
                            {investments.slice(0, 3).map((investment) => (
                                <InvestmentItem key={investment._id} investment={investment} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-gray-500 dark:text-gray-400 mb-4">No active investments</p>
                            <Link
                                to="/manage/investor/investments"
                                className="inline-flex items-center gap-2 px-6 py-2 bg-primary-light text-white rounded-lg hover:bg-primary-dark transition-colors"
                            >
                                <FaChartLine className="w-5 h-5" /> Start Investing
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const StatCard = ({ icon, title, value, description }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-slate-700 rounded-full">{icon}</div>
            <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{value}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
            </div>
        </div>
    </div>
);

const TransactionItem = ({ transaction }) => {
   
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    return (
        <div className="flex justify-between items-center p-3 border-b border-gray-100 dark:border-slate-700 last:border-0">
            <div>
                <p className="font-medium">{transaction.type}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {moment(transaction.createdAt).format('MMM D, h:mm A')}
                </p>
            </div>
            <div className="text-right">
                <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </p>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                </span>
            </div>
        </div>
    );
};

const InvestmentItem = ({ investment }) => {
    const progress = Math.min(100, (investment.currentLevel / investment.totalDuration) * 100);
    
    return (
        <div className="p-4 border border-gray-100 dark:border-slate-700 rounded-lg">
            <div className="flex justify-between mb-2">
                <h3 className="font-medium">{investment.plan?.name || 'Investment Plan'}</h3>
                <span className="text-primary-light font-semibold">
                    {investment.percentage.toFixed(2)}% complete
                </span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 mb-2">
                <div 
                    className="bg-primary-light h-2.5 rounded-full" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div>
                    <p>Amount: <span className="font-medium text-gray-800 dark:text-gray-200">
                        ${investment.investment.amount?.toLocaleString()}
                    </span></p>
                </div>
                <div>
                    <p>Profit: <span className="font-medium text-green-600 dark:text-green-400">
                        ${investment.investment.profit?.toLocaleString()}
                    </span></p>
                </div>
                <div>
                    <p>Started: <span className="font-medium">
                        {moment(investment.investment?.createdAt).format('MMM D')}
                    </span></p>
                </div>
                <div>
                    <p>Ends: <span className="font-medium">
                        {moment(investment.investment?.expiryDate).format('MMM D')}
                    </span></p>
                </div>
            </div>
        </div>
    );
};