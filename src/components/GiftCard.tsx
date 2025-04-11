
import { GiftItem } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { categoryPriceRanges } from "@/data/mockData";
import GiftProgress from "./GiftProgress";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Gift, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface GiftCardProps {
  item: GiftItem;
  className?: string;
}

const GiftCard = ({ item, className }: GiftCardProps) => {
  const { contributeToGift, currentUser } = useApp();
  const [amount, setAmount] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  
  const totalContributed = item.contributors.reduce((sum, contrib) => sum + contrib.amount, 0);
  const amountRemaining = Math.max(0, item.price - totalContributed);
  const isFullyFunded = amountRemaining === 0;
  
  const canContribute = currentUser && !isFullyFunded;
  
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
              disabled={!canContribute}
            >
              {isFullyFunded ? (
                <>
                  <Gift size={14} className="mr-1" /> Funded
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
            
            <div className="space-y-4 py-2">
              <div className="space-y-2">
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
              
              <div className="space-y-1">
                <label htmlFor="message" className="text-sm font-medium">
                  Add a Message (Optional)
                </label>
                <Textarea 
                  id="message" 
                  placeholder="Send your wishes..."
                  className="resize-none"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                className="gift-btn w-full" 
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
