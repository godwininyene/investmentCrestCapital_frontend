import { Link } from "react-router-dom";
const Final = ()=>{
    return(
        <div className="container md:mt-10">
            <div className="flex flex-col items-center">
                <div 
                    className={`rounded-full transition duration-500 ease-in-out h-12 w-12 flex items-center justify-center py-3 bg-green-600 text-white font-bold border border-green-600`}
                >
                    <span className="text-white font-bold text-xl">&#10003;</span>
                </div>
                <div className="mt-3 text-xl font-semibold uppercase text-green-500">
                    Congratulations!
                </div>
                <div className="text-lg font-semibold text-gray-500">
                    Your account has been created.
                </div>

                <a className="mt-10 inline-block" href="">
                    <Link to='/users/login' 
                        
                        className='border border-primary-light cursor-pointer transition-all duration-100 bg-primary-dark hover:bg-primary-light text-white rounded-md px-5 py-2'>
                        Close
                    </Link>
                </a>
            </div>
        </div>
    )
}

export default Final;