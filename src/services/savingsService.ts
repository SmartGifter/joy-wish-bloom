import { supabase } from "@/integrations/supabase/client";
import { BirthdaySavings, RecurringGift } from "@/types";

export const createBirthdaySavings = async (savings: Omit<BirthdaySavings, 'id' | 'currentBalance' | 'lastNotificationDate'>) => {
  const { data, error } = await supabase
    .from('birthday_savings')
    .insert([{
      ...savings,
      currentBalance: 0,
      lastNotificationDate: new Date().toISOString(),
      status: 'active'
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateBirthdaySavings = async (id: string, updates: Partial<BirthdaySavings>) => {
  const { data, error } = await supabase
    .from('birthday_savings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getBirthdaySavings = async (userId: string) => {
  const { data, error } = await supabase
    .from('birthday_savings')
    .select('*')
    .eq('userId', userId);

  if (error) throw error;
  return data;
};

export const createRecurringGift = async (gift: Omit<RecurringGift, 'id' | 'nextDeliveryDate'>) => {
  const { data, error } = await supabase
    .from('recurring_gifts')
    .insert([{
      ...gift,
      nextDeliveryDate: calculateNextDeliveryDate(gift.startDate, gift.frequency),
      status: 'active'
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateRecurringGift = async (id: string, updates: Partial<RecurringGift>) => {
  const { data, error } = await supabase
    .from('recurring_gifts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getRecurringGifts = async (userId: string) => {
  const { data, error } = await supabase
    .from('recurring_gifts')
    .select('*')
    .eq('userId', userId);

  if (error) throw error;
  return data;
};

const calculateNextDeliveryDate = (startDate: string, frequency: RecurringGift['frequency']): string => {
  const date = new Date(startDate);
  const now = new Date();

  while (date <= now) {
    switch (frequency) {
      case 'daily':
        date.setDate(date.getDate() + 1);
        break;
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
    }
  }

  return date.toISOString();
}; 