import { useState, useRef } from 'react';
import { StepperContext } from '../../components/contexts/StepperContext';
import Stepper from '../../components/Stepper';
import StepperControl from '../../components/StepperControl';
import PersonalDetails from '../../components/steps/PersonalDetails';
import { toast } from 'react-toastify';
import Final from '../../components/steps/Final';
import VerifyEmail from '../../components/steps/VerifyEmail';
import axios from '../../lib/axios';
import { Link } from 'react-router-dom';

export default function Register() {
    const [currentStep, setCurrentStep] = useState(1);
    const formRef = useRef(null);
    const [processing, setProcessing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        passwordConfirm: ''
    });

    const [errors, setErrors] = useState({});

    const steps = [
        "Personal",
        "Verify Email",
        "Final"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        
        try {
            const response = await axios.post('api/v1/users/signup', formData);
            
            if (response.data.status === 'success') {
                setCurrentStep(2);
                toast.success("Account created successfully! Please verify your email.");
            }
        } catch (err) {
            if (err.response?.data?.errors) {
                // Handle field-specific errors
                setErrors(err.response.data.errors);
                
                // Show general error message if available
                if (err.response.data.message) {
                    toast.error(err.response.data.message);
                }
            } else {
                // Handle network errors or other unexpected errors
                const errorMessage = err.response?.data?.message || 
                                  err.message || 
                                  'An unexpected error occurred. Please try again.';
                toast.error(errorMessage);
                console.error('Registration error:', err);
            }
        } finally {
            setProcessing(false);
        }
    };

    const displayStep = (step) => {
        switch (step) {
            case 1: 
                return <PersonalDetails />;
            case 2:
                return <VerifyEmail />;
            case 3:
                return <Final />;
            default:
                return null;
        }
    };

    return (
        <div className='bg-white dark:bg-slate-800 max-w-3xl mx-auto lg:p-5 p-3 rounded-lg shadow-md'>
            {/* Stepper */}
            <div className='container horizontal'>
                <div className='flex flex-col items-center mb-5'>
                    <h3 className='font-bold text-2xl'>Create Your Account</h3>
                    <p className='text-center lg:text-left'>Enter your details to create account and continue</p>
                </div>
                <Stepper steps={steps} currentStep={currentStep} />

                {/* Display Components */}
                <div className='my-10 p-4'>
                    <StepperContext.Provider value={{
                        formData, 
                        setFormData,
                        errors,
                        setCurrentStep,
                    }}>
                        <form ref={formRef} onSubmit={handleSubmit}>
                            {displayStep(currentStep)}
                        </form>
                    </StepperContext.Provider>
                </div>
            </div>

            {/* Navigation Controls */}
            {currentStep !== steps.length &&
                <StepperControl
                    
                    currentStep={currentStep} 
                    steps={steps}
                    handleSubmit={handleSubmit}
                    processing={processing}
                />
            }

            <div className='mt-5 text-center'>
                <p className='inline-block pl-4 text-sm'>
                    Already have Account?
                    <Link to="/users/login" className='inline-block ml-1 text-blue-600'>Click here to login</Link>
                </p>
            </div>
        </div>
    );
}