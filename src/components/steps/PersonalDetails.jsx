import { useContext } from "react";
import { StepperContext } from "../contexts/StepperContext";
import SelectField from "../common/SelectField";
import InputField from "../common/InputField";
const PersonalDetails = ()=>{
    const{formData, setFormData, errors} = useContext(StepperContext);
    const handleChange = e =>{
        const{name, value} = e.target;
        setFormData({...formData, [name]: value})
    }

    return(
        <>
            <h1 className="mb-4 text-center font-semibold">Personal Details</h1>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-2 mb-4 relative'>
                <InputField
                    name={'firstName'}
                    placeholder={'Enter your firstname'}
                    value={formData['firstName' || " "]}
                    onChange={handleChange}
                    label={'Firstname'}
                    error={errors.firstName}
                />
               <InputField
                    name={'lastName'}
                    placeholder={'Enter your lastname'}
                    value={formData['lastName' || " "]}
                    onChange={handleChange}
                    label={'lastname'}
                    error={errors.lastName}
                />
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-2 mb-4 relative'>
                <InputField
                    name={'phone'}
                    placeholder={'Enter your phone number'}
                    value={formData['phone' || " "]}
                    onChange={handleChange}
                    label={'Phone'}
                    error={errors.phone}
                />   
                <InputField
                    name={'email'}
                    placeholder={'Enter your email address'}
                    label={'Email'}
                    value={formData['email' || " "]}
                    onChange={handleChange}
                    error={errors.email}
                />
                  
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-2 mb-4 relative'>
                <InputField
                    type="password"
                    name={'password'}
                    placeholder={'Enter your password'}
                    label={'Password'}
                    value={formData['password' || " "]}
                    onChange={handleChange}
                    error={errors.password}
                /> 
               
                <InputField
                    type="password"
                    name={'passwordConfirm'}
                    placeholder={'Confirm your password'}
                    label={'Password Confirm'}
                    value={formData['passwordConfirm' || " "]}
                    onChange={handleChange}
                    error={errors.passwordConfirm}
                />
                   
            </div>
        </>
    )
}

export default PersonalDetails;