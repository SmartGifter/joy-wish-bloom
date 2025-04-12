import { supabase } from "@/integrations/supabase/client";
import { BirthdaySavings, RecurringGift } from "@/types";

export const checkBirthdaySavingsNotifications = async (userId: string) => {
  const { data: savings, error } = await supabase
    .from('birthday_savings')
    .select('*')
    .eq('userId', userId)
    .eq('status', 'active');

  if (error) throw error;

  const now = new Date();
  const notifications = [];

  for (const saving of savings) {
    const lastNotification = new Date(saving.lastNotificationDate);
    const daysSinceLastNotification = Math.floor((now.getTime() - lastNotification.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceLastNotification >= 30) {
      notifications.push({
        type: 'birthday_savings',
        title: 'Monthly Savings Reminder',
        message: `It's time to save $${saving.monthlyAmount} for ${saving.friendId}'s birthday gift.`,
        data: saving
      });

      // Update last notification date
      await supabase
        .from('birthday_savings')
        .update({ lastNotificationDate: now.toISOString() })
        .eq('id', saving.id);
    }
  }

  return notifications;
};

export const checkRecurringGiftNotifications = async (userId: string) => {
  const { data: gifts, error } = await supabase
    .from('recurring_gifts')
    .select('*')
    .eq('userId', userId)
    .eq('status', 'active');

  if (error) throw error;

  const now = new Date();
  const notifications = [];

  for (const gift of gifts) {
    const nextDelivery = new Date(gift.nextDeliveryDate);
    const daysUntilDelivery = Math.floor((nextDelivery.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDelivery <= 1) {
      notifications.push({
        type: 'recurring_gift',
        title: 'Gift Delivery Reminder',
        message: `It's time to order ${gift.giftType} for ${gift.recipientId}.`,
        data: gift
      });

      // Update next delivery date
      const newNextDelivery = new Date(nextDelivery);
      switch (gift.frequency) {
        case 'daily':
          newNextDelivery.setDate(newNextDelivery.getDate() + 1);
          break;
        case 'weekly':
          newNextDelivery.setDate(newNextDelivery.getDate() + 7);
          break;
        case 'monthly':
          newNextDelivery.setMonth(newNextDelivery.getMonth() + 1);
          break;
        case 'yearly':
          newNextDelivery.setFullYear(newNextDelivery.getFullYear() + 1);
          break;
      }

      await supabase
        .from('recurring_gifts')
        .update({ nextDeliveryDate: newNextDelivery.toISOString() })
        .eq('id', gift.id);
    }
  }

  return notifications;
};

export const checkAllNotifications = async (userId: string) => {
  const birthdayNotifications = await checkBirthdaySavingsNotifications(userId);
  const giftNotifications = await checkRecurringGiftNotifications(userId);
  
  return [...birthdayNotifications, ...giftNotifications];
}; 