
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { eventTypeIcons, giftSuggestions } from "@/data/mockData";
import { GiftItem } from "@/types";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { currentUser, createEvent, addGiftItem } = useApp();
  
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<"birthday" | "wedding" | "housewarming" | "baby_shower" | "other">("birthday");
  const [privacy, setPrivacy] = useState<"public" | "private">("public");
  
  if (!currentUser) {
    navigate("/login");
    return null;
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !date || !type || !privacy) return;
    
    // Create the event
    createEvent({
      title,
      date,
      type,
      creator: currentUser.id,
      privacy,
      participants: [], // Start with no participants
      rsvp: {}
    });
    
    // Add suggested gifts if selected
    const suggestions = giftSuggestions[type];
    if (suggestions) {
      suggestions.forEach(suggestion => {
        addGiftItem({
          title: suggestion.title,
          description: `Suggested ${suggestion.title} for your ${type}`,
          price: suggestion.price,
          category: suggestion.category as any,
          url: "",
          status: "available",
          priority: "medium",
          eventId: `event${(Math.random() * 1000).toFixed(0)}`, // This will be replaced with the correct ID in the context
          contributors: []
        });
      });
    }
    
    navigate("/");
  };
  
  return (
    <Layout>
      <div className="max-w-lg mx-auto">
        <Card className="border-peachBlush">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-peachBlush/20 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-dustyRose" />
            </div>
            <CardTitle className="text-2xl font-bold text-warmBrown">Create a Celebration</CardTitle>
            <p className="text-muted-foreground">Share the joy with friends & family</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Celebration Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Sarah's Birthday Party" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Event Type</Label>
                <Select 
                  value={type} 
                  onValueChange={(val) => setType(val as any)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="birthday">
                      <div className="flex items-center gap-2">
                        <span role="img" aria-label="birthday">
                          {eventTypeIcons.birthday}
                        </span>
                        <span>Birthday</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="wedding">
                      <div className="flex items-center gap-2">
                        <span role="img" aria-label="wedding">
                          {eventTypeIcons.wedding}
                        </span>
                        <span>Wedding</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="housewarming">
                      <div className="flex items-center gap-2">
                        <span role="img" aria-label="housewarming">
                          {eventTypeIcons.housewarming}
                        </span>
                        <span>Housewarming</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="baby_shower">
                      <div className="flex items-center gap-2">
                        <span role="img" aria-label="baby shower">
                          {eventTypeIcons.baby_shower}
                        </span>
                        <span>Baby Shower</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="other">
                      <div className="flex items-center gap-2">
                        <span role="img" aria-label="other">
                          {eventTypeIcons.other}
                        </span>
                        <span>Other</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="privacy">Privacy</Label>
                <Select 
                  value={privacy} 
                  onValueChange={(val) => setPrivacy(val as any)}
                >
                  <SelectTrigger id="privacy">
                    <SelectValue placeholder="Select privacy setting" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public (Anyone can see)</SelectItem>
                    <SelectItem value="private">Private (Invitation only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button type="submit" className="gift-btn w-full mt-6">
                Create Celebration
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateEvent;
