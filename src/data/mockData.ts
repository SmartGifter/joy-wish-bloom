
import { User, Event, GiftItem } from "../types";

export type EventType = "birthday" | "wedding" | "housewarming" | "baby_shower" | "other";

export const mockUsers: User[] = [
  {
    id: "user1",
    name: "Alex Johnson",
    email: "alex@example.com",
    profilePhoto: "https://randomuser.me/api/portraits/men/1.jpg",
    birthday: "1990-05-15",
    friends: ["user2", "user3", "user4", "user5"],
    walletBalance: 500.00
  },
  {
    id: "user2",
    name: "Emma Wilson",
    email: "emma@example.com",
    profilePhoto: "https://randomuser.me/api/portraits/women/2.jpg",
    birthday: "1992-08-22",
    friends: ["user1", "user3", "user5"],
    walletBalance: 350.00
  },
  {
    id: "user3",
    name: "Michael Brown",
    email: "michael@example.com",
    profilePhoto: "https://randomuser.me/api/portraits/men/3.jpg",
    birthday: "1988-12-10",
    friends: ["user1", "user2"],
    walletBalance: 200.00
  },
  {
    id: "user4",
    name: "Sophia Davis",
    email: "sophia@example.com",
    profilePhoto: "https://randomuser.me/api/portraits/women/4.jpg",
    birthday: "1995-03-27",
    friends: ["user1", "user5"],
    walletBalance: 450.00
  },
  {
    id: "user5",
    name: "James Miller",
    email: "james@example.com",
    profilePhoto: "https://randomuser.me/api/portraits/men/5.jpg",
    birthday: "1991-07-18",
    friends: ["user1", "user2", "user4"],
    walletBalance: 300.00
  }
];

export const mockEvents: Event[] = [
  {
    id: "event1",
    title: "Alex's Birthday",
    date: "2024-05-15",
    type: "birthday",
    creator: "user1",
    privacy: "public",
    participants: ["user2", "user3", "user4", "user5"],
    rsvp: {
      "user2": "yes",
      "user3": "yes",
      "user4": "maybe",
      "user5": "no"
    }
  },
  {
    id: "event2",
    title: "Emma's Wedding",
    date: "2024-09-10",
    type: "wedding",
    creator: "user2",
    privacy: "private",
    participants: ["user1", "user3", "user5"],
    rsvp: {
      "user1": "yes",
      "user3": "yes",
      "user5": "maybe"
    }
  },
  {
    id: "event3",
    title: "Michael's Housewarming",
    date: "2024-06-20",
    type: "housewarming",
    creator: "user3",
    privacy: "public",
    participants: ["user1", "user2"],
    rsvp: {
      "user1": "yes",
      "user2": "maybe"
    }
  }
];

export const mockGiftItems: GiftItem[] = [
  {
    id: "item1",
    title: "Sony WH-1000XM5 Headphones",
    description: "Noise-cancelling headphones with amazing sound quality",
    price: 349.99,
    category: "large",
    url: "https://example.com/sony-headphones",
    status: "available",
    priority: "high",
    contributors: [],
    eventId: "event1"
  },
  {
    id: "item2",
    title: "Coffee Subscription - 6 Months",
    description: "Premium coffee beans delivered monthly",
    price: 120.00,
    category: "medium",
    url: "https://example.com/coffee-subscription",
    status: "available",
    priority: "medium",
    contributors: [
      {
        userId: "user2",
        amount: 50.00,
        date: "2024-04-20"
      }
    ],
    eventId: "event1"
  },
  {
    id: "item3",
    title: "KitchenAid Stand Mixer",
    description: "Professional-grade kitchen mixer in sunset gold",
    price: 399.99,
    category: "large",
    url: "https://example.com/kitchenaid-mixer",
    status: "available",
    priority: "high",
    contributors: [
      {
        userId: "user1",
        amount: 150.00,
        date: "2024-08-15",
        message: "Can't wait to celebrate with you!"
      },
      {
        userId: "user3",
        amount: 100.00,
        date: "2024-08-16"
      }
    ],
    eventId: "event2"
  }
];

export const eventTypeIcons: Record<string, string> = {
  "birthday": "🎂",
  "wedding": "💍",
  "housewarming": "🏠",
  "baby_shower": "👶",
  "other": "🎁"
};

export const categoryPriceRanges: Record<string, string> = {
  "small": "Under $50",
  "medium": "$50-$200",
  "large": "$200+"
};

export const giftSuggestions = {
  "birthday": [
    { title: "Wireless Earbuds", price: 129.99, category: "medium" },
    { title: "Fitness Tracker", price: 79.99, category: "medium" },
    { title: "Personalized Star Map", price: 49.99, category: "small" },
    { title: "Scented Candle Set", price: 35.00, category: "small" }
  ],
  "wedding": [
    { title: "Smart Home Speaker", price: 199.99, category: "medium" },
    { title: "Luxury Bed Sheets", price: 150.00, category: "medium" },
    { title: "Professional Knife Set", price: 299.99, category: "large" },
    { title: "Crystal Wine Glasses", price: 89.99, category: "medium" }
  ],
  "housewarming": [
    { title: "Indoor Plant", price: 45.00, category: "small" },
    { title: "Decorative Throw Blanket", price: 59.99, category: "medium" },
    { title: "Smart Doorbell", price: 179.99, category: "medium" },
    { title: "Artwork Print", price: 85.00, category: "medium" }
  ],
  "baby_shower": [
    { title: "Baby Monitor", price: 149.99, category: "medium" },
    { title: "Diaper Subscription", price: 200.00, category: "large" },
    { title: "Soft Plush Toys Set", price: 39.99, category: "small" },
    { title: "Baby Clothes Bundle", price: 75.00, category: "medium" }
  ]
};
