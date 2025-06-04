import { useState, useRef } from 'react';

export default function Register() {
    const [step, setStep] = useState(1);
    const formRef = useRef(null);

    const nextStep = () => {
        if (formRef.current.checkValidity()) {
            setStep(step + 1);
        } else {
            formRef.current.reportValidity();
        }
    };

    const prevStep = () => setStep(step - 1);

    const [formData, setFormData] = useState({
        firstname: '',
        lastname:'',
        dob:'',
        email:'',
        phone:'',
        email: '',
        password: '',
        passwordConfirm:'',
        employmentStatus:'',
        taxResident:'',
        taxNumber:'',
        firstAddress:'',
        secondAddress:'',
        townCity:'',
        stateProvince:'',
        postalCode:''
      });
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });

        console.log(formData)
      };

    const handleSubmit = async e=>{
        e.preventDefault();
    }

    const stepTexts=[
        'Complete your personal details',
        'Complete your employment and tax information details',
        'Complete your address details',
        'Terms of use'
    ]

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                       
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-2 mb-4'>

                            <input
                                type='text' 
                                required 
                                name='firstname'
                                placeholder='First Name'
                                value={formData.name}
                                onChange={handleInputChange}
                                className='peer w-full py-3 px-5 rounded-md  bg-slate-100 dark:text-slate-700  transition-all duration-300 border-0 border-b-[3px] border-b-transparent focus:border-b-primary focus:outline-0 focus:ring-0 focus:bg-white focus:shadow-lg'
                            />
                            <input
                                type='text' 
                                required 
                                name='lastname'
                                placeholder='Last Name'
                                value={formData.name}
                                onChange={handleInputChange}
                                className='peer w-full py-3 px-5 rounded-md  bg-slate-100 dark:text-slate-700  transition-all duration-300 border-0 border-b-[3px] border-b-transparent focus:border-b-primary focus:outline-0 focus:ring-0 focus:bg-white focus:shadow-lg'
                            />

                        </div>

                        <div className='mb-4'>
                            <input
                                type='date' 
                                required 
                                name='dob'
                                placeholder='Date of Birth'
                                value={formData.name}
                                onChange={handleInputChange}
                                className='peer w-full py-3 px-5 rounded-md  bg-slate-100 dark:text-slate-700  transition-all duration-300 border-0 border-b-[3px] border-b-transparent focus:border-b-primary focus:outline-0 focus:ring-0 focus:bg-white focus:shadow-lg'
                            />
                        </div>

                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-2 mb-4'>
                            <input
                                type='email' 
                                required 
                                name='email'
                                placeholder='Email address'
                                value={formData.name}
                                onChange={handleInputChange}
                                className='peer w-full py-3 px-5 rounded-md  bg-slate-100 dark:text-slate-700  transition-all duration-300 border-0 border-b-[3px] border-b-transparent focus:border-b-primary focus:outline-0 focus:ring-0 focus:bg-white focus:shadow-lg'
                            />
                            <input
                                type='tel' 
                                required 
                                name='phone'
                                placeholder='Phone Number'
                                value={formData.name}
                                onChange={handleInputChange}
                                className='peer w-full py-3 px-5 rounded-md  bg-slate-100 dark:text-slate-700  transition-all duration-300 border-0 border-b-[3px] border-b-transparent focus:border-b-primary focus:outline-0 focus:ring-0 focus:bg-white focus:shadow-lg'
                            />
                        </div>

                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-2 mb-4'>
                            <input
                                type='password' 
                                required 
                                name='password'
                                placeholder='Password'
                                value={formData.name}
                                onChange={handleInputChange}
                                className='peer w-full py-3 px-5 rounded-md  bg-slate-100 dark:text-slate-700  transition-all duration-300 border-0 border-b-[3px] border-b-transparent focus:border-b-primary focus:outline-0 focus:ring-0 focus:bg-white focus:shadow-lg'
                            />
                            <input
                                type='password' 
                                required 
                                name='passwordConfirm'
                                placeholder='Confirm Password'
                                value={formData.name}
                                onChange={handleInputChange}
                                className='peer w-full py-3 px-5 rounded-md  bg-slate-100 dark:text-slate-700  transition-all duration-300 border-0 border-b-[3px] border-b-transparent focus:border-b-primary focus:outline-0 focus:ring-0 focus:bg-white focus:shadow-lg'
                            />

                        </div>
            
                       
                        <div className='flex justify-end'>
                            <button onClick={nextStep} className='border border-primary-light cursor-pointer transition-all duration-100 hover:bg-primary-light hover:text-white rounded-md px-5 py-2'>Next</button>
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-2 mb-4'>

                            <select
                                type='text' 
                                required 
                                name='employmentStatus'
                                placeholder='Employment Status'
                                value={formData.name}
                                onChange={handleInputChange}
                                className='peer w-full py-3 px-5 rounded-md  bg-slate-100 dark:text-slate-700  transition-all duration-300 border-0 border-b-[3px] border-b-transparent focus:border-b-primary focus:outline-0 focus:ring-0 focus:bg-white focus:shadow-lg'
                            >
                                <option>Employed</option> 
                                <option>Self-Employed</option>
                                <option>Pensioner</option>
                                <option>Student</option>
                                <option>Unemployed</option>
                            </select>

                            <select
                                type='text' 
                                name='taxResident'
                                placeholder='Employment Status'
                                value={formData.name}
                                onChange={handleInputChange}
                                className='peer w-full py-3 px-5 rounded-md  bg-slate-100 dark:text-slate-700  transition-all duration-300 border-0 border-b-[3px] border-b-transparent focus:border-b-primary focus:outline-0 focus:ring-0 focus:bg-white focus:shadow-lg'
                            >
                                <option>Employed</option>
                                <option>Self-Employed</option>
                                <option>Pensioner</option>
                                <option>Student</option>
                                <option>Unemployed</option>
                            </select>
                        </div>

                        <div className='mb-4'>
                            <input
                                type='text' 
                                name='taxNumber'
                                placeholder='Tax Number'
                                value={formData.name}
                                onChange={handleInputChange}
                                className='peer w-full py-3 px-5 rounded-md  bg-slate-100 dark:text-slate-700  transition-all duration-300 border-0 border-b-[3px] border-b-transparent focus:border-b-primary focus:outline-0 focus:ring-0 focus:bg-white focus:shadow-lg'
                            />
                        </div>
                      
                        
                        <div className='flex justify-end gap-x-2'>
                            <button onClick={prevStep} className='border border-primary-light cursor-pointer transition-all duration-100 hover:bg-primary-light hover:text-white rounded-md px-5 py-2'>Previous</button>
                            <button onClick={nextStep} className='border border-primary-light cursor-pointer transition-all duration-100 bg-primary-dark hover:bg-primary-light text-white rounded-md px-5 py-2'>Next</button>
                        </div>
                    </>
                );
            case 3:
                return (
                    <>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-2 mb-4'>

                            <input
                                type='text' 
                                required 
                                name='firstAddress'
                                placeholder='First line of address'
                                value={formData.name}
                                onChange={handleInputChange}
                                className='peer w-full py-3 px-5 rounded-md  bg-slate-100 dark:text-slate-700  transition-all duration-300 border-0 border-b-[3px] border-b-transparent focus:border-b-primary focus:outline-0 focus:ring-0 focus:bg-white focus:shadow-lg'
                            />
                            <input
                                type='text' 
                                required 
                                name='secondAddress'
                                placeholder='Second line of address'
                                value={formData.name}
                                onChange={handleInputChange}
                                className='peer w-full py-3 px-5 rounded-md  bg-slate-100 dark:text-slate-700  transition-all duration-300 border-0 border-b-[3px] border-b-transparent focus:border-b-primary focus:outline-0 focus:ring-0 focus:bg-white focus:shadow-lg'
                            />

                        </div>

                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-2 mb-4'>
                            <input
                                type='text' 
                                name='townCity'
                                placeholder='Town/City'
                                value={formData.name}
                                onChange={handleInputChange}
                                className='peer w-full py-3 px-5 rounded-md  bg-slate-100 dark:text-slate-700  transition-all duration-300 border-0 border-b-[3px] border-b-transparent focus:border-b-primary focus:outline-0 focus:ring-0 focus:bg-white focus:shadow-lg'
                            />
                            <input
                                type='text' 
                                required 
                                name='stateProvince'
                                placeholder='State/Province'
                                value={formData.name}
                                onChange={handleInputChange}
                                className='peer w-full py-3 px-5 rounded-md  bg-slate-100 dark:text-slate-700  transition-all duration-300 border-0 border-b-[3px] border-b-transparent focus:border-b-primary focus:outline-0 focus:ring-0 focus:bg-white focus:shadow-lg'
                            />

                        </div>

                        <div className='mb-4'>
                            <input
                                type='text' 
                                name='postalCode'
                                placeholder='Postal/ZIP Code'
                                value={formData.name}
                                onChange={handleInputChange}
                                className='peer w-full py-3 px-5 rounded-md  bg-slate-100 dark:text-slate-700  transition-all duration-300 border-0 border-b-[3px] border-b-transparent focus:border-b-primary focus:outline-0 focus:ring-0 focus:bg-white focus:shadow-lg'
                            />
                        </div>

                        <div className='flex justify-end gap-x-2'>
                            <button onClick={prevStep} className='border border-primary-light cursor-pointer transition-all duration-100 hover:bg-primary-light hover:text-white rounded-md px-5 py-2'>Previous</button>
                            <button onClick={nextStep} className='border border-primary-light cursor-pointer transition-all duration-100 bg-primary-dark hover:bg-primary-light text-white rounded-md px-5 py-2'>Next</button>
                        </div>
                    </>
                );
            case 4:
                return (
                    <>
                        <h3 className='font-semibold text-sm mb-1'>Jurisdiction and choice of Law</h3>
                        <p className='mb-6'>
                            Your account will be opened with TradeInvest, and will be subject
                            to the Laws of Saint
                        </p>

                        <h3 className='font-semibold text-sm mb-1'>Risk Warning</h3>
                        <p className='mb-6'>
                            Your account will be opened with TradeInvest, and will be subject
                            to the Laws of Saint
                        </p>
                        <div className='flex justify-end gap-x-2'>
                            <button onClick={prevStep} className='border border-primary-light cursor-pointer transition-all duration-100 hover:bg-primary-light hover:text-white rounded-md px-5 py-2'>Previous</button>
                            <button type='submit'  className='border border-primary-light cursor-pointer transition-all duration-100 bg-primary-dark hover:bg-primary-light text-white rounded-md px-5 py-2'>Submit</button>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <>
          
           
            <div className='bg-white dark:bg-slate-800 max-w-3xl mx-auto p-8 rounded-lg shadow-md'>
                <div className='mb-6 flex items-center justify-center ml-20'>
                    
                    {[1, 2, 3, 4].map(num => (
                        <div key={num} className='flex items-center flex-1'>
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full 
                                ${step === num ? 'bg-blue-500 text-white' : step > num ? 'bg-green-500 text-white' : 'bg-gray-200'}
                                ${step > num ? 'border-2 border-green-500' : ''}`}>
                                {num}
                            </div>
                            
                            {num !== 4 && (
                                <div className={`flex-1 w-8 h-1 ${step > num ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            )}
                            
                        </div>
                        
                    ))}
                </div>
                <form ref={formRef} onSubmit={handleSubmit}>
                    {renderStep()}
                </form>
            </div>
        </>
    );
}
