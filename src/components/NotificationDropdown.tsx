
import { useState } from "react";
import { 
  Bell, 
  Calendar, 
  Home, 
  X, 
  Check,
  Clock,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { format } from "date-fns";

const NotificationDropdown = () => {
  const { users } = useApp();
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "invitation",
      title: "Housewarming Party",
      description: "You're invited to Emma's housewarming party",
      from: users[1]?.id || "1",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: false,
      requiresAction: true,
    },
    {
      id: "2",
      type: "reminder",
      title: "Birthday Gift Reminder",
      description: "Don't forget to buy a gift for Alex's birthday",
      from: null,
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: false,
      requiresAction: false,
    },
    {
      id: "3",
      type: "invitation",
      title: "Anniversary Celebration",
      description: "John and Sarah invite you to their anniversary dinner",
      from: users[2]?.id || "2",
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      requiresAction: true,
    },
  ]);
  const [open, setOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const getSenderName = (userId: string | null) => {
    if (!userId) return "System";
    const user = users.find(u => u.id === userId);
    return user ? user.name : "Unknown User";
  };
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };
  
  const handleDismiss = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };
  
  const handleAccept = (id: string) => {
    // In a real app, this would send an API request to accept the invitation
    markAsRead(id);
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, requiresAction: false } : notif
    ));
  };
  
  const handleDecline = (id: string) => {
    // In a real app, this would send an API request to decline the invitation
    markAsRead(id);
    handleDismiss(id);
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "invitation":
        return <Calendar className="h-5 w-5 text-mossGreen" />;
      case "reminder":
        return <Clock className="h-5 w-5 text-sunsetGold" />;
      case "gift":
        return <Gift className="h-5 w-5 text-dustyRose" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dustyRose opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-dustyRose"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-peachBlush text-warmBrown">
              {unreadCount} new
            </Badge>
          )}
        </div>
        
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div 
                key={notification.id}
                className={cn(
                  "p-4 border-b last:border-b-0",
                  !notification.isRead ? "bg-muted/20" : ""
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{notification.title}</p>
                      {!notification.isRead && (
                        <Badge variant="outline" className="h-1.5 w-1.5 rounded-full bg-dustyRose p-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>{getSenderName(notification.from)}</span>
                      <span>•</span>
                      <span>{format(new Date(notification.date), 'MMM d, h:mm a')}</span>
                    </div>
                    
                    {notification.requiresAction && (
                      <div className="flex items-center gap-2 mt-3">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 text-xs"
                          onClick={() => handleAccept(notification.id)}
                        >
                          <Check className="h-3 w-3 mr-1" /> Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 text-xs"
                          onClick={() => handleDecline(notification.id)}
                        >
                          <X className="h-3 w-3 mr-1" /> Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <Bell className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-2 border-t">
            <Button variant="ghost" size="sm" className="w-full text-xs justify-center">
              See all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;
