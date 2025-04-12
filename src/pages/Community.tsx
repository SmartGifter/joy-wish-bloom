
import { useState } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserAvatar from "@/components/UserAvatar";
import { eventTypeIcons } from "@/data/mockData";
import { format } from "date-fns";
import { Calendar, Gift, MessageCircle, VideoIcon } from "lucide-react";

const Community = () => {
  const { users, events, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<string>("all");

  // Filter events that are public or where the current user is a participant
  const accessibleEvents = events.filter(
    (event) => event.privacy === "public" || 
    (currentUser && (event.participants.includes(currentUser.id) || event.creator === currentUser.id))
  );
  
  // Group events by month for display
  const eventsByMonth: Record<string, typeof events> = {};
  const upcomingEvents = accessibleEvents.filter(event => new Date(event.date) >= new Date());
  
  upcomingEvents.forEach(event => {
    const month = format(new Date(event.date), 'MMMM yyyy');
    if (!eventsByMonth[month]) {
      eventsByMonth[month] = [];
    }
    eventsByMonth[month].push(event);
  });
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-warmBrown">Community</h1>
        </div>
        
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="all">All Celebrations</TabsTrigger>
            <TabsTrigger value="birthdays">Birthdays</TabsTrigger>
            <TabsTrigger value="weddings">Weddings</TabsTrigger>
            <TabsTrigger value="others">Other Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {Object.keys(eventsByMonth).map((month) => (
              <Card key={month}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{month}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {eventsByMonth[month].map((event) => (
                      <CommunityEvent key={event.id} event={event} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {Object.keys(eventsByMonth).length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No upcoming community events found.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="birthdays" className="space-y-4">
            {Object.keys(eventsByMonth).map((month) => {
              const birthdayEvents = eventsByMonth[month].filter(e => e.type === "birthday");
              if (birthdayEvents.length === 0) return null;
              
              return (
                <Card key={month}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{month}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {birthdayEvents.map((event) => (
                        <CommunityEvent key={event.id} event={event} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {!Object.keys(eventsByMonth).some(month => 
              eventsByMonth[month].some(e => e.type === "birthday")
            ) && (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No upcoming birthday celebrations found.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="weddings" className="space-y-4">
            {Object.keys(eventsByMonth).map((month) => {
              const weddingEvents = eventsByMonth[month].filter(e => e.type === "wedding");
              if (weddingEvents.length === 0) return null;
              
              return (
                <Card key={month}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{month}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {weddingEvents.map((event) => (
                        <CommunityEvent key={event.id} event={event} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {!Object.keys(eventsByMonth).some(month => 
              eventsByMonth[month].some(e => e.type === "wedding")
            ) && (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No upcoming wedding celebrations found.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="others" className="space-y-4">
            {Object.keys(eventsByMonth).map((month) => {
              const otherEvents = eventsByMonth[month].filter(e => 
                e.type !== "birthday" && e.type !== "wedding"
              );
              if (otherEvents.length === 0) return null;
              
              return (
                <Card key={month}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{month}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {otherEvents.map((event) => (
                        <CommunityEvent key={event.id} event={event} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {!Object.keys(eventsByMonth).some(month => 
              eventsByMonth[month].some(e => 
                e.type !== "birthday" && e.type !== "wedding"
              )
            ) && (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No other upcoming celebrations found.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

// Community Event Component
const CommunityEvent = ({ event }) => {
  const { getUserById } = useApp();
  const creator = getUserById(event.creator);
  const eventDate = new Date(event.date);
  
  return (
    <div className="border border-border rounded-xl p-4 bg-card hover:border-peachBlush transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-peachBlush/20 flex items-center justify-center">
              <span className="text-xl" role="img" aria-label={event.type}>
                {eventTypeIcons[event.type] || "🎁"}
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg">{event.title}</h3>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span className="text-sm">{format(eventDate, 'EEEE, MMM d')}</span>
            </div>
            
            <div className="flex items-center mt-1 gap-1">
              <span className="text-sm text-muted-foreground">by</span>
              {creator && (
                <div className="flex items-center gap-1">
                  <UserAvatar user={creator} size="xs" />
                  <span className="text-sm font-medium">{creator.name}</span>
                </div>
              )}
            </div>
            
            <div className="mt-3 flex gap-3">
              <Button variant="outline" size="sm" className="text-dustyRose">
                <Gift className="h-3 w-3 mr-1" />
                View Gifts
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-3 w-3 mr-1" />
                Send Wishes
              </Button>
              <Button variant="outline" size="sm">
                <VideoIcon className="h-3 w-3 mr-1" />
                Record Video
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
