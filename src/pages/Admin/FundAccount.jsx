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
        await axios.patch(`api/v1/users/${user._id}/wallets`, form)
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

    return (
        <section>
            <div className="mb-4">
                <button onClick={() => back()} className="flex items-center gap-2 cursor-pointer py-2 px-4 rounded-3xl bg-gradient-to-t from-primary-light to-primary-dark shadow-md text-slate-100 font-semibold">
                    <BiArrowBack className="h-6 w-6" /> Back
                </button>
            </div>

            {/*  */}
            <aside>
                <div className="grid grid-cols-1 md:grid-cols-5 max-w-4xl gap-4">
                    <section className="md:col-span-2">
                        <div className="bg-white dark:bg-slate-700 dark:text-slate-200 rounded-md">
                            <div className="min-h-[150px] bg-cover rounded-t-md" style={{backgroundImage: `url(${coverImage})`}}>

                            </div>
                            { user && (<>
                                <div>
                                    <span className="mx-auto h-32 w-32 block -mt-20">
                                        <img src={(user.photo && user.photo != 'default.png') ? user.photo : defaultAvatar} alt=" " className={`bg-slate-300 h-32 w-32 rounded-full overflow-hidden`} />
                                    </span>
                                    <section className="px-4 py-3 text-center">
                                        <h1 className="text-xl font-bold">
                                            { user.name }
                                        </h1>
                                        <p className="text-sm font-semibold text-primary">
                                            { user.email }
                                        </p>
                                        <p className="text-sm capitalize">
                                            Status: 
                                            <span className={`ml-2 font-bold ${(user.status == 'pending') ? 'text-orange-500' : (user.status == 'active') ? 'text-green-500' : 'text-red-500'}`}>
                                                {user.status}
                                            </span>
                                        </p>

                                        <h2 className='mt-6'>Payment Channels/Bank Accounts</h2>
                                       <table className='w-full'>
                                        <thead className='bg-slate-50'>
                                            <th  className="py-1 px-3 text-sm">Name</th>
                                            <th  className="py-1 px-3 text-sm">Number</th>
                                            <th  className="py-1 px-3 text-sm">Bank</th>
                                            <th  className="py-1 px-3 text-sm">Type</th>

                                        </thead>
                                        <tbody>
                                            {
                                                (user?.bankAccounts?.length==0)&&
                                                <tr className="even:bg-teal-50">
                                                    <td className="whitespace-nowrap border py-1 px-4" colSpan="4">
                                                    <div className="flex items-center justify-center gap-5 w-full">
                                                        <span>No record available</span>
                                                    </div>
                                                    </td>
                                                </tr>
                                            }
                                            {
                                                
                                                user?.bankAccounts?.map((account)=>(
                                                    <tr className='border-b'>
                                                        <td className='text-sm'>{account.accountName}</td>
                                                        <td className='text-sm'>{account.accountNumber}</td>
                                                        <td className='text-sm'>{account.bankName}</td>
                                                        <td className='text-sm'>{account.accountType}</td>
                                                    </tr>
                                                ))
                                                
                                            }
                                        </tbody>
                                       </table>
  

                                        <div className="grid grid-cols-3 mt-6 border-y pb-1 pt-2 divide-x">
                                            {/* Action */}
                                            <aside>
                                                <h6>Balance</h6>
                                                ${user?.wallet[0]?.balance.toLocaleString()}
                                            </aside>
                                            {/* Fund */}
                                            <aside>
                                                <h6>Profit</h6>
                                                ${user?.wallet[0]?.profit.toLocaleString()}
                                            </aside>
                                            {/* Delete Account */}
                                            <aside>
                                                <h6>Referral Bal.</h6>
                                                ${user?.wallet[0]?.referralBalance.toLocaleString()}
                                            </aside>
                                        </div>
                                    </section>
                                </div>
                            </>)}
                        </div>
                    </section>
                    <section className="md:col-span-3">
                        <div className="bg-white dark:bg-slate-700 dark:text-slate-200 rounded-md py-3 px-4">
                            <form className='' method='post' onSubmit={submit}>
                               
                                <div className="mb-5 relative">
                                    <SelectField
                                        options={['balance',  'profit', 'referralBalance']}
                                        label={'Choose Wallet to fund'}
                                        name={'wallet_type'}
                                    />
                                   
                                </div>
                                <div className="mb-5 relative">
                                    <InputField 
                                        name={'amount'}
                                        type='number'
                                        placeholder={'Enter Enter amount'}
                                        label={'Amount'}
                                    />
                                </div>
                               
                                {message !== '' && <p className={'text-sm text-red-600 mb-2'}>
                                    {message}
                                </p>}
                                <div className='text-left'>
                                    <button disabled={processing} className='inline-flex gap-2 justify-center items-center bg-primary-light hover:bg-primary-dark cursor-pointer rounded-md font-semibold px-4 py-3 transition-all duration-300 ease-in  text-white'>
                                        {processing ? <>
                                                <LoadingIndicator className="w-6 h-6"  /> Funding...
                                            </>
                                            : 
                                            <>
                                                <AiOutlineTransaction className="w-6 h-6"  /> Proceed with Funding
                                            </> 
                                        }
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

export default FundAccount