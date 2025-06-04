import React from "react";
import airbnb from './../assets/images/airbnb.png'
import binance from './../assets/images/binance.png'
import coinbase from './../assets/images/coinbase.png'
import dropbox from './../assets/images/dropbox.png'

const Sponsors = () => {
    // List of sponsor logos
    const sponsors = [airbnb, binance, coinbase, dropbox];

    return (
        <section className="py-16 bg-gray-100 text-center">
            {/* Section Title */}
            <h2 className="text-3xl font-bold text-primary-light uppercase mb-4">Our Sponsors</h2>
            <p className="text-lg text-gray-600 mb-8">
                Proudly supported by our amazing sponsors.
            </p>

            {/* Sponsors Logos Grid */}
            <div className="max-w-6xl mx-auto flex justify-center items-center flex-wrap w-full">
                {sponsors.map((logo, index) => (
                    <div 
                        className="flex justify-center items-center sm:min-w-[192px] min-w-[120px] m-5"
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        data-aos-delay={index * 200} 
                    >
                        <img
                            key={index}
                            src={logo}
                            alt={`Sponsor ${index + 1}`}
                            className="sm:w-[192px] w-[100px] object-contain transition-transform duration-300 hover:scale-105"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Sponsors;
