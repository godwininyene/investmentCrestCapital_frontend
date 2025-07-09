import { useState, useEffect } from 'react';
import { 
  BiTransferAlt, 
  BiCheck, 
  BiSearch, 
  BiFilterAlt,
  BiCalendar,
  BiDownload,
  BiUpArrowAlt,
  BiDownArrowAlt
} from 'react-icons/bi';
import { 
  FaTimesCircle,
  FaMoneyBillWave,
  FaExchangeAlt
} from 'react-icons/fa';
import { BsEye } from 'react-icons/bs';
import moment from 'moment';
import axios from '../../lib/axios';
import Modal from '../../components/CustomModal';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import EmptyState from '../../components/common/EmptyState';
import SelectField from '../../components/common/SelectField';
import defaultAvatar from '../../assets/images/default.jpg';
import coverImage from '../../assets/images/forex.jpeg';
import { toast } from 'react-toastify';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [approving, setApproving] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    dateRange: 'all'
  });



  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, searchTerm, transactions]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('api/v1/transactions');
      if (res.data.status === 'success') {
        setTransactions(res.data.data.transactions);
        setFetched(true);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setFetched(true);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...transactions];
    
    // Apply type filter
    if (filters.type.toLowerCase() !== 'all') {
      result = result.filter(tx => 
        tx.type.toLowerCase() === filters.type.toLowerCase()
      );
    }
    
    // Apply status filter
    if (filters.status.toLowerCase() !== 'all') {
      result = result.filter(tx => 
        tx.status.toLowerCase() === filters.status.toLowerCase()
      );
    }
    
    // Apply date range filter
    if (filters.dateRange.toLowerCase() !== 'all') {
      const now = moment();
      result = result.filter(tx => {
        const txDate = moment(tx.createdAt);
        switch(filters.dateRange.toLowerCase()) {
          case 'today':
            return txDate.isSame(now, 'day');
           
          case 'week':
            return txDate.isSame(now, 'week');
          case 'month':
            return txDate.isSame(now, 'month');
          default:
            return true;
        }
      });
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(tx => 
        tx.reference?.toLowerCase().includes(term) || 
        tx.user?.name?.toLowerCase().includes(term) ||
        tx.amount.toString().includes(term)
      );
    }
    
    setFilteredTransactions(result);
  };

  const approveTransaction = async (transactionId) => {
     if (!window.confirm(`Are you sure you want to approve this transaction?`)) return;
    setApproving(true);
    try {
      const res = await axios.patch(`api/v1/transactions/${transactionId}/action/approve`);
      if (res.data.status === 'success') {
        setTransactions(prev => 
          prev.map(tx => tx.id === transactionId ? res.data.data.transaction : tx)
        );
        setSelectedTransaction(res.data.data.transaction);
         setDetailModal(false)
        toast.success('Transaction approved successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve transaction");
    } finally {
      setApproving(false);
     
    }
  };

  const declineTransaction = async (transactionId) => {
    if (!window.confirm(`Are you sure you want to decline this transaction?`)) return;
    setDeclining(true);
    try {
      const res = await axios.patch(`api/v1/transactions/${transactionId}/action/decline`);
      if (res.data.status === 'success') {
        setTransactions(prev => 
          prev.map(tx => tx.id === transactionId ? res.data.data.transaction : tx)
        );
        setSelectedTransaction(res.data.data.transaction);
         setDetailModal(false)
         toast.success('Transaction declined successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to decline transaction");
    } finally {
      setDeclining(false);
    }
  };

  const getTransactionIcon = (type) => {
    switch(type) {
      case 'investment deposit':
        return <BiDownArrowAlt className="text-green-500 text-xl" />;
      case 'copytrade deposit':
        return <BiDownArrowAlt className="text-green-500 text-xl" />;
      case 'withdrawal':
        return <BiUpArrowAlt className="text-red-500 text-xl" />;
      case 'transfer':
        return <FaExchangeAlt className="text-blue-500 text-xl" />;
      default:
        return <BiTransferAlt className="text-gray-500 text-xl" />;
    }
  };

  const statusBadge = (status) => {
    const baseClass = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch(status) {
      case 'success':
        return <span className={`${baseClass} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}>
          Completed
        </span>;
      case 'pending':
        return <span className={`${baseClass} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`}>
          Pending
        </span>;
      case 'declined':
        return <span className={`${baseClass} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`}>
          Declined
        </span>;
      default:
        return <span className={`${baseClass} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`}>
          {status}
        </span>;
    }
  };

  const exportTransactions = () => {
    // Implement CSV export functionality
    alert('Export functionality would be implemented here');
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BiTransferAlt className="text-blue-600 dark:text-blue-400" /> 
          Transaction Management
        </h1>
        
        <div className="flex items-center gap-4">
          <button
            onClick={exportTransactions}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg"
          >
            <BiDownload className="h-5 w-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
              <BiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search transactions..."
              className="pl-10 w-full p-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <SelectField
              label={'Type'}
              options={['All', 'Deposit', 'Withdrawal', 'Transfer']}
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              icon={<BiFilterAlt className="h-4 w-4" />}
              variant="outline"
              classNames="dark:bg-slate-700 dark:border-slate-700"
            />
            
            <SelectField
              label={'Status'}
              options={['All', 'Pending', 'Success', 'Declined']}
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              icon={<BiFilterAlt className="h-4 w-4" />}
              variant="outline"
              classNames="dark:bg-slate-700 dark:border-slate-700"
            />
            
            <SelectField
              label={'Date'}
              options={['All', 'Today', 'Week', 'Month']}
              value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
              icon={<BiCalendar className="h-4 w-4" />}
              variant="outline"
              classNames="dark:bg-slate-700 dark:border-slate-700"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
          <div className="flex lg:items-center lg:justify-between flex-col-reverse lg:flex-row">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Transactions</p>
              <p className="text-2xl font-bold">{filteredTransactions.length}</p>
            </div>
            <div className="p-3 rounded-full h-12 w-12 mb-2 lg:mb-0 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
              <BiTransferAlt className="h-6 w-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
          <div className="flex lg:items-center lg:justify-between flex-col-reverse lg:flex-row">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Deposits</p>
              <p className="text-2xl font-bold">
                ${filteredTransactions
                  .filter(tx => tx.type === 'investment deposit')
                  .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
                  .toLocaleString()
                }
              </p>
            </div>
            <div className="p-3 rounded-full h-12 w-12 mb-2 lg:mb-0 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
              <BiDownArrowAlt className="h-6 w-6" />
            </div>
          </div>
        </div>


        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
          <div className="flex lg:items-center lg:justify-between flex-col-reverse lg:flex-row">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Copytrade Deposits</p>
              <p className="text-2xl font-bold">
                ${filteredTransactions
                  .filter(tx => tx.type === 'copytrade deposit')
                  .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
                  .toLocaleString()
                }
              </p>
            </div>
            <div className="p-3 rounded-full h-12 w-12 mb-2 lg:mb-0 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
              <BiDownArrowAlt className="h-6 w-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
          <div className="flex lg:items-center lg:justify-between flex-col-reverse lg:flex-row">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Withdrawals</p>
              <p className="text-2xl font-bold">
                ${filteredTransactions
                  .filter(tx => tx.type === 'withdrawal')
                  .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
                  .toLocaleString()
                }
              </p>
            </div>
            <div className="p-3 rounded-full h-12 w-12 mb-2 lg:mb-0 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300">
              <BiUpArrowAlt className="h-6 w-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
          <div className="flex lg:items-center lg:justify-between flex-col-reverse lg:flex-row">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Transactions</p>
              <p className="text-2xl font-bold">
                {filteredTransactions.filter(tx => tx.status === 'pending').length}
              </p>
            </div>
            <div className="p-3 rounded-full h-12 w-12 mb-2 lg:mb-0 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300">
              <FaMoneyBillWave className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transaction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {loading && !fetched ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <LoadingIndicator type="dots" size={8} />
                  </td>
                </tr>
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                            {transaction.type}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.type === 'deposit' ? transaction.paymentChannel : transaction.accountType}
                            
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            src={transaction.user?.photo && transaction.user.photo !== 'default.png' ? 
                              transaction.user.photo : defaultAvatar} 
                            alt={transaction.user?.firstName} 
                            className="h-10 w-10 rounded-full"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {`${transaction.user?.firstName || ''} ${transaction.user?.lastName || ''}`.trim() || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.user?.email || 'System Transaction'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        transaction.type === 'investment deposit' || transaction.type==='copytrade deposit' ? 
                        'text-green-600 dark:text-green-400' : 
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'investment deposit' || transaction.type==='copytrade deposit' ? '+' : '-'}
                        ${parseFloat(transaction.amount).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {moment(transaction.createdAt).format('MMM D, YYYY')}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {moment(transaction.createdAt).format('h:mm A')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {statusBadge(transaction.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setDetailModal(true);
                          }}
                          className="text-blue-600 cursor-pointer dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        >
                          <BsEye className="h-5 w-5" />
                        </button>
                        
                        {transaction.status === 'pending' && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedTransaction(transaction);
                                approveTransaction(transaction.id);
                              }}
                              className="text-green-600 cursor-pointer dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                              disabled={approving && selectedTransaction?.id === transaction.id}
                            >
                              {approving && selectedTransaction?.id === transaction.id ? (
                                <LoadingIndicator size={4} />
                              ) : (
                                <BiCheck className="h-5 w-5" />
                              )}
                            </button>
                            
                            <button
                              onClick={() => {
                                setSelectedTransaction(transaction);
                                declineTransaction(transaction.id);
                              }}
                              className="text-red-600 cursor-pointer dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                              disabled={declining && selectedTransaction?.id === transaction.id}
                            >
                              {declining && selectedTransaction?.id === transaction.id ? (
                                <LoadingIndicator size={4} />
                              ) : (
                                <FaTimesCircle className="h-5 w-5" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4">
                    <EmptyState 
                      title="No transactions found"
                      description="Try adjusting your search or filter criteria"
                      icon={<BiTransferAlt className="h-12 w-12 text-gray-400" />}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      <Modal show={detailModal} maxWidth="md" onClose={() => setDetailModal(false)}>
        {selectedTransaction && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
            <div className="min-h-[150px] bg-cover bg-center relative" style={{ backgroundImage: `url(${coverImage})` }}>
            </div>
    
            <div className="relative pb-4">
             

              <span className="mx-auto h-32 w-32 block -mt-32">
                <img  alt={selectedTransaction.user?.firstName}  src={(selectedTransaction?.user?.photo && selectedTransaction?.user?.photo != 'default.png') ? selectedTransaction?.user.photo : defaultAvatar}  className={`bg-slate-300 h-32 w-32 rounded-full object-cover overflow-hidden`} />
              </span>
              <section className="px-4 pt-3 text-center">
                <h1 className="text-xl font-bold dark:text-slate-300">
                  { selectedTransaction?.user?.firstName} {' '} {selectedTransaction?.user?.firstName }
                </h1>
                <p className="text-sm font-semibold text-primary dark:text-slate-300 mb-2">
                  { selectedTransaction?.user?.email }
                </p>
              </section>
              
              <div className="px-4 pt-1 pb-2 grid grid-cols-1 md:grid-cols-2 gap-4 md:max-h-[250px] overflow-y-auto">
               
                  <h3 className="font-medium py-1 px-4 text-center border-b bg-primary-light text-white  col-span-2">
                    Transaction Information
                  </h3>
                  
                 
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Reference</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedTransaction.reference || 'N/A'}
                    </p>
                  </div>
                    
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                    <p className="text-sm text-gray-900 dark:text-white capitalize">
                      {selectedTransaction.type}
                    </p>
                  </div>
                    
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <div className="text-sm">
                      {statusBadge(selectedTransaction.status)}
                    </div>
                  </div>
                    
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date & Time</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {moment(selectedTransaction.createdAt).format('MMMM D, YYYY [at] h:mm A')}
                    </p>
                  </div>
                 
              
                  <h3 className="font-medium py-1 px-4 text-center border-b bg-primary-light text-white  col-span-2">
                    Financial Details
                  </h3>
                
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                      <p className={`text-xl font-bold ${
                        selectedTransaction.type === 'investment deposit' || selectedTransaction.type==='copytrade deposit' ? 
                        'text-green-600 dark:text-green-400' : 
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {selectedTransaction.type === 'investment deposit' || selectedTransaction.type==='copytrade deposit' ? '+' : '-'}
                        ${parseFloat(selectedTransaction.amount).toLocaleString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
                      <p className="text-sm text-gray-900 dark:text-white capitalize">
                        {selectedTransaction.type === 'investment deposit' || selectedTransaction.type==='copytrade deposit' ? selectedTransaction.paymentChannel : selectedTransaction.accountType}

                      </p>
                    </div>
                    
                    {selectedTransaction.receipt && (
                      <div className='col-span-2'>
                       
                        <div className="">
                          <img 
                            src={selectedTransaction.receipt} 
                            alt="Transaction receipt" 
                            className="rounded-md border border-gray-200 dark:border-slate-700 w-full"
                          />
                        </div>
                      </div>
                    )}
                  
                
              </div>
              
             
                <div className="pt-2 border-t border-gray-200 dark:border-slate-700 flex justify-center gap-4">
                {selectedTransaction.status !== 'success' && (
                  <button
                    onClick={() => approveTransaction(selectedTransaction.id)}
                    className="px-4 py-2 cursor-pointer bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
                    disabled={approving}
                  >
                    {approving ? (
                      <LoadingIndicator size={4} />
                    ) : (
                      <>
                        <BiCheck className="h-5 w-5" /> Approve
                      </>
                    )}
                  </button>
                )}
                {selectedTransaction.status !== 'declined' && (
                  <button
                    onClick={() => declineTransaction(selectedTransaction.id)}
                    className="px-4 py-2 cursor-pointer bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2"
                    disabled={declining}
                  >
                    {declining ? (
                      <LoadingIndicator size={4} />
                    ) : (
                      <>
                        <FaTimesCircle className="h-5 w-5" /> Decline
                      </>
                    )}
                  </button>
                  )}
                </div>
              
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}