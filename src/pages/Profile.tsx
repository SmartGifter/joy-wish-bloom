import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Gift, Users, Wallet, UserX, ArrowLeft } from "lucide-react";
import { User } from "@/types";
import EventCard from "@/components/EventCard";
import { format } from "date-fns";

const ProfileTab = ({ user }: { user: User }) => {
  const { getUserById } = useApp();

  // Group friends by relationship type (simulated for now)
  const relationships = {
    "Family": user.friends.slice(0, 2),
    "Friend": user.friends.slice(2),
    "Colleague": []
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">About</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
              <p>{user.email}</p>
            </div>
            
            {user.birthday && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Birthday</h3>
                <p>{format(new Date(user.birthday), "MMMM d, yyyy")}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Connections</CardTitle>
          <CardDescription>Family, friends, and colleagues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(relationships).map(([type, members]) => (
              members.length > 0 && (
                <div key={type}>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Badge variant="outline">{type}</Badge>
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {members.map(id => {
                      const friend = getUserById(id);
                      if (!friend) return null;
                      
                      return (
                        <div key={id} className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={friend.profilePhoto} />
                            <AvatarFallback>
                              {friend.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{friend.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            ))}
            
            {Object.values(relationships).flat().length === 0 && (
              <div className="text-center py-4">
                <Users className="h-12 w-12 mx-auto opacity-20 mb-2" />
                <p className="text-muted-foreground">No connections yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const EventsTab = ({ user }: { user: User }) => {
  const { events } = useApp();
  
  const userEvents = events.filter(
    event => event.creator === user.id || event.participants.includes(user.id)
  );
  
  const hostedEvents = userEvents.filter(event => event.creator === user.id);
  const attendingEvents = userEvents.filter(event => 
    event.creator !== user.id && event.participants.includes(user.id)
  );
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Hosted Events</CardTitle>
          <CardDescription>Events you've created</CardDescription>
        </CardHeader>
        <CardContent>
          {hostedEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hostedEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Gift className="h-12 w-12 mx-auto opacity-20 mb-2" />
              <p className="text-muted-foreground">No hosted events yet</p>
              <Button variant="link" className="mt-2">Create an event</Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Attending Events</CardTitle>
          <CardDescription>Events you've been invited to</CardDescription>
        </CardHeader>
        <CardContent>
          {attendingEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {attendingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Calendar className="h-12 w-12 mx-auto opacity-20 mb-2" />
              <p className="text-muted-foreground">No events to attend yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const WalletTab = ({ user }: { user: User }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Wallet Balance</CardTitle>
          <CardDescription>Your available funds for gifting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-6">
            <div className="rounded-full bg-muted/30 h-24 w-24 flex items-center justify-center mb-4">
              <Wallet className="h-12 w-12 text-dustyRose opacity-70" />
            </div>
            <h2 className="text-3xl font-bold text-warmBrown">${user.walletBalance.toFixed(2)}</h2>
            <p className="text-muted-foreground mt-1">Available Balance</p>
            
            <div className="mt-6 space-y-3 w-full max-w-xs">
              <Button className="gift-btn w-full">Add Funds</Button>
              <Button variant="outline" className="w-full">Transaction History</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Button variant="outline" className="mt-2">Add Payment Method</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Profile = () => {
  const { userId } = useParams();
  const { currentUser, getUserById } = useApp();
  const [activeTab, setActiveTab] = useState("profile");
  
  const profileUser = userId ? getUserById(userId) : currentUser;
  
  if (!currentUser) {
    return (
      <Layout>
        <div className="container max-w-2xl mx-auto space-y-6">
          <Card className="text-center py-8">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <UserX className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <CardTitle>Sign in Required</CardTitle>
              <CardDescription>
                Please sign in to view profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-x-4">
              <Button 
                variant="secondary" 
                className="bg-peachBlush hover:bg-peachBlush/90 text-warmBrown"
                asChild
              >
                <Link to="/login">
                  Sign In
                </Link>
              </Button>
              <Button 
                variant="outline"
                asChild
              >
                <Link to="/signup">
                  Create Account
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (userId && !profileUser) {
    return (
      <Layout>
        <div className="container max-w-2xl mx-auto space-y-6">
          <Button 
            variant="ghost" 
            className="text-muted-foreground"
            asChild
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <Card className="text-center py-8">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <UserX className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <CardTitle>User Not Found</CardTitle>
              <CardDescription>
                The user you're looking for doesn't exist or has been removed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="secondary" 
                className="bg-peachBlush hover:bg-peachBlush/90 text-warmBrown"
                asChild
              >
                <Link to="/">
                  Return Home
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const isCurrentUser = currentUser && profileUser.id === currentUser.id;

  return (
    <Layout>
      <div className="container max-w-2xl mx-auto space-y-6">
        {userId && (
          <Button 
            variant="ghost" 
            className="text-muted-foreground"
            asChild
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        )}

        <Card className="mb-6 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-peachBlush to-dustyRose opacity-30" />
          <CardContent className="px-6 pb-6 -mt-12">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
              <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                <AvatarImage src={profileUser.profilePhoto} />
                <AvatarFallback className="text-xl bg-dustyRose text-white">
                  {profileUser.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-warmBrown">{profileUser.name}</h1>
                <p className="text-muted-foreground">{profileUser.email}</p>
              </div>
              
              {isCurrentUser && (
                <Button variant="outline" className="mt-2 sm:mt-0">Edit Profile</Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-0">
            <ProfileTab user={profileUser} />
          </TabsContent>
          
          <TabsContent value="events" className="mt-0">
            <EventsTab user={profileUser} />
          </TabsContent>
          
          <TabsContent value="wallet" className="mt-0">
            <WalletTab user={profileUser} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
