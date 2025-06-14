
import { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Wait for fade out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-200 flex flex-col items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Logo Container */}
      <div className="flex flex-col items-center space-y-8 mb-16">
        {/* Animated Fire Heart Emoji */}
        <div className="text-8xl animate-pulse">
          <span className="inline-block">❤️</span>
          <span className="inline-block animate-bounce">‍🔥</span>
        </div>
        
        {/* Brand Name */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-red-500 mb-4 animate-fade-in">
            unfiltered
          </h1>
          
          {/* Tagline */}
          <p className="text-xl text-red-400 font-medium animate-fade-in delay-300">
            It's Me, Not You
          </p>
        </div>
      </div>
      
      {/* Loading indicator */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
        <div className="w-8 h-8 border-2 border-red-300 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
