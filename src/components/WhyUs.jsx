import { FaShieldAlt, FaExchangeAlt, FaMoneyBillWave, FaGlobe} from "react-icons/fa";
const why = [
    {
        id: 0,
        title: "Protection & Security",
        desc: "Stop loss and take profit orders will help secure your investment. The system will automatically execute trades gains.",
        icon: <FaShieldAlt className="text-4xl text-red-500" />
    },
    {
        id: 1,
        title: "Licensed Exchange",
        desc: "Our customers perform transactions not only in cryptocurrency, but major world currencies supported by the system.",
        icon: <FaExchangeAlt className="text-4xl text-blue-500" />
    },
    {
        id: 2,
        title: "Unlimited Free Transfers",
        desc: "Send any currency to friends, family members or business associates many times as you want, 24 hours a day free.",
        icon: <FaMoneyBillWave className="text-4xl text-green-500" />
    },
    {
        id: 3,
        title: "Multi-Currency Accounts",
        desc: "Support major currencies: USD, EUR, GBP & various Cryptocurrencies. Funds exchanged between currencies rate.",
        icon: <FaGlobe className="text-4xl text-yellow-500" />
    }
];
const WhyUs = ()=>{
    return(
        <section className="why-us py-[50px] lg:py-[100px] px-4 lg:px-0 bg-grey-500 bg-cover bg-center bg-fixed">
        <div className="max-w-[1140px] w-11/12 mx-auto">
            <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
                <h1 className="font-bold text-3xl lg:text-4xl uppercase relative text-primary-light">Why Invest With Us?</h1>
                <p className="text-md my-3" data-aos="fade-up" data-aos-delay="200">
                    We provide a secure and innovative cryptocurrency investment platform that ensures 
                    maximum protection of funds and seamless transactions. With our licensed exchange, 
                    multi-currency support, and free unlimited transfers, we make digital asset management 
                    simple, profitable, and reliable.
                </p>
            </div>
        </div>

        {/* Features Section */}
        <div className="max-w-[1140px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {why.map((item, index) => (
                <div key={item.id} className="bg-white p-6 rounded-lg shadow-lg text-center" data-aos="zoom-in" data-aos-delay={index * 100}>
                    <div className="mb-4 flex justify-center">{item.icon}</div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-gray-600 mt-2">{item.desc}</p>
                </div>
            ))}
        </div>
    </section>
    )
}

export default WhyUs