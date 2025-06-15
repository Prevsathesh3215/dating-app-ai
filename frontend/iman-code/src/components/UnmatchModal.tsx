
import { useEffect, useState } from 'react';

interface UnmatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UnmatchModal = ({ isOpen, onClose }: UnmatchModalProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade out
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center space-y-4 max-w-xs mx-4">
          <div className="text-6xl animate-pulse">
            💔
          </div>
          <h2 className="text-xl font-bold text-gray-800">Unmatched!</h2>
        </div>
      </div>
    </div>
  );
};

export default UnmatchModal;
