
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import Layout from "@/components/Layout";
import GiftCard from "@/components/GiftCard";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { eventTypeIcons, giftSuggestions } from "@/data/mockData";
import { format } from "date-fns";
import { Calendar, Gift, Plus, Share2, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const EventDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { 
    currentUser, 
    getEventById, 
    getUserById, 
    getGiftsByEventId, 
    updateRSVP 
  } = useApp();
  
  const event = eventId ? getEventById(eventId) : null;
  const creator = event ? getUserById(event.creator) : null;
  const gifts = eventId ? getGiftsByEventId(eventId) : [];
  
  const [selectedRsvp, setSelectedRsvp] = useState<"yes" | "no" | "maybe" | null>(null);
  
  useEffect(() => {
    if (event && currentUser) {
      setSelectedRsvp(event.rsvp[currentUser.id] || null);
    }
  }, [event, currentUser]);
  
  if (!event || !creator) {
    navigate("/");
    return null;
  }
  
  const isCreator = currentUser && currentUser.id === event.creator;
  const isParticipant = currentUser && event.participants.includes(currentUser.id);
  const eventDate = new Date(event.date);
  const isPastEvent = eventDate < new Date();
  
  const handleRsvpChange = (status: "yes" | "no" | "maybe") => {
    if (!currentUser) return;
    
    setSelectedRsvp(status);
    updateRSVP(event.id, currentUser.id, status);
  };
  
  const participants = event.participants
    .map(id => getUserById(id))
    .filter(Boolean);
  
  const rsvpCounts = {
    yes: Object.values(event.rsvp).filter(status => status === "yes").length,
    no: Object.values(event.rsvp).filter(status => status === "no").length,
    maybe: Object.values(event.rsvp).filter(status => status === "maybe").length
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        {/* Event Header */}
        <header className="bg-white rounded-2xl p-6 border border-peachBlush/20 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl" role="img" aria-label={event.type}>
                  {eventTypeIcons[event.type] || "🎁"}
                </span>
                <h1 className="text-2xl md:text-3xl font-bold text-warmBrown">{event.title}</h1>
                {event.privacy === "private" && (
                  <Badge variant="outline" className="ml-2">Private</Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{format(eventDate, "EEEE, MMMM d, yyyy")}</span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{participants.length} guests</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Hosted by</span>
                <UserAvatar user={creator} size="sm" showHoverCard />
                <span className="font-medium">{creator.name}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {!isPastEvent && (
                <div className="flex items-center gap-2">
                  {!isCreator && (
                    <>
                      <Button
                        variant={selectedRsvp === "yes" ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          selectedRsvp === "yes" && "bg-mossGreen hover:bg-mossGreen/90"
                        )}
                        onClick={() => handleRsvpChange("yes")}
                      >
                        Yes
                      </Button>
                      <Button
                        variant={selectedRsvp === "maybe" ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          selectedRsvp === "maybe" && "bg-sunsetGold hover:bg-sunsetGold/90"
                        )}
                        onClick={() => handleRsvpChange("maybe")}
                      >
                        Maybe
                      </Button>
                      <Button
                        variant={selectedRsvp === "no" ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          selectedRsvp === "no" && "bg-dustyRose hover:bg-dustyRose/90"
                        )}
                        onClick={() => handleRsvpChange("no")}
                      >
                        No
                      </Button>
                    </>
                  )}
                </div>
              )}
              
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Gift Content */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Wishlist</CardTitle>
                    <CardDescription>
                      Help make these wishes come true
                    </CardDescription>
                  </div>
                  
                  {isCreator && (
                    <Button className="gift-btn">
                      <Plus className="h-4 w-4 mr-1" /> Add Gift
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {gifts.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {gifts.map(gift => (
                      <GiftCard key={gift.id} item={gift} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted/50 rounded-xl p-8 text-center">
                    <Gift className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      No gifts added to the wishlist yet.
                    </p>
                    {isCreator && (
                      <Button className="gift-btn mt-3">
                        <Plus className="h-4 w-4 mr-1" /> Add First Gift
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Suggested Gifts */}
            {isCreator && giftSuggestions[event.type] && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Gift Suggestions</CardTitle>
                  <CardDescription>
                    Popular ideas for {event.type === "birthday" ? "birthdays" : 
                                      event.type === "wedding" ? "weddings" : 
                                      event.type === "housewarming" ? "housewarmings" : 
                                      event.type === "baby_shower" ? "baby showers" : 
                                      "celebrations"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {giftSuggestions[event.type].map((suggestion, i) => (
                      <div key={i} className="p-3 rounded-lg border border-peachBlush/20 hover:bg-peachBlush/5 transition-colors">
                        <p className="font-medium truncate">{suggestion.title}</p>
                        <p className="text-sm text-muted-foreground">${suggestion.price.toFixed(2)}</p>
                        <Button variant="ghost" size="sm" className="mt-2 w-full text-dustyRose">
                          <Plus className="h-4 w-4 mr-1" /> Add to Wishlist
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Guest List */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Guests</CardTitle>
                <CardDescription>
                  {rsvpCounts.yes} attending · {rsvpCounts.maybe} maybe · {rsvpCounts.no} declined
                </CardDescription>
              </CardHeader>
              <CardContent>
                {participants.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-3">
                    {participants.map(participant => participant && (
                      <div key={participant.id} className="flex items-center gap-2">
                        <UserAvatar user={participant} size="sm" />
                        <div className="flex flex-col leading-tight">
                          <span className="font-medium text-sm truncate">
                            {participant.name.split(' ')[0]}
                          </span>
                          <span className="text-xs text-muted-foreground capitalize">
                            {event.rsvp[participant.id] || "invited"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No guests yet.</p>
                )}
                
                {isCreator && (
                  <Button variant="outline" className="w-full mt-4 text-dustyRose">
                    <Plus className="h-4 w-4 mr-1" /> Invite Guests
                  </Button>
                )}
              </CardContent>
            </Card>
            
            {/* Chat or Comments Placeholder */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Event Chat</CardTitle>
                <CardDescription>
                  Coordinate with other guests
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  Chat will be available soon!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetails;
