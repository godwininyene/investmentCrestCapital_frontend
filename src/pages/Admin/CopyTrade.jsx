import { useEffect, useState } from 'react';
import { BiEditAlt, BiSave, BiTrashAlt } from 'react-icons/bi';
import { BsQrCode } from 'react-icons/bs';
import { ImPieChart } from 'react-icons/im';
import axios from '../../lib/axios';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import Modal from '../../components/CustomModal';
import InputField from '../../components/common/InputField';
import SelectField from '../../components/common/SelectField';
import SubmitButton from '../../components/common/SubmitButton';
import { toast } from 'react-toastify';

const CopyTrade = () => {
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loadingTrades, setTradeState] = useState(false);
  const [trades, setTrades] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [editModal, setEditModal] = useState(false);

  useEffect(() => {
    fetchTrades();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors([]);
    
    const formData = new FormData(e.target);

    try {
      const res = await axios.post('api/v1/copytrades', formData);
      if (res.data.status === 'success') {
        setTrades(prev => [res.data.data.copytrade, ...prev]);
        toast.success('Copytrade added successfully!');
        e.target.reset();
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors(err);
        toast.error(err.response?.data?.message || 'Error saving copytrade');
        console.error('Unexpected Error:', err);
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors([]);
    
    const formData = new FormData(e.target);

    try {
      const res = await axios.patch(`api/v1/copytrades/${selectedTrade.id}`, formData);
      if (res.data.status === 'success') {
        setTrades(prev => prev.map(trade => 
          trade.id === selectedTrade.id ? res.data.data.copytrade : trade
        ));
         toast.success('Copytrade updated successfully!');
        setEditModal(false);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors(err);
        toast.error(err.response?.data?.message || 'Error updating copytrade');
        console.log('Unexpected Error:', err);
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (trade) => {
    if (!window.confirm('Are you sure you want to delete this trade?')) return;
    setDeleting(true);
    setSelectedTrade(trade);
    try {
      await axios.delete(`api/v1/copytrades/${trade.id}`);
      setTrades(prev => prev.filter(t => t.id !== trade.id));
      toast.success('Copytrade updated successfully!');
    } catch (err) {
      console.log(err);
       toast.error(err.response?.data?.message || 'Error deleting copytrade');
    } finally {
      setDeleting(false);
    }
  };

  const openEditModal = (trade) => {
    setSelectedTrade(trade);
    setEditModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ImPieChart className="text-blue-600" /> Copy Trades
        </h1>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Trade Form */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-slate-700">
            Create New Trade
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              name="tradeName"
              label="Trade Name"
              placeholder="e.g. Market Masters"
              error={errors.tradeName}
            />
            
            <InputField
              name="tradeUsername"
              label="Trade Username"
              placeholder="e.g. @Mini_Tradez"
              error={errors.tradeUsername}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <InputField
                name="minDeposit"
                label="Min Deposit ($)"
                type="number"
                placeholder="e.g. 10000"
                error={errors.minDeposit}
              />
              
              <InputField
                name="fees"
                label="Fees (%)"
                type="number"
                placeholder="e.g. 30"
                error={errors.fees}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <InputField
                name="investors"
                label="Investors"
                type="number"
                placeholder="e.g. 566"
                error={errors.investors}
              />
              
              <InputField
                name="monthlyReturn"
                label="1M Return (%)"
                type="number"
                placeholder="e.g. 110"
                error={errors.monthlyReturn}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Image
              </label>
              <div className="flex items-center gap-2">
                <label className="flex-1 cursor-pointer border border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-4 text-center hover:bg-gray-50 dark:hover:bg-slate-700">
                  <input 
                    type="file" 
                    name="image" 
                    accept="image/*" 
                    className="hidden"
                  />
                  <BsQrCode className="mx-auto h-8 w-8 text-gray-400" />
                  <span className="mt-2 block text-sm text-gray-500 dark:text-gray-400">
                    Upload Image
                  </span>
                </label>
              </div>
              {errors.image && (
                <p className="mt-1 text-sm text-red-500">{errors.image}</p>
              )}
            </div>
            
            <SubmitButton
              label="Create Trade"
              processing={processing}
              Icon={BiSave}
              className="w-full"
            />
          </form>
        </div>

        {/* Trade Table */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden lg:col-span-2">
          <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
            <h2 className="font-semibold text-lg">All Copy Trades</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {trades.length} {trades.length === 1 ? 'Trade' : 'Trades'}
            </span>
          </div>

          {loadingTrades ? (
            <div className="p-8 text-center">
              <LoadingIndicator type="dots" size={8} />
            </div>
          ) : trades.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Username</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Min Deposit</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fees</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">1M Return</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                  {trades.map(trade => (
                    <tr key={trade.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {trade.tradeName || 'Unnamed Trade'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {trade.tradeUsername}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        ${trade.minDeposit?.toLocaleString()}
                      </td>
                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {trade.fees}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {trade.monthlyReturn}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(trade)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                          >
                            <BiEditAlt className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(trade)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            disabled={deleting && selectedTrade?.id === trade.id}
                          >
                            {deleting && selectedTrade?.id === trade.id ? (
                              <LoadingIndicator size={4} />
                            ) : (
                              <BiTrashAlt className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No copy trades found
            </div>
          )}
        </div>
      </div>

      {/* Edit Trade Modal */}
      <Modal show={editModal} maxWidth="sm" onClose={() => setEditModal(false)}>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-slate-300 text-gray-500 pb-2 border-b border-gray-200 dark:border-slate-700">
            Edit Trade
          </h2>
          {selectedTrade && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <InputField
                name="tradeName"
                label="Trade Name"
                defaultValue={selectedTrade.tradeName}
                placeholder="e.g. Market Masters"
                error={errors.tradeName}
              />
              
              <InputField
                name="tradeUsername"
                label="Trade Username"
                defaultValue={selectedTrade.tradeUsername}
                placeholder="e.g. @Mini_Tradez"
                error={errors.tradeUsername}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  name="minDeposit"
                  label="Min Deposit ($)"
                  type="number"
                  defaultValue={selectedTrade.minDeposit}
                  error={errors.minDeposit}
                />
                
                <InputField
                  name="fees"
                  label="Fees (%)"
                  type="number"
                  defaultValue={selectedTrade.fees}
                  error={errors.fees}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  name="investors"
                  label="Investors"
                  type="number"
                  defaultValue={selectedTrade.investors}
                  error={errors.investors}
                />
                
                <InputField
                  name="monthlyReturn"
                  label="1M Return (%)"
                  type="number"
                  defaultValue={selectedTrade.monthlyReturn}
                  error={errors.monthlyReturn}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-slate-300 text-gray-500 ">
                    Image
                </label>
                <div className="flex flex-col items-center gap-2">
                    {selectedTrade.image && (
                      <img 
                        src={selectedTrade.image} 
                        alt="Current trade image" 
                        className="h-24 object-contain rounded border border-gray-200 dark:border-slate-600 mb-2"
                      />
                    )}
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer border border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-4 text-center hover:bg-gray-50 dark:hover:bg-slate-700">
                    <input 
                      type="file" 
                      name="image" 
                      accept="image/*" 
                      className="hidden"
                    />
                    <BsQrCode className="mx-auto h-8 w-8 text-gray-400" />
                    <span className="mt-2 block text-sm text-gray-500 dark:text-gray-400">
                      {selectedTrade.image ? 'Change Image' : 'Upload Image'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:text-slate-300 text-gray-500 dark:border-slate-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <SubmitButton
                  label="Save Changes"
                  processing={processing}
                  Icon={BiSave}
                  className="px-4"
                />
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CopyTrade;