import InputField from "../../components/common/InputField"
import Label from "../../components/common/Label"
import SubmitButton from "../../components/common/SubmitButton"
import { IoLogInOutline } from 'react-icons/io5';
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import axios from '../../lib/axios';
import { useState } from "react";
export default function Login() {
    const[searchParams, setSearchParams] = useSearchParams(); 
    let pathname = searchParams.get("redirectTo")||null
    const message = searchParams.get("message")|| null;
    const[processing, setProcessing] = useState(false);

    const [formData, setFormData] = useState({
        email:'',
        password: '',
    });


   const[error, setError] = useState();
    const handleChange = e =>{
        const{name, value} = e.target;
        setFormData({...formData, [name]: value})
    }

    const navigate = useNavigate();

    const submit = async(e) => {
        e.preventDefault();
        let goTo;
        setProcessing(true)
        try {
            const response = await axios.post('api/v1/users/login', formData);
            if(response.data.status=='success'){
                localStorage.setItem("user", JSON.stringify(response.data.data.user));
                if(response.data.data.user.role === 'user'){
                    goTo = pathname || '/manage/investor/dashboard' 
                }
                if(response.data.data.user.role === 'admin'){
                    goTo = pathname || '/manage/admin/dashboard'
                    console.log('True');
                }
                navigate(goTo)
            }
            
        } catch (err) {
            // Extract errors from the backend response
            if (err.response && err.response.data.message) {
                setError(err.response.data.message);
                console.log(err.response.data.message);
            } else {
                setError('No response received from the server.');
                console.log('Unexpected Error:', err);
            }
        } finally {
            setProcessing(false);
        }
    
    };

    return(
        <div className="mx-auto max-w-[450px] bg-white shadow-[0_2.5rem_8rem_2rem_rgba(0,0,0,0.06)] p-[30px] rounded-[5px]">
            <span className="inline-block mb-3  text-center text-xs lg:text-base text-neutral-400">Please enter your email and password to continue</span>
             {error && <div className="mb-2 font-medium text-sm text-red-600">{error}</div>}
             {message && <h2 className="text-[#cc0000]">{message}</h2>}
            <form onSubmit={submit}>
                
              
                <div className="mb-4">
                    <InputField
                        type="email"
                        name={'email'}
                        label="Email"
                        placeholder={'Enter your email'}
                        value={formData['email' || " "]}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-4">
                    <InputField
                        name={'password'}
                        label="Password"
                        type="password"
                        placeholder={'Enter your password'}
                        value={formData['password' || " "]}
                        onChange={handleChange}
                    />
                </div>
                <div className='flex justify-between w-full mb-4'>
                    <div className="mb-3">
                        <label className="flex items-center">
                            <input type='checkbox'
                                name="remember"
                            />
                            <span className="ml-2 text-sm text-slate-600 dark:text-slate-300">Remember me</span>
                        </label>
                    </div>

                    <p className='inline-block text-sm text-right'>
                        <Link to='/users/forgotPassword' className='inline-block ml-1 text-blue-600 dark:text-blue-400' >Forgot your password?</Link>
                    </p>
                </div>
                <div className="flex justify-end">
                    <SubmitButton
                        processing={processing}
                        disabled={processing}
                        Icon={IoLogInOutline}
                        label={' Login'}
                    />
                </div>

                <div className='mt-5 text-center'>
                    <p className='inline-block pl-4 text-sm'>
                        Don't have Account?
                        <Link to="/users/register" className='inline-block ml-1 text-blue-600 dark:text-blue-400' >Create Account</Link>
                    </p>
                </div>
            </form>
        </div>
    )
}