import Modal from '../../components/CustomModal';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import moment from 'moment/moment';
import { useEffect, useState } from 'react';
import { BiTransferAlt, BiPlus, BiMinus, BiCreditCard } from 'react-icons/bi';
import BankAccounts from './BankAccounts';
import axios from '../../lib/axios';
import { Link } from 'react-router-dom';

export default function Transactions() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [transactions, setTransactions] = useState([]);
    const [fetched, setFetched] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [witdModal, setWithdrawModal] = useState(false);
    const [accountModal, setAccountModal] = useState(false);

    const fetchStats = async () => {
        setProcessing(true);
        try {
            const res = await axios.get('api/v1/users/me/transactions');
            setTransactions(res.data.data.transactions);
            setFetched(true);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setProcessing(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const getStatusColor = (status) => {
        switch(status) {
            case 'success':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'failed':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const getTypeIcon = (type) => {
        switch(type.toLowerCase()) {
            case 'deposit':
                return <BiPlus className="text-green-500" />;
            case 'withdrawal':
                return <BiMinus className="text-red-500" />;
            default:
                return <BiTransferAlt className="text-blue-500" />;
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        to='/manage/investor/deposit'
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium rounded-lg shadow-md transition-all duration-300"
                    >
                        <BiPlus className="text-xl" />
                        Deposit Funds
                    </Link>
                    <Link
                        to='/manage/investor/withdrawal'
                       
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-lg shadow-md transition-all duration-300"
                    >
                        <BiMinus className="text-xl" />
                        Withdraw Funds
                    </Link>
                </div>
                
                <button 
                    onClick={() => setAccountModal(true)}
                    className="flex items-center cursor-pointer justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium rounded-lg shadow-md transition-all duration-300"
                >
                    <BiCreditCard className="text-xl" />
                    Bank Accounts
                </button>
            </div>

            {/* Transaction History */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-xl font-semibold flex items-center">
                        <BiTransferAlt className="mr-2 text-blue-500" />
                        Transaction History
                    </h2>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                        {transactions.length} records
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                   
                        <thead className="bg-gray-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment Method</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {processing && (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center">
                                        <LoadingIndicator type="dots" size={8} />
                                    </td>
                                </tr>
                            )}

                            {!processing && transactions.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <BiTransferAlt className="text-4xl text-gray-400 mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                No Transactions Found
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                Make your first transaction by depositing funds
                                            </p>
                                            <Link
                                               to='/manage/investor/deposit'
                                                className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-colors"
                                            >
                                                Deposit Now
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!processing && transactions.length > 0 && transactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="py-3 px-4 flex items-center gap-2">
                                        {getTypeIcon(transaction.type)}
                                        <span className="capitalize">{transaction.type}</span>
                                    </td>
                                    <td className="py-3 px-4 font-medium">
                                        ${transaction.amount.toLocaleString()}
                                    </td>
                                     <td className="py-3 px-4 font-medium">
                                        {transaction.paymentChannel}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                            {transaction.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm">
                                        {moment(transaction.createdAt).format('MMM D, YYYY h:mm A')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            
            <Modal show={accountModal} maxWidth="md" onClose={() => setAccountModal(false)}>
                <BankAccounts />
            </Modal>
        </div>
    );
}