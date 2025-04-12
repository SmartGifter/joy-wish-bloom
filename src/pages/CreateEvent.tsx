
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Gift, Loader2, Plus, Trash2, X } from "lucide-react";
import { eventTypeIcons, giftSuggestions } from "@/data/mockData";
import { GiftItem } from "@/types";

interface GiftFormData {
  title: string;
  description: string;
  price: string;
  priority: "low" | "medium" | "high";
  url: string;
  category: "small" | "medium" | "large";
}

const EMPTY_GIFT_FORM: GiftFormData = {
  title: "",
  description: "",
  price: "",
  priority: "medium",
  url: "",
  category: "medium",
};

const CreateEvent = () => {
  const navigate = useNavigate();
  const { currentUser, createEvent, addGiftItem } = useApp();
  
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<"birthday" | "wedding" | "housewarming" | "baby_shower" | "other">("birthday");
  const [privacy, setPrivacy] = useState<"public" | "private">("public");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [gifts, setGifts] = useState<GiftFormData[]>([{ ...EMPTY_GIFT_FORM }]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!currentUser) {
    navigate("/login");
    return null;
  }

  const addGiftForm = () => {
    setGifts([...gifts, { ...EMPTY_GIFT_FORM }]);
  };

  const removeGiftForm = (index: number) => {
    setGifts(gifts.filter((_, i) => i !== index));
  };

  const updateGiftForm = (index: number, field: keyof GiftFormData, value: string) => {
    const updatedGifts = [...gifts];
    updatedGifts[index] = {
      ...updatedGifts[index],
      [field]: value,
    };
    setGifts(updatedGifts);
  };

  const toggleSuggestion = (title: string) => {
    if (selectedSuggestions.includes(title)) {
      setSelectedSuggestions(selectedSuggestions.filter(s => s !== title));
    } else {
      setSelectedSuggestions([...selectedSuggestions, title]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !date || !type || !privacy) return;
    
    setIsSubmitting(true);
    
    try {
      // Create the event
      const eventId = `event${Date.now()}`;
      createEvent({
        id: eventId, // Temporary ID that will be replaced by the context
        title,
        date,
        type,
        creator: currentUser.id,
        privacy,
        participants: [], 
        rsvp: {},
        description,
        location
      });
      
      // Add user specified gifts
      gifts.forEach(gift => {
        if (gift.title && gift.price) {
          addGiftItem({
            title: gift.title,
            description: gift.description,
            price: parseFloat(gift.price) || 0,
            category: gift.category,
            url: gift.url,
            status: "available",
            priority: gift.priority,
            eventId: eventId,
            contributors: []
          });
        }
      });
      
      // Add selected suggested gifts
      const suggestions = giftSuggestions[type];
      if (suggestions) {
        suggestions
          .filter(suggestion => selectedSuggestions.includes(suggestion.title))
          .forEach(suggestion => {
            addGiftItem({
              title: suggestion.title,
              description: `Suggested ${suggestion.title} for your ${type}`,
              price: suggestion.price,
              category: suggestion.category as any,
              url: "",
              status: "available",
              priority: "medium",
              eventId: eventId,
              contributors: []
            });
          });
      }
      
      // Navigate to the event details page
      navigate(`/event/${eventId}`);
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="border-peachBlush">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-peachBlush/20 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-dustyRose" />
            </div>
            <CardTitle className="text-2xl font-bold text-warmBrown">Create a Celebration</CardTitle>
            <CardDescription>Share the joy with friends & family</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Event Details</h3>
                
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea 
                    id="description"
                    placeholder="Tell everyone about your celebration..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input 
                    id="location"
                    placeholder="Where is the celebration happening?"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="border-t border-peachBlush/20 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Gift className="h-5 w-5 text-dustyRose" />
                    <span>Gift Registry</span>
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {gifts.map((gift, index) => (
                    <div key={index} className="p-4 border border-peachBlush/20 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Gift {index + 1}</h4>
                        {gifts.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeGiftForm(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor={`gift-title-${index}`}>Gift Name</Label>
                            <Input 
                              id={`gift-title-${index}`}
                              placeholder="e.g. Coffee Maker"
                              value={gift.title}
                              onChange={(e) => updateGiftForm(index, 'title', e.target.value)}
                              required={index === 0}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`gift-price-${index}`}>Price ($)</Label>
                            <Input 
                              id={`gift-price-${index}`}
                              type="number"
                              step="0.01"
                              placeholder="e.g. 49.99"
                              value={gift.price}
                              onChange={(e) => updateGiftForm(index, 'price', e.target.value)}
                              required={index === 0}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`gift-description-${index}`}>Description</Label>
                          <Textarea 
                            id={`gift-description-${index}`}
                            placeholder="Describe the gift..."
                            value={gift.description}
                            onChange={(e) => updateGiftForm(index, 'description', e.target.value)}
                            rows={2}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor={`gift-priority-${index}`}>Priority</Label>
                            <Select 
                              value={gift.priority}
                              onValueChange={(val) => updateGiftForm(index, 'priority', val)}
                            >
                              <SelectTrigger id={`gift-priority-${index}`}>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`gift-category-${index}`}>Category</Label>
                            <Select 
                              value={gift.category}
                              onValueChange={(val) => updateGiftForm(index, 'category', val as any)}
                            >
                              <SelectTrigger id={`gift-category-${index}`}>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small">Small</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="large">Large</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`gift-url-${index}`}>Product URL (Optional)</Label>
                          <Input 
                            id={`gift-url-${index}`}
                            placeholder="Link to the product"
                            value={gift.url}
                            onChange={(e) => updateGiftForm(index, 'url', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={addGiftForm}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Gift
                  </Button>
                </div>
                
                {giftSuggestions[type]?.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="font-medium">Gift Suggestions</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {giftSuggestions[type].map((suggestion, idx) => (
                        <div 
                          key={idx}
                          onClick={() => toggleSuggestion(suggestion.title)}
                          className={`p-3 border rounded-md cursor-pointer transition-colors flex justify-between items-center ${
                            selectedSuggestions.includes(suggestion.title) 
                              ? 'border-dustyRose bg-peachBlush/10' 
                              : 'border-border hover:border-peachBlush/50'
                          }`}
                        >
                          <div>
                            <p className="font-medium">{suggestion.title}</p>
                            <p className="text-sm text-muted-foreground">${suggestion.price.toFixed(2)}</p>
                          </div>
                          {selectedSuggestions.includes(suggestion.title) && (
                            <div className="h-6 w-6 rounded-full bg-dustyRose/20 flex items-center justify-center">
                              <Plus className="h-4 w-4 text-dustyRose" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="gift-btn w-full mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Celebration
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateEvent;
