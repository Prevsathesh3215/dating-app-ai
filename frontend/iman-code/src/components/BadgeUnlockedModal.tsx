
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '../types';

interface BadgeUnlockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  badge: Badge | null;
}

const BadgeUnlockedModal = ({ isOpen, onClose, badge }: BadgeUnlockedModalProps) => {
  if (!badge) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 mb-4">
            Badge Unlocked: {badge.name}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          <div className="text-6xl mb-4">{badge.icon}</div>
          <p className="text-gray-700 leading-relaxed">
            Well, well, well, look at you, earning the <span className="font-semibold">{badge.name}</span>! 
            Your dating game is officially legendary… or at least uniquely you. Keep rocking (or dodging) 
            those chats to show the world what you're made of!
          </p>
        </div>

        <Button 
          onClick={onClose} 
          className="w-full bg-brand hover:bg-brand/90 text-white font-semibold py-3"
        >
          Got It!
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default BadgeUnlockedModal;
