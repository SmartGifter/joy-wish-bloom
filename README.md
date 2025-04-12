# Joy Wish Bloom - Gift Management Platform

Joy Wish Bloom is a comprehensive gift management platform that helps users organize, plan, and manage gifts for their loved ones. The platform provides features for managing events, gifts, savings, and recurring gift deliveries.

## Features

### 1. User Management
- User registration and authentication
- Profile management
- Friend list management
- Relationship categorization (family, friend, colleague)

### 2. Event Management
- Create and manage events (birthdays, weddings, housewarmings, baby showers)
- Set event privacy (public/private)
- Manage RSVPs
- Add event details (date, location, description)

### 3. Gift Management
- Create gift lists for events
- Categorize gifts by size (small, medium, large)
- Set gift priorities
- Track gift status (available, reserved, purchased)
- Add gift details (title, description, price, URL, image)
- Group gifting functionality

### 4. Birthday Savings
- Set up monthly savings plans for friends' birthdays
- Track savings progress
- Set target amounts
- Monthly reminders to save
- Progress visualization

### 5. Recurring Gifts
- Set up recurring gift deliveries
- Choose gift types
- Set delivery frequency (daily, weekly, monthly, yearly)
- Track next delivery dates
- Delivery reminders

### 6. Notifications
- Birthday savings reminders
- Recurring gift delivery reminders
- Event reminders
- Gift contribution notifications

### 7. Wallet Management
- Track wallet balance
- Deposit funds
- Withdraw funds
- Track contributions
- Transaction history

## Technical Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Supabase
- Authentication: Supabase Auth
- Database: PostgreSQL
- UI Components: Shadcn UI
- Date Handling: date-fns
- State Management: React Context
- Routing: React Router

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Database Schema

### Users
- id: string
- name: string
- email: string
- profilePhoto: string
- birthday: string
- friends: string[]
- walletBalance: number
- relationship: Record<string, "family" | "friend" | "colleague">

### Events
- id: string
- title: string
- date: string
- type: "birthday" | "wedding" | "housewarming" | "baby_shower" | "other"
- creator: string
- privacy: "public" | "private"
- participants: string[]
- rsvp: Record<string, "yes" | "no" | "maybe">
- description?: string
- location?: string

### Gift Items
- id: string
- title: string
- description: string
- price: number
- category: "small" | "medium" | "large"
- url: string
- status: "available" | "reserved" | "purchased"
- priority: "low" | "medium" | "high"
- contributors: Contribution[]
- eventId: string
- imageUrl?: string

### Birthday Savings
- id: string
- userId: string
- friendId: string
- targetAmount: number
- monthlyAmount: number
- startDate: string
- endDate: string
- currentBalance: number
- status: 'active' | 'completed' | 'cancelled'
- lastNotificationDate: string

### Recurring Gifts
- id: string
- userId: string
- recipientId: string
- giftType: string
- frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
- startDate: string
- nextDeliveryDate: string
- status: 'active' | 'paused' | 'cancelled'
- notes?: string

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
