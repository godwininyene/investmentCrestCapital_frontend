import { useContext, useEffect, useState } from "react";
import { StepperContext } from "../contexts/StepperContext";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import axios from "../../lib/axios";


const Address = ()=>{
    const{formData, setFormData, errors} = useContext(StepperContext);
    const handleChange = e =>{
        const{name, value} = e.target;
        setFormData({...formData, [name]: value})
    }

    const [countries, loadCountries] = useState([]);

 
    useEffect(() => {
        fetchCountries();
    },[])

    const fetchCountries = async () => {
        const res = await axios.get('api/v1/countries');
        loadCountries(res.data.data.countries)
    }
    return(
        <>
            <h1 className="mb-4 text-center font-semibold">Address Information</h1>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-2 mb-4 relative'>
                <SelectField 
                    name='country'
                    label="Country"
                    value={formData['country' || " "]}
                    onChange={handleChange}
                    options={countries}
                    error={errors.country}
                />

                <InputField
                    name={'firstAddress'}
                    placeholder={'First line of address'}
                    label="Address 1"
                    value={formData['firstAddress' || " "]}
                    onChange={handleChange}
                    error={errors.firstAddress}
                />


                {/* <InputField
                    name={'townCity'}
                    placeholder={'Town/City/Region'}
                    label="Town/City/Region"
                    value={formData['townCity' || " "]}
                    onChange={handleChange}
                    error={errors.townCity}
                /> */}
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-2 mb-4 relative'>
                {/* <InputField
                    name={'Address'}
                    placeholder={'First line of address'}
                    label="Address 1"
                    value={formData['firstAddress' || " "]}
                    onChange={handleChange}
                    error={errors.firstAddress}
                /> */}
                   
                {/* <InputField
                    name={'secondAddress'}
                    placeholder={'Second line of address'}
                    label="Address 2 (Optional)"
                    value={formData['secondAddress' || " "]}
                    onChange={handleChange}
                    isRequired={false}
                    error={errors.secondAddress}
                /> */}
            </div>
        </>
        
    )
}

export default Address;