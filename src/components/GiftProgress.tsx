
import { GiftItem } from "@/types";
import { cn } from "@/lib/utils";

interface GiftProgressProps {
  item: GiftItem;
  showContributions?: boolean;
}

const GiftProgress = ({ item, showContributions = false }: GiftProgressProps) => {
  const totalContributed = item.contributors.reduce((sum, contrib) => sum + contrib.amount, 0);
  const percentComplete = Math.min((totalContributed / item.price) * 100, 100);
  const isComplete = percentComplete >= 100;
  const isNearlyComplete = percentComplete >= 85 && percentComplete < 100;

  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-xs">
        <span className="font-medium">
          {isComplete ? "Fully Funded! 🎉" : "WishBloom"}
        </span>
        <span>
          ${totalContributed.toFixed(2)} of ${item.price.toFixed(2)}
        </span>
      </div>
      <div className="progress-bar">
        <div 
          className={cn(
            "progress-value transition-all duration-700",
            isComplete && "from-mossGreen to-mossGreen/80",
            isNearlyComplete && "shimmer"
          )} 
          style={{ width: `${percentComplete}%` }}
        />
      </div>
      {showContributions && item.contributors.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-medium mb-1 text-warmBrown">
            {item.contributors.length} {item.contributors.length === 1 ? "person" : "people"} contributed
          </p>
          <div className="flex -space-x-2">
            {item.contributors.slice(0, 5).map((contributor, index) => (
              <div key={`${contributor.userId}-${index}`} className="h-6 w-6 rounded-full bg-dustyRose/20 border border-dustyRose flex items-center justify-center text-[10px] text-dustyRose font-medium">
                {contributor.userId.substring(4)}
              </div>
            ))}
            {item.contributors.length > 5 && (
              <div className="h-6 w-6 rounded-full bg-dustyRose/20 border border-dustyRose flex items-center justify-center text-[10px] text-dustyRose font-medium">
                +{item.contributors.length - 5}
              </div>
            )}
          </div>
          {isComplete ? (
            <p className="text-xs mt-1 text-mossGreen font-medium">Joy unlocked! 🎁</p>
          ) : isNearlyComplete ? (
            <p className="text-xs mt-1 text-sunsetGold font-medium">So close to wrapping! ✨</p>
          ) : (
            <p className="text-xs mt-1 text-muted-foreground">Help make this wish come true</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GiftProgress;
