import React, {useEffect} from 'react';
import { Outlet } from 'react-router-dom';
import AOS from "aos";
import 'aos/dist/aos.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
// import Hero from '@/Components/Hero';


const BaseLayout = () => {

// const buildTawkChatWidget = async()=>{
//   var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
//   var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
//   s1.async=true;
//   s1.src='https://embed.tawk.to/67ac9883825083258e141db5/1ijt37gp1';
//   s1.charset='UTF-8';
//   s1.setAttribute('crossorigin','*');
//   s0.parentNode.insertBefore(s1,s0);
// }
    useEffect(()=>{
        AOS.init();
        // buildTawkChatWidget()
      },[])
  return (
    <div className='relative'>
        <Header />
       <div className=''>
        <Outlet />
       </div>
        <Footer />
    </div>
  )
}

export default BaseLayout