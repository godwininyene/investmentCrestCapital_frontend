import { FaQuoteLeft } from "react-icons/fa";
import testify_1 from './../assets/images/testify_1.jpg'
import testify_2 from './../assets/images/testify_2.jpg'
import testify_3 from './../assets/images/testify_3.jpg'

const testimonials = [
    {
        name: "Scott Anthony",
        role: "Investor",
        image: testify_1,
        text: "This platform has completely transformed my investment journey. The returns are amazing, and the process is seamless!",
    },
    {
        name: "Emily Smith",
        role: "Entrepreneur",
        image: testify_2,
        text: "I was skeptical at first, but now I’m a believer. The customer support is fantastic, and the results speak for themselves!",
    },
    {
        name: "Michael Brown",
        role: "Financial Analyst",
        image: testify_3,
        text: "Investing here was the best decision I made. Secure, profitable, and easy to use!",
    },
];

const Testimonials = () => {
    return (
        <section className="py-20 px-4 lg:px-0 bg-gray-100 text-center" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-primary-light mb-4 uppercase">What Our Investors Say</h2>
            <p className="text-lg text-gray-600 mb-8">
                Hear from those who have trusted us with their investments.
            </p>
            <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center" data-aos="fade-up" data-aos-delay={`${index * 200}`}> 
                        <FaQuoteLeft className="text-4xl text-blue-500 mx-auto mb-3" />
                        <p className="text-gray-700 italic">"{testimonial.text}"</p>
                        <div className="mt-4 flex flex-col items-center text-center">
                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="h-16 w-16 object-cover rounded-full border-2 border-blue-500"
                            />
                            <h3 className="text-lg font-semibold text-gray-800 mt-3">{testimonial.name}</h3>
                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;
