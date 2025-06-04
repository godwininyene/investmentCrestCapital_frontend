import React, { useEffect, useRef } from 'react';

const GoogleTranslate = () => {
  const googleTranslateRef = useRef(null);
  const scriptLoaded = useRef(false);

  const googleTranslateElementInit = () => {
    if (window.google && window.google.translate) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          layout: window.google.translate.TranslateElement.FloatPosition.TOP_LEFT,
          autoDisplay: false
        }, 
        'google_translate_element'
      );
    }
  };

  useEffect(() => {
    if (!scriptLoaded.current) {
      const addScript = document.createElement('script');
      addScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      addScript.async = true;
      document.body.appendChild(addScript);
      window.googleTranslateElementInit = googleTranslateElementInit;
      scriptLoaded.current = true;
    }

    return () => {
      // Clean up function to prevent memory leaks
      if (scriptLoaded.current) {
        const script = document.querySelector('script[src*="translate.google.com"]');
        if (script) {
          document.body.removeChild(script);
        }
        delete window.googleTranslateElementInit;
        scriptLoaded.current = false;
      }
    };
  }, []);

  return (
    <div ref={googleTranslateRef} id="google_translate_element" className="w-[120px]  relative overflow-hidden text-white"></div>
  );
};

export default GoogleTranslate;