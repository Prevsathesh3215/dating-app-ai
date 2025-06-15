export interface User {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Non-Binary' | 'Prefer Not to Say';
  relationshipGoal: string; // Changed to string to allow custom formatted text
  bio: string;
  photo: string;
  badges: Badge[];
  flirtingScore?: number;
  flirtingFeedback?: string;
  ratings: {
    communication: number[];
    respectfulness: number[];
    authenticity?: number[];
  };
  lifePhase: string; // <-- Added property for user's life phase
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}

export interface Match {
  id: string;
  user: User;
  matchedAt: Date;
  wordCount: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  timestamp: Date;
}

export interface PotentialMatch extends User {
  // This represents users that can be swiped on
}
