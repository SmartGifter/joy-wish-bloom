import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { PiggyBank, UserX, ArrowLeft, Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function BirthdaySavingsPage() {
  const { recipientId } = useParams();
  const { currentUser, getUserById } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [monthlyAmount, setMonthlyAmount] = useState<string>('');

  const recipient = getUserById(recipientId || '');

  if (!currentUser) {
    return (
      <Layout>
        <Card>
          <CardHeader>
            <CardTitle>Birthday Savings</CardTitle>
            <CardDescription>Please log in to manage birthday savings</CardDescription>
          </CardHeader>
        </Card>
      </Layout>
    );
  }

  if (!recipient) {
    return (
      <Layout>
        <div className="space-y-6">
          <Button 
            variant="ghost" 
            className="text-muted-foreground"
            asChild
          >
            <Link to="/birthday-savings">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Recipients
            </Link>
          </Button>

          <Card className="text-center py-8">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <UserX className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <CardTitle>Recipient Not Found</CardTitle>
              <CardDescription>
                The recipient you're looking for doesn't exist or has been removed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="secondary" 
                className="bg-peachBlush hover:bg-peachBlush/90 text-warmBrown"
                asChild
              >
                <Link to="/birthday-savings">
                  View All Recipients
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const birthday = new Date(recipient.birthday);
  const nextBirthday = new Date(birthday);
  nextBirthday.setFullYear(new Date().getFullYear());
  if (nextBirthday < new Date()) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
  }
  const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const monthsUntilBirthday = Math.ceil(daysUntilBirthday / 30);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // TODO: Implement savings plan creation
      toast.success("Savings plan created successfully!");
    } catch (err) {
      setError("Failed to create savings plan. Please try again.");
      toast.error("Failed to create savings plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          className="text-muted-foreground"
          asChild
        >
          <Link to="/birthday-savings">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Recipients
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold text-warmBrown">Birthday Savings</h1>
          <p className="text-muted-foreground">Plan birthday savings for {recipient.name}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Birthday Overview</CardTitle>
            <CardDescription>Next birthday: {nextBirthday.toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-peachBlush/20 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-dustyRose" />
              </div>
              <div>
                <p className="text-lg font-semibold">{daysUntilBirthday} days until next birthday</p>
                <p className="text-sm text-muted-foreground">
                  {monthsUntilBirthday} months to save for their special day
                </p>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-sm mb-2">
                <span>Savings Progress</span>
                <span>$0 / Target: Not Set</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Set Up Monthly Savings</CardTitle>
            <CardDescription>Choose how much to save each month for {recipient.name}'s birthday</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="monthlyAmount" className="text-sm font-medium">Monthly Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="monthlyAmount"
                    type="number"
                    placeholder="0.00"
                    className="pl-8"
                    value={monthlyAmount}
                    onChange={(e) => setMonthlyAmount(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Total savings goal: ${(parseFloat(monthlyAmount) * monthsUntilBirthday).toFixed(2)}
                </p>
              </div>

              {error && (
                <div className="text-sm text-red-500">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="bg-dustyRose hover:bg-dustyRose/90 text-white w-full"
                disabled={loading || !monthlyAmount}
              >
                {loading ? "Creating Plan..." : "Start Saving"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Savings History</CardTitle>
            <CardDescription>Track your contributions towards {recipient.name}'s birthday gift</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground text-center py-8">
              No savings recorded yet. Start your savings plan to track your progress.
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
} 