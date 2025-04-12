
import { useState } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserAvatar from "@/components/UserAvatar";
import { eventTypeIcons } from "@/data/mockData";
import { format } from "date-fns";
import { Calendar, Gift, MessageCircle, VideoIcon, Image as ImageIcon, Heart, PartyPopper, CakeSlice, Home } from "lucide-react";

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
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-warmBrown">Community</h1>
        </div>
        
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="all">All Celebrations</TabsTrigger>
            <TabsTrigger value="birthdays">Birthdays</TabsTrigger>
            <TabsTrigger value="weddings">Weddings</TabsTrigger>
            <TabsTrigger value="housewarming">Housewarming</TabsTrigger>
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
                <CardContent className="text-center py-6">
                  <Calendar className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
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
                <CardContent className="text-center py-6">
                  <CakeSlice className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No upcoming birthday celebrations found.</p>
                  <Button variant="outline" className="mt-3" size="sm">
                    <CakeSlice className="h-4 w-4 mr-2" /> View Recent Birthday Messages
                  </Button>
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
                <CardContent className="text-center py-6">
                  <PartyPopper className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No upcoming wedding celebrations found.</p>
                  <Button variant="outline" className="mt-3" size="sm">
                    <PartyPopper className="h-4 w-4 mr-2" /> View Recent Wedding Wishes
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="housewarming" className="space-y-4">
            {Object.keys(eventsByMonth).map((month) => {
              const housewarmingEvents = eventsByMonth[month].filter(e => e.type === "housewarming");
              if (housewarmingEvents.length === 0) return null;
              
              return (
                <Card key={month}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{month}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {housewarmingEvents.map((event) => (
                        <CommunityEvent key={event.id} event={event} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {!Object.keys(eventsByMonth).some(month => 
              eventsByMonth[month].some(e => e.type === "housewarming")
            ) && (
              <Card>
                <CardContent className="text-center py-6">
                  <Home className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No upcoming housewarming celebrations found.</p>
                  <Button variant="outline" className="mt-3" size="sm">
                    <Home className="h-4 w-4 mr-2" /> View Recent Housewarming Messages
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="messages" className="space-y-4">
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
    <div className="border border-border rounded-lg p-3 bg-card hover:border-peachBlush transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-peachBlush/20 flex items-center justify-center">
              <span className="text-lg" role="img" aria-label={event.type}>
                {eventTypeIcons[event.type] || "🎁"}
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium">{event.title}</h3>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span className="text-xs">{format(eventDate, 'EEEE, MMM d')}</span>
            </div>
            
            <div className="flex items-center mt-1 gap-1">
              <span className="text-xs text-muted-foreground">by</span>
              {creator && (
                <div className="flex items-center gap-1">
                  <UserAvatar user={creator} size="sm" />
                  <span className="text-xs font-medium">{creator.name}</span>
                </div>
              )}
            </div>
            
            <div className="mt-2 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="text-dustyRose text-xs h-7 px-2">
                <Gift className="h-3 w-3 mr-1" />
                View Gifts
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                <MessageCircle className="h-3 w-3 mr-1" />
                Send Wishes
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-7 px-2">
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
    // Birthday messages
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
    
    // Wedding messages
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
    },
    {
      id: 7,
      sender: "user4",
      recipient: "user2",
      eventType: "wedding",
      message: "Emma and Jake, congratulations on your big day! I've prepared a special message for both of you.",
      date: "2024-09-06",
      mediaType: "video",
      mediaUrl: "https://player.vimeo.com/video/238447560?background=1"
    },
    
    // Housewarming messages
    {
      id: 8,
      sender: "user1",
      recipient: "user3",
      eventType: "housewarming",
      message: "Congratulations on your new home, Michael! May it be filled with laughter, love, and unforgettable memories.",
      date: "2024-07-15",
      mediaType: "text"
    },
    {
      id: 9,
      sender: "user2",
      recipient: "user3",
      eventType: "housewarming",
      message: "Michael, so excited for your new place! I can't wait to see it in person. Here's a little something to brighten up your space.",
      date: "2024-07-12",
      mediaType: "image",
      mediaUrl: "/placeholder.svg"
    },
    {
      id: 10,
      sender: "user5",
      recipient: "user3",
      eventType: "housewarming",
      message: "Hey Michael! I put together this short video tour of my favorite houseplants that would look perfect in your new home.",
      date: "2024-07-14",
      mediaType: "video",
      mediaUrl: "https://player.vimeo.com/video/353423371?background=1"
    },
    
    // Baby shower messages
    {
      id: 11,
      sender: "user1",
      recipient: "user4",
      eventType: "baby_shower",
      message: "Sarah, congratulations on your baby shower! I'm so excited to meet the little one soon. Sending all my love! 👶🍼",
      date: "2024-06-20",
      mediaType: "text"
    },
    {
      id: 12,
      sender: "user2",
      recipient: "user4",
      eventType: "baby_shower",
      message: "What a beautiful baby shower, Sarah! Here's a picture from the celebration. You're absolutely glowing!",
      date: "2024-06-22",
      mediaType: "image",
      mediaUrl: "/placeholder.svg"
    },
    {
      id: 13,
      sender: "user3",
      recipient: "user4",
      eventType: "baby_shower",
      message: "Sarah, I couldn't be at your shower but wanted to send this video message to congratulate you and your growing family!",
      date: "2024-06-21",
      mediaType: "video",
      mediaUrl: "https://player.vimeo.com/video/384611645?background=1"
    }
  ];

  // Helper function to get messages by event type
  const getMessagesByType = (eventType) => {
    return messages.filter(m => m.eventType === eventType);
  };

  // Group recipients by event type to create sections
  const birthdayRecipients = [...new Set(getMessagesByType("birthday").map(m => m.recipient))];
  const weddingRecipients = [...new Set(getMessagesByType("wedding").map(m => m.recipient))];
  const housewarmingRecipients = [...new Set(getMessagesByType("housewarming").map(m => m.recipient))];
  const babyShowerRecipients = [...new Set(getMessagesByType("baby_shower").map(m => m.recipient))];

  const renderMessages = (messageGroup, recipientId) => {
    const recipientUser = users.find(user => user.id === recipientId);
    const recipientMessages = messageGroup.filter(m => m.recipient === recipientId);
    
    return (
      <Card key={recipientId} className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            Wishes for {recipientUser?.name || "Friend"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {recipientMessages.map(message => {
              const sender = users.find(user => user.id === message.sender);
              return (
                <div key={message.id} className="p-3 rounded-lg bg-muted/30 space-y-2">
                  <div className="flex items-center gap-2">
                    {sender && <UserAvatar user={sender} size="sm" />}
                    <div>
                      <p className="font-medium text-sm">{sender?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(message.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm leading-relaxed">{message.message}</p>
                  
                  {message.mediaType === "image" && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-border">
                      <img 
                        src={message.mediaUrl} 
                        alt="Celebration photo" 
                        className="w-full h-auto max-h-48 object-cover"
                      />
                    </div>
                  )}
                  
                  {message.mediaType === "video" && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-border aspect-video">
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
                  
                  <div className="flex items-center gap-2 pt-1">
                    <Button variant="ghost" size="sm" className="text-muted-foreground h-7 text-xs">
                      <Heart className="h-3 w-3 mr-1" />
                      Like
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground h-7 text-xs">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* Birthday Messages */}
      {birthdayRecipients.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-warmBrown flex items-center gap-2">
            <CakeSlice className="h-5 w-5" /> Birthday Celebrations
          </h2>
          {birthdayRecipients.map(recipient => 
            renderMessages(getMessagesByType("birthday"), recipient)
          )}
        </div>
      )}
      
      {/* Wedding Messages */}
      {weddingRecipients.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-warmBrown flex items-center gap-2">
            <PartyPopper className="h-5 w-5" /> Wedding Celebrations
          </h2>
          {weddingRecipients.map(recipient => 
            renderMessages(getMessagesByType("wedding"), recipient)
          )}
        </div>
      )}
      
      {/* Housewarming Messages */}
      {housewarmingRecipients.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-warmBrown flex items-center gap-2">
            <Home className="h-5 w-5" /> Housewarming Celebrations
          </h2>
          {housewarmingRecipients.map(recipient => 
            renderMessages(getMessagesByType("housewarming"), recipient)
          )}
        </div>
      )}
      
      {/* Baby Shower Messages */}
      {babyShowerRecipients.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-warmBrown flex items-center gap-2">
            <Gift className="h-5 w-5" /> Baby Shower Celebrations
          </h2>
          {babyShowerRecipients.map(recipient => 
            renderMessages(getMessagesByType("baby_shower"), recipient)
          )}
        </div>
      )}

      {birthdayRecipients.length === 0 && 
       weddingRecipients.length === 0 && 
       housewarmingRecipients.length === 0 && 
       babyShowerRecipients.length === 0 && (
        <Card>
          <CardContent className="text-center py-6">
            <MessageCircle className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No celebration messages found.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Community;
