
export interface User {
  id: string;
  name: string;
  email: string;
  profilePhoto: string;
  birthday: string;
  friends: string[];
  walletBalance: number;
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
}

export interface Contribution {
  userId: string;
  amount: number;
  date: string;
  message?: string;
}
