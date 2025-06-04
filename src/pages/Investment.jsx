import bannerBg from './../assets/images/about_bg.jpg';
import { IoMdSettings } from 'react-icons/io';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import InvestmentPlans from '../components/InvestmentPlans';
import WhyUs from '../components/WhyUs';
import HowItWorks from '../components/HowItWorks';

const Investment = () => {
    return (
        <div className="">
            {/* Hero Section */}
            <div className="services-page-container bg-center" style={{ backgroundImage: `url(${bannerBg})` }}>
                <div className="bg-gradient-to-b pt-10 lg:pt-28 h-full from-[#000000ec] dark:from-[#000000da] via-[#000000b9] to-[#000000b9] dark:to-[#000000d5] text-primary">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-7 gap-4 mx-auto max-w-6xl px-8 md:px-2">
                        <div data-aos="fade-up" className="lg:col-span-4">
                            <div className="rounded text-white opacity py-12 p-2 md:px-1 items-center">
                                <span className="mt-3 mb-0 text-xl flex items-center">
                                    <IoMdSettings />
                                    Investment Plan
                                </span>
                                <span className="block text-3xl font-bold uppercase">Empowering Your Crypto Journey</span>
                                <hr className="w-1/4 border-2 border-primary-light" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Our Investment Plans */}
            <InvestmentPlans />
            {/* Why Choose Us */}
            <WhyUs />
            {/* How It Works */}
            <HowItWorks />


            {/* Risk Management and Security Measures */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-8 text-center">
                    <h2 className="text-3xl font-bold mb-6 text-primary-light uppercase">Risk Management & Security</h2>
                    <p className="mb-8">We take serious steps to protect your investments and ensure a secure platform.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Fund Protection", desc: "Your funds are stored securely with multi-layered security." },
                            { title: "Fraud Prevention", desc: "We actively monitor and prevent suspicious activities." },
                            { title: "Regulated Compliance", desc: "We follow industry regulations for transparency." },
                        ].map((security, index) => (
                            <div key={index} data-aos="fade-up" className="p-6 border rounded-lg shadow-md bg-gray-100">
                                <h3 className="text-xl font-semibold">{security.title}</h3>
                                <p className="mt-2">{security.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <Testimonials />

            {/* FAQ Section */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-8 text-center">
                    <h2 className="text-3xl font-bold mb-6 uppercase text-primary-light">Frequently Asked Questions</h2>
                    <p className="mb-8">Find answers to common questions about investing with us.</p>
                    <ul className="text-left space-y-4">
                        {[
                            { question: "How do I start investing?", answer: "Simply sign up, deposit funds, and choose a plan." },
                            { question: "Are my funds secure?", answer: "Yes, we use high-level encryption and security protocols." },
                            { question: "Can I withdraw anytime?", answer: "Yes, withdrawals are processed swiftly." },
                        ].map((faq, index) => (
                            <li key={index} data-aos="fade-up" className="p-4 border rounded-lg shadow-md bg-gray-50">
                                <h3 className="text-lg font-semibold">{faq.question}</h3>
                                <p className="mt-2">{faq.answer}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* CTA Section */}
            <CTA />
        </div>
    );
};

export default Investment;
