
import { useState, useEffect } from 'react';
import { User } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import BadgeUnlockedModal from './BadgeUnlockedModal';

interface BadgesScreenProps {
  user: User;
  totalMatches: number;
  totalMessages: number;
  totalWords: number;
  messages: { [key: string]: any[] };
  onBack: () => void;
  onBadgeUnlocked?: (badge: any) => void;
}

const BadgesScreen = ({ user, totalMatches, totalMessages, totalWords, messages, onBack, onBadgeUnlocked }: BadgesScreenProps) => {
  const [unlockedBadge, setUnlockedBadge] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  // Check for dry texter pattern (3 consecutive one-word messages in any conversation)
  const checkDryTexterPattern = () => {
    for (const matchId in messages) {
      const matchMessages = messages[matchId] || [];
      const userMessages = matchMessages.filter(msg => msg.senderId === user.id);
      
      for (let i = 0; i <= userMessages.length - 3; i++) {
        const consecutiveMessages = userMessages.slice(i, i + 3);
        const allOneWord = consecutiveMessages.every(msg => 
          msg.text.trim().split(' ').length === 1
        );
        
        if (allOneWord) {
          return true;
        }
      }
    }
    return false;
  };

  // All available badges with unlock conditions
  const allBadges = [
    { 
      id: 'icebreaker', 
      name: 'Icebreaker Pro', 
      description: 'Send the first message in 3+ different chats', 
      icon: '🎯',
      requirement: 'Start 3 conversations',
      earned: totalMessages >= 3 && Object.keys(messages).length >= 3
    },
    { 
      id: 'respectful', 
      name: 'Respectful Responder', 
      description: 'Receive an average rating of 4+ stars in Respectfulness from 2+ reviews', 
      icon: '🌟',
      requirement: '4+ stars in Respectfulness (2+ reviews)',
      earned: user.ratings.respectfulness.length >= 2 && 
               (user.ratings.respectfulness.reduce((sum, rating) => sum + rating, 0) / user.ratings.respectfulness.length) >= 4
    },
    { 
      id: 'conversationalist', 
      name: 'Great Conversationalist', 
      description: 'Exchange 1000+ words in conversations with your matches', 
      icon: '💬',
      requirement: 'Exchange 1000+ words total',
      earned: totalWords >= 1000
    },
    { 
      id: 'popular', 
      name: 'Popular Match', 
      description: 'Get matched with 5+ different people', 
      icon: '🔥',
      requirement: 'Get 5+ matches',
      earned: totalMatches >= 5
    },
    { 
      id: 'dry_texter', 
      name: 'Dry Texter', 
      description: 'Send 3 consecutive one-word replies in a single conversation', 
      icon: '🏜️',
      requirement: 'Send 3 one-word messages in a row',
      earned: checkDryTexterPattern()
    },
    { 
      id: 'early_bird', 
      name: 'Early Bird', 
      description: 'Send your first message within 1 hour of matching', 
      icon: '🐦',
      requirement: 'Quick first message (within 1 hour)',
      earned: false // This would require timestamp tracking in a real app
    },
    { 
      id: 'social_butterfly', 
      name: 'Social Butterfly', 
      description: 'Have active conversations with 10+ matches simultaneously', 
      icon: '🦋',
      requirement: 'Active chats with 10+ matches',
      earned: Object.keys(messages).length >= 10
    },
    { 
      id: 'heart_breaker', 
      name: 'Heart Breaker', 
      description: 'Receive 20+ likes in a single day', 
      icon: '💔',
      requirement: '20+ likes in one day',
      earned: false // This would require daily like tracking
    },
    { 
      id: 'storyteller', 
      name: 'Storyteller', 
      description: 'Send messages with an average of 50+ words each', 
      icon: '📚',
      requirement: 'Average 50+ words per message',
      earned: totalMessages > 0 && (totalWords / totalMessages) >= 50
    },
    { 
      id: 'loyal_user', 
      name: 'Loyal User', 
      description: 'Use the app for 30 consecutive days', 
      icon: '👑',
      requirement: 'Use app for 30 days straight',
      earned: false // This would require usage tracking
    },
    { 
      id: 'perfect_match', 
      name: 'Perfect Match', 
      description: 'Have a conversation that exceeds 500 messages with one person', 
      icon: '💕',
      requirement: '500+ messages with one match',
      earned: Object.values(messages).some(messageList => messageList.length >= 500)
    }
  ];

  // Check for newly unlocked badges
  useEffect(() => {
    const earnedBadges = allBadges.filter(badge => badge.earned);
    const previouslyEarnedBadgeIds = (user.badges || []).map(badge => badge.id);
    
    const newlyUnlockedBadge = earnedBadges.find(badge => 
      !previouslyEarnedBadgeIds.includes(badge.id)
    );

    if (newlyUnlockedBadge && onBadgeUnlocked) {
      setUnlockedBadge(newlyUnlockedBadge);
      setShowModal(true);
      onBadgeUnlocked(newlyUnlockedBadge);
    }
  }, [totalMatches, totalMessages, totalWords, messages, user.ratings, user.badges]);

  const earnedBadges = allBadges.filter(badge => badge.earned);
  const lockedBadges = allBadges.filter(badge => !badge.earned);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-brand px-4 py-6 sticky top-0 z-10">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/10 mr-4 p-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-white">All Badges</h1>
        </div>
        <p className="text-white/80 text-sm">
          Collect badges by being active and respectful on the app!
        </p>
      </div>

      <div className="px-4 py-6">
        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              🏆 Earned Badges ({earnedBadges.length})
            </h2>
            <div className="space-y-3">
              {earnedBadges.map((badge) => (
                <Card key={badge.id} className="bg-gradient-to-r from-pink-50 to-red-50 border-pink-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{badge.icon}</div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{badge.name}</h3>
                          <p className="text-sm text-gray-600">{badge.description}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        EARNED
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Locked Badges */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            🔒 Locked Badges ({lockedBadges.length})
          </h2>
          <div className="space-y-3">
            {lockedBadges.map((badge) => (
              <Card key={badge.id} className="bg-gray-50 border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between opacity-60">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl filter grayscale">{badge.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{badge.name}</h3>
                        <p className="text-sm text-gray-600">{badge.description}</p>
                        <p className="text-xs text-brand mt-1">
                          How to unlock: {badge.requirement}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300">
                      LOCKED
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="pb-8"></div>
      </div>

      <BadgeUnlockedModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        badge={unlockedBadge}
      />
    </div>
  );
};

export default BadgesScreen;
