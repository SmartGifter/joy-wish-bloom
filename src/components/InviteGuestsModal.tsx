
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import UserAvatar from "./UserAvatar";
import { Loader2, Mail, Search, User, Users } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

interface InviteGuestsModalProps {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
}

const InviteGuestsModal = ({ eventId, isOpen, onClose }: InviteGuestsModalProps) => {
  const { users, currentUser, events, getUserById } = useApp();
  const [activeTab, setActiveTab] = useState("friends");
  const [searchTerm, setSearchTerm] = useState("");
  const [email, setEmail] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const event = events.find(e => e.id === eventId);
  
  if (!event || !currentUser) return null;
  
  // Filter out the current user and users who are already participants
  const availableUsers = users.filter(user => 
    user.id !== currentUser.id && !event.participants.includes(user.id)
  );
  
  const friends = availableUsers.filter(user => 
    currentUser.friends.includes(user.id)
  );
  
  const filteredUsers = availableUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };
  
  const handleInvite = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would send invitations via email/SMS
      // and update the database
      
      // For now, we'll just simulate a successful invitation
      setTimeout(() => {
        toast.success(`${selectedUsers.length} invitations sent successfully!`);
        setSelectedUsers([]);
        setEmail("");
        onClose();
      }, 1500);
    } catch (error) {
      toast.error("Failed to send invitations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEmailInvite = async () => {
    if (!email.trim() || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would send an email invitation
      
      // For now, we'll just simulate a successful invitation
      setTimeout(() => {
        toast.success(`Invitation sent to ${email}`);
        setEmail("");
        onClose();
      }, 1500);
    } catch (error) {
      toast.error("Failed to send invitation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Invite Guests</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="friends" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>
          
          <TabsContent value="friends" className="space-y-4 mt-4">
            {friends.length > 0 ? (
              <div className="space-y-3">
                {friends.map(friend => (
                  <div 
                    key={friend.id}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <UserAvatar user={friend} size="sm" />
                      <span>{friend.name}</span>
                    </div>
                    
                    <Checkbox 
                      checked={selectedUsers.includes(friend.id)}
                      onCheckedChange={() => toggleUserSelection(friend.id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No friends found.</p>
                <p className="text-sm text-muted-foreground">Add friends to your network first.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="search" className="space-y-4 mt-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            {filteredUsers.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {filteredUsers.map(user => (
                  <div 
                    key={user.id}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <UserAvatar user={user} size="sm" />
                      <span>{user.name}</span>
                    </div>
                    
                    <Checkbox 
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => toggleUserSelection(user.id)}
                    />
                  </div>
                ))}
              </div>
            ) : searchTerm ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No users found matching "{searchTerm}"</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Search for users to invite</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="email" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="friend@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                We'll send an invitation email with event details and a link to join
              </p>
            </div>
            
            <Button 
              onClick={handleEmailInvite} 
              className="w-full"
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email Invitation
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
        
        {(activeTab === "friends" || activeTab === "search") && (
          <DialogFooter>
            <div className="flex items-center justify-between w-full gap-3">
              <div className="text-sm">
                {selectedUsers.length} {selectedUsers.length === 1 ? "user" : "users"} selected
              </div>
              
              <Button 
                onClick={handleInvite}
                disabled={isLoading || selectedUsers.length === 0}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Send Invitations"
                )}
              </Button>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InviteGuestsModal;
