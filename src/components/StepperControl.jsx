import SubmitButton from './common/SubmitButton';
import BackButton from './common/BackButton';
import NextButton from './common/NextButton';

const StepperControl = ({ handleClick, steps, currentStep, handleSubmit, processing }) => {
    return (
        <div className="container flex justify-between p-4 mb-8">
            {/* Only show Create Account button on step 1 */}
            {currentStep === 1 && (
                <SubmitButton
                    onClick={handleSubmit}
                    processing={processing}
                    disabled={processing}
                    label="Create Account"
                />
            )}
            
            {/* No buttons shown for steps 2 and 3 */}
        </div>
    );
};

export default StepperControl;