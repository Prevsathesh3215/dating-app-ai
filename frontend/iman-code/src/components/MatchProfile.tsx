
import { User } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, MapPin, Heart } from 'lucide-react';

interface MatchProfileProps {
  user: User;
  onBack: () => void;
}

const MatchProfile = ({ user, onBack }: MatchProfileProps) => {
  // Calculate average ratings
  const getAverageRating = (ratings: number[]) => {
    if (ratings.length === 0) return 0;
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  };

  const avgCommunication = getAverageRating(user.ratings.communication);
  const avgRespectfulness = getAverageRating(user.ratings.respectfulness);
  const avgAuthenticity = getAverageRating(user.ratings.authenticity || []);

  // Available badges for this user
  const earnedBadges = user.badges.filter(badge => badge.earned);

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
            {earnedBadges.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Badges</h3>
                <div className="flex flex-wrap gap-2">
                  {earnedBadges.map((badge) => (
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

            {/* Ratings */}
            {(user.ratings.communication.length > 0 || user.ratings.respectfulness.length > 0 || (user.ratings.authenticity && user.ratings.authenticity.length > 0)) && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Reviews</h3>
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
                                i < Math.floor(avgAuthenticity) 
                                  ? 'text-pink-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                          {avgAuthenticity.toFixed(1)} ({user.ratings.authenticity.length} reviews)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="pb-8"></div>
      </div>
    </div>
  );
};

export default MatchProfile;
