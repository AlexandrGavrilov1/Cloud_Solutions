import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const CYRILLIC_CHARS = 'абвгдежзийклмнопрстуфхцчшщъыьэюя';
const LATIN_CHARS = 'abcdefghijklmnopqrstuvwxyz';

export const MatrixWord = () => {
  const { t, language } = useLanguage();
  const WORDS = [t('hero.word1'), t('hero.word2')];
  const CHARS = language === 'ru' ? CYRILLIC_CHARS : LATIN_CHARS;
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState(WORDS[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setDisplayText(WORDS[currentWordIndex]);
  }, [language]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      const nextIndex = (currentWordIndex + 1) % WORDS.length;
      const nextWord = WORDS[nextIndex];
      const currentWord = WORDS[currentWordIndex];
      const maxLength = Math.max(currentWord.length, nextWord.length);
      
      let frame = 0;
      const transitionFrames = 40;
      
      const animate = setInterval(() => {
        frame++;
        
        if (frame <= transitionFrames) {
          let newText = '';
          for (let i = 0; i < maxLength; i++) {
            const progress = frame / transitionFrames;
            const charProgress = Math.min(1, Math.max(0, progress * maxLength - i));
            
            if (charProgress < 0.5) {
              newText += currentWord[i] || '';
            } else if (charProgress < 0.85) {
              newText += CHARS[Math.floor(Math.random() * CHARS.length)];
            } else {
              newText += nextWord[i] || '';
            }
          }
          setDisplayText(newText);
        } else {
          setDisplayText(nextWord);
          setIsTransitioning(false);
          setCurrentWordIndex(nextIndex);
          clearInterval(animate);
        }
      }, 35);
      
    }, 4000);

    return () => clearInterval(interval);
  }, [currentWordIndex, language]);

  return (
    <span className="relative inline-block">
      <span className={`text-foreground ${isTransitioning ? 'matrix-glitch' : ''}`}>
        {displayText}
      </span>
    </span>
  );
};