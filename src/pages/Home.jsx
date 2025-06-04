import Hero from "../components/Hero";
import InvestmentPlans from "../components/InvestmentPlans";
import ring from './../assets/images/ring.png'
import Sponsors from "../components/Sponsors";
import Testimonials from "../components/Testimonials";
import WhyUs from "../components/WhyUs";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";
import SectionAbout from "../components/SectionAbout";
const Home = () => {
    return (
        <div>
            <Hero />
            {/* Why Choose Us Section */}
            <WhyUs />
            {/* About Us Section */}
            <SectionAbout />
        
           <InvestmentPlans />
           {/* CTA Section */}
           <CTA />

          {/* Investment Process Section */}
            <section className="py-20 px-4 lg:px-0 bg-gray-100 text-center">
                {/* Section Intro */}
                <div 
                    className="max-w-2xl mx-auto mb-10"
                    data-aos="fade-up"
                >
                    <h2 className="text-3xl font-bold text-primary-light uppercase">Our Investment Approach</h2>
                    <p className="text-lg text-gray-600 mt-2">
                        Explore a secure and high-yield investment platform designed for both beginners and experienced investors. 
                        Our process ensures maximum protection, transparency, and profitability.
                    </p>
                </div>

                {/* Image with Positioned Text */}
                <div 
                    className="relative max-w-3xl mx-auto flex justify-center items-center"
                    data-aos="zoom-in"
                >
                    <img 
                        src={ring} 
                        alt="Investment Process" 
                        className="w-full mx-auto drop-shadow-lg"
                    />

                    {/* Positioned Text Labels */}
                    <div 
                        className="absolute top-5 left-5 text-sm sm:text-lg font-bold bg-white p-2 rounded-md shadow-md"
                        data-aos="fade-in"
                        data-aos-delay="200"
                    >
                        Secure Transactions
                    </div>

                    <div 
                        className="absolute top-1/2 left-0 transform -translate-y-1/2 text-sm sm:text-lg font-bold bg-white p-2 rounded-md shadow-md"
                        data-aos="fade-in"
                        data-aos-delay="400"
                    >
                        Passive Income
                    </div>

                    <div 
                        className="absolute bottom-5 right-5 text-sm sm:text-lg font-bold bg-white p-2 rounded-md shadow-md"
                        data-aos="fade-in"
                        data-aos-delay="600"
                    >
                        Trusted Platform
                    </div>

                    <div 
                        className="absolute bottom-1/2 right-0 transform translate-y-1/2 text-sm sm:text-lg font-bold bg-white p-2 rounded-md shadow-md"
                        data-aos="fade-in"
                        data-aos-delay="800"
                    >
                        Expert Guidance
                    </div>

                    <div 
                        className="absolute top-5 right-5 text-sm sm:text-lg font-bold bg-white p-2 rounded-md shadow-md"
                        data-aos="fade-in"
                        data-aos-delay="1000"
                    >
                        High-Yield Returns
                    </div>
                </div>
            </section>

          {/* Getting Started Section */}
          <HowItWorks />
           

            <Sponsors />
            <Testimonials />
        </div>
    );
};

export default Home;
