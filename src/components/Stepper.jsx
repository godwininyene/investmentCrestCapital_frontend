import { useEffect, useState, useRef } from "react";

const Stepper = ({steps, currentStep})=>{
    const[newStep, setNewStep] = useState([]);

    const stepRef = useRef()
    const updateStep = (stepNumber, steps) =>{
       
        const newSteps = [...steps];
       
        let count = 0;
        while(count < steps.length){
            //Current Step
            if(count === stepNumber){
                newSteps[count]= {
                    ...newSteps[count],
                    highlighted:true,
                    selected:true,
                    completed:true
                }
                count++;
            }
            //Step Completed
            else if(count < stepNumber){
                newSteps[count]= {
                    ...newSteps[count],
                    highlighted:false,
                    selected:true,
                    completed:true
                }
                count++;
            }
            //Step Pending
            else{
                newSteps[count]= {
                    ...newSteps[count],
                    highlighted:false,
                    selected:false,
                    completed:false
                }
                count++;
            }
        }

        return newSteps;
    }
    useEffect(()=>{
        //Create Object
        const stepsState = steps.map((step, index)=>(
            Object.assign(
                {
                    description: step,
                    completed:false,
                    highlighted: index === 0? true: false,
                    selected: index === 0 ? true : false
                }
            )
        ))
        stepRef.current = stepsState;
        const current = updateStep(currentStep - 1,  stepRef.current);
        setNewStep(current)
    }, [steps, currentStep])
    

    const displaySteps = newStep.map((step, index) => {
        return (
            <div className={`${index !== newStep.length - 1 ? 'w-full flex items-center' : 'flex items-center'}`} key={index}>
                <div className="relative flex flex-col items-center text-teal-600">
                    <div 
                        className={`rounded-full flex-shrink-0 transition duration-500 ease-in-out border-2 text-xs lg:text-base border-gray-300 h-6 lg:h-12 w-6 lg:w-12 flex items-center justify-center py-2 lg:py-3 ${step.selected ? 'bg-primary-light text-white font-bold border border-primary-light' : ''}`}
                    >
                        {/* Display number */}
                       {step.completed ? (
                        <span className="text-white font-bold text-xs lg:text-xl">&#10003;</span>
                       ) : (index + 1)}
                    </div>
                    <div className={`absolute top-0 text-center mt-8 lg:mt-16 w-32 text-[9px] lg:text-xs font-medium uppercase ${step.highlighted ? "text-gray-900" : "text-gray-400"}`}>
                        {/* Display description */}
                       {step.description}
                    </div>
                </div>
                
                <div className={`flex-auto border-t-2 transition duration-500 ease-in-out ${step.completed ? "border-primary-light" : "border-gray-300"}`}>
                    {/* Display line */}
                </div>
            </div>
        );
    });
    
    return(
        <div className="mx-4 p-4 flex justify-between items-center">
           {displaySteps}
        </div>
    )
}

export default Stepper;