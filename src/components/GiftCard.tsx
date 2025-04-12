
import { GiftItem } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { categoryPriceRanges } from "@/data/mockData";
import GiftProgress from "./GiftProgress";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Gift, ShoppingCart, Upload, MessageCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { useState } from "react";
import { useParams } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface GiftCardProps {
  item: GiftItem;
  className?: string;
}

const GiftCard = ({ item, className }: GiftCardProps) => {
  const { eventId } = useParams<{ eventId: string }>();
  const { contributeToGift, currentUser, getEventById } = useApp();
  const [amount, setAmount] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [mediaType, setMediaType] = useState<"none" | "photo" | "video">("none");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [contributionOption, setContributionOption] = useState<"manual" | "suggested">("manual");
  
  const event = eventId ? getEventById(eventId) : null;
  const isEventCreator = currentUser && event && currentUser.id === event.creator;
  
  const totalContributed = item.contributors.reduce((sum, contrib) => sum + contrib.amount, 0);
  const amountRemaining = Math.max(0, item.price - totalContributed);
  const isFullyFunded = amountRemaining === 0;
  
  // User can contribute if they are not the event creator, they are logged in, and the gift isn't fully funded
  const canContribute = currentUser && !isEventCreator && !isFullyFunded;
  
  const suggestedAmounts = [
    Math.min(Math.round(amountRemaining * 0.25), currentUser?.walletBalance || 0),
    Math.min(Math.round(amountRemaining * 0.5), currentUser?.walletBalance || 0),
    Math.min(Math.round(amountRemaining * 0.75), currentUser?.walletBalance || 0)
  ].filter(amount => amount > 0);
  
  const handleContribute = () => {
    if (!currentUser || !amount) return;
    
    const contributionAmount = Number(amount);
    if (isNaN(contributionAmount) || contributionAmount <= 0) return;
    
    contributeToGift(item.id, {
      userId: currentUser.id,
      amount: contributionAmount,
      message: message || undefined
    });
    
    setAmount("");
    setMessage("");
    setMediaType("none");
    setMediaUrl("");
  };

  const handleMediaUpload = (type: "photo" | "video") => {
    // In a real app, this would trigger a file upload
    // For now, we'll simulate it with placeholder URLs
    setMediaType(type);
    if (type === "photo") {
      setMediaUrl("/placeholder.svg");
    } else if (type === "video") {
      // Using a sample video URL
      setMediaUrl("https://player.vimeo.com/video/76979871?background=1");
    }
  };
  
  return (
    <Card 
      className={cn(
        "overflow-hidden border-peachBlush/50 hover:shadow-md transition-all",
        isFullyFunded && "bg-gradient-to-br from-white to-mossGreen/10 border-mossGreen/50",
        className
      )}
    >
      <div className={cn(
        "h-1 w-full",
        item.priority === "high" && "bg-red-400",
        item.priority === "medium" && "bg-amber-400",
        item.priority === "low" && "bg-blue-400"
      )} />
      
      <CardContent className="pt-4 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold truncate flex-1">{item.title}</h3>
          <Badge variant="outline" className="ml-2 text-xs font-normal">
            {categoryPriceRanges[item.category]}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>
        
        <div className="mt-2">
          <GiftProgress item={item} showContributions />
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0 pb-4">
        {item.url && (
          <Button variant="ghost" size="sm" className="text-xs" asChild>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={14} className="mr-1" /> View
            </a>
          </Button>
        )}
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant={isFullyFunded ? "outline" : "default"} 
              size="sm" 
              className={cn(
                "text-xs ml-auto", 
                !isFullyFunded && "gift-btn",
                isFullyFunded && "border-mossGreen text-mossGreen hover:bg-mossGreen/10"
              )}
              disabled={!canContribute || isEventCreator}
            >
              {isFullyFunded ? (
                <>
                  <Gift size={14} className="mr-1" /> Funded
                </>
              ) : isEventCreator ? (
                <>
                  <Gift size={14} className="mr-1" /> Your Gift
                </>
              ) : (
                <>
                  <ShoppingCart size={14} className="mr-1" /> Contribute
                </>
              )}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Contribute to Gift</DialogTitle>
              <DialogDescription>
                Make someone's wish come true! Contribute toward {item.title}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 py-2">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Gift Price</span>
                  <span>${item.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Amount Contributed</span>
                  <span>${totalContributed.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span>Amount Remaining</span>
                  <span>${amountRemaining.toFixed(2)}</span>
                </div>
              </div>
              
              <Tabs defaultValue="manual" 
                onValueChange={(value) => setContributionOption(value as "manual" | "suggested")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">Your Contribution</TabsTrigger>
                  <TabsTrigger value="suggested">AI Suggestions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="manual" className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label htmlFor="amount" className="text-sm font-medium">
                      Your Contribution
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">$</span>
                      <Input 
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        className="pl-7" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {currentUser && (
                        <>Your wallet balance: ${currentUser.walletBalance.toFixed(2)}</>
                      )}
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="suggested" className="space-y-3 pt-2">
                  <div>
                    <p className="text-xs mb-2">
                      Based on the gift price and remaining amount:
                    </p>
                    <RadioGroup 
                      defaultValue={suggestedAmounts[0]?.toString()} 
                      onValueChange={setAmount}
                      className="space-y-2"
                    >
                      {suggestedAmounts.map((amount, index) => (
                        <div key={index} className="flex items-center space-x-2 border p-2 rounded-md">
                          <RadioGroupItem value={amount.toString()} id={`amount-${index}`} />
                          <Label htmlFor={`amount-${index}`} className="flex-1">
                            <div className="font-medium text-sm">${amount.toFixed(2)}</div>
                            <div className="text-xs text-muted-foreground">
                              {index === 0 ? "Perfect starter contribution" : 
                               index === 1 ? "Great mid-range gift" : 
                               "Generous contribution!"}
                            </div>
                          </Label>
                          <Sparkles size={14} className="text-sunsetGold" />
                        </div>
                      ))}
                      
                      <div className="flex items-center space-x-2 border p-2 rounded-md">
                        <RadioGroupItem value="custom" id="amount-custom" />
                        <Label htmlFor="amount-custom" className="flex-1">
                          <div className="font-medium text-sm">Custom amount</div>
                        </Label>
                        {contributionOption === "suggested" && (
                          <div className="relative w-20">
                            <span className="absolute left-2 top-1.5 text-xs">$</span>
                            <Input 
                              type="number"
                              placeholder="0.00"
                              className="pl-5 h-7 text-sm" 
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    </RadioGroup>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="space-y-2">
                <div className="space-y-1">
                  <label htmlFor="message" className="text-sm font-medium">
                    Add a Message
                  </label>
                  <Textarea 
                    id="message" 
                    placeholder="Send your wishes..."
                    className="resize-none"
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Add Media (Optional)</p>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      className={cn("flex-1 h-8", mediaType === "photo" && "border-dustyRose text-dustyRose")}
                      onClick={() => handleMediaUpload("photo")}
                    >
                      <Upload className="h-3 w-3 mr-1" /> Photo
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      className={cn("flex-1 h-8", mediaType === "video" && "border-dustyRose text-dustyRose")}
                      onClick={() => handleMediaUpload("video")}
                    >
                      <Upload className="h-3 w-3 mr-1" /> Video
                    </Button>
                  </div>
                  
                  {mediaType === "photo" && (
                    <div className="border rounded-md p-2 mt-1">
                      <img src={mediaUrl} alt="Preview" className="w-full h-20 object-cover" />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full mt-1 text-xs text-muted-foreground h-6"
                        onClick={() => {
                          setMediaType("none");
                          setMediaUrl("");
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                  
                  {mediaType === "video" && (
                    <div className="border rounded-md p-2 mt-1">
                      <iframe 
                        src={mediaUrl} 
                        className="w-full aspect-video"
                        frameBorder="0"
                        allow="autoplay; fullscreen"
                      ></iframe>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full mt-1 text-xs text-muted-foreground h-6"
                        onClick={() => {
                          setMediaType("none"); 
                          setMediaUrl("");
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <DialogClose asChild>
                <Button variant="outline" size="sm">Cancel</Button>
              </DialogClose>
              <Button 
                className="gift-btn w-full sm:w-auto" 
                size="sm"
                onClick={handleContribute}
                disabled={!amount || isNaN(Number(amount)) || Number(amount) <= 0 || (currentUser && Number(amount) > currentUser.walletBalance)}
              >
                Contribute ${amount ? Number(amount).toFixed(2) : "0.00"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default GiftCard;
