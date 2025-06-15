
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
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundColor: '#D95277' }}>
      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col items-center space-y-4 md:space-y-6 mx-8 max-w-xs md:max-w-sm w-full">
        {/* Fire Heart Emoji */}
        <div className="text-4xl md:text-6xl animate-pulse">
          ❤️‍🔥
        </div>
        
        {/* Brand Name */}
        <div className="text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-black mb-1 md:mb-2" style={{ fontFamily: 'serif' }}>
            Unfiltered
          </h1>
          
          {/* Tagline */}
          <p className="text-sm md:text-lg text-gray-600 font-medium">
            For the emotionally exhausted
          </p>
        </div>
      </div>
      
      {/* Loading indicator */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
