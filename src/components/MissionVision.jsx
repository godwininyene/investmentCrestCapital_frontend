import React from "react";

const MissionVision = () => {
    return (
        <section className="py-20 bg-gray-100 text-center">
            <div className="max-w-6xl mx-auto px-6">
                <h2 
                    data-aos="fade-up" 
                    className="text-3xl font-bold text-primary-light uppercase"
                >
                    Our Mission & Vision
                </h2>
                <p 
                    data-aos="fade-up" 
                    data-aos-delay="100" 
                    className="text-gray-600 mt-2"
                >
                    At InvestmentCrestCapital, we are committed to revolutionizing cryptocurrency investments through security, transparency, and innovation.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    <div 
                        data-aos="zoom-in" 
                        data-aos-delay="200" 
                        className="bg-white p-6 shadow-lg rounded-lg"
                    >
                        <h3 className="text-xl font-semibold">Our Mission</h3>
                        <p className="text-gray-600 mt-3">
                            To empower individuals and businesses with the tools and knowledge to navigate cryptocurrency investments confidently, ensuring growth and success in the digital economy.
                        </p>
                    </div>
                    <div 
                        data-aos="zoom-in" 
                        data-aos-delay="300" 
                        className="bg-white p-6 shadow-lg rounded-lg"
                    >
                        <h3 className="text-xl font-semibold">Our Vision</h3>
                        <p className="text-gray-600 mt-3">
                            To create a future where cryptocurrency investment is seamless and accessible to everyone, bridging the gap between traditional finance and digital assets.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MissionVision;
