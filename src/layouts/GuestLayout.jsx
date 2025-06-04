import { Outlet, Link } from "react-router-dom";
import logo from './../assets/images/logo.png'
export default function GuestLayout() {
    return (
        <div className="min-h-screen flex py-10 justify-center bg-slate-100 dark:bg-slate-900">
              
            <section className="w-full px-5 mx-auto">
                <div className='text-center mb-3 flex justify-center'>
                    <Link to='/' className="flex items-center">
                        <img src={logo} alt="logo" className='h-16 mb-2 inline-block' />
                        <h2 className='text-black dark:text-white font-bold text-xl ml-1 inline-block'>InvestmentCrestCapital</h2>
                    </Link>
                  
                </div>
                

                <Outlet />
            </section>
        </div>
    );
}
