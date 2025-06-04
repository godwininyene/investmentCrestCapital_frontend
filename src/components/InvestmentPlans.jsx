import { FaChartLine, FaPiggyBank, FaRocket, FaCrown } from "react-icons/fa";
import { Link } from "react-router-dom";

const investmentPlans = [
    {
        id: 1,
        title: "Starter Plan",
        desc: "Perfect for beginners looking to explore cryptocurrency investments.",
        minInvestment: "$100",
        duration: "30 Days",
        roi: "5% Return",
        icon: <FaPiggyBank className="text-4xl text-green-500" />
    },
    {
        id: 2,
        title: "Growth Plan",
        desc: "Ideal for investors aiming for steady and secure returns.",
        minInvestment: "$500",
        duration: "60 Days",
        roi: "12% Return",
        icon: <FaChartLine className="text-4xl text-blue-500" />
    },
    {
        id: 3,
        title: "Pro Plan",
        desc: "For experienced investors seeking high-yield opportunities.",
        minInvestment: "$2000",
        duration: "90 Days",
        roi: "20% Return",
        icon: <FaRocket className="text-4xl text-red-500" />
    },
    {
        id: 4,
        title: "Elite Plan",
        desc: "Premium plan for serious investors looking for maximum gains.",
        minInvestment: "$5000",
        duration: "180 Days",
        roi: "40% Return",
        icon: <FaCrown className="text-4xl text-yellow-500" />
    }
];

const InvestmentPlans = () => {
    return (
        <section className="py-20 bg-white px-4 lg:px-0">
            <div className="max-w-[1140px] w-11/12 mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6 text-primary-light uppercase" data-aos="fade-up">Our Investment Plans</h2>
                <p className="text-lg mb-8" data-aos="fade-up" data-aos-delay="200">
                    Choose a plan that fits your financial goals and start growing your wealth today.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {investmentPlans.map((plan, index) => (
                        <div 
                            key={plan.id} 
                            className="bg-white p-6 rounded-lg shadow-lg text-center text-gray-900"
                            data-aos="zoom-in" 
                            data-aos-delay={index * 200} // Staggered effect
                        >
                            <div className="mb-4 flex justify-center">{plan.icon}</div>
                            <h3 className="text-xl font-semibold">{plan.title}</h3>
                            <p className="text-gray-600 mt-2">{plan.desc}</p>
                            <p className="mt-3 font-bold">Min Investment: {plan.minInvestment}</p>
                            <p className="font-bold">Duration: {plan.duration}</p>
                            <p className="font-bold text-green-600">{plan.roi}</p>
                            <Link 
                                to="/users/register" 
                                className="mt-4 inline-block px-6 py-3 rounded-lg font-semibold transition-all duration-300 text-white"
                                style={{
                                    backgroundColor: "#ffcc00",
                                    color: "#1f156e",
                                    boxShadow: "0px 4px 10px rgba(255, 204, 0, 0.4)"
                                }}
                                data-aos="fade-up"
                                data-aos-delay="600"
                            >
                                Invest Now
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default InvestmentPlans;
