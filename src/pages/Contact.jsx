import bannerBg from './../assets/images/about_bg.jpg';
import { IoMdSettings } from 'react-icons/io';
import CTA from '../components/CTA';
import { useEffect, useState } from 'react';
import axios from '../lib/axios';


const Contact = () => {

    const [questionsList, loadQuestions] = useState([]);
     useEffect(() => {
        fetchFaqs();
      }, [])
    
      let fetchFaqs = async () => {
        await axios.get('api/v1/faqs')
        .then((res) => {
         
          loadQuestions(res.data.data.faqs);
        })
        .catch((err) => {
          console.log(err);
          
        });
      }
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
                                    Get In Touch With Us
                                </span>
                                <span className="block text-3xl font-bold uppercase">We're Here to Help</span>
                                <hr className="w-1/4 border-2 border-primary-light" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Form and Information Section */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-3 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div data-aos="fade-up" className="p-3 rounded-lg shadow-md">
                        <h2 className="text-3xl font-bold mb-6 uppercase text-primary-light">Contact Form</h2>
                        <form className="space-y-6">
                            <input type="text" placeholder="Your Name" className="w-full p-4 rounded-lg border border-gray-300 transition duration-500 focus:outline-none  focus:border-primary-light" />
                            <input type="email" placeholder="Your Email" className="w-full p-4 rounded-lg border border-gray-300 transition duration-500 focus:outline-none  focus:border-primary-light" />
                            <textarea placeholder="Your Message" className="w-full p-4 rounded-lg border border-gray-300 transition duration-500 focus:outline-none  focus:border-primary-light" rows="5"></textarea>
                            <button className="bg-yellow-500 text-white cursor-pointer py-3 px-6 rounded-lg hover:bg-yellow-600 transition duration-300">Send Message</button>
                        </form>
                    </div>
                    <div data-aos="fade-up" className="p-3">
                        <h2 className="text-3xl font-bold mb-6 uppercase text-primary-light">Contact Information</h2>
                        <p className="mb-4"><span className='font-bold'>Phone:</span> +123 456 7890</p>
                        <p className="mb-4"><span className='font-bold'>Email: </span> support@investmentcrestcapital.com</p>
                        <p> <span className='font-bold'>Address:</span> 23 Blockchain Avenue, New York, USA</p>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-3 text-center">
                    <h2 className="text-3xl font-bold mb-6 uppercase text-primary-light">Frequently Asked Questions</h2>
                    <p className="mb-8">Find answers to common questions about investing with us.</p>
                    <ul className="text-left space-y-4">
                        {questionsList.length > 0 && questionsList.map((faq, index) => (
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

export default Contact;
