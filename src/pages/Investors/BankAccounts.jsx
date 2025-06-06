import LoadingIndicator from '../../components/common/LoadingIndicator';
import React, { useEffect, useState } from 'react'
import { BiSave } from 'react-icons/bi';
import { FaTimesCircle } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md'
import axios from '../../lib/axios';
import SubmitButton from '../../components/common/SubmitButton';
import InputField from '../../components/common/InputField';
import SelectField from '../../components/common/SelectField';

const BankAccounts = () => {
  const [addNewBank, setAddBankState] = useState(false);
  const [error, setError] = useState({});
  const [processing, setProcessing] = useState(false);
  const [banks, setBanks] = useState([]);


  let fetchMyAccounts = async () => {
    await axios.get('api/v1/users/me/banks')
    .then((res) => {
      console.log(res)
      if(res.data.status === 'success'){
        setBanks(res.data.data.accounts);
      }
    })
    .catch((error) => {
      alert(error?.response.data.message);
      console.log(error);
    })
  }

  useEffect(() => {
    fetchMyAccounts();
  }, [])
  
let submit = async (e) => {
  e.preventDefault();
  setProcessing(true);
  setError(false); // Clear previous error

  const formElement = e.target;
  const form = new FormData(formElement);
  const jsonData = Object.fromEntries(form);

  try {
    const res = await axios.post('api/v1/users/me/banks', jsonData);

    if (res.data.status === 'success') {
      setBanks(res.data.data.account);
      alert("Account added successfully")
      setAddBankState(false);
      formElement.reset();
    }
  } catch (error) {
    // Stop loading indicator
    setProcessing(false);

    // No response from server (network/server error)
    if (!error.response) {
      setError('Network error. Please check your internet connection or try again later.');
      alert('Network error. Please check your internet connection or try again later.');
      return;
    }

    const { message, errors } = error.response.data;

    if (message && !errors) {
      // Server returned a single message
      alert(message);
    } else if (errors) {
      // Server returned validation errors
      setError(errors);
      alert('Please check the form and try again.');
    } else {
      // Fallback error
      setError('An unexpected error occurred. Please try again.');
      alert('An unexpected error occurred. Please try again.');
    }

    console.error(error);
  } finally {
    setProcessing(false);
  }
};



  return (
    <div>
        <section className="px-4 py-3">
            <h2 className="pt-2 flex justify-between">
                <span className="font-bold">Bank Accounts</span>
                { (addNewBank == false) ?
                <button onClick={() => setAddBankState(true)} className="py-1 px-2  cursor-pointer rounded-md bg-teal-500 text-white"> 
                  <MdAdd className="inline" /> Add New
                </button> :
                <button onClick={() => setAddBankState(false)} className="py-1 currsor-pointer px-2 rounded-md bg-red-500 text-white"> 
                <FaTimesCircle className="inline" /> Cancel
              </button> }
            </h2>
            <hr className="my-2" />
            { addNewBank ? (
              <aside>
                {/* Form */}
                <form onSubmit={submit}>
                  <InputField
                    name={'bankName'}
                    placeholder={'Enter the Bank name'}
                    label={'Bank Name'}
                    classNames='mb-2'
                    error={error.bankName}
                  />

                  <InputField
                    name={'accountNumber'}
                    placeholder={'Enter the Bank name'}
                    label={'Account Number / IBAN'}
                    classNames='mb-2'
                    isRequired={false}
                    error={error.accountNumber}
                  />

                  <InputField
                    name={'accountName'}
                    placeholder={'Enter the account name'}
                    label={'Account Holder Name'}
                    classNames='mb-2'
                    error={error.accountName}
                  />

                  <SelectField
                    name="accountType"
                    label="Account Type"
                    options={['savings Account', 'Current Account', 'Fix Deposit Account', 'Others']}
                    classNames="mb-2"
                    error={error.payOption}
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
              <aside className="md:max-h-[400px] overflow-y-auto">
                {/* Show Accounts */}
                {banks?.length > 0 && banks.map((bank) => (
                  <aside key={bank.id} className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-primary bg-opacity-20 rounded-lg px-2 py-3 mb-5">
                    <div className="mb-5 relative">
                      <label htmlFor="bank" className='text-sm block'> Bank Name </label>
                      <p className="text-lg font-bold">{bank.bankName}</p>
                    </div>
                    <div className="mb-5 relative">
                      <label htmlFor="bank" className='text-sm block'> Account Holder </label>
                      <p className="text-lg font-bold">{bank.accountName}</p>
                    </div>
                    <div className="mb-5 relative">
                      <label htmlFor="bank" className='text-sm block'> Account Number </label>
                      <p className="text-lg font-bold">{bank.accountNumber}</p>
                    </div>
                    <div className="mb-5 relative">
                      <label htmlFor="bank" className='text-sm block'> Account Type </label>
                      <p className="text-lg font-bold">{bank.accountType}</p>
                    </div>
                  </aside>
                ))}
                {banks?.length == 0 && <div className="text-base py-8 px-4 italic text-centerr "> 
                    You have no bank information! Kindly add your own bank information here by clicking on the "Add New" button above.
                </div>}
              </aside>
            )

            }
        </section>
    </div>
  )
}

export default BankAccounts