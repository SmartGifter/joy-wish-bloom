
import { Event } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { eventTypeIcons } from "@/data/mockData";
import { useApp } from "@/context/AppContext";
import { format } from "date-fns";
import UserAvatar from "./UserAvatar";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  event: Event;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const EventCard = ({ event, className, size = "md" }: EventCardProps) => {
  const { getUserById, getGiftsByEventId, currentUser } = useApp();
  const creator = getUserById(event.creator);
  const gifts = getGiftsByEventId(event.id);
  const dateObj = new Date(event.date);
  const isUpcoming = dateObj > new Date();

  const sizingClasses = {
    sm: "p-3 max-w-[200px]",
    md: "p-4 max-w-[320px]",
    lg: "p-6 max-w-[400px]"
  };

  if (!creator) return null;

  const isParticipant = currentUser && event.participants.includes(currentUser.id);
  const userRsvp = currentUser && event.rsvp[currentUser.id];

  return (
    <Link to={`/event/${event.id}`}>
      <Card 
        className={cn(
          "overflow-hidden transition-all hover:shadow-lg border-peachBlush/50 hover:border-peachBlush", 
          sizingClasses[size],
          className
        )}
      >
        <div 
          className={cn(
            "h-2 w-full", 
            event.type === "birthday" && "bg-peachBlush",
            event.type === "wedding" && "bg-sunsetGold",
            event.type === "housewarming" && "bg-mossGreen",
            event.type === "baby_shower" && "bg-dustyRose",
            event.type === "other" && "bg-warmBrown"
          )}
        />
        <CardContent className={cn("pt-4", size === "sm" ? "space-y-2" : "space-y-3")}>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className="text-xl" role="img" aria-label={event.type}>
                {eventTypeIcons[event.type] || "🎁"}
              </span>
              <h3 className={cn("font-semibold truncate", size === "sm" ? "text-sm" : "text-base")}>
                {event.title}
              </h3>
            </div>
            {isParticipant && userRsvp && (
              <Badge 
                variant="outline" 
                className={cn(
                  "text-[10px] capitalize",
                  userRsvp === "yes" && "border-green-500 text-green-700",
                  userRsvp === "no" && "border-red-400 text-red-600",
                  userRsvp === "maybe" && "border-amber-400 text-amber-600"
                )}
              >
                {userRsvp}
              </Badge>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <UserAvatar user={creator} size="sm" />
              <span className={cn("text-muted-foreground", size === "sm" ? "text-xs" : "text-sm")}>
                by {creator.name.split(' ')[0]}
              </span>
            </div>
            
            <span className={cn("text-muted-foreground", size === "sm" ? "text-xs" : "text-sm")}>
              {format(dateObj, "MMM d")}
            </span>
          </div>
          
          {size !== "sm" && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">
                {event.participants.length} {event.participants.length === 1 ? "guest" : "guests"}
              </span>
              <span className="text-muted-foreground">
                {gifts.length} {gifts.length === 1 ? "gift" : "gifts"}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default EventCard;
