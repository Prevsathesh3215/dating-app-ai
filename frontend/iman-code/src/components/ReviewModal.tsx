
import { useState } from 'react';
import { User } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSubmitReview: (ratings: { communication: number; respectfulness: number; authenticity: number }) => void;
}

const ReviewModal = ({ isOpen, onClose, user, onSubmitReview }: ReviewModalProps) => {
  const [ratings, setRatings] = useState({
    communication: 0,
    respectfulness: 0,
    authenticity: 0
  });

  const handleStarClick = (category: keyof typeof ratings, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [category]: rating
    }));
  };

  const handleSubmit = () => {
    if (ratings.communication > 0 && ratings.respectfulness > 0 && ratings.authenticity > 0) {
      onSubmitReview(ratings);
      onClose();
      setRatings({
        communication: 0,
        respectfulness: 0,
        authenticity: 0
      });
    }
  };

  const isComplete = ratings.communication > 0 && ratings.respectfulness > 0 && ratings.authenticity > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Rate {user.name}</DialogTitle>
          <p className="text-sm text-gray-600 text-center">
            Help others by sharing your experience with {user.name}
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Communication */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Communication</h3>
            <p className="text-sm text-gray-600 mb-3">How well did they communicate?</p>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick('communication', star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= ratings.communication
                        ? 'text-pink-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Respectfulness */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Respectfulness</h3>
            <p className="text-sm text-gray-600 mb-3">How respectful were they?</p>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick('respectfulness', star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= ratings.respectfulness
                        ? 'text-pink-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Authenticity */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Authenticity</h3>
            <p className="text-sm text-gray-600 mb-3">How authentic did they seem?</p>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick('authenticity', star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= ratings.authenticity
                        ? 'text-pink-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Maybe Later
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isComplete}
            className="flex-1 bg-brand hover:bg-brand/90"
          >
            Submit Review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
