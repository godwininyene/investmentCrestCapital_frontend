import { useEffect, useState } from 'react';
import { 
  BiTransferAlt, 
  BiFilterAlt, 
  BiSearch, 
  BiCalendar,
  BiTrendingUp,
  BiWallet,
  BiTime,
  BiCheckCircle,
  BiXCircle,
  BiLoaderCircle,
} from 'react-icons/bi';
import moment from 'moment';
import axios from '../../lib/axios';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import SelectField from '../../components/common/SelectField';
import EmptyState from '../../components/common/EmptyState';
import { toast } from 'react-toastify';

export default function CopytradeInvestments() {
    const [investments, setInvestments] = useState([]);
    const [filteredInvestments, setFilteredInvestments] = useState([]);
    const [fetched, setFetched] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: 'all',
        dateRange: 'all'
    });
    const [stats, setStats] = useState({
        totalInvested: 0,
        totalProfit: 0,
        activeInvestments: 0,
        completedInvestments: 0
    });
    const [loading, setLoading] = useState({
        stats: false,
        investments: false
    });

    const fetchInvestments = async () => {
        try {
            setLoading(prev => ({...prev, investments: true}));
            const res = await axios.get('api/v1/copytradeInvestments');
            setInvestments(res.data.data.investments);
            setFilteredInvestments(res.data.data.investments);
            setFetched(true);
            
            // Calculate stats from the fetched data
            calculateLocalStats(res.data.data.investments);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(prev => ({...prev, investments: false}));
        }
    };

    const stopTrade = async (investmentId) => {
        if (!window.confirm(`Are you sure you want to stop this trade?`)) return;
        setProcessing(true);
        try {
            await axios.patch(`api/v1/copytradeInvestments/${investmentId}/stop`);
            toast.success('Trade stopped successfully!');
            await fetchInvestments();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to stop trade");
            console.error('Error stopping trade:', error);
        } finally {
            setProcessing(false);
        }
    };

    const fetchStats = async () => {
        setLoading(prev => ({...prev, stats: true}));
        try {
            const res = await axios.get('api/v1/stats/admin');
            setStats({
                totalInvested: res.data.data.stats.total_copytrade_amount,
                totalProfit: res.data.data.stats.total_copytrade_profit,
                activeInvestments: res.data.data.stats.active_copytrade_investments || 0,
            });
            setFetched(true);      
        } catch (error) {
            console.error(error);
            setFetched(true); 
        } finally {
            setLoading(prev => ({...prev, stats: false}));
        }
    };

    const calculateLocalStats = (investments) => {
        const localStats = {
            totalInvested: 0,
            totalProfit: 0,
            activeInvestments: 0,
            completedInvestments: 0
        };

        investments.forEach(inv => {
            localStats.totalInvested += parseFloat(inv.amount);
            localStats.totalProfit += parseFloat(inv.profit || 0);
            
            if (inv.status === 'active') {
                localStats.activeInvestments++;
            } else if (inv.status === 'completed') {
                localStats.completedInvestments++;
            }
        });

        setStats(prev => ({
            ...prev,
            ...localStats
        }));
    };

    const applyFilters = () => {
        let result = [...investments];
        
        // Apply status filter
        if (filters.status !== 'all') {
            result = result.filter(inv => inv.status === filters.status);
        }
        
        // Apply search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(inv => {
                const userName = `${inv.user?.firstName || ''} ${inv.user?.lastName || ''}`.toLowerCase();
                const traderName = inv.copyTrade?.tradeName?.toLowerCase() || '';
                return (
                    userName.includes(term) || 
                    traderName.includes(term) ||
                    inv.amount.toString().includes(term)
                );
            });
        }
        
        // Apply date range filter
        if (filters.dateRange !== 'all') {
            const now = moment();
            result = result.filter(inv => {
                const created = moment(inv.createdAt);
                switch(filters.dateRange) {
                    case 'today':
                        return created.isSame(now, 'day');
                    case 'week':
                        return created.isSame(now, 'week');
                    case 'month':
                        return created.isSame(now, 'month');
                    default:
                        return true;
                }
            });
        }
        
        setFilteredInvestments(result);
    };

   

    useEffect(() => {
        fetchInvestments();
        fetchStats();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, searchTerm, investments]);

    const statusBadge = (status) => {
        const baseClass = "text-xs px-2 py-1 rounded-full flex items-center gap-1";
        switch(status) {
            case 'active':
                return <span className={`${baseClass} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}>
                    <BiTrendingUp className="h-3 w-3" /> Active
                </span>;
            case 'completed':
                return <span className={`${baseClass} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`}>
                    <BiCheckCircle className="h-3 w-3" /> Completed
                </span>;
            case 'denied':
                return <span className={`${baseClass} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`}>
                    <BiXCircle className="h-3 w-3" /> Denied
                </span>;
            default:
                return <span className={`${baseClass} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`}>
                    <BiLoaderCircle className="h-3 w-3" /> Pending
                </span>;
        }
    };

    const formatCurrency = (value) => {
        if (value === undefined || value === null) return '$0.00';
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return '$' + num.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
                    <div className="flex lg:items-center lg:justify-between flex-col-reverse lg:flex-row">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Invested</p>
                            <p className="text-2xl font-bold">
                                {loading.stats ? '...' : formatCurrency(stats.totalInvested)}
                            </p>
                        </div>
                        <div className="p-3 rounded-full h-12 w-12 mb-2 lg:mb-0 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                            <BiWallet className="h-6 w-6" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
                    <div className="flex lg:items-center lg:justify-between flex-col-reverse lg:flex-row">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Profit</p>
                            <p className="text-2xl font-bold">
                                {loading.stats ? '...' : formatCurrency(stats.totalProfit)}
                            </p>
                        </div>
                        <div className="p-3 rounded-full h-12 w-12 mb-2 lg:mb-0 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                            <BiTrendingUp className="h-6 w-6" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
                    <div className="flex lg:items-center lg:justify-between flex-col-reverse lg:flex-row">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
                            <p className="text-2xl font-bold">
                                {loading.stats ? '...' : stats.activeInvestments}
                            </p>
                        </div>
                        <div className="p-3 rounded-full h-12 w-12 mb-2 lg:mb-0 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                            <BiTime className="h-6 w-6" />
                        </div>
                    </div>
                </div>

               
            </div>

            {/* Filters Section */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <BiSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by user, trader or amount..."
                            className="pl-10 w-full p-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                        <SelectField
                            options={[
                                {value: 'all', label: 'All Status'},
                                {value: 'active', label: 'Active'},
                                {value: 'completed', label: 'Completed'},
                                {value: 'denied', label: 'Denied'}
                            ]}
                            value={filters.status}
                            onChange={(e) => setFilters({...filters, status: e.target.value})}
                            variant="outline"
                            classNames="dark:bg-slate-700 dark:border-slate-700"
                        />
                        
                        <SelectField
                            options={[
                                {value: 'all', label: 'All Time'},
                                {value: 'today', label: 'Today'},
                                {value: 'week', label: 'This Week'},
                                {value: 'month', label: 'This Month'}
                            ]}
                            value={filters.dateRange}
                            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                            variant="outline"
                            classNames="dark:bg-slate-700 dark:border-slate-700"
                            icon={<BiCalendar className="h-4 w-4" />}
                        />
                    </div>
                </div>
            </div>

            {/* Investments Table */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        <BiTransferAlt className="text-blue-600 dark:text-blue-400" /> 
                        Copy Trade Investments
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {filteredInvestments.length} {filteredInvestments.length === 1 ? 'Record' : 'Records'}
                    </span>
                </div>

                {loading.investments && !fetched ? (
                    <div className="p-8 text-center">
                        <LoadingIndicator type="dots" size={8} />
                    </div>
                ) : filteredInvestments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                            <thead className="bg-gray-50 dark:bg-slate-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User/Trader</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dates</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                                {filteredInvestments.map((investment) => (
                                    <tr key={investment.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center">
                                                    {investment.user?.photo ? (
                                                        <img src={investment.user.photo} alt="User" className="h-full w-full rounded-full" />
                                                    ) : (
                                                        `${investment.user?.firstName?.charAt(0) || ''}${investment.user?.lastName?.charAt(0) || ''}`.trim() || 'U'
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {`${investment.user?.firstName || ''} ${investment.user?.lastName || ''}`.trim() || 'Unknown User'}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                        {investment.copyTrade?.image && (
                                                            <img src={investment.copyTrade.image} alt="Trader" className="h-4 w-4 rounded-full" />
                                                        )}
                                                        {investment.copyTrade?.tradeName || 'Unknown Trader'}
                                                        {investment.copyTrade?.tradeUsername && (
                                                            <span className="text-xs opacity-75">({investment.copyTrade.tradeUsername})</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(investment.amount)}
                                            </div>
                                           
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {moment(investment.createdAt).format('MMM D, YYYY')}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {investment.status === 'active' ? 'Active' : `Ended ${moment(investment.updatedAt).fromNow()}`}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            {statusBadge(investment.status)}
                                        </td>

                                        <td className="px-4 py-4 whitespace-nowrap">
                                            {investment.status === 'active' && (
                                                <button
                                                    onClick={() => stopTrade(investment.id)}
                                                    disabled={processing}
                                                    className={`inline-flex cursor-pointer items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md ${
                                                        processing 
                                                            ? 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed'
                                                            : 'bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-800'
                                                    }`}
                                                >
                                                    {processing ? (
                                                        <>
                                                            <BiLoaderCircle className="animate-spin h-4 w-4 mr-2" />
                                                            Stopping...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <BiXCircle className="h-4 w-4 mr-1" />
                                                            Stop Trade
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </td>
                                       
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <EmptyState 
                        title="No investments found"
                        description="Try adjusting your search or filter criteria"
                        icon={<BiTransferAlt className="h-12 w-12 text-gray-400" />}
                    />
                )}
            </div>
        </div>
    );
}