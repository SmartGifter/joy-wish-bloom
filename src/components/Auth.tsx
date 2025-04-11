
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Facebook, Mail } from "lucide-react";
import Confetti from "./Confetti";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";

interface AuthProps {
  onComplete?: () => void;
  initialTab?: "login" | "signup";
}

const Auth = ({ onComplete, initialTab = "login" }: AuthProps) => {
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">(initialTab);

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
          <CardDescription>Sign in to start celebrating together</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue={activeTab} 
            onValueChange={(val) => setActiveTab(val as "login" | "signup")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
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
                
                <Button type="submit" className="gift-btn w-full" disabled={!email || !name}>
                  <Mail className="mr-2 h-4 w-4" /> Continue with Email
                </Button>
                
                <div className="relative flex py-4 items-center">
                  <Separator className="flex-grow" />
                  <span className="flex-shrink mx-4 text-xs text-muted-foreground">OR CONTINUE WITH</span>
                  <Separator className="flex-grow" />
                </div>
                
                <Button type="button" variant="outline" className="w-full">
                  <Facebook className="mr-2 h-4 w-4 text-blue-600" /> Continue with Facebook
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Your Name</Label>
                  <Input 
                    id="signup-name" 
                    placeholder="Enter your full name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email Address</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2 bg-muted/30 p-3 rounded-md border">
                  <Label htmlFor="about-platform" className="text-sm">What is SmartGifter?</Label>
                  <p className="text-xs text-muted-foreground">
                    SmartGifter is a platform that makes group gifting simple and delightful. 
                    Create celebrations, add wishlists, and collaborate with friends and family 
                    to make gifting magical.
                  </p>
                </div>
                
                <Button type="submit" className="gift-btn w-full" disabled={!email || !name}>
                  <Mail className="mr-2 h-4 w-4" /> Sign up with Email
                </Button>
                
                <div className="relative flex py-4 items-center">
                  <Separator className="flex-grow" />
                  <span className="flex-shrink mx-4 text-xs text-muted-foreground">OR SIGN UP WITH</span>
                  <Separator className="flex-grow" />
                </div>
                
                <Button type="button" variant="outline" className="w-full">
                  <Facebook className="mr-2 h-4 w-4 text-blue-600" /> Continue with Facebook
                </Button>

                <p className="text-xs text-center text-muted-foreground pt-4">
                  By signing up, you agree to our Terms and Privacy Policy.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {showSuccess && <Confetti />}
    </div>
  );
};

import { Gift } from "lucide-react";

export default Auth;
