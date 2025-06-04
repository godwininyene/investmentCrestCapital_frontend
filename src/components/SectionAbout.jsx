import about_img from './../assets/images/about_img.webp'
import { Link } from 'react-router-dom';
const SectionAbout = ()=>{
    return(
        <section 
        className="py-20 text-white px-4 lg:px-0 overflow-hidden"
        style={{
            background: "linear-gradient(135deg, #0f419a 0%, #1f156e 100%)"
        }}
    >
        <div className="max-w-[1140px] w-11/12 mx-auto flex flex-col lg:flex-row items-center">
            {/* Image Section */}
            <div className="lg:w-1/2" data-aos="fade-right">
                <img 
                    src={about_img}
                    alt="About Us" 
                    className="rounded-2xl shadow-lg w-full"
                />
            </div>

            {/* Text Section */}
            <div className="lg:w-1/2 lg:pl-12 text-center lg:text-left mt-6 lg:mt-0">
                <h2 className="text-4xl font-bold mb-4 uppercase" data-aos="fade-up">About Our Investment Platform</h2>
                <p className="text-lg mb-6" data-aos="fade-up" data-aos-delay="200">
                    At InvestmentCrestCapital, we are more than just a cryptocurrency investment platform—we are a community of forward-thinking investors.
                    Our secure and transparent system provides you with high returns, instant transactions, and 24/7 support.
                </p>
                <p className="text-lg mb-6" data-aos="fade-up" data-aos-delay="400">
                    Whether you’re a beginner or an experienced investor, our platform offers the tools and expertise 
                    to help you grow your wealth in the crypto space.
                </p>
                <Link 
                    to="/about_us" 
                    className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 text-white"
                    style={{
                        backgroundColor: "#ffcc00",
                        color: "#1f156e",
                        boxShadow: "0px 4px 10px rgba(255, 204, 0, 0.4)"
                    }}
                    data-aos="zoom-in" data-aos-delay="600"
                >
                    Learn More
                </Link>
            </div>
        </div>
    </section>
    )
}

export default SectionAbout;