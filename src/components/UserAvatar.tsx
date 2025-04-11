
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
  showHoverCard?: boolean;
  className?: string;
}

const UserAvatar = ({ user, size = "md", showHoverCard = false, className }: UserAvatarProps) => {
  const { getUserById } = useApp();
  
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16"
  };

  const avatar = (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={user.profilePhoto} alt={user.name} />
      <AvatarFallback className="bg-dustyRose text-white">
        {user.name.split(' ').map(name => name[0]).join('')}
      </AvatarFallback>
    </Avatar>
  );

  if (!showHoverCard) {
    return avatar;
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {avatar}
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.profilePhoto} />
            <AvatarFallback className="bg-dustyRose text-white text-xl">
              {user.name.split(' ').map(name => name[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-lg font-semibold">{user.name}</h4>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-warmBrown">Wallet: </span>
              <span className="font-semibold text-green-600">${user.walletBalance.toFixed(2)}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {user.friends.slice(0, 5).map(friendId => {
                const friend = getUserById(friendId);
                return friend ? (
                  <Avatar key={friendId} className="h-6 w-6 border border-white">
                    <AvatarImage src={friend.profilePhoto} alt={friend.name} />
                    <AvatarFallback className="text-[8px]">
                      {friend.name.split(' ').map(name => name[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ) : null;
              })}
              {user.friends.length > 5 && (
                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
                  +{user.friends.length - 5}
                </div>
              )}
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserAvatar;
