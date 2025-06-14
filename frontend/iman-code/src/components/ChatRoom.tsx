
import { useState, useEffect, useRef } from 'react';
import { User, Match, ChatMessage } from '../types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, User as UserIcon } from 'lucide-react';
import ReviewModal from './ReviewModal';

interface ChatRoomProps {
  match: Match;
  currentUser: User;
  messages: ChatMessage[];
  onSendMessage: (message: ChatMessage) => void;
  onBack: () => void;
  onViewProfile: (user: User) => void;
  onSubmitReview: (userId: string, ratings: { communication: number; respectfulness: number; authenticity: number }) => void;
}

const ChatRoom = ({ match, currentUser, messages, onSendMessage, onBack, onViewProfile, onSubmitReview }: ChatRoomProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [hasShownReviewPrompt, setHasShownReviewPrompt] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Calculate word count for this conversation
  const wordCount = messages.reduce((count, message) => {
    return count + message.text.split(' ').length;
  }, 0);

  // Check if we should show review modal (after 100 words exchanged)
  useEffect(() => {
    if (wordCount >= 100 && !hasShownReviewPrompt) {
      setShowReviewModal(true);
      setHasShownReviewPrompt(true);
    }
  }, [wordCount, hasShownReviewPrompt]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      senderId: currentUser.id,
      timestamp: new Date()
    };

    onSendMessage(message);
    setNewMessage('');

    // Simulate response from the other user (for demo purposes)
    setTimeout(() => {
      const responses = [
        "That's really interesting!",
        "I totally agree with you!",
        "Tell me more about that!",
        "Haha, that's funny!",
        "What do you think about...?",
        "I love that idea!",
        "That sounds amazing!",
        "I've never thought about it that way.",
        "You seem really thoughtful!",
        "Thanks for sharing that with me!"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        senderId: match.user.id,
        timestamp: new Date()
      };

      onSendMessage(responseMessage);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleReviewSubmit = (ratings: { communication: number; respectfulness: number; authenticity: number }) => {
    onSubmitReview(match.user.id, ratings);
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <img
            src={match.user.photo}
            alt={match.user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          
          <div className="flex-1">
            <h3 className="font-semibold">{match.user.name}</h3>
            <p className="text-sm opacity-90">
              {wordCount} words exchanged
              {wordCount >= 100 && " • Can rate after chat"}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewProfile(match.user)}
            className="text-white hover:bg-white/20 p-2"
          >
            <UserIcon className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">👋</div>
            <p className="text-gray-600">Say hello to start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.senderId === currentUser.id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                    : 'bg-white text-gray-800 shadow-sm'
                }`}
              >
                <p>{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.senderId === currentUser.id ? 'text-white/70' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        user={match.user}
        onSubmitReview={handleReviewSubmit}
      />
    </div>
  );
};

export default ChatRoom;
