import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const MatrixWord = () => {
  const { t, language } = useLanguage();
  const WORDS = [t('hero.word1'), t('hero.word2')];
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState(WORDS[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setDisplayText(WORDS[currentWordIndex]);
  }, [language]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentWordIndex + 1) % WORDS.length;
      const nextWord = WORDS[nextIndex];
      
      setIsAnimating(true);
      
      setTimeout(() => {
        setDisplayText(nextWord);
        setCurrentWordIndex(nextIndex);
        
        setTimeout(() => {
          setIsAnimating(false);
        }, 600);
      }, 300);
      
    }, 3500);

    return () => clearInterval(interval);
  }, [currentWordIndex, language]);

  return (
    <span className="relative inline-block">
      <span 
        className={`text-primary font-extrabold transition-all duration-500 ${
          isAnimating 
            ? 'scale-110 opacity-0 blur-sm' 
            : 'scale-100 opacity-100 blur-0'
        }`}
        style={{
          textShadow: isAnimating 
            ? '0 0 30px currentColor, 0 0 60px currentColor' 
            : '0 0 20px rgba(var(--primary-rgb), 0.5)'
        }}
      >
        {displayText}
      </span>
    </span>
  );
};