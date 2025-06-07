import React, { useEffect } from 'react'

  // Function to detect user's preferred language
  const getUserLanguage = () => {
    // 1. First try to get from browser's navigator object (most reliable for language)
    const browserLanguage = navigator.language || navigator.userLanguage;
    
    // 2. If you want to use geolocation to determine language (requires extra API calls)
    // You would need to use a geolocation API here
    
    // Extract base language code (e.g., 'es' from 'es-ES')
    const baseLanguage = browserLanguage.split('-')[0];
    
    // List of supported languages by Google Translate
    const supportedLanguages = ['af', 'sq', 'am', 'ar', 'hy', 'az', 'eu', 'be', 'bn', 'bs', 'bg', 'ca', 'ceb', 'zh', 'zh-TW', 'co', 'hr', 'cs', 'da', 'nl', 'en', 'eo', 'et', 'fi', 'fr', 'fy', 'gl', 'ka', 'de', 'el', 'gu', 'ht', 'ha', 'haw', 'he', 'hi', 'hmn', 'hu', 'is', 'ig', 'id', 'ga', 'it', 'ja', 'jv', 'kn', 'kk', 'km', 'rw', 'ko', 'ku', 'ky', 'lo', 'la', 'lv', 'lt', 'lb', 'mk', 'mg', 'ms', 'ml', 'mt', 'mi', 'mr', 'mn', 'my', 'ne', 'no', 'ny', 'or', 'ps', 'fa', 'pl', 'pt', 'pa', 'ro', 'ru', 'sm', 'gd', 'sr', 'st', 'sn', 'sd', 'si', 'sk', 'sl', 'so', 'es', 'su', 'sw', 'sv', 'tl', 'tg', 'ta', 'tt', 'te', 'th', 'tr', 'tk', 'uk', 'ur', 'ug', 'uz', 'vi', 'cy', 'xh', 'yi', 'yo', 'zu'];
    
    // Return the detected language if supported, otherwise default to English
    return supportedLanguages.includes(baseLanguage) ? baseLanguage : 'en';
  };

const GoogleTranslate = () => {
  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement({ pageLanguage: getUserLanguage(), layout: window.google.translate.TranslateElement.FloatPosition.TOP_LEFT }, 'google_translate_element')
  }
   
  useEffect(() => {
    var addScript = document.createElement('script');
    addScript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, [])
  
  return (
    <div>
        <div id="google_translate_element"></div>
    </div>
  )
}

export default GoogleTranslate