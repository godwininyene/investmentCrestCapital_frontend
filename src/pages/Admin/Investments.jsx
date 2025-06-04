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
  BiLoaderCircle
} from 'react-icons/bi';
import moment from 'moment';
import axios from '../../lib/axios';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import SelectField from '../../components/common/SelectField';
import EmptyState from '../../components/common/EmptyState';

export default function Investments({ auth }) {
    const [investments, setInvestments] = useState([]);
    const [filteredInvestments, setFilteredInvestments] = useState([]);
    const [fetched, setFetched] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: 'all',
        dateRange: 'all',
        plan: 'all'
    });
    const [stats, setStats] = useState({
        totalInvested: 0,
        totalProfit: 0,
        activeInvestments: 0
    });

    const fetchInvestments = async () => {
        try {
            setProcessing(true);
            const res = await axios.get('api/v1/investments');
            setInvestments(res.data.data.investments);
            setFilteredInvestments(res.data.data.investments);
            calculateStats(res.data.data.investments);
            setFetched(true);
        } catch (error) {
            console.log(error);
        } finally {
            setProcessing(false);
        }
    };

    const calculateStats = (investments) => {
        const totalInvested = investments.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
        const totalProfit = investments.reduce((sum, inv) => sum + parseFloat(inv.profit || 0), 0);
        const activeInvestments = investments.filter(inv => inv.status === 'active').length;
        
        setStats({
            totalInvested,
            totalProfit,
            activeInvestments
        });
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
            result = result.filter(inv => 
                inv.user.name.toLowerCase().includes(term) || 
                inv.plan?.name?.toLowerCase().includes(term) ||
                inv.amount.toString().includes(term)
            );
        }
        
        // Apply date range filter (example implementation)
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
        calculateStats(result);
    };

    useEffect(() => {
        fetchInvestments();
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

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
                    <div className="flex lg:items-center lg:justify-between flex-col-reverse lg:flex-row">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Invested</p>
                            <p className="text-2xl font-bold">${stats.totalInvested.toLocaleString()}</p>
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
                            <p className="text-2xl font-bold">${stats.totalProfit.toLocaleString()}</p>
                        </div>
                        <div className="p-3 rounded-full h-12 w-12 mb-2 lg:mb-0 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                            <BiTrendingUp className="h-6 w-6" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
                    <div className="flex lg:items-center lg:justify-between flex-col-reverse lg:flex-row">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Active Investments</p>
                            <p className="text-2xl font-bold">{stats.activeInvestments}</p>
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
                            placeholder="Search investments..."
                            className="pl-10 w-full p-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                        <SelectField
                            options={['all', 'active', 'completed', 'denied']}
                            value={filters.status}
                            onChange={(e) => setFilters({...filters, status: e.target.value})}
                            label="Status"
                            variant="outline"
                            classNames="dark:bg-slate-700 dark:border-slate-700"
                        />
                        
                        <SelectField
                            options={['all', 'today', 'week', 'month']}
                            value={filters.dateRange}
                            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                            label="Date Range"
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
                        Investment History
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {filteredInvestments.length} {filteredInvestments.length === 1 ? 'Record' : 'Records'}
                    </span>
                </div>

                {processing && !fetched ? (
                    <div className="p-8 text-center">
                        <LoadingIndicator type="dots" size={8} />
                    </div>
                ) : filteredInvestments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                            <thead className="bg-gray-50 dark:bg-slate-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User/Plan</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dates</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                                {filteredInvestments.map((investment) => (
                                    <tr key={investment.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center">
                                                    {/* {investment.user.firstName.charAt(0).toUpperCase()} */}
                                                    {`${investment.user?.firstName.charAt(0) || ''} ${investment.user?.lastName.charAt(0) || ''}`.trim() || 'Unknown'}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {`${investment.user?.firstName || ''} ${investment.user?.lastName || ''}`.trim() || 'Unknown'}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {investment?.plan?.name || 'No Plan'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                ${parseFloat(investment.amount).toLocaleString()}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Profit: ${parseFloat(investment?.profit || 0).toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {moment(investment.createdAt).format('MMM D, YYYY')}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {moment(investment.expiryDate).fromNow()}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            {statusBadge(investment.status)}
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