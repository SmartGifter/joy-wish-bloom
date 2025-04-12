
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Event, GiftItem } from '../types';
import { mockUsers, mockEvents, mockGiftItems } from '../data/mockData';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  events: Event[];
  giftItems: GiftItem[];
  selectedFriends: User[];
  setSelectedFriends: (friends: User[]) => void;
  login: (email: string, name: string) => void;
  logout: () => void;
  createEvent: (event: Omit<Event, "id">) => Event;
  addGiftItem: (item: Omit<GiftItem, "id">) => void;
  contributeToGift: (giftId: string, contribution: { userId: string; amount: number; message?: string }) => void;
  updateRSVP: (eventId: string, userId: string, status: "yes" | "no" | "maybe") => void;
  getUserById: (userId: string) => User | undefined;
  getEventById: (eventId: string) => Event | undefined;
  getGiftsByEventId: (eventId: string) => GiftItem[];
  addFunds: (amount: number) => Promise<{ success: boolean; error?: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [giftItems, setGiftItems] = useState<GiftItem[]>(mockGiftItems);
  const [selectedFriends, setSelectedFriends] = useState<User[]>([]);

  const login = (email: string, name: string) => {
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      toast.success(`Welcome back, ${user.name}!`);
    } else {
      // Create a new user if not found
      const newUser: User = {
        id: `user${users.length + 1}`,
        name,
        email,
        profilePhoto: `https://randomuser.me/api/portraits/men/${users.length + 1}.jpg`, 
        birthday: "",
        friends: [],
        walletBalance: 100.00 // Welcome bonus
      };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      toast.success(`Welcome to SmartGifter, ${name}!`);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setSelectedFriends([]);
    toast.info("You've been logged out");
  };

  const createEvent = (eventData: Omit<Event, "id">) => {
    const newEventId = `event${events.length + 1}`;
    const newEvent: Event = {
      ...eventData,
      id: newEventId,
    };
    setEvents([...events, newEvent]);
    toast.success(`Event "${newEvent.title}" created!`);
    return newEvent;
  };

  const addGiftItem = (itemData: Omit<GiftItem, "id">) => {
    const newItem: GiftItem = {
      ...itemData,
      id: `item${giftItems.length + 1}`,
      contributors: [],
    };
    setGiftItems([...giftItems, newItem]);
    toast.success(`Gift "${newItem.title}" added!`);
  };

  const contributeToGift = (giftId: string, contribution: { userId: string; amount: number; message?: string }) => {
    setGiftItems(prevItems => 
      prevItems.map(item => {
        if (item.id === giftId) {
          // Deduct from user's wallet
          setUsers(prevUsers => 
            prevUsers.map(user => {
              if (user.id === contribution.userId) {
                return {
                  ...user,
                  walletBalance: user.walletBalance - contribution.amount
                };
              }
              return user;
            })
          );

          // Add contribution to gift
          return {
            ...item,
            contributors: [
              ...item.contributors, 
              {
                ...contribution,
                date: new Date().toISOString().split('T')[0]
              }
            ],
          };
        }
        return item;
      })
    );
    toast.success(`You contributed $${contribution.amount.toFixed(2)}!`);
  };

  const updateRSVP = (eventId: string, userId: string, status: "yes" | "no" | "maybe") => {
    setEvents(prevEvents => 
      prevEvents.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            rsvp: {
              ...event.rsvp,
              [userId]: status
            }
          };
        }
        return event;
      })
    );
    toast.success(`RSVP updated to "${status}"`);
  };

  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  const getEventById = (eventId: string) => {
    return events.find(event => event.id === eventId);
  };

  const getGiftsByEventId = (eventId: string) => {
    return giftItems.filter(item => item.eventId === eventId);
  };
  
  const addFunds = async (amount: number) => {
    if (!currentUser) {
      return { success: false, error: 'User not logged in' };
    }
    
    try {
      // This would normally call a Stripe integration
      // For now, just simulate adding funds
      setCurrentUser({
        ...currentUser,
        walletBalance: currentUser.walletBalance + amount
      });
      
      setUsers(prevUsers =>
        prevUsers.map(user => {
          if (user.id === currentUser.id) {
            return {
              ...user,
              walletBalance: user.walletBalance + amount
            };
          }
          return user;
        })
      );
      
      toast.success(`Added $${amount.toFixed(2)} to your wallet!`);
      return { success: true };
    } catch (error: any) {
      toast.error(`Failed to add funds: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  // Prepare for Supabase integration
  useEffect(() => {
    // Get the initial session
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log("Supabase session:", data.session);
        // We'll implement proper auth when we set up Supabase auth
      } catch (error) {
        console.error("Error getting session:", error);
      }
    };
    
    getSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session);
        // We'll implement proper auth when we set up Supabase auth
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      events,
      giftItems,
      selectedFriends,
      setSelectedFriends,
      login,
      logout,
      createEvent,
      addGiftItem,
      contributeToGift,
      updateRSVP,
      getUserById,
      getEventById,
      getGiftsByEventId,
      addFunds
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
