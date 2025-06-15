
import { useState, useEffect } from 'react';
import SplashScreen from '../components/SplashScreen';
import ProfileForm from '../components/ProfileForm';
import PhotoUpload from '../components/PhotoUpload';
import MatchingInterface from '../components/MatchingInterface';
import ChatList from '../components/ChatList';
import ChatRoom from '../components/ChatRoom';
import UserProfile from '../components/UserProfile';
import BadgesScreen from '../components/BadgesScreen';
import MatchProfile from '../components/MatchProfile';
import { User, Match, ChatMessage } from '../types';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'splash' | 'profile' | 'photo-upload' | 'matching' | 'chats' | 'chat-room' | 'user-profile' | 'badges' | 'match-profile'>('splash');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [messages, setMessages] = useState<{ [key: string]: ChatMessage[] }>({});
  const [unmatchedCount, setUnmatchedCount] = useState(0);

  // Fix broken image URLs
  const getValidPhotoUrl = (photo: string) => {
    if (!photo || photo.includes('broken') || photo === '/placeholder.svg') {
      return 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=600&fit=crop&crop=face';
    }
    return photo;
  };

  // Safe localStorage operations with error handling
  const safeSetLocalStorage = (key: string, value: any) => {
    try {
      // For user data, exclude the photo to reduce size
      if (key === 'currentUser' && value?.photo) {
        const userWithoutPhoto = { ...value };
        delete userWithoutPhoto.photo;
        localStorage.setItem(key, JSON.stringify(userWithoutPhoto));
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn(`Failed to save ${key} to localStorage:`, error);
      // Clear some localStorage if quota exceeded
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        try {
          localStorage.clear();
          console.log('Cleared localStorage due to quota exceeded');
        } catch (clearError) {
          console.warn('Failed to clear localStorage:', clearError);
        }
      }
    }
  };

  const safeGetLocalStorage = (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(`Failed to read ${key} from localStorage:`, error);
      return null;
    }
  };

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = safeGetLocalStorage('currentUser');
    if (savedUser) {
      // Restore the photo placeholder since we don't store it, but fix broken URLs
      const userWithPhoto = { ...savedUser, photo: getValidPhotoUrl(savedUser.photo || '/placeholder.svg') };
      setCurrentUser(userWithPhoto);
      // Skip splash screen if user already exists
      setCurrentView('matching');
    }
    
    const savedMatches = safeGetLocalStorage('matches');
    if (savedMatches) {
      // Fix broken photo URLs in matches as well
      const fixedMatches = savedMatches.map((match: Match) => ({
        ...match,
        user: {
          ...match.user,
          photo: getValidPhotoUrl(match.user.photo)
        }
      }));
      setMatches(fixedMatches);
    }

    const savedMessages = safeGetLocalStorage('messages');
    if (savedMessages) {
      setMessages(savedMessages);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      safeSetLocalStorage('currentUser', currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    safeSetLocalStorage('matches', matches);
  }, [matches]);

  useEffect(() => {
    safeSetLocalStorage('messages', messages);
  }, [messages]);

  const handleSplashComplete = () => {
    setCurrentView('profile');
  };

  const handleBackToSplash = () => {
    setCurrentView('splash');
  };

  const handleProfileComplete = (user: User) => {
    setCurrentUser(user);
    setCurrentView('photo-upload');
  };

  const handlePhotoUploadComplete = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setCurrentView('matching');
  };

  const handlePhotoUploadSkip = () => {
    setCurrentView('matching');
  };

  const handleMatch = (match: Match) => {
    // Fix broken photo URLs when adding new matches
    const fixedMatch = {
      ...match,
      user: {
        ...match.user,
        photo: getValidPhotoUrl(match.user.photo)
      }
    };
    setMatches(prev => [...prev, fixedMatch]);
  };

  const handleStartChat = (match: Match) => {
    setSelectedMatch(match);
    setCurrentView('chat-room');
  };

  const handleSendMessage = (matchId: string, message: ChatMessage) => {
    setMessages(prev => ({
      ...prev,
      [matchId]: [...(prev[matchId] || []), message]
    }));
  };

  const handleBackToChats = () => {
    setSelectedMatch(null);
    setCurrentView('chats');
  };

  const handleViewProfile = () => {
    setCurrentView('user-profile');
  };

  const handleViewAllBadges = () => {
    setCurrentView('badges');
  };

  const handleViewMatchProfile = (user: User) => {
    setViewingUser(user);
    setCurrentView('match-profile');
  };

  const handleBackFromMatchProfile = () => {
    setViewingUser(null);
    setCurrentView('chat-room');
  };

  const handleSubmitReview = (userId: string, ratings: { communication: number; respectfulness: number; authenticity: number }) => {
    // Update the user's ratings in matches
    setMatches(prev => prev.map(match => {
      if (match.user.id === userId) {
        return {
          ...match,
          user: {
            ...match.user,
            ratings: {
              ...match.user.ratings,
              communication: [...match.user.ratings.communication, ratings.communication],
              respectfulness: [...match.user.ratings.respectfulness, ratings.respectfulness],
              authenticity: [...(match.user.ratings.authenticity || []), ratings.authenticity]
            }
          }
        };
      }
      return match;
    }));
  };

  const handleBadgeUnlocked = (badge: any) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        badges: [...(currentUser.badges || []), badge]
      };
      setCurrentUser(updatedUser);
    }
  };

  const handleDeleteAccount = () => {
    // Reset all state to initial values
    setCurrentUser(null);
    setCurrentView('profile');
    setSelectedMatch(null);
    setViewingUser(null);
    setMatches([]);
    setMessages({});
    setUnmatchedCount(0);
  };

  const handleUnmatch = (userId: string) => {
    // Remove the match from matches array
    setMatches(prev => prev.filter(match => match.user.id !== userId));
    
    // Remove messages for this match
    setMessages(prev => {
      const matchId = Object.keys(prev).find(id => {
        const match = matches.find(m => m.id === id);
        return match && match.user.id === userId;
      });
      
      if (matchId) {
        const newMessages = { ...prev };
        delete newMessages[matchId];
        return newMessages;
      }
      return prev;
    });
    
    // Increment unmatched count
    setUnmatchedCount(prev => prev + 1);
    
    // Go back to previous view
    setViewingUser(null);
    setCurrentView('chat-room');
  };

  // Show splash screen first
  if (currentView === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (!currentUser && currentView === 'profile') {
    return (
      <div className="min-h-screen bg-white">
        <ProfileForm 
          onComplete={handleProfileComplete} 
          onBack={handleBackToSplash}
        />
      </div>
    );
  }

  if (currentUser && currentView === 'photo-upload') {
    return (
      <PhotoUpload 
        user={currentUser}
        onComplete={handlePhotoUploadComplete}
        onSkip={handlePhotoUploadSkip}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Navigation */}
      <nav className="bg-brand shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Unfiltered</h1>
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentView('matching')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  currentView === 'matching' 
                    ? 'bg-white text-brand' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Discover
              </button>
              <button
                onClick={() => setCurrentView('chats')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all relative ${
                  currentView === 'chats' 
                    ? 'bg-white text-brand' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Chats
                {matches.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {matches.length}
                  </span>
                )}
              </button>
              <button
                onClick={handleViewProfile}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  currentView === 'user-profile' 
                    ? 'bg-white text-brand' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Profile
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-md mx-auto">
        {currentView === 'matching' && currentUser && (
          <MatchingInterface 
            currentUser={currentUser} 
            onMatch={handleMatch}
            existingMatches={matches}
          />
        )}
        
        {currentView === 'chats' && (
          <ChatList 
            matches={matches} 
            messages={messages}
            onStartChat={handleStartChat}
          />
        )}
        
        {currentView === 'chat-room' && selectedMatch && currentUser && (
          <ChatRoom 
            match={selectedMatch}
            currentUser={currentUser}
            messages={messages[selectedMatch.id] || []}
            onSendMessage={(message) => handleSendMessage(selectedMatch.id, message)}
            onBack={handleBackToChats}
            onViewProfile={handleViewMatchProfile}
            onSubmitReview={handleSubmitReview}
          />
        )}

        {currentView === 'user-profile' && currentUser && (
          <UserProfile 
            user={currentUser}
            matches={matches}
            messages={messages}
            unmatchedCount={unmatchedCount}
            onBack={() => setCurrentView('matching')}
            onDeleteAccount={handleDeleteAccount}
            onViewAllBadges={handleViewAllBadges}
          />
        )}

        {currentView === 'badges' && currentUser && (
          <BadgesScreen
            user={currentUser}
            totalMatches={matches.length}
            totalMessages={Object.values(messages).reduce((total, messageList) => total + messageList.length, 0)}
            totalWords={Object.values(messages).reduce((total, messageList) => {
              return total + messageList.reduce((wordCount, message) => {
                return wordCount + message.text.split(' ').length;
              }, 0);
            }, 0)}
            messages={messages}
            onBack={() => setCurrentView('user-profile')}
            onBadgeUnlocked={handleBadgeUnlocked}
          />
        )}

        {currentView === 'match-profile' && viewingUser && (
          <MatchProfile
            user={viewingUser}
            onBack={handleBackFromMatchProfile}
            onUnmatch={handleUnmatch}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
