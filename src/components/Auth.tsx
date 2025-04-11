
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Facebook, Mail } from "lucide-react";
import Confetti from "./Confetti";

interface AuthProps {
  onComplete?: () => void;
}

const Auth = ({ onComplete }: AuthProps) => {
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    
    login(email, name);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      if (onComplete) onComplete();
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-[500px] w-full">
      <Card className="w-full max-w-md border-peachBlush">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-peachBlush/20 flex items-center justify-center">
            <Gift className="h-8 w-8 text-dustyRose" />
          </div>
          <CardTitle className="text-2xl font-bold text-warmBrown">Welcome to SmartGifter</CardTitle>
          <p className="text-muted-foreground">Sign in to start celebrating together</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input 
                id="name" 
                placeholder="Enter your name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="gift-btn w-full" disabled={!email || !name}>
              <Mail className="mr-2 h-4 w-4" /> Continue with Email
            </Button>
            
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              <div className="absolute top-1/2 w-full border-t" />
            </div>
            
            <Button type="button" variant="outline" className="w-full">
              <Facebook className="mr-2 h-4 w-4 text-blue-600" /> Continue with Facebook
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {showSuccess && <Confetti />}
    </div>
  );
};

import { Gift } from "lucide-react";

export default Auth;
