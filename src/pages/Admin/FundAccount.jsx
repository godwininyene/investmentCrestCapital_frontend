import LoadingIndicator from '../../components/common/LoadingIndicator';
import coverImage from './../../assets/images/forex.jpeg';
import defaultAvatar from './../../assets/images/default.jpg'
import React, { useState } from 'react'
import { BiArrowBack } from 'react-icons/bi';
import { AiOutlineTransaction } from 'react-icons/ai';
import axios from '../../lib/axios';
import InputField from '../../components/common/InputField';
import SelectField from '../../components/common/SelectField';

const FundAccount = ({user, onBack, onFunded = () => Object}) => {
    let back = () => {
        onBack();
    }
    const [processing, setProcessing] = useState(false);
    const [message, setErrorMessage] = useState('');
    
    let submit = async (e) => {
        e.preventDefault();
        let form =  new FormData(e.target)
        setErrorMessage('')
        setProcessing(true);
        await axios.patch(`api/v1/users/${user.id}/wallets`, form)
        .then((res) => {
            if(res.data.status ==='success'){
                alert('Wallet funded successfully!')
                e.target.reset();
                setProcessing(false);              
                onFunded(res.data.data.user)
            }
        })
        .catch((err) => {
            console.log(err)
            setErrorMessage(err.response?.data?.message)
            alert("Something went very wrong!")
            setProcessing(false);
        });
    }

    const formatWalletAddress = (address) => {
        if (!address) return '';
        if (address.length <= 16) return address;
        return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
    };

    return (
        <section className="p-4">
            <div className="mb-4">
                <button 
                    onClick={() => back()} 
                    className="flex items-center gap-2 cursor-pointer py-2 px-4 rounded-3xl bg-gradient-to-t from-primary-light to-primary-dark shadow-md text-slate-100 font-semibold hover:shadow-lg transition-all duration-200"
                >
                    <BiArrowBack className="h-6 w-6" /> Back
                </button>
            </div>

            <aside>
                <div className="grid grid-cols-1 md:grid-cols-5 max-w-4xl gap-4">
                    {/* User Profile Section */}
                    <section className="md:col-span-2 relative"> 
                        <div className="bg-white dark:bg-slate-700 dark:text-slate-200 rounded-md shadow-md overflow-hidden">
                            <div className="min-h-[150px] bg-cover rounded-t-md relative" style={{backgroundImage: `url(${coverImage})`}}>
                                <div className="absolute inset-0 bg-black/20 dark:bg-black/30"></div>
                            </div>
                            
                            { user && (
                                <div className="relative"> 
                                    <div className="flex justify-center -mt-16 z-10"> 
                                        <img 
                                            src={(user.photo && user.photo != 'default.png') ? user.photo : defaultAvatar} 
                                            alt="User profile" 
                                            className="h-32 w-32 rounded-full border-4 border-white dark:border-slate-700 bg-white dark:bg-slate-600 object-cover shadow-md"
                                        />
                                    </div>
                                    
                                    <section className="px-4  pb-3 text-center"> 
                                        <h1 className="text-xl font-bold dark:text-white">
                                            {`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Unknown'}
                                        </h1>
                                        <p className="text-sm font-semibold text-primary dark:text-primary-light">
                                            {user.email}
                                        </p>
                                        <p className="text-sm capitalize mt-1">
                                            Status: 
                                            <span className={`ml-2 font-bold ${
                                                user.status == 'pending' ? 'text-orange-500' : 
                                                user.status == 'active' ? 'text-green-500' : 
                                                'text-red-500'
                                            }`}>
                                                {user.status}
                                            </span>
                                        </p>

                                        <h2 className='mt-6 text-lg font-semibold dark:text-gray-200'>Payment Channels</h2>
                                        
                                        {/* Wallet Addresses Table - Improved responsiveness */}
                                        <div className="mt-3 overflow-x-auto">
                                            <table className='w-full min-w-max'>
                                                <thead className='bg-slate-50 dark:bg-slate-600'>
                                                    <tr>
                                                        <th className="py-2 px-3 text-sm text-left dark:text-gray-200">Network</th>
                                                        <th className="py-2 px-3 text-sm text-left dark:text-gray-200">Wallet Address</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
                                                    {user?.bankAccounts?.length === 0 ? (
                                                        <tr className="bg-white dark:bg-slate-700">
                                                            <td className="py-3 px-4 text-center text-sm dark:text-gray-300" colSpan="2">
                                                                No payment channels available
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        user?.bankAccounts?.map((account, index) => (
                                                            <tr key={index} className="bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors">
                                                                <td className="py-2 px-3 text-sm dark:text-gray-300 whitespace-nowrap">
                                                                    {account.network || 'N/A'}
                                                                </td>
                                                                <td className="py-2 px-3 text-sm dark:text-gray-300">
                                                                    <div className="flex items-center">
                                                                        <span className="hidden md:inline break-all font-mono">
                                                                            {account.walletAddress}
                                                                        </span>
                                                                        <span className="md:hidden font-mono">
                                                                            {formatWalletAddress(account.walletAddress)}
                                                                        </span>
                                                                        <button 
                                                                            className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                                                            onClick={() => {
                                                                                navigator.clipboard.writeText(account.walletAddress);
                                                                                alert('Wallet address copied!');
                                                                            }}
                                                                            title="Copy to clipboard"
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Wallet Balances */}
                                        <div className="grid grid-cols-3 mt-6 border-t border-b border-gray-200 dark:border-slate-600 py-3 divide-x divide-gray-200 dark:divide-slate-600">
                                            <aside className="px-2">
                                                <h6 className="text-xs text-gray-500 dark:text-gray-400">Balance</h6>
                                                <p className="font-semibold dark:text-white">
                                                    ${user?.wallet?.balance?.toLocaleString() || '0.00'}
                                                </p>
                                            </aside>
                                            <aside className="px-2">
                                                <h6 className="text-xs text-gray-500 dark:text-gray-400">Profit</h6>
                                                <p className="font-semibold dark:text-white">
                                                    ${user?.wallet?.profit?.toLocaleString() || '0.00'}
                                                </p>
                                            </aside>
                                            <aside className="px-2">
                                                <h6 className="text-xs text-gray-500 dark:text-gray-400">Referral</h6>
                                                <p className="font-semibold dark:text-white">
                                                    ${user?.wallet?.referralBalance?.toLocaleString() || '0.00'}
                                                </p>
                                            </aside>
                                        </div>
                                    </section>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Fund Account Form Section */}
                    <section className="md:col-span-3">
                        <div className="bg-white dark:bg-slate-700 dark:text-slate-200 rounded-md shadow-md py-5 px-6">
                            <h2 className="text-xl font-bold mb-4 dark:text-white">Fund User Account</h2>
                            
                            <form onSubmit={submit}>
                                <div className="mb-5">
                                    <SelectField
                                        options={['balance', 'profit', 'referralBalance']}
                                        label={'Choose Wallet to fund'}
                                        name={'wallet_type'}
                                        classNames="dark:bg-slate-600 dark:border-slate-500"
                                    />
                                </div>
                                <div className="mb-5">
                                    <InputField 
                                        name={'amount'}
                                        type='number'
                                        placeholder={'Enter amount'}
                                        label={'Amount'}
                                        classNames="dark:bg-slate-600 dark:border-slate-500"
                                    />
                                </div>
                               
                                {message && (
                                    <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                                        {message}
                                    </p>
                                )}
                                
                                <div className='text-left'>
                                    <button 
                                        disabled={processing} 
                                        className='inline-flex gap-2 justify-center items-center bg-primary-light hover:bg-primary-dark cursor-pointer rounded-md font-semibold px-6 py-3 transition-all duration-200 text-white shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed'
                                    >
                                        {processing ? (
                                            <>
                                                <LoadingIndicator className="w-5 h-5" /> Funding...
                                            </>
                                        ) : (
                                            <>
                                                <AiOutlineTransaction className="w-5 h-5" /> Proceed with Funding
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            </aside>
        </section>
    )
}

export default FundAccount;