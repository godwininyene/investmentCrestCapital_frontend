import React from 'react';
import { Link } from 'react-router-dom';
import logo from './../assets/images/logo.png'
import {LuMenu} from 'react-icons/lu';
import {MdClose} from 'react-icons/md';
import GoogleTranslate from './GoogleTranslate';

const Header = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isFixedClass, setIsFixedClass] = React.useState(false);

    const toggleMenu = () => setIsOpen(prev => !prev);

    const addFixedClass = () => window.pageYOffset > 200 ? setIsFixedClass(true) : setIsFixedClass(false);

    React.useEffect(() => {
        window.addEventListener('scroll', addFixedClass);
        return () => window.removeEventListener('scroll', addFixedClass);
    }, []);

    const fixedHeader = {
        backgroundColor: '#1f156e',
        borderBottom: "2px solid #0f419a",
        boxShadow: "0 10px 5px rgba(15, 16, 24, 0.1)",
        zIndex: 9999
    };
   
    return(
        <div className={`header fixed w-full border-b-[1px] border-white/20 z-50 left-0 top-0 ${isFixedClass ? 'animate-fadeInDown' : ''}`} style={isFixedClass ? fixedHeader : {}}>
            <div className='max-w-[1140px] mx-auto w-full relative'> 
                <nav className='flex items-center justify-between flex-wrap lg:flex-nowrap px-5 py-4 relative'>
                    <Link to="/" className='mr-4 flex items-center'>
                        <div className='h-12 w-12 text-white flex items-center justify-center rounded-full bg-primary-dark'>ICC</div>
                        {/* <img src={logo} alt="" className="h-10"/> */}
                        <h2 className='text-white font-bold text-xs ml-1'>InvestmentCrestCapital</h2>
                    </Link>

                    {/* Mobile Nav Icon */}
                    <button className='border-0 outline-0 shadow-none block lg:hidden' onClick={toggleMenu}>
                        {!isOpen ? (
                            <LuMenu className="text-3xl inline text-white"/>
                        ) : (
                            <MdClose className="text-3xl inline-block text-white"/>
                        )}
                    </button>

                    <div className={`${isOpen ? 'h-80 bg-primary-light mt-3 rounded' : 'h-0'} overflow-hidden lg:h-auto lg:flex items-center basis-full grow transition-all duration-300 ease-linear`}>
                        <ul className='flex-col lg:flex-row flex lg:items-center ml-auto py-4 lg:py-0' id='header-nav'>
                            <li>
                                <Link to="/" className='text-base font-bold text-white py-3 px-4 hover:text-gold cursor-pointer flex items-center'>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="about_us" className='text-base font-bold text-white py-3 px-4 hover:text-gold cursor-pointer flex items-center'>
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link to="services" className='text-base font-bold text-white py-3 px-4 hover:text-gold cursor-pointer flex items-center'>
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link to="investment" className='text-base font-bold text-white py-3 px-4 hover:text-gold cursor-pointer flex items-center'>
                                    Investment
                                </Link>
                            </li>
                            <li>
                                <Link to="contact_us" className='text-base font-bold text-white py-3 px-4 hover:text-gold cursor-pointer flex items-center'>
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link to="faqs" className='text-base font-bold text-white py-3 px-4 hover:text-gold cursor-pointer flex items-center'>
                                    FAQs
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
            <div className='absolute right-6'>
                <GoogleTranslate />
            </div>
        </div>
    );
};

export default Header;