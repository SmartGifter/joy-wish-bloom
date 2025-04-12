import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, Repeat } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import Layout from "@/components/Layout";

const RecurringGiftsIndex = () => {
  const { currentUser, recipients } = useApp();

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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-warmBrown">Recurring Gifts</h1>
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
              to={`/recurring-gifts/${recipient.id}`}
            >
              <Card className="hover:bg-accent transition-colors">
                <CardHeader className="flex flex-row items-center gap-4">
                  <UserAvatar user={recipient} size="lg" />
                  <div>
                    <CardTitle>{recipient.name}</CardTitle>
                    <CardDescription>
                      Manage recurring gifts and subscriptions
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Repeat className="h-4 w-4" />
                    <span>View Recurring Gifts</span>
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
                  Add your first recipient to start setting up recurring gifts
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

export default RecurringGiftsIndex; 