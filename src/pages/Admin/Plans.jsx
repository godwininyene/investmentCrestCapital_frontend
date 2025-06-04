import { useEffect, useState } from 'react';
import { BiEditAlt, BiSave, BiTrashAlt } from 'react-icons/bi';
import { ImPieChart } from 'react-icons/im';
import axios from '../../lib/axios';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import Modal from '../../components/CustomModal';
import InputField from '../../components/common/InputField';
import SelectField from '../../components/common/SelectField';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import SubmitButton from '../../components/common/SubmitButton';

const Plans = () => {
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loadingPlans, setPlanState] = useState(false);
  const [plans, setPlans] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [returnPrincipal, setReturnPrincipal] = useState(false);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    setPlanState(true);
    try {
      const res = await axios.get('api/v1/plans');
      setPlans(res.data.data.plans);
      setFetched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setPlanState(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors([]);
    
    const formData = new FormData(e.target);
    formData.append('returnPrincipal', returnPrincipal);

    try {
      const res = await axios.post('api/v1/plans', formData);
      if (res.data.status === 'success') {
        setPlans(prev => [res.data.data.plan, ...prev]);
        e.target.reset();
      }
    } catch (err) {
       // Extract errors from the backend response
       if (err.response && err.response.data.message && err.response.data.errors) {
        const newErrors = {};

        err.response.data.errors.forEach(el => {
            for (let key in el) {
                newErrors[key] = el[key];
            }
        });
        setErrors(newErrors);
        } else {
            setErrors(err);
            console.error('Unexpected Error:', err);
        }
        console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors([]);
    
    const formData = new FormData(e.target);
    formData.append('returnPrincipal', returnPrincipal);

    try {
      const res = await axios.patch(`api/v1/plans/${selectedPlan.id}`, formData);
      if (res.data.status === 'success') {
        setPlans(prev => prev.map(plan => 
          plan.id === selectedPlan.id ? res.data.data.plan : plan
        ));
        setEditModal(false);
      }
    } catch (err) {
        // Extract errors from the backend response
        if (err.response && err.response.data.message && err.response.data.errors) {
            const newErrors = {};

            err.response.data.errors.forEach(el => {
                for (let key in el) {
                    newErrors[key] = el[key];
                }
            });
            setErrors(newErrors);
        } else {
            setErrors(err);
            console.error('Unexpected Error:', err);
        }
        console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (plan) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    setDeleting(true);
    setSelectedPlan(plan);
    try {
      await axios.delete(`api/v1/plans/${plan.id}`);
      setPlans(prev => prev.filter(p => p.id !== plan.id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const openEditModal = (plan) => {
    setSelectedPlan(plan);
    setReturnPrincipal(plan.returnPrincipal);
    setEditModal(true);
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ImPieChart className="text-blue-600" /> Investment Plans
        </h1>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Plan Form */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-slate-700">
            Create New Plan
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              name="name"
              label="Plan Name (optional)"
              type="text"
              placeholder="e.g. Bronze Plan"
              error={errors.name}
            />

            <div className="grid grid-cols-2 gap-4">
                <InputField
                    name="planDuration"
                    label="Duration"
                    type="number"
                    error={errors.planDuration}
                />
                <SelectField
                    name="timingParameter"
                    options={['hours', 'days']}
                    label="Time Unit"
                    error={errors.timingParameter}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                name="minDeposit"
                label="Min Deposit ($)"
                type="number"
                error={errors.minDeposit}
              />
              <InputField
                name="maxDeposit"
                label="Max Deposit ($)"
                type="number"
                error={errors.maxDeposit}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                name="percentage"
                label="Return (%)"
                type="number"
                error={errors.percentage}
              />
              <InputField
                name="referalBonus"
                label="Referral Bonus (%)"
                type="number"
                isRequired={false}
                error={errors.referalBonus}
              />
            </div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
             <textarea
                name="description"
                className='w-full py-2 px-4 transition-all duration-200 focus:outline-none border border-gray-300 rounded-lg focus:border-primary-light focus:outline-0 focus:ring-0'
              />

            <div className="flex items-center">
              <ToggleSwitch
                id="returnPrincipal"
                checked={returnPrincipal}
                onChange={() => setReturnPrincipal(!returnPrincipal)}
              />
              <label htmlFor="returnPrincipal" className="ml-2 text-sm">
                Return Principal
              </label>
            </div>

            <SubmitButton
              label="Create Plan"
              processing={processing}
              Icon={BiSave}
              className="w-full"
            />
          </form>
        </div>

        {/* Plans Table */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden lg:col-span-2">
          <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
            <h2 className="font-semibold text-lg">All Investment Plans</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {plans.length} {plans.length === 1 ? 'Plan' : 'Plans'}
            </span>
          </div>

          {loadingPlans ? (
            <div className="p-8 text-center">
              <LoadingIndicator type="dots" size={8} />
            </div>
          ) : plans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Deposit Range</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Percentage</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                  {plans.map(plan => (
                    <tr key={plan.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {plan.name || 'Unnamed Plan'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {plan.planDuration} {plan.timingParameter}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        ${plan.minDeposit?.toLocaleString()} - ${plan.maxDeposit?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {plan.percentage}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(plan)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                          >
                            <BiEditAlt className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(plan)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            disabled={deleting && selectedPlan?.id === plan.id}
                          >
                            {deleting && selectedPlan?.id === plan.id ? (
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
              No investment plans found
            </div>
          )}
        </div>
      </div>

      {/* Edit Plan Modal */}
      <Modal show={editModal} maxWidth="sm" onClose={() => setEditModal(false)}>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-slate-700">
            Edit Plan
          </h2>
          {selectedPlan && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <InputField
                name="name"
                label="Plan Name (optional)"
                type="text"
                defaultValue={selectedPlan.name}
                placeholder="e.g. Bronze Plan"
                error={errors.name}
              />

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  name="planDuration"
                  label="Duration"
                  type="number"
                  defaultValue={selectedPlan.planDuration}
                  error={errors.planDuration}
    
                />
                <SelectField
                    name="timingParameter"
                    options={['hours', 'days']}
                    label="Time Unit"
                    error={errors.timingParameter}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  name="minDeposit"
                  label="Min Deposit ($)"
                  type="number"
                  defaultValue={selectedPlan.minDeposit}
                  error={errors.minDeposit}
                />
                <InputField
                  name="maxDeposit"
                  label="Max Deposit ($)"
                  type="number"
                  defaultValue={selectedPlan.maxDeposit}
                  error={errors.maxDeposit}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  name="percentage"
                  label="Return (%)"
                  type="number"
                  defaultValue={selectedPlan.percentage}
                  error={errors.percentage}
                />
                <InputField
                  name="referalBonus"
                  label="Referral Bonus (%)"
                  type="number"
                  defaultValue={selectedPlan.referalBonus}
                  error={errors.referalBonus}
                />

               
              </div>
               <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                <textarea
                  name="description"
                  className='w-full py-2 px-4 transition-all duration-200 focus:outline-none border border-gray-300 rounded-lg focus:border-primary-light focus:outline-0 focus:ring-0'
                  defaultValue={selectedPlan.description}
                />

              <div className="flex items-center">
                <ToggleSwitch
                  id="editReturnPrincipal"
                  checked={returnPrincipal}
                  onChange={() => setReturnPrincipal(!returnPrincipal)}
                />
                <label htmlFor="editReturnPrincipal" className="ml-2 text-sm">
                  Return Principal
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
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

export default Plans;