
import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import UserAvatar from "./UserAvatar";
import { Gift, Home, LogOut, PlusCircle, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { currentUser, logout } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-ivoryCream">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-peachBlush/20 py-3">
        <div className="container max-w-6xl flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-peachBlush to-dustyRose flex items-center justify-center">
              <Gift className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-warmBrown">SmartGifter</span>
          </Link>

          <div className="flex items-center gap-2">
            {currentUser ? (
              <>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Wallet className="h-4 w-4 mr-1" />
                  <span>${currentUser.walletBalance.toFixed(2)}</span>
                </Button>
                
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/create-event">
                    <PlusCircle className="h-5 w-5 text-dustyRose" />
                  </Link>
                </Button>
                
                <div className="flex items-center gap-2 ml-2">
                  <UserAvatar user={currentUser} showHoverCard size="sm" />
                  
                  <Button variant="ghost" size="icon" onClick={logout}>
                    <LogOut className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </>
            ) : (
              <Button className="gift-btn" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 py-6">
        <div className="container max-w-6xl">
          {children}
        </div>
      </main>

      <footer className="bg-white border-t border-peachBlush/20 py-6">
        <div className="container max-w-6xl">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} SmartGifter. All rights reserved.
            </p>
          </div>
          
          {currentUser && (
            <div className="fixed bottom-0 left-0 right-0 py-2 px-4 bg-white border-t border-peachBlush/20 flex justify-center gap-6 md:hidden">
              <Link to="/" className={cn("flex flex-col items-center text-xs font-medium")}>
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>
              <Link to="/create-event" className={cn("flex flex-col items-center text-xs font-medium text-dustyRose")}>
                <PlusCircle className="h-5 w-5" />
                <span>New</span>
              </Link>
              <Link to="/profile" className={cn("flex flex-col items-center text-xs font-medium")}>
                <Wallet className="h-5 w-5" />
                <span>Wallet</span>
              </Link>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
