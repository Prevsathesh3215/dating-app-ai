import { User, Match, ChatMessage } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Star, MessageSquare, Heart, TrendingUp, MapPin, Briefcase, GraduationCap, Trash2, ChevronRight } from 'lucide-react';

interface UserProfileProps {
  user: User;
  matches: Match[];
  messages: { [key: string]: ChatMessage[] };
  onBack: () => void;
  onDeleteAccount: () => void;
  onViewAllBadges: () => void;
}

const UserProfile = ({ user, matches, messages, onBack, onDeleteAccount, onViewAllBadges }: UserProfileProps) => {
  // Calculate stats
  const totalMatches = matches.length;
  const totalMessages = Object.values(messages).reduce((total, messageList) => total + messageList.length, 0);
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

  // Available badges (extended for demo)
  const availableBadges = [
    { 
      id: 'icebreaker', 
      name: 'Icebreaker Pro', 
      description: 'Sent first message in 3+ chats', 
      icon: '🎯',
      earned: totalMessages >= 3 && matches.some(match => {
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
        {/* Profile Card - Updated with new brand color */}
        <Card className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="relative">
            {/* Main Photo */}
            <div className="aspect-[3/4] bg-gray-200 rounded-t-2xl overflow-hidden">
              <img
                src={user.photo}
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
            {/* Basic Info */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-brand" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Looking for</p>
                  <p className="font-semibold text-gray-800">{user.relationshipGoal}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-brand" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-semibold text-gray-800">{user.gender}</p>
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
                {availableBadges
                  .filter(badge => badge.earned)
                  .map((badge) => (
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
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="bg-white rounded-2xl shadow-lg mb-6">
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-brand" />
              My Activity
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-brand">{totalMatches}</div>
                <div className="text-xs text-gray-500">Matches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-brand">{totalMessages}</div>
                <div className="text-xs text-gray-500">Messages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-brand">{totalWords}</div>
                <div className="text-xs text-gray-500">Words</div>
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

        {/* Reviews Card - Always show this section */}
        <Card className="bg-white rounded-2xl shadow-lg mb-6">
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-brand" />
              Reviews
            </h3>
            {(user.ratings.communication.length > 0 || user.ratings.respectfulness.length > 0 || (user.ratings.authenticity && user.ratings.authenticity.length > 0)) ? (
              <div className="space-y-4">
                {user.ratings.communication.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Communication</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(avgCommunication) 
                                ? 'text-pink-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {avgCommunication.toFixed(1)} ({user.ratings.communication.length} reviews)
                      </span>
                    </div>
                  </div>
                )}
                
                {user.ratings.respectfulness.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Respectfulness</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(avgRespectfulness) 
                                ? 'text-pink-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {avgRespectfulness.toFixed(1)} ({user.ratings.respectfulness.length} reviews)
                      </span>
                    </div>
                  </div>
                )}

                {user.ratings.authenticity && user.ratings.authenticity.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Authenticity</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(getAverageRating(user.ratings.authenticity || [])) 
                                ? 'text-pink-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {getAverageRating(user.ratings.authenticity || []).toFixed(1)} ({user.ratings.authenticity.length} reviews)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center">No reviews yet</p>
            )}
          </CardContent>
        </Card>

        {/* Delete Account Section */}
        <Card className="bg-red-50 border-red-200 rounded-2xl shadow-lg mb-6">
          <CardContent className="p-6">
            <h3 className="font-bold text-red-800 mb-2">Delete Account</h3>
            <p className="text-red-600 text-sm mb-4">
              This action cannot be undone. All your data, matches, and messages will be permanently deleted.
            </p>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete My Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data including matches, messages, and profile information.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Yes, delete my account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        <div className="pb-8"></div>
      </div>
    </div>
  );
};

export default UserProfile;
