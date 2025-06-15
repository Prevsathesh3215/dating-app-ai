import { useState } from 'react';
import { User } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, MapPin, Heart, UserX, TrendingUp, GraduationCap } from 'lucide-react';
import UnmatchModal from './UnmatchModal';

interface MatchProfileProps {
  user: User;
  onBack: () => void;
  onUnmatch?: (userId: string) => void;
}

const MatchProfile = ({ user, onBack, onUnmatch }: MatchProfileProps) => {
  const [showUnmatchModal, setShowUnmatchModal] = useState(false);

  // Fix broken image URLs
  const getValidPhotoUrl = (photo: string) => {
    if (!photo || photo.includes('broken') || photo === '/placeholder.svg') {
      return 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=600&fit=crop&crop=face';
    }
    return photo;
  };

  const handleUnmatch = () => {
    // Show modal first, then handle unmatch in the modal's onClose
    setShowUnmatchModal(true);
  };

  const handleCloseModal = () => {
    setShowUnmatchModal(false);
    // Now perform the actual unmatch and navigation
    if (onUnmatch) {
      onUnmatch(user.id);
    }
    // Navigate back after modal closes
    setTimeout(() => {
      onBack();
    }, 100);
  };

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

  // Available badges for this user
  const earnedBadges = user.badges.filter(badge => badge.earned);

  // Mock activity data - in a real app this would come from props or API
  const activityStats = {
    totalMatches: Math.floor(Math.random() * 20) + 5, // 5-25 matches
    totalConversations: Math.floor(Math.random() * 15) + 2, // 2-17 conversations
    unmatchedCount: Math.floor(Math.random() * 5) + 1 // 1-6 unmatched
  };

  // Generate membership date - use current year for demo purposes
  const generateMembershipDate = () => {
    const years = [2020, 2021, 2022, 2023, 2024];
    const randomYear = years[Math.floor(Math.random() * years.length)];
    return randomYear;
  };

  const memberSince = generateMembershipDate();

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
          <h1 className="text-xl font-bold text-white">{user.name}'s Profile</h1>
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
            {earnedBadges.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Badges</h3>
                <div className="flex flex-wrap gap-2">
                  {earnedBadges.map(badge => (
                    <div
                      key={badge.id}
                      className="bg-pink-100 border border-pink-200 rounded-full px-3 py-1 flex items-center space-x-2"
                    >
                      <span className="text-sm">{badge.icon}</span>
                      <span className="text-xs font-medium text-pink-800">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Reviews Section - Always show, with message if no reviews */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 mb-2">Reviews</h3>
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
            {/* --- End Reviews Section --- */}
            </div>
          </CardContent>
        </Card>
        {/* Activity Stats Card - Updated Layout */}
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
                <div className="text-4xl font-bold text-brand mb-2">{activityStats.totalMatches}</div>
                <div className="text-sm text-gray-600 font-medium">Matches</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-brand mb-2">{activityStats.totalConversations}</div>
                <div className="text-sm text-gray-600 font-medium">Conversations</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-brand mb-2">{activityStats.unmatchedCount}</div>
                <div className="text-sm text-gray-600 font-medium">Unmatched</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Unmatch Button */}
        <Card className="bg-red-50 border-red-200 rounded-2xl shadow-lg mb-6">
          <CardContent className="p-6">
            <Button
              onClick={handleUnmatch}
              variant="destructive"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
            >
              <UserX className="w-4 h-4 mr-2" />
              Unmatch
            </Button>
          </CardContent>
        </Card>

        <div className="pb-8"></div>
      </div>
      <UnmatchModal
        isOpen={showUnmatchModal}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default MatchProfile;
