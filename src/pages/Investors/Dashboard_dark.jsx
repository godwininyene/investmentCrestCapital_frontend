import { Link } from 'react-router-dom';
import { BiWallet, BiMoneyWithdraw, BiCopy } from 'react-icons/bi';
import { FaMoneyBillTransfer, FaUsersLine } from 'react-icons/fa6';
import { BsCashCoin } from 'react-icons/bs';
import defaulAvatar from '../../assets/images/default.jpg';
import { FaChartLine } from 'react-icons/fa';
import { useRef, useState, useEffect } from 'react';
import FunnelChaart from '../../components/Charts/FunnelChart';
import GuageCharts from '../../components/Charts/GuageCharts';
import { HiPresentationChartBar } from 'react-icons/hi';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import axios from '../../../lib/axios';
import moment from 'moment/moment';

export default function Dashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [showTip, setShowTip] = useState(false);
    const [deposits, setDeposits] = useState();
    const [investments, setInvestments] = useState([]);
    const [wallet, setWallet] = useState(null);
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
        await axios.get('api/v1/stats/users')
            .then((res) => {
                setInvestments(res.data.data.stats.investments);
                setDeposits(res.data.data.stats.total_deposit);
                setWallet(res.data.data.stats.wallet);
                setFetched(true);
            })
            .catch((err) => {
                setFetched(true);
            })
            .finally(() => setProcessing(false));
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
        <div className="p-6 bg-slate-900 min-h-screen">
            {/* User Profile Section */}
            <div className="bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <img
                        src={user.photo && user.photo !== 'default.png' ? user.photo : defaulAvatar}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-4 border-slate-700"
                    />
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                        <p className="text-blue-400">{user.email}</p>
                        <div className="mt-4">
                            <label className="block text-sm text-gray-400">Referral Link</label>
                            <div className="flex items-center mt-1">
                                <input
                                    type="text"
                                    ref={reffid}
                                    readOnly
                                    value={`${import.meta.env.VITE_APP_URL}/users/register?refid=${user.accountId}`}
                                    className="flex-1 p-2 rounded-l-lg border border-slate-700 bg-slate-700 text-white"
                                />
                                <button
                                    onClick={copyReffLink}
                                    className="p-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                                >
                                    <BiCopy className="w-6 h-6" />
                                </button>
                            </div>
                            {showTip && (
                                <div className="text-sm text-green-600 mt-1">Copied to clipboard!</div>
                            )}
                        </div>
                        <div className="mt-6 flex gap-4 justify-center md:justify-start">
                            <Link
                                to="/manage/investor/investments"
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <FaChartLine className="w-5 h-5" /> Investments
                            </Link>
                            <Link
                                to="/manage/investor/transactions"
                                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
                    icon={<BiMoneyWithdraw className="w-8 h-8" />}
                    title="Total Accrued Profit"
                    value={`$${wallet?.profit.toLocaleString() || 0}`}
                    description="Total Profits"
                />
            </div>

            {/* Investments Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {investments.length > 0 ? (
                    investments.map((investment) => (
                        <InvestmentCard key={investment._id} investment={investment} />
                    ))
                ) : (
                    <div className="bg-slate-800 rounded-xl shadow-lg p-6 text-center">
                        <h2 className="text-xl font-bold mb-4">No Active Investments</h2>
                        <Link
                            to="/my_investments"
                            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FaChartLine className="w-5 h-5" /> Start Investing
                        </Link>
                    </div>
                )}
                <div className="bg-slate-800 rounded-xl shadow-lg p-6 flex items-center justify-center">
                    <FunnelChaart />
                </div>
            </div>
        </div>
    );
}

const StatCard = ({ icon, title, value, description }) => (
    <div className="bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-700 rounded-full">{icon}</div>
            <div>
                <p className="text-sm text-gray-400">{title}</p>
                <h2 className="text-2xl font-bold text-white">{value}</h2>
                <p className="text-xs text-gray-400">{description}</p>
            </div>
        </div>
    </div>
);

const InvestmentCard = ({ investment }) => (
    <div className="bg-slate-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">
            <HiPresentationChartBar className="inline-block w-6 h-6 mr-2" /> Active Investment
        </h2>
        <GuageCharts type='line' percent={investment.percentage.toFixed(2)} />
        <div className="mt-4 text-sm text-gray-400">
            <p><strong>Start Date:</strong> {moment(investment.investment?.createdAt).format('L LT')}</p>
            <p><strong>End Date:</strong> {moment(investment.investment?.expiryDate).format('L LT')}</p>
            <p><strong>Total Duration:</strong> {investment.totalDuration} hours</p>
            <p><strong>Time Remaining:</strong> {investment.totalDuration - investment.currentLevel} hours</p>
        </div>
    </div>
);