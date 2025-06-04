import React from 'react';
import bannerBg from './../assets/images/hero_bg.jpg'
import hero_img from './../assets/images/hero_img.png'
import { Link } from 'react-router-dom';
import { BiDollarCircle } from 'react-icons/bi';
import { IoLogInOutline } from 'react-icons/io5';

const Hero = () => {
    return (
        <div className='overflow-hidden lg:h-[115vh] min-h-[100vh] relative'>
            <div
                style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className='h-full bg-gradient-to-b from-[#000000ec] via-[#000000b9] to-[#000000b9] bg-opacity-95 text-primary flex items-center'>
                    <div className='max-w-6xl mx-auto relative px-4 lg:px-0 h-full py-[120px]'>
                        <div className="flex flex-col lg:flex-row">
                            {/* Left Content */}
                            <div className="w-full lg:w-2/4 mb-10 lg:mb-0">
                                <div className="text-center lg:text-left text-white">
                                    {/* Icon & Badge */}
                                    <div 
                                        className="flex justify-center items-center md:justify-start gap-2 text-sm mb-3"
                                        data-aos="fade-right" data-aos-duration="1000"
                                    >
                                        <Link href="" className="p-1 inline-flex items-center justify-center md:mx-0 rounded-3xl bg-white/10 text-slate-300 font-medium">
                                            <BiDollarCircle className="h-10 w-10" />
                                        </Link>
                                        <Link href="" className="px-2 py-1 inline-flex items-center md:mx-0 rounded-xl bg-white/10 text-slate-300 font-medium">
                                            We provide 100% profit guarantee!
                                        </Link>
                                    </div>

                                    {/* Heading */}
                                    <h1 
                                        className="text-white text-6xl font-black mb-4"
                                        data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000"
                                    >
                                        The Most Effective Method to <span className="text-primary-light">Increase</span> Your Income
                                    </h1>

                                    {/* Description */}
                                    <p 
                                        className="text-slate-300 font-normal text-lg mb-7"
                                        data-aos="fade-up" data-aos-delay="400" data-aos-duration="1000"
                                    >
                                        We're creating more than just profits—ensuring fully secured investments with great returns.
                                    </p>

                                    {/* Buttons */}
                                    <div 
                                        className="flex gap-2 lg:gap-3 mb-10 md:mb-28 justify-center lg:justify-normal"
                                        data-aos="zoom-in" data-aos-delay="100" data-aos-duration="1000"
                                    >
                                        <Link to="users/login" className="py-2 lg:py-3 px-3 lg:px-5 flex items-center  md:mx-0 rounded-3xl bg-primary-light hover:bg-black text-white font-bold">
                                            <IoLogInOutline className="w-6 h-6 inline-block mr-2"  /> Login
                                            
                                        </Link>
                                        <Link to='users/register' className="py-2 lg:py-3 px-3 lg:px-5 rounded-3xl border border-primary bg-black bg-opacity-50 text-white hover:bg-black font-bold">
                                            Start Investing
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Hero Image */}
                            <div 
                                className="w-full lg:w-2/4 flex justify-center"
                                data-aos="fade-left" data-aos-delay="800" data-aos-duration="1000"
                            >
                                <img src={hero_img} className='transition-opacity duration-1000 ease-in-out transform' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shape Divider */}
            <div className="custom-shape-divider-bottom-1741612936">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
                    <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
                    <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
                </svg>
            </div>
        </div>
    );
};

export default Hero;
