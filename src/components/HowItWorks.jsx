import {FaUserPlus, FaClipboardList, FaWallet, FaChartLine } from "react-icons/fa";
import { Link } from "react-router-dom";
const HowItWorks = ()=>{
    return(
        <section 
        className="py-20 text-center relative px-4 lg:px-0"
        style={{ background: "linear-gradient(135deg, #0f419a 0%, #1f156e 100%)" }}
    >
        {/* Section Intro */}
        <div 
            className="max-w-2xl mx-auto mb-10"
            data-aos="fade-up"
        >
            <h2 className="text-3xl font-bold text-white uppercase">How to Get Started</h2>
            <p className="text-lg text-white mt-2">
                Follow these simple steps to start investing securely and profitably on our platform.
            </p>
        </div>

        {/* Steps Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1: Create an Account */}
            <div 
                className="bg-white p-6 rounded-lg shadow-lg text-center"
                data-aos="fade-up"
                data-aos-delay="200"
            >
                <FaUserPlus className="text-6xl text-primary-light mb-3 mx-auto"/>
                <h3 className="text-xl font-semibold text-gray-800">Create an Account</h3>
                <p className="text-gray-600 mt-2">
                    Sign up with your details to create a secure investment account.
                </p>
            </div>

            {/* Step 2: Make a Deposit */}
            <div 
                className="bg-white p-6 rounded-lg shadow-lg text-center"
                data-aos="fade-up"
                data-aos-delay="400"
            >
                <FaWallet className="text-6xl text-primary-light mb-3 mx-auto"/>
                <h3 className="text-xl font-semibold text-gray-800">Make a Deposit</h3>
                <p className="text-gray-600 mt-2">
                    Deposit funds securely using your preferred payment method.
                </p>
            </div>

            {/* Step 3: Choose a Plan */}
            <div 
                className="bg-white p-6 rounded-lg shadow-lg text-center"
                data-aos="fade-up"
                data-aos-delay="600"
            >
                <FaClipboardList className="text-6xl text-primary-light mb-3 mx-auto"/>
                <h3 className="text-xl font-semibold text-gray-800">Choose a Plan</h3>
                <p className="text-gray-600 mt-2">
                    Select the investment plan that fits your financial goals.
                </p>
            </div>

            {/* Step 4: Start Earning */}
            <div 
                className="bg-white p-6 rounded-lg shadow-lg text-center"
                data-aos="fade-up"
                data-aos-delay="800"
            >
                <FaChartLine className="text-6xl text-primary-light mb-3 mx-auto"/>
                <h3 className="text-xl font-semibold text-gray-800">Start Earning</h3>
                <p className="text-gray-600 mt-2">
                    Watch your investment grow with our high-yield strategies.
                </p>
            </div>
        </div>

        {/* Call to Action */}
        <div className="mt-10" data-aos="zoom-in">
            <Link 
                to="/users/register" 
                className="mt-4 inline-block px-6 py-3 rounded-lg font-semibold transition-all duration-300 text-white"
                style={{
                    backgroundColor: "#ffcc00",
                    color: "#1f156e",
                    boxShadow: "0px 4px 10px rgba(255, 204, 0, 0.4)"
                }}
            >
                Get Started Now
            </Link>
        </div>

        {/* Curve Divider */}
        <div className="custom-shape-divider-top-1741623129 mt-[-70px] lg:mt-0">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
            </svg>
        </div>
    </section>
    )
}   
export default HowItWorks