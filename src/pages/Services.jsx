import bannerBg from './../assets/images/about_bg.jpg'
import {IoMdSettings} from 'react-icons/io'
import CTA from '../components/CTA'
import Testimonials from '../components/Testimonials'
import HowItWorks from '../components/HowItWorks'

const expertiseItems = [
    {
        number: "01.",
        title: "Secure Transactions",
        desc: "Ensuring safe and reliable financial operations with advanced security measures."
    },
    {
        number: "02.",
        title: "Advanced Analytics",
        desc: "Providing real-time data insights and market analysis for informed decision-making."
    },
    {
        number: "03.",
        title: "24/7 Support",
        desc: "Offering round-the-clock customer support to assist with all your needs."
    }
];

const Services = () => {
    return (
        <div className="">
            {/* Hero Section */}
            <div className="services-page-container bg-center" style={{backgroundImage:`url(${bannerBg})`}}>
                <div className="bg-gradient-to-b pt-10 lg:pt-28 h-full from-[#000000ec] dark:from-[#000000da] via-[#000000b9] to-[#000000b9] dark:to-[#000000d5] text-primary">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-7 gap-4 mx-auto max-w-6xl px-8 md:px-2">
                        <div data-aos="fade-up" className="lg:col-span-4">
                            <div className="rounded text-white opacity py-12 p-2 md:px-1 items-center">
                                <span className="mt-3 mb-0 text-xl flex items-center">
                                    <IoMdSettings />
                                    Our Services
                                </span>
                                <span className="block text-3xl font-bold uppercase">Empowering Your Crypto Journey</span>
                                <hr className="w-1/4 border-2 border-primary-light" />
                            </div>  
                        </div>
                    </div>
                </div>
            </div>

            {/* Our Expertise Section */}
            <section className="py-16 bg-gray-100">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {expertiseItems.map((item, index) => (
                        <div key={index} data-aos="fade-up" className="text-gray-700">
                            <span className="text-6xl font-bold text-gray-300">{item.number}</span>
                            <p className="text-sm italic text-gray-500">Expertise Insight</p>
                            <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                            <p className="mt-2 text-gray-600">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Service Categories */}
            <section className="py-16">
                <div className="max-w-6xl mx-auto px-8 md:px-2 text-center">
                    <h2 data-aos="fade-up" className="text-3xl font-bold mb-6 uppercase text-primary-light">Service Categories</h2>
                    <p data-aos="fade-up" data-aos-delay="200" className="mb-8">Explore our diverse range of services tailored to enhance your investment experience.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div data-aos="fade-up" className="p-6 border rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">Investment Advisory</h3>
                            <p>Personalized guidance for optimal portfolio management.</p>
                        </div>
                        <div data-aos="fade-up" data-aos-delay="200" className="p-6 border rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">Trading Signals</h3>
                            <p>Real-time alerts and signals for market trends and opportunities.</p>
                        </div>
                        <div data-aos="fade-up" data-aos-delay="400" className="p-6 border rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">Wallet Security</h3>
                            <p>Protecting your digital assets with top-tier security solutions.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <HowItWorks />

            {/* Testimonials Section */}
            <Testimonials />

            {/* CTA Section */}
            <CTA />
        </div>
    )
}

export default Services;
