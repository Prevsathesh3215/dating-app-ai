import { User, Match, ChatMessage } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowLeft, Star, MessageSquare, Heart, TrendingUp, MapPin, Briefcase, GraduationCap, Trash2, ChevronRight } from 'lucide-react';

interface UserProfileProps {
  user: User;
  matches: Match[];
  messages: { [key: string]: ChatMessage[] };
  unmatchedCount?: number;
  onBack: () => void;
  onDeleteAccount: () => void;
  onViewAllBadges: () => void;
}

const UserProfile = ({ user, matches, messages, unmatchedCount = 0, onBack, onDeleteAccount, onViewAllBadges }: UserProfileProps) => {
  // Fix broken image URLs
  const getValidPhotoUrl = (photo: string) => {
    if (!photo || photo.includes('broken') || photo === '/placeholder.svg') {
      return 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=600&fit=crop&crop=face';
    }
    return photo;
  };

  // Calculate stats
  const totalMatches = matches.length;
  const totalConversations = Object.keys(messages).length; // Changed from totalMessages
  const totalWords = Object.values(messages).reduce((total, messageList) => {
    return total + messageList.reduce((wordCount, message) => {
      return wordCount + message.text.split(' ').length;
    }, 0);
  }, 0);

  // Calculate matches with meaningful conversations (100+ words each)
  const matchesWithMeaningfulConversations = Object.keys(messages).filter(matchId => {
    const matchMessages = messages[matchId] || [];
    const wordCount = matchMessages.reduce((total, message) => {
      return total + message.text.split(' ').length;
    }, 0);
    return wordCount >= 100;
  }).length;

  // Generate membership date - use current year for new users (no matches/conversations)
  const generateMembershipDate = () => {
    // If user is completely new (no matches or conversations), use current year
    if (totalMatches === 0 && totalConversations === 0) {
      return new Date().getFullYear();
    }
    
    // Otherwise, use random year between 2020-2024 for demo purposes
    const years = [2020, 2021, 2022, 2023, 2024];
    const randomYear = years[Math.floor(Math.random() * years.length)];
    return randomYear;
  };

  const memberSince = generateMembershipDate();

  // Generate AI Rizz Review
  const generateRizzReview = () => {
    if (matchesWithMeaningfulConversations < 3) return null;

    const conversationStyles = [
      "Your conversation game is absolutely fire! 🔥 You've got that perfect balance of charm and authenticity that keeps matches engaged.",
      "You're a smooth operator with words! Your ability to keep conversations flowing naturally shows real social finesse.",
      "Your rizz is on point! You know exactly when to be playful and when to be genuine, creating meaningful connections.",
      "You've mastered the art of digital flirting! Your messages show confidence without being overwhelming.",
      "Your conversation skills are impressive! You ask great questions and know how to keep the energy up.",
    ];

    const messageAnalysis = [
      "You strike the perfect balance between being interested and interesting.",
      "Your timing is excellent - you know when to respond quickly and when to let anticipation build.",
      "You're great at reading the room and matching your match's energy level.",
      "Your humor game is strong, and you know how to make conversations memorable.",
      "You show genuine curiosity about your matches, which makes them feel valued.",
    ];

    const improvements = [
      "Keep being yourself - authenticity is your strongest asset!",
      "Your natural charm shines through in every conversation.",
      "You've found your groove, and it's working perfectly!",
      "Your communication style creates real connections beyond just surface-level chat.",
      "You're building the kind of rapport that leads to great dates!",
    ];

    const randomStyle = conversationStyles[Math.floor(Math.random() * conversationStyles.length)];
    const randomAnalysis = messageAnalysis[Math.floor(Math.random() * messageAnalysis.length)];
    const randomImprovement = improvements[Math.floor(Math.random() * improvements.length)];

    return `${randomStyle} ${randomAnalysis} ${randomImprovement}`;
  };

  const rizzReview = generateRizzReview();

  // Calculate average ratings
  const getAverageRating = (ratings: number[]) => {
    if (ratings.length === 0) return 0;
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  };

  const avgCommunication = getAverageRating(user.ratings.communication);
  const avgRespectfulness = getAverageRating(user.ratings.respectfulness);
  const avgAuthenticity = getAverageRating(user.ratings.authenticity || []);

  // Check if user has any actual reviews
  const hasReviews = user.ratings.communication.length > 0 || 
                    user.ratings.respectfulness.length > 0 || 
                    (user.ratings.authenticity && user.ratings.authenticity.length > 0);

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

  // Available badges (extended for demo)
  const availableBadges = [
    { 
      id: 'icebreaker', 
      name: 'Icebreaker Pro', 
      description: 'Sent first message in 3+ chats', 
      icon: '🎯',
      earned: totalConversations >= 3 && matches.some(match => {
        const matchMessages = messages[match.id] || [];
        return matchMessages.length > 0 && matchMessages[0].senderId === user.id;
      })
    },
    { 
      id: 'respectful', 
      name: 'Respectful Responder', 
      description: 'Received 4+/5 in Respectfulness from 2+ reviews', 
      icon: '🌟',
      earned: user.ratings.respectfulness.length >= 2 && avgRespectfulness >= 4
    },
    { 
      id: 'conversationalist', 
      name: 'Great Conversationalist', 
      description: 'Exchanged 1000+ words with someone', 
      icon: '💬',
      earned: totalWords >= 1000
    },
    { 
      id: 'popular', 
      name: 'Popular Match', 
      description: 'Matched with 5+ people', 
      icon: '🔥',
      earned: totalMatches >= 5
    },
    { 
      id: 'dry_texter', 
      name: 'Dry Texter', 
      description: 'Sent 3 consecutive one-word replies in a conversation', 
      icon: '🏜️',
      earned: checkDryTexterPattern()
    }
  ];

  const handleDeleteAccount = () => {
    // Clear all localStorage data
    localStorage.clear();
    // Call the parent function to reset app state
    onDeleteAccount();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-brand px-4 py-6">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/10 mr-4 p-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-white">My Profile</h1>
        </div>
      </div>

      <div className="px-4 -mt-12">
        {/* Profile Card */}
        <Card className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="relative">
            {/* Main Photo */}
            <div className="aspect-[3/4] bg-gray-200 rounded-t-2xl overflow-hidden">
              <img
                src={getValidPhotoUrl(user.photo)}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Profile Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-1">{user.name}, {user.age}</h2>
                <div className="flex items-center mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">2 miles away</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <CardContent className="p-6">
            {/* Basic Info - UPDATED STYLING */}
            <div className="space-y-4 mb-6">
              {/* Gender */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Star className="w-4 h-4 text-brand" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Gender</p>
                  <p className="font-semibold text-gray-800">{user.gender}</p>
                </div>
              </div>
              {/* Looking for - FIXED ALIGNMENT */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Heart className="w-4 h-4 text-brand" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Looking for</p>
                  <p className="font-semibold text-gray-800 leading-relaxed">{user.relationshipGoal}</p>
                </div>
              </div>
              {/* Life Phase */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <GraduationCap className="w-4 h-4 text-brand" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Life Phase</p>
                  <p className="font-semibold text-gray-800">{user.lifePhase}</p>
                </div>
              </div>
            </div>
            {/* Bio */}
            {user.bio && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">About me</h3>
                <p className="text-gray-600 leading-relaxed">{user.bio}</p>
              </div>
            )}
            {/* Earned Badges */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">My Badges</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onViewAllBadges}
                  className="text-brand hover:bg-pink-50 px-3 py-1 h-auto"
                >
                  View All Badges
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableBadges.filter(badge => badge.earned).map(badge => (
                  <div
                    key={badge.id}
                    className="bg-pink-100 border border-pink-200 rounded-full px-3 py-1 flex items-center space-x-2"
                  >
                    <span className="text-sm">{badge.icon}</span>
                    <span className="text-xs font-medium text-pink-800">{badge.name}</span>
                  </div>
                ))}
                {availableBadges.filter(badge => badge.earned).length === 0 && (
                  <p className="text-gray-500 text-sm">No badges earned yet. Keep using the app to unlock them!</p>
                )}
              </div>
            </div>
            {/* Reviews Section - Always show, with message if no reviews */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 mb-1">Reviews</h3>
              {hasReviews ? (
                <>
                  <div className="text-gray-600 text-xs mb-3">
                    Average rating based on {Math.max(user.ratings.communication.length, user.ratings.respectfulness.length, user.ratings.authenticity?.length || 0)} reviews
                  </div>
                  <div className="space-y-3">
                    {user.ratings.communication.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-black font-medium">Communication</span>
                          <span className="text-xs text-black font-medium">- {avgCommunication.toFixed(1)}/5</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} width="12" height="12" viewBox="0 0 24 24">
                              <polygon
                                points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.8 5.8 21 7 14 2 9.3 9 8.5 12 2"
                                fill={i < Math.round(avgCommunication) ? "#ec4899" : "none"}
                                stroke="#ec4899"
                                strokeWidth="2"
                              />
                            </svg>
                          ))}
                        </div>
                      </div>
                    )}
                    {user.ratings.respectfulness.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-black font-medium">Respectfulness</span>
                          <span className="text-xs text-black font-medium">- {avgRespectfulness.toFixed(1)}/5</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} width="12" height="12" viewBox="0 0 24 24">
                              <polygon
                                points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.8 5.8 21 7 14 2 9.3 9 8.5 12 2"
                                fill={i < Math.round(avgRespectfulness) ? "#ec4899" : "none"}
                                stroke="#ec4899"
                                strokeWidth="2"
                              />
                            </svg>
                          ))}
                        </div>
                      </div>
                    )}
                    {user.ratings.authenticity && user.ratings.authenticity.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-black font-medium">Authenticity</span>
                          <span className="text-xs text-black font-medium">- {avgAuthenticity.toFixed(1)}/5</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} width="12" height="12" viewBox="0 0 24 24">
                              <polygon
                                points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.8 5.8 21 7 14 2 9.3 9 8.5 12 2"
                                fill={i < Math.round(avgAuthenticity) ? "#ec4899" : "none"}
                                stroke="#ec4899"
                                strokeWidth="2"
                              />
                            </svg>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-gray-500 text-sm">
                  You haven't received any reviews yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Card - Updated Layout */}
        <Card className="bg-white rounded-2xl shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <h3 className="font-bold text-gray-800 text-lg flex items-center">
                  Activity
                  <TrendingUp className="w-5 h-5 ml-2 text-brand" />
                </h3>
              </div>
              <div className="text-gray-600 text-sm">
                Member since {memberSince}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-brand mb-2">{totalMatches}</div>
                <div className="text-sm text-gray-600 font-medium">Matches</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-brand mb-2">{totalConversations}</div>
                <div className="text-sm text-gray-600 font-medium">Conversations</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-brand mb-2">{unmatchedCount}</div>
                <div className="text-sm text-gray-600 font-medium">Unmatched</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Rizz Review Card */}
        <Card className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl shadow-lg mb-6">
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-brand" />
              Rizz Skill
            </h3>
            {rizzReview ? (
              <div className="text-center">
                <div className="text-4xl font-bold text-brand mb-3">✨ AI Review ✨</div>
                <p className="text-gray-700 text-sm leading-relaxed">{rizzReview}</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-400 mb-3">🤖</div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Your AI rizz review will be generated once you exchange 100+ words with at least 3 different matches. 
                  Keep chatting to unlock your personalized flirting analysis!
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  Progress: {matchesWithMeaningfulConversations}/3 meaningful conversations
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Account Link */}
        <div className="text-center pb-8">
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-gray-500 text-sm underline hover:text-gray-700 transition-colors">
                Delete Account
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-center mb-4">
                  Delete Account
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-gray-600 text-center">
                  This action cannot be undone. All your data, matches, and messages will be permanently deleted.
                </p>
                
                <Button 
                  onClick={handleDeleteAccount}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Proceed to Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
