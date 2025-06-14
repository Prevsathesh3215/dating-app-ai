
import { useState, useEffect } from 'react';
import { User, Match, PotentialMatch } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, X } from 'lucide-react';

interface MatchingInterfaceProps {
  currentUser: User;
  onMatch: (match: Match) => void;
  existingMatches: Match[];
}

// Mock users for demo with diverse profiles and photos
const mockUsers: PotentialMatch[] = [
  {
    id: '2',
    name: 'Sarah',
    age: 28,
    gender: 'Female',
    relationshipGoal: 'Long-Term Relationship',
    bio: 'Love hiking, reading, and trying new restaurants. Looking for genuine connections! 📚🥾',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face',
    badges: [
      { id: 'icebreaker', name: 'Icebreaker Pro', description: 'Sent first message in 3+ chats', icon: '🎯', earned: true }
    ],
    ratings: { communication: [4, 5, 4], respectfulness: [5, 5, 4] }
  },
  {
    id: '3',
    name: 'Alex',
    age: 32,
    gender: 'Male',
    relationshipGoal: 'Casual Dates',
    bio: 'Adventure seeker, coffee enthusiast, dog lover. Life is too short for boring conversations! ☕🐕',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face',
    badges: [
      { id: 'respectful', name: 'Respectful Responder', description: 'Received 4+/5 in Respectfulness from 2+ reviews', icon: '🌟', earned: true }
    ],
    ratings: { communication: [4, 4, 5], respectfulness: [5, 5, 5] }
  },
  {
    id: '4',
    name: 'Jordan',
    age: 26,
    gender: 'Non-Binary',
    relationshipGoal: 'Friendship',
    bio: 'Artist, musician, and nature lover. Always up for deep conversations and creative collaborations! 🎨🎵',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face',
    badges: [],
    ratings: { communication: [3, 4, 4], respectfulness: [4, 4, 5] }
  },
  {
    id: '5',
    name: 'Maya',
    age: 29,
    gender: 'Female',
    relationshipGoal: 'Long-Term Relationship',
    bio: 'Yoga instructor, foodie, travel enthusiast. Seeking someone to explore life\'s adventures with! 🧘‍♀️✈️',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face',
    badges: [
      { id: 'icebreaker', name: 'Icebreaker Pro', description: 'Sent first message in 3+ chats', icon: '🎯', earned: true },
      { id: 'respectful', name: 'Respectful Responder', description: 'Received 4+/5 in Respectfulness from 2+ reviews', icon: '🌟', earned: true }
    ],
    ratings: { communication: [5, 4, 5], respectfulness: [5, 5, 4] }
  },
  {
    id: '6',
    name: 'Marcus',
    age: 31,
    gender: 'Male',
    relationshipGoal: 'Casual Dates',
    bio: 'Tech entrepreneur by day, salsa dancer by night. Love exploring new cultures and cuisines! 💃🌮',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face',
    badges: [
      { id: 'conversationalist', name: 'Great Conversationalist', description: 'Exchanged 1000+ words with someone', icon: '💬', earned: true }
    ],
    ratings: { communication: [5, 5, 4], respectfulness: [4, 5, 5] }
  },
  {
    id: '7',
    name: 'Emma',
    age: 25,
    gender: 'Female',
    relationshipGoal: 'Friendship',
    bio: 'Graduate student, bookworm, and amateur photographer. Always down for coffee and deep conversations! 📸☕',
    photo: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=600&fit=crop&crop=face',
    badges: [],
    ratings: { communication: [4, 3, 4], respectfulness: [5, 4, 5] }
  },
  {
    id: '8',
    name: 'Diego',
    age: 30,
    gender: 'Male',
    relationshipGoal: 'Long-Term Relationship',
    bio: 'Chef, fitness enthusiast, and weekend hiker. Looking for someone who appreciates good food and outdoor adventures! 🍳🏔️',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face',
    badges: [
      { id: 'popular', name: 'Popular Match', description: 'Matched with 5+ people', icon: '🔥', earned: true }
    ],
    ratings: { communication: [4, 5, 5], respectfulness: [5, 5, 4] }
  },
  {
    id: '9',
    name: 'Zara',
    age: 27,
    gender: 'Female',
    relationshipGoal: 'Intimacy Without Commitment',
    bio: 'Marketing manager, wine lover, and travel blogger. Life\'s too short for boring dates! 🍷✈️',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=face',
    badges: [
      { id: 'icebreaker', name: 'Icebreaker Pro', description: 'Sent first message in 3+ chats', icon: '🎯', earned: true },
      { id: 'conversationalist', name: 'Great Conversationalist', description: 'Exchanged 1000+ words with someone', icon: '💬', earned: true }
    ],
    ratings: { communication: [5, 4, 5], respectfulness: [4, 5, 4] }
  },
  {
    id: '10',
    name: 'Kai',
    age: 24,
    gender: 'Non-Binary',
    relationshipGoal: 'Friendship',
    bio: 'Film student, indie music lover, and part-time barista. Always looking for creative collaborations and genuine friendships! 🎬🎵',
    photo: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=600&fit=crop&crop=face',
    badges: [],
    ratings: { communication: [3, 4, 3], respectfulness: [5, 5, 5] }
  },
  {
    id: '11',
    name: 'Aria',
    age: 33,
    gender: 'Female',
    relationshipGoal: 'Long-Term Relationship',
    bio: 'Veterinarian, animal lover, and weekend gardener. Seeking someone who shares my passion for making the world a better place! 🐾🌱',
    photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=600&fit=crop&crop=face',
    badges: [
      { id: 'respectful', name: 'Respectful Responder', description: 'Received 4+/5 in Respectfulness from 2+ reviews', icon: '🌟', earned: true },
      { id: 'popular', name: 'Popular Match', description: 'Matched with 5+ people', icon: '🔥', earned: true }
    ],
    ratings: { communication: [5, 5, 4], respectfulness: [5, 5, 5] }
  },
  {
    id: '12',
    name: 'Ryan',
    age: 28,
    gender: 'Male',
    relationshipGoal: 'Casual Dates',
    bio: 'Software developer, rock climber, and craft beer enthusiast. Always up for trying new adventures and meeting interesting people! 🧗‍♂️🍺',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&crop=face',
    badges: [
      { id: 'icebreaker', name: 'Icebreaker Pro', description: 'Sent first message in 3+ chats', icon: '🎯', earned: true }
    ],
    ratings: { communication: [4, 4, 5], respectfulness: [4, 4, 4] }
  }
];

const MatchingInterface = ({ currentUser, onMatch, existingMatches }: MatchingInterfaceProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [availableUsers, setAvailableUsers] = useState<PotentialMatch[]>([]);
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [newMatch, setNewMatch] = useState<PotentialMatch | null>(null);

  useEffect(() => {
    // Filter out already matched users and current user
    const matchedUserIds = existingMatches.map(match => match.user.id);
    const filtered = mockUsers.filter(user => 
      user.id !== currentUser.id && 
      !matchedUserIds.includes(user.id)
    );
    setAvailableUsers(filtered);
  }, [currentUser.id, existingMatches]);

  const currentCard = availableUsers[currentCardIndex];

  const handleSwipe = (liked: boolean) => {
    if (!currentCard) return;

    if (liked) {
      // Simulate matching logic (in real app, this would check if the other user liked back)
      const isMatch = Math.random() > 0.5; // 50% chance of match for demo
      
      if (isMatch) {
        const match: Match = {
          id: `${currentUser.id}-${currentCard.id}`,
          user: currentCard,
          matchedAt: new Date(),
          wordCount: 0
        };
        
        onMatch(match);
        setNewMatch(currentCard);
        setShowMatchAnimation(true);
        
        setTimeout(() => {
          setShowMatchAnimation(false);
          setNewMatch(null);
        }, 3000);
      }
    }

    // Move to next card
    if (currentCardIndex < availableUsers.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      // No more cards
      setCurrentCardIndex(0);
    }
  };

  const getAverageRating = (ratings: number[]) => {
    if (ratings.length === 0) return 0;
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  };

  if (!currentCard) {
    return (
      <div className="p-6 text-center">
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No More Profiles</h2>
            <p className="text-gray-600 mb-4">You've seen all available profiles. Check back later for new people!</p>
            <div className="text-6xl mb-4">🔄</div>
            <Button 
              onClick={() => setCurrentCardIndex(0)}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              Start Over
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 relative">
      {/* Match Animation */}
      {showMatchAnimation && newMatch && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4 animate-pulse">
            <div className="text-6xl mb-4">💖</div>
            <h2 className="text-2xl font-bold text-purple-800 mb-2">It's a Match!</h2>
            <p className="text-gray-600 mb-4">You and {newMatch.name} liked each other</p>
            <div className="flex justify-center space-x-4">
              <img
                src={currentUser.photo}
                alt={currentUser.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <img
                src={newMatch.photo}
                alt={newMatch.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <div className="max-w-sm mx-auto">
        <Card className="bg-white rounded-2xl overflow-hidden shadow-2xl transform transition-transform hover:scale-105">
          <div className="relative">
            <img
              src={currentCard.photo}
              alt={currentCard.name}
              className="w-full h-96 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">{currentCard.name}, {currentCard.age}</h2>
                {currentCard.ratings.communication.length >= 5 && (
                  <div className="text-sm bg-white/20 px-2 py-1 rounded-full">
                    ⭐ {getAverageRating([...currentCard.ratings.communication, ...currentCard.ratings.respectfulness]).toFixed(1)}/5
                  </div>
                )}
              </div>
              <p className="text-sm opacity-90 mb-2">{currentCard.relationshipGoal}</p>
            </div>
          </div>
          
          <CardContent className="p-6">
            <p className="text-gray-700 mb-4">{currentCard.bio}</p>
            
            {/* Badges */}
            {currentCard.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {currentCard.badges.slice(0, 2).map((badge) => (
                  <Badge key={badge.id} variant="secondary" className="bg-purple-100 text-purple-800">
                    {badge.icon} {badge.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => handleSwipe(false)}
                size="lg"
                variant="outline"
                className="rounded-full w-16 h-16 border-2 border-gray-300 hover:border-red-400 hover:bg-red-50"
              >
                <X className="w-8 h-8 text-gray-500 hover:text-red-500" />
              </Button>
              <Button
                onClick={() => handleSwipe(true)}
                size="lg"
                className="rounded-full w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
              >
                <Heart className="w-8 h-8 text-white" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress indicator */}
        <div className="flex justify-center mt-4 space-x-2">
          {availableUsers.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentCardIndex ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchingInterface;
