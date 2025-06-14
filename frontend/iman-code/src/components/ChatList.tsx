
import { Match, ChatMessage } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ChatListProps {
  matches: Match[];
  messages: { [key: string]: ChatMessage[] };
  onStartChat: (match: Match) => void;
}

const ChatList = ({ matches, messages, onStartChat }: ChatListProps) => {
  const getLastMessage = (matchId: string) => {
    const matchMessages = messages[matchId] || [];
    return matchMessages[matchMessages.length - 1];
  };

  const getTimeAgo = (date: Date | string) => {
    const now = new Date();
    const targetDate = new Date(date); // Convert to Date object if it's a string
    const diff = now.getTime() - targetDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (matches.length === 0) {
    return (
      <div className="p-6 text-center">
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Matches Yet</h2>
            <p className="text-gray-600">Start swiping to find your perfect match!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">Your Matches</h2>
      
      <div className="space-y-3">
        {matches.map((match) => {
          const lastMessage = getLastMessage(match.id);
          const messageCount = messages[match.id]?.length || 0;
          
          return (
            <Card
              key={match.id}
              className="bg-white/95 backdrop-blur-sm hover:bg-white cursor-pointer transition-all duration-200 hover:scale-105"
              onClick={() => onStartChat(match)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={match.user.photo}
                      alt={match.user.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {messageCount === 0 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-800 truncate">{match.user.name}</h3>
                      <span className="text-xs text-gray-500">
                        {lastMessage ? getTimeAgo(lastMessage.timestamp) : getTimeAgo(match.matchedAt)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">
                        {lastMessage 
                          ? lastMessage.text 
                          : "You matched! Say hello 👋"
                        }
                      </p>
                      
                      <div className="flex items-center space-x-2">
                        {match.wordCount >= 2000 && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            Can Rate
                          </Badge>
                        )}
                        {messageCount > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {messageCount}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Show badges */}
                    {match.user.badges.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {match.user.badges.slice(0, 2).map((badge) => (
                          <span key={badge.id} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            {badge.icon}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;
