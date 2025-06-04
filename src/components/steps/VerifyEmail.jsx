import { useState, useRef } from 'react';
import axios from "../../lib/axios";
import { useContext } from 'react';
import { StepperContext } from '../contexts/StepperContext';
import SubmitButton from '../common/SubmitButton';

const VerifyEmail = () => {
    const{setCurrentStep, formData} = useContext(StepperContext);
    const [code, setCode] = useState(['', '', '', '']);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRefs = useRef([]);

    const handleInputChange = (value, index) => {
        if (/^\d?$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            if (value && index < 3) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();

        if (/^\d{4}$/.test(pastedData)) {
            setCode(pastedData.split(''));
            pastedData.split('').forEach((digit, index) => {
                if (inputRefs.current[index]) {
                    inputRefs.current[index].value = digit;
                }
            });
            inputRefs.current[3].focus();
        }
    };

    const handleSubmit = async (e) => {
       console.log('Submitting');
        setError(null);
        setIsSubmitting(true);

        const verificationCode = code.join('');
        if (verificationCode.length !== 4) {
            setError('Please enter the complete code.');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post('api/v1/users/verify_email', {code:verificationCode});
            // If response is successful, handle success (e.g., redirect or show a message)
            if(response.data.status == 'success') setCurrentStep(3)
            setIsSubmitting(true);
    
        } catch (err) {
            // Extract errors from the backend response
             if (err.response && err.response.data.message) {
                console.log(err.response.data.message);
                setError(err.response.data.message);
                
            } else {
                console.log('Unexpected Error:', err);
                setError(err);
            }
           
        } finally {
            setIsSubmitting(false);
        }
    };

    const test = ()=>{
        console.log("Hello user")
    }
    return (
        <div className="bg-white p-6 mx-auto flex flex-col justify-center items-center">
            <p className="text-sm text-gray-600 mb-4 text-center">
                We’ve sent a four-digit verification code to <strong>{formData.email}</strong>
            </p>

            <div className="flex justify-center gap-4 mb-6">
                {code.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleInputChange(e.target.value, index)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        className="w-12 h-12 text-center border rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                ))}
            </div>
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            <div className='flex justify-center'>

                <SubmitButton
                    type='button'
                    onClick={handleSubmit}
                    processing={isSubmitting}
                    disabled={isSubmitting || code.some((d) => d === '')}
                    label={' Verify Code'}
                    Icon={''}
                />
            </div>

            <p className="text-sm text-center text-gray-600 mt-4">
                Didn't get an email? <span className="text-blue-500 cursor-pointer">Resend email</span>
            </p>
            <ul className="text-sm text-gray-600 mt-4 list-disc pl-5">
                <li>Make sure you’ve entered your email correctly.</li>
                <li>Check your spam folder.</li>
                <li>Make sure the email isn’t blocked by firewalls or filters.</li>
            </ul>
        </div>
    );
};

export default VerifyEmail;
