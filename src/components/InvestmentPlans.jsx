import { FaChartLine, FaPiggyBank, FaRocket, FaCrown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../lib/axios";

const InvestmentPlans = () => {
    const [plans, setPlans] = useState([]);
    
    // Map plan IDs to corresponding icons
    const planIcons = {
        1: <FaCrown className="text-4xl text-yellow-500" />,
        2: <FaRocket className="text-4xl text-red-500" />,
        3: <FaChartLine className="text-4xl text-blue-500" />,
        4: <FaPiggyBank className="text-4xl text-green-500" />
    };

    const fetchPlans = async () => {
        try {
            const res = await axios.get('api/v1/plans');
            setPlans(res.data.data.plans);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    // Function to format the duration display
    const formatDuration = (duration, timingParameter) => {
        if (timingParameter === "hours") {
            return duration === 24 ? "1 Day" : `${duration} Hours`;
        }
        return `${duration} ${timingParameter}`;
    };

    return (
        <section className="py-20 bg-white px-4 lg:px-0">
            <div className="max-w-[1140px] w-11/12 mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6 text-primary-light uppercase" data-aos="fade-up">Our Investment Plans</h2>
                <p className="text-lg mb-8" data-aos="fade-up" data-aos-delay="200">
                    Choose a plan that fits your financial goals and start growing your wealth today.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map((plan, index) => (
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center text-gray-900"
                            data-aos="zoom-in" 
                            data-aos-delay={index * 200}
                        >
                            <div className="mb-4 flex justify-center">{planIcons[plan.id]}</div>
                            <h3 className="text-xl font-semibold mb-3">{plan.name}</h3>
                            <p className="text-gray-600 mb-4 min-h-[60px]">{plan.description}</p>
                            
                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Min Investment:</span>
                                    <span className="font-semibold">${plan.minDeposit.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Max Investment:</span>
                                    <span className="font-semibold">${plan.maxDeposit.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">Duration:</span>
                                    <span className="font-semibold">{formatDuration(plan.planDuration, plan.timingParameter)}</span>
                                </div>
                            </div>
                            
                            <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-4">
                                <p className="text-green-700 font-bold text-lg">
                                    {plan.percentage}% ROI
                                </p>
                            </div>
                            
                            <Link 
                                to="/users/register" 
                                className="mt-4 inline-block px-6 py-3 rounded-lg font-semibold transition-all duration-300 text-white hover:shadow-lg"
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