import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PiggyBank, Plus } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import Layout from "@/components/Layout";

const BirthdaySavingsIndex = () => {
  const { currentUser, recipients } = useApp();

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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-warmBrown">Birthday Savings</h1>
          <Button 
            variant="secondary" 
            className="bg-peachBlush hover:bg-peachBlush/90 text-warmBrown"
            asChild
          >
            <Link to="/add-recipient">
              <Plus className="h-4 w-4 mr-2" />
              Add Recipient
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recipients?.map((recipient) => (
            <Link 
              key={recipient.id} 
              to={`/birthday-savings/${recipient.id}`}
            >
              <Card className="hover:bg-accent transition-colors">
                <CardHeader className="flex flex-row items-center gap-4">
                  <UserAvatar user={recipient} size="lg" />
                  <div>
                    <CardTitle>{recipient.name}</CardTitle>
                    <CardDescription>
                      Birthday: {new Date(recipient.birthday).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <PiggyBank className="h-4 w-4" />
                    <span>View Savings Plan</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {(!recipients || recipients.length === 0) && (
            <Card>
              <CardHeader>
                <CardTitle>No Recipients Yet</CardTitle>
                <CardDescription>
                  Add your first recipient to start saving for their birthday gifts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="secondary" 
                  className="bg-peachBlush hover:bg-peachBlush/90 text-warmBrown"
                  asChild
                >
                  <Link to="/add-recipient">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Recipient
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BirthdaySavingsIndex; 