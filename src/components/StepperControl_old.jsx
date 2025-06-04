import LoadingIndicator  from './common/LoadingIndicator';
import BackButton from './common/BackButton';
import NextButton from './common/NextButton';
import SubmitButton from './common/SubmitButton';
import { FaUserPlus } from 'react-icons/fa6';
const StepperControl = ({ handleClick, steps, currentStep, handleSubmit, processing }) => {


    return (
        <div className="container flex justify-between p-4 mt-4 mb-8">
            {currentStep !== 4 && (
                <>
                    {/* Back Button */}
                    <button
                        onClick={() => handleClick()}
                        className={`border border-primary-light transition-all duration-100 hover:bg-primary-light hover:text-white rounded-md px-5 py-2 ${currentStep === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                        Previous
                    </button>

                    {/* Next Button (Hidden on step 3) */}
                    {currentStep !== 3 && (
                        <button
                            onClick={() => handleClick("next")}
                            className="border border-primary-light cursor-pointer transition-all duration-100 bg-primary-dark hover:bg-primary-light text-white rounded-md px-5 py-2"
                        >
                            {currentStep === steps.length - 1 ? "Confirm" : "Next"}
                        </button>
                    )}

                    {/* Submit Button (Only visible on step 3) */}
                    This submit button should be disable or made not clickable when processing
                    {currentStep === 3 && (
                        <button 
                            type="submit" 
                            className="border border-primary-light cursor-pointer transition-all duration-100 bg-primary-dark hover:bg-primary-light text-white rounded-md px-5 py-2"
                            onClick={handleSubmit}
                        >
                            {processing ? <LoadingIndicator size={5} />  : <FaUserPlus className="w-6 h-6"  /> }
                                    Create Account
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default StepperControl;
