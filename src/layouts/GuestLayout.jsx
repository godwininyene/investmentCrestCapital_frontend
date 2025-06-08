import { Outlet, Link } from "react-router-dom";
import logo from './../assets/images/logo.png'
export default function GuestLayout() {
    return (
        <div className="min-h-screen flex py-10 justify-center bg-slate-100 dark:bg-slate-900">
              
            <section className="w-full px-5 mx-auto">
                <div className='text-center mb-3 flex justify-center'>
                    {/* <Link to='/' className="flex items-center">
                        <img src={logo} alt="logo" className='h-16 mb-2 inline-block' />
                        <h2 className='text-black dark:text-white font-bold text-xl ml-1 inline-block'>InvestmentCrestCapital</h2>
                    </Link> */}

                     <Link to="/" className='mr-4 flex items-center'>
                        <div className='h-12 w-12 text-white flex items-center justify-center rounded-full bg-primary-dark'>ICC</div>
                        {/* <img src={logo} alt="" className="h-10"/> */}
                        <h2 className='text-slate-900 dark:text-white font-bold text-sm ml-1'>InvestmentCrestCapital</h2>
                    </Link>
                  
                </div>

                
                

                <Outlet />
            </section>
        </div>
    );
}
