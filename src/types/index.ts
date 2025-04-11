
export interface User {
  id: string;
  name: string;
  email: string;
  profilePhoto: string;
  birthday: string;
  friends: string[];
  walletBalance: number;
  // Added for future enhancements
  relationship?: Record<string, "family" | "friend" | "colleague">;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  type: "birthday" | "wedding" | "housewarming" | "baby_shower" | "other";
  creator: string;
  privacy: "public" | "private";
  participants: string[];
  rsvp: Record<string, "yes" | "no" | "maybe">;
  description?: string;
  location?: string;
}

export interface GiftItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: "small" | "medium" | "large";
  url: string;
  status: "available" | "reserved" | "purchased";
  priority: "low" | "medium" | "high";
  contributors: Contribution[];
  eventId: string;
  imageUrl?: string;
}

export interface Contribution {
  userId: string;
  amount: number;
  date: string;
  message?: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'contribution';
  description: string;
  timestamp: string;
}
