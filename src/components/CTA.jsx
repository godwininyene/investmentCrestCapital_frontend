import img from './../assets/images/hero_bg.jpg'
import { Link } from 'react-router-dom';
const CTA = ()=>{
    return(
        <div 
        className='py-4' 
        style={{
            backgroundImage: `linear-gradient(135deg, rgba(15, 65, 154, 0.85) 0%, rgba(31, 21, 110, 0.85) 100%), url(${img})`,
            backgroundBlendMode: 'overlay',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}
    >
        <div className='max-w-6xl text-white mx-auto p-3 lg:p-10 text-center lg:text-left'>
            <h1 
                className='text-3xl md:text-4xl font-bold font-sans'
                data-aos="fade-up"
            >
                Secure & Profitable Crypto Investments
            </h1>
            <p 
                className='text-lg font-sans mt-4'
                data-aos="fade-up" 
                data-aos-delay="200"
            >
                Join our trusted crypto investment platform and grow your digital assets with high-yield strategies. 
                Enjoy secure transactions, real-time tracking, and expert guidance.
            </p>
            <div className='mt-7' data-aos="zoom-in" data-aos-delay="400">
                <Link 
                    to="/users/register" 
                    className="mt-4 inline-block px-6 py-3 rounded-lg font-semibold transition-all duration-300 text-white"
                    style={{
                        backgroundColor: "#ffcc00",
                        color: "#1f156e",
                        boxShadow: "0px 4px 10px rgba(255, 204, 0, 0.4)"
                    }}
                >
                    Start Investing
                </Link>
            </div>
        </div>
    </div>
    )
}

export default CTA;