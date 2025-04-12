import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { createRecurringGift, getRecurringGifts, updateRecurringGift } from "@/services/savingsService";
import { format } from "date-fns";

interface RecurringGiftsProps {
  userId: string;
  recipientId: string;
  recipientName: string;
}

export default function RecurringGifts({ userId, recipientId, recipientName }: RecurringGiftsProps) {
  const [giftType, setGiftType] = useState<string>('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');
  const [gift, setGift] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadGifts();
  }, [userId, recipientId]);

  const loadGifts = async () => {
    try {
      const data = await getRecurringGifts(userId);
      const recipientGift = data.find(g => g.recipientId === recipientId);
      if (recipientGift) {
        setGift(recipientGift);
        setGiftType(recipientGift.giftType);
        setFrequency(recipientGift.frequency);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load recurring gifts",
        variant: "destructive",
      });
    }
  };

  const handleCreateGift = async () => {
    try {
      const startDate = new Date().toISOString();

      await createRecurringGift({
        userId,
        recipientId,
        giftType,
        frequency,
        startDate,
        status: 'active'
      });

      toast({
        title: "Success",
        description: "Recurring gift created successfully",
      });

      loadGifts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create recurring gift",
        variant: "destructive",
      });
    }
  };

  const handleUpdateGift = async () => {
    if (!gift) return;

    try {
      await updateRecurringGift(gift.id, {
        giftType,
        frequency,
      });

      toast({
        title: "Success",
        description: "Recurring gift updated successfully",
      });

      loadGifts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update recurring gift",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recurring Gifts</CardTitle>
        <CardDescription>
          Set up recurring gifts for {recipientName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {gift ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Gift Type</Label>
              <Input
                value={giftType}
                onChange={(e) => setGiftType(e.target.value)}
                placeholder="e.g., Flowers, Chocolates, etc."
              />
            </div>
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={frequency} onValueChange={(value: any) => setFrequency(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Next Delivery</Label>
              <p className="text-sm text-muted-foreground">
                {format(new Date(gift.nextDeliveryDate), 'PPP')}
              </p>
            </div>
            <Button onClick={handleUpdateGift}>Update Gift</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Gift Type</Label>
              <Input
                value={giftType}
                onChange={(e) => setGiftType(e.target.value)}
                placeholder="e.g., Flowers, Chocolates, etc."
              />
            </div>
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={frequency} onValueChange={(value: any) => setFrequency(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCreateGift}>Create Gift</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 