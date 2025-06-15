import React, {useEffect} from 'react';
import { Outlet } from 'react-router-dom';
import AOS from "aos";
import 'aos/dist/aos.css';
import Header from '../components/Header';
import Footer from '../components/Footer';



const BaseLayout = () => {

const buildTawkChatWidget = async()=>{
  var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
  var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
  s1.async=true;
  s1.src='https://embed.tawk.to/684ee55d6b65fa190ea6fa21/1itq2vub5';
  s1.charset='UTF-8';
  s1.setAttribute('crossorigin','*');
  s0.parentNode.insertBefore(s1,s0);
}
    useEffect(()=>{
        AOS.init();
        buildTawkChatWidget()
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