import { useApp } from "@/context/AppContext";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/Layout";
import { useState } from "react";
import { toast } from "sonner";
import { UserX, ArrowLeft } from "lucide-react";

const RecurringGiftsPage = () => {
  const { recipientId } = useParams();
  const { currentUser, getUserById } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recipient = getUserById(recipientId || "");

  if (!currentUser) {
    return (
      <Layout>
        <Card>
          <CardHeader>
            <CardTitle>Recurring Gifts</CardTitle>
            <CardDescription>Please log in to manage recurring gifts</CardDescription>
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
            <Link to="/recurring-gifts">
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
                <Link to="/recurring-gifts">
                  View All Recipients
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // TODO: Implement recurring gift creation
      toast.success("Recurring gift created successfully!");
    } catch (err) {
      setError("Failed to create recurring gift. Please try again.");
      toast.error("Failed to create recurring gift");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-warmBrown">Recurring Gifts</h1>
          <p className="text-muted-foreground">Manage recurring gifts for {recipient.name}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recurring Gifts</CardTitle>
            <CardDescription>Set up recurring gifts for {recipient.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="giftType" className="text-sm font-medium">Gift Type</label>
                <Input
                  id="giftType"
                  placeholder="e.g., Flowers, Chocolates, etc."
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="frequency" className="text-sm font-medium">Frequency</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <div className="text-sm text-red-500">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="bg-dustyRose hover:bg-dustyRose/90 text-white"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Gift"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* List of existing recurring gifts will go here */}
        <Card>
          <CardHeader>
            <CardTitle>Active Recurring Gifts</CardTitle>
            <CardDescription>Your current recurring gifts for {recipient.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              No recurring gifts set up yet.
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RecurringGiftsPage; 