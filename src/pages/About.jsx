import bannerBg from './../assets/images/about_bg.jpg'
import {IoMdInformationCircle} from 'react-icons/io'
import CryptoConcepts from '../components/CryptoConcepts'
import MissionVision from '../components/MissionVision'
import WhyUs from '../components/WhyUs'
import CTA from '../components/CTA'
import Testimonials from '../components/Testimonials'
import SectionAbout from '../components/SectionAbout'
const About = ()=>{
    return(
       
        <div className="">
            {/* Banner Section  */}
            <div className="about-page-container bg-center" style={{backgroundImage:`url(${bannerBg})`}}>
                <div className={`bg-gradient-to-b pt-10 lg:pt-28 h-full from-[#000000ec] dark:from-[#000000da] via-[#000000b9] to-[#000000b9] dark:to-[#000000d5]  text-primary`}>
                    <div className=' grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-7 gap-4 mx-auto max-w-6xl px-8 md:px-2'>
                        <div data-aos="zoom-in" className='lg:col-span-4'>
                            <div className='rounded text-white opacity py-12 p-2 md:px-1 items-center'>
                                <span className='class="block mt-3 mb-0 text-xl flex items-center'>
                                    <IoMdInformationCircle />
                                    About Us
                                </span>
                                <span className='block text-base lg:text-3xl font-bold uppercase'>InvestmentCrestCapital</span>
                                <hr className='w-1/4 border-2 border-primary-light' />
                            </div>  
                        </div>
                    </div>
                </div>
            </div>

            <CryptoConcepts />
            <MissionVision />
            <SectionAbout />
            <WhyUs />
            <CTA />
            <Testimonials />
        </div>
    )
}

export default About;