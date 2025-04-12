import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { createBirthdaySavings, getBirthdaySavings, updateBirthdaySavings } from "@/services/savingsService";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";

interface BirthdaySavingsProps {
  userId: string;
  friendId: string;
  friendName: string;
  friendBirthday: string;
}

export default function BirthdaySavings({ userId, friendId, friendName, friendBirthday }: BirthdaySavingsProps) {
  const [monthlyAmount, setMonthlyAmount] = useState<number>(0);
  const [savings, setSavings] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSavings();
  }, [userId, friendId]);

  const loadSavings = async () => {
    try {
      const data = await getBirthdaySavings(userId);
      const friendSavings = data.find(s => s.friendId === friendId);
      if (friendSavings) {
        setSavings(friendSavings);
        setMonthlyAmount(friendSavings.monthlyAmount);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load savings data",
        variant: "destructive",
      });
    }
  };

  const handleCreateSavings = async () => {
    try {
      const targetAmount = monthlyAmount * 12; // Assuming saving for a year
      const startDate = new Date().toISOString();
      const endDate = new Date(friendBirthday).toISOString();

      await createBirthdaySavings({
        userId,
        friendId,
        targetAmount,
        monthlyAmount,
        startDate,
        endDate,
        status: 'active'
      });

      toast({
        title: "Success",
        description: "Birthday savings plan created successfully",
      });

      loadSavings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create savings plan",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSavings = async () => {
    if (!savings) return;

    try {
      await updateBirthdaySavings(savings.id, {
        monthlyAmount,
        targetAmount: monthlyAmount * 12,
      });

      toast({
        title: "Success",
        description: "Savings plan updated successfully",
      });

      loadSavings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update savings plan",
        variant: "destructive",
      });
    }
  };

  const progress = savings ? (savings.currentBalance / savings.targetAmount) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Birthday Savings Plan</CardTitle>
        <CardDescription>
          Set up monthly savings for {friendName}'s birthday
        </CardDescription>
      </CardHeader>
      <CardContent>
        {savings ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Monthly Amount</Label>
              <Input
                type="number"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Progress</Label>
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground">
                {savings.currentBalance} / {savings.targetAmount} saved
              </p>
            </div>
            <Button onClick={handleUpdateSavings}>Update Plan</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Monthly Amount</Label>
              <Input
                type="number"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(Number(e.target.value))}
              />
            </div>
            <Button onClick={handleCreateSavings}>Create Plan</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 