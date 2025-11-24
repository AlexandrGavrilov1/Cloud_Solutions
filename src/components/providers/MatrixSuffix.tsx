import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const MatrixSuffix = () => {
  const { t, language } = useLanguage();
  const SUFFIXES = [t('hero.suffix1'), t('hero.suffix2')];
  
  const [currentSuffixIndex, setCurrentSuffixIndex] = useState(0);
  const [displayText, setDisplayText] = useState(SUFFIXES[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setDisplayText(SUFFIXES[currentSuffixIndex]);
  }, [language]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentSuffixIndex + 1) % SUFFIXES.length;
      const nextSuffix = SUFFIXES[nextIndex];
      
      setIsAnimating(true);
      
      setTimeout(() => {
        setDisplayText(nextSuffix);
        setCurrentSuffixIndex(nextIndex);
        
        setTimeout(() => {
          setIsAnimating(false);
        }, 600);
      }, 300);
      
    }, 3500);

    return () => clearInterval(interval);
  }, [currentSuffixIndex, language]);

  return (
    <span 
      className={`text-white font-extrabold transition-all duration-500 ${
        isAnimating 
          ? 'scale-110 opacity-0 blur-sm' 
          : 'scale-100 opacity-100 blur-0'
      }`}
      style={{
        textShadow: isAnimating 
          ? '0 0 30px currentColor, 0 0 60px currentColor' 
          : '0 0 20px rgba(255, 255, 255, 0.4)'
      }}
    >
      {displayText}
    </span>
  );
};