import React, { useEffect, useState } from 'react';
import { BiSave, BiTrash } from 'react-icons/bi';
import { FaTimesCircle } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';
import axios from '../../lib/axios';
import SubmitButton from '../../components/common/SubmitButton';
import InputField from '../../components/common/InputField';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const BankAccounts = () => {
  const [addNewBank, setAddBankState] = useState(false);
  const [error, setError] = useState({});
  const [processing, setProcessing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [banks, setBanks] = useState([]);

  const fetchMyAccounts = async () => {
    try {
      const res = await axios.get('api/v1/users/me/banks');
      if (res.data.status === 'success') {
        setBanks(res.data.data.accounts);
      }
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to fetch accounts');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMyAccounts();
  }, []);

  const handleDelete = (accountId) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this account?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              setDeletingId(accountId);
              const res = await axios.delete(`api/v1/users/me/banks/${accountId}`);
              if (res.status === 204) {
                setBanks(banks.filter(bank => bank.id !== accountId));
                alert('Account deleted successfully');
              }
            } catch (error) {
              alert(error?.response?.data?.message || 'Failed to delete account');
              console.error(error);
            } finally {
              setDeletingId(null);
            }
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError({});

    const formElement = e.target;
    const form = new FormData(formElement);
    const jsonData = Object.fromEntries(form);

    try {
      const res = await axios.post('api/v1/users/me/banks', jsonData);
      if (res.data.status === 'success') {
        setBanks([...banks, res.data.data.account]);
        alert("Account added successfully");
        setAddBankState(false);
        formElement.reset();
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setError(error.response.data.errors);
      }
      alert(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="dark:bg-gray-800 dark:text-white rounded">
      <section className="px-4 py-3">
        <h2 className="pt-2 flex justify-between items-center">
          <span className="font-bold dark:text-gray-200">Withdrawal Wallets</span>
          {!addNewBank ? (
            <button 
              onClick={() => setAddBankState(true)} 
              className="flex items-center gap-1 py-1 px-3 cursor-pointer rounded-md bg-teal-500 hover:bg-teal-600 text-white dark:bg-teal-600 dark:hover:bg-teal-700 transition-colors"
            > 
              <MdAdd className="inline" /> Add New
            </button>
          ) : (
            <button 
              onClick={() => setAddBankState(false)} 
              className="flex items-center gap-1 py-1 px-3 cursor-pointer rounded-md bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700 transition-colors"
            > 
              <FaTimesCircle className="inline" /> Cancel
            </button>
          )}
        </h2>
        <hr className="my-2 border-gray-300 dark:border-gray-600" />
        
        {addNewBank ? (
          <aside className="dark:bg-gray-700 dark:border-gray-600 p-4 rounded-lg border border-gray-200">
            <form onSubmit={submit}>
              <InputField
                name={'network'}
                placeholder={'Enter network eg. Bitcoin, Ethereum, Solana etc'}
                label={'Network'}
                classNames='mb-2'
                error={error.network}
                isRequired={true}
              />

              <InputField
                name={'walletAddress'}
                placeholder={'Enter wallet address'}
                label={'Wallet Address'}
                classNames='mb-2'
                error={error.walletAddress}
                isRequired={true}
              />
              
              <div className="mt-5 relative">
                <SubmitButton
                  label="Save Account Details"
                  processing={processing}
                  Icon={BiSave}
                  className="px-4 w-full py-3"
                />
              </div>
            </form>
          </aside>
        ) : (
          <aside className="space-y-4">
            {banks?.length > 0 ? (
              banks.map((bank) => (
                <div 
                  key={bank.id} 
                  className="relative grid grid-cols-1 md:grid-cols-3 gap-4 bg-primary bg-opacity-20 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                >
                  <div>
                    <label className='text-sm block dark:text-gray-300'>Network</label>
                    <p className="text-lg font-bold dark:text-white">{bank.network}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className='text-sm block dark:text-gray-300'>Wallet Address</label>
                    <p className="text-lg font-bold dark:text-white break-all">{bank.walletAddress}</p>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(bank.id)}
                    disabled={deletingId === bank.id}
                    className="absolute top-3 right-3 p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    title="Delete account"
                  >
                    {deletingId === bank.id ? (
                      <LoadingIndicator className="h-5 w-5" />
                    ) : (
                      <BiTrash className="h-5 w-5" />
                    )}
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 px-4">
                <div className="text-gray-500 dark:text-gray-400 italic mb-4">
                  You have no wallet information!
                </div>
                <button 
                  onClick={() => setAddBankState(true)} 
                  className="inline-flex items-center gap-1 py-2 px-4 rounded-md bg-teal-500 hover:bg-teal-600 text-white dark:bg-teal-600 dark:hover:bg-teal-700 transition-colors"
                >
                  <MdAdd /> Add New Wallet
                </button>
              </div>
            )}
          </aside>
        )}
      </section>
    </div>
  );
};

export default BankAccounts;