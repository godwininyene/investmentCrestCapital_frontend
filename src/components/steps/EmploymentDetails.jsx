import { useContext, useEffect , useState} from "react";
import { StepperContext } from "../contexts/StepperContext";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import axios from "../../lib/axios";
const EmploymentDetails = ()=>{
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
             <h1 className="mb-4 text-center font-semibold">Employment and Tax Information</h1>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-2 mb-4'>
                <SelectField 
                    name='employmentStatus'
                    label="Employment Status"
                    value={formData['employmentStatus' || " "]}
                    onChange={handleChange}
                    options={['Employed', 'Self-Employed', 'Pensioner', 'Student', 'Unemployed']}
                    error={errors.employmentStatus}
                />
                    
                <SelectField 
                    name='taxResidence'
                    label="Tax Residence (optional)"
                    value={formData['taxResidence' || " "]}
                    onChange={handleChange}
                    options={countries}
                    isRequired={false}
                    error={errors.taxResidence}
                />
            </div>
            <InputField
                type="text"
                name={'taxNumber'}
                label="Tax Identification Number (Optional)"
                placeholder={'Tax Identification Number'}
                value={formData['taxNumber' || " "]}
                onChange={handleChange}
                isRequired={false}
                error={errors.taxNumber} 
            />
        </>
    )
}

export default EmploymentDetails;