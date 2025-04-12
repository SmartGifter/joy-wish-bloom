
import { useState } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserAvatar from "@/components/UserAvatar";
import { eventTypeIcons } from "@/data/mockData";
import { format } from "date-fns";
import { Calendar, Gift, MessageCircle, VideoIcon, Image as ImageIcon, Heart } from "lucide-react";

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
            <TabsTrigger value="messages">Messages & Wishes</TabsTrigger>
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
          
          <TabsContent value="messages" className="space-y-6">
            <CelebrationMessages />
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
                  <UserAvatar user={creator} size="sm" />
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

// New component for celebration messages, photos, and videos
const CelebrationMessages = () => {
  const { users } = useApp();
  
  // Hardcoded messages, photos, and videos for demonstration
  const messages = [
    {
      id: 1,
      sender: "user2",
      recipient: "user1",
      eventType: "birthday",
      message: "Happy birthday Alex! Wishing you all the happiness in the world. May this year bring you success and joy in everything you do! 🎂🎉",
      date: "2024-05-10",
      mediaType: "text"
    },
    {
      id: 2,
      sender: "user3",
      recipient: "user1",
      eventType: "birthday",
      message: "Alex, you're the best! Have a fantastic birthday and enjoy every moment. Looking forward to celebrating with you soon!",
      date: "2024-05-12",
      mediaType: "text"
    },
    {
      id: 3,
      sender: "user4",
      recipient: "user1",
      eventType: "birthday",
      message: "Hey Alex! I recorded this special message for your birthday. Can't wait to see you at the party!",
      date: "2024-05-14",
      mediaType: "video",
      mediaUrl: "https://player.vimeo.com/video/76979871?background=1"
    },
    {
      id: 4,
      sender: "user5",
      recipient: "user1",
      eventType: "birthday",
      message: "Check out this photo from last year's celebration. Here's to another amazing year, Alex!",
      date: "2024-05-13",
      mediaType: "image",
      mediaUrl: "/placeholder.svg"
    },
    {
      id: 5,
      sender: "user1",
      recipient: "user2",
      eventType: "wedding",
      message: "Congratulations on your wedding, Emma! So happy for you and your partner. Wishing you a lifetime of love and happiness.",
      date: "2024-09-08",
      mediaType: "text"
    },
    {
      id: 6,
      sender: "user3",
      recipient: "user2",
      eventType: "wedding",
      message: "Emma, I'm so excited for your wedding! Here's a throwback photo of us from college. Can't believe how far we've come!",
      date: "2024-09-05",
      mediaType: "image",
      mediaUrl: "/placeholder.svg"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Birthday Wishes for Alex</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {messages
              .filter(m => m.eventType === "birthday" && m.recipient === "user1")
              .map(message => {
                const sender = users.find(user => user.id === message.sender);
                return (
                  <div key={message.id} className="p-4 rounded-lg bg-muted/30 space-y-3">
                    <div className="flex items-center gap-3">
                      {sender && <UserAvatar user={sender} size="sm" />}
                      <div>
                        <p className="font-medium">{sender?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(message.date), 'MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sm leading-relaxed">{message.message}</p>
                    
                    {message.mediaType === "image" && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-border">
                        <img 
                          src={message.mediaUrl} 
                          alt="Celebration photo" 
                          className="w-full h-auto max-h-64 object-cover"
                        />
                      </div>
                    )}
                    
                    {message.mediaType === "video" && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-border aspect-video">
                        <iframe
                          src={message.mediaUrl}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                          title="Birthday message video"
                        ></iframe>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 pt-2">
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <Heart className="h-3.5 w-3.5 mr-1" />
                        Like
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <MessageCircle className="h-3.5 w-3.5 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Wedding Wishes for Emma</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {messages
              .filter(m => m.eventType === "wedding" && m.recipient === "user2")
              .map(message => {
                const sender = users.find(user => user.id === message.sender);
                return (
                  <div key={message.id} className="p-4 rounded-lg bg-muted/30 space-y-3">
                    <div className="flex items-center gap-3">
                      {sender && <UserAvatar user={sender} size="sm" />}
                      <div>
                        <p className="font-medium">{sender?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(message.date), 'MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sm leading-relaxed">{message.message}</p>
                    
                    {message.mediaType === "image" && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-border">
                        <img 
                          src={message.mediaUrl} 
                          alt="Celebration photo" 
                          className="w-full h-auto max-h-64 object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 pt-2">
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <Heart className="h-3.5 w-3.5 mr-1" />
                        Like
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <MessageCircle className="h-3.5 w-3.5 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Community;
