
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsItem, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { format, isPast, isSameMonth } from "date-fns";
import { MessageCircle, MessageSquare, Video, Heart, Share, Gift, UserRound, Users, Calendar, ThumbsUp } from "lucide-react";

const Community = () => {
  const { users, events, currentUser } = useApp();
  const [filter, setFilter] = useState<"all" | "birthday" | "anniversary" | "celebration">("all");
  
  // Mock celebration messages - in a real app, these would come from the database
  const celebrationMessages = [
    {
      id: 1,
      userId: users[1]?.id || "1",
      recipientId: currentUser?.id || "0",
      content: "Happy birthday! Hope you have a wonderful day filled with joy and laughter!",
      type: "birthday",
      media: null,
      createdAt: new Date().toISOString(),
      likes: 5,
    },
    {
      id: 2,
      userId: users[2]?.id || "2",
      recipientId: currentUser?.id || "0",
      content: "Wishing you the best birthday ever! Remember that time we went hiking? Let's do it again soon!",
      type: "birthday",
      media: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=500&auto=format&fit=crop",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      likes: 3,
    },
    {
      id: 3,
      userId: users[3]?.id || "3",
      recipientId: currentUser?.id || "0",
      content: "Happy anniversary to you and Sarah! Here's to many more years of happiness!",
      type: "anniversary",
      media: null,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      likes: 8,
    },
    {
      id: 4,
      userId: users[0]?.id || "4",
      recipientId: currentUser?.id || "0",
      content: "Congratulations on your new home! Can't wait for the housewarming party!",
      type: "celebration",
      media: null,
      createdAt: new Date(Date.now() - 10800000).toISOString(),
      likes: 12,
    },
  ];
  
  const filteredMessages = filter === "all" 
    ? celebrationMessages 
    : celebrationMessages.filter(message => message.type === filter);
  
  const getSenderName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case "birthday": return <Gift className="h-4 w-4" />;
      case "anniversary": return <Calendar className="h-4 w-4" />;
      case "celebration": return <Users className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-warmBrown mb-6">Community Messages</h1>
        
        <div className="mb-8">
          <Tabs defaultValue="all" className="w-full" onValueChange={(val) => setFilter(val as any)}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="birthday">Birthdays</TabsTrigger>
              <TabsTrigger value="anniversary">Anniversaries</TabsTrigger>
              <TabsTrigger value="celebration">Celebrations</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="space-y-6">
                {filteredMessages.map((message) => (
                  <MessageCard key={message.id} message={message} senderName={getSenderName(message.userId)} typeIcon={getTypeIcon(message.type)} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="birthday" className="mt-0">
              <div className="space-y-6">
                {filteredMessages.map((message) => (
                  <MessageCard key={message.id} message={message} senderName={getSenderName(message.userId)} typeIcon={getTypeIcon(message.type)} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="anniversary" className="mt-0">
              <div className="space-y-6">
                {filteredMessages.map((message) => (
                  <MessageCard key={message.id} message={message} senderName={getSenderName(message.userId)} typeIcon={getTypeIcon(message.type)} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="celebration" className="mt-0">
              <div className="space-y-6">
                {filteredMessages.map((message) => (
                  <MessageCard key={message.id} message={message} senderName={getSenderName(message.userId)} typeIcon={getTypeIcon(message.type)} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

interface MessageProps {
  message: {
    id: number;
    userId: string;
    content: string;
    type: string;
    media: string | null;
    createdAt: string;
    likes: number;
  };
  senderName: string;
  typeIcon: React.ReactNode;
}

const MessageCard = ({ message, senderName, typeIcon }: MessageProps) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(message.likes);
  
  const handleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setLiked(!liked);
  };
  
  return (
    <Card className="border-peachBlush/20 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={`https://avatar.vercel.sh/${message.userId}.png`} />
            <AvatarFallback>{senderName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">{senderName}</CardTitle>
            <CardDescription className="flex items-center gap-1 text-xs">
              {typeIcon}
              <span>{message.type.charAt(0).toUpperCase() + message.type.slice(1)} message</span>
              <span>·</span>
              <span>{format(new Date(message.createdAt), 'MMM d, h:mm a')}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="mb-4">{message.content}</p>
        
        {message.media && (
          <div className="mt-4 mb-6 rounded-md overflow-hidden">
            <img 
              src={message.media} 
              alt="Message attachment" 
              className="w-full h-auto object-cover rounded-md"
            />
          </div>
        )}
        
        <div className="flex items-center gap-3 mt-4 text-sm text-muted-foreground border-t pt-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex items-center gap-1 ${liked ? 'text-dustyRose' : ''}`}
            onClick={handleLike}
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{likesCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>Reply</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Share className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Community;
