import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import logo from './../assets/images/logo.jpg';

const Footer = () => {
  return (
    <footer className="bg-[#0f419a] text-white py-12 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div data-aos="fade-right" data-aos-duration="1000">
           <Link to="/" className='mr-4 flex items-center'>                 
              <img src={logo} alt="" className="h-10"/>
              <h2 className='text-white font-bold text-xl ml-1'>InvestmentCrestCapital</h2>
            </Link>
          <p className="mt-3 text-gray-300">
            InvestmentCrestCapital is your trusted gateway to the world of cryptocurrency
            investments. With a secure platform, expert-backed strategies, and a
            commitment to innovation, we help investors grow their digital
            assets effortlessly. Join us to explore high-yield crypto
            opportunities with confidence.
          </p>
        </div>
        <div data-aos="fade-left" data-aos-duration="1000">
          <h3 className="text-lg font-semibold">Contact Us</h3>
          <ul className="mt-3 space-y-3 text-gray-300">
            {/* <li className="flex items-center space-x-2">
              <FaPhoneAlt className="text-yellow-400" />
              <span>+1 (912) 388-0218</span>
            </li> */}
            <li className="flex items-center space-x-2">
              <FaEnvelope className="text-yellow-400" />
              <span>admin@investmentcrestcapital.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <FaMapMarkerAlt className="text-yellow-400" />
              <span>123 Blockchain Avenue, New York, USA</span>
            </li>
          </ul>
        </div>
        <div data-aos="fade-up" data-aos-duration="1000">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-gray-300">
            <li>
              <Link to="about_us" className="hover:text-yellow-400 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="investment" className="hover:text-yellow-400 transition">
                Investment Plans
              </Link>
            </li>
            <li>
              <Link to="contact_us" className="hover:text-yellow-400 transition">
                Contact
              </Link>
            </li>
            <li>
              <Link to="faqs" className="hover:text-yellow-400 transition">
                FAQs
              </Link>
            </li>
          </ul>
        </div>
        <div data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
          <h3 className="text-lg font-semibold">Follow Us</h3>
          <div className="flex mt-3 space-x-4">
            <a href="#" className="text-gray-300 hover:text-yellow-400 transition">
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="text-gray-300 hover:text-yellow-400 transition">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="text-gray-300 hover:text-yellow-400 transition">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="text-gray-300 hover:text-yellow-400 transition">
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>
      </div>
      <div
        className="text-center mt-8 text-gray-300 text-sm"
        data-aos="fade-in"
        data-aos-duration="1000"
        data-aos-delay="400"
      >
        © {new Date().getFullYear()} InvestmentCrestCapital. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
