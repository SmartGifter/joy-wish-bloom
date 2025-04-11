
import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
}

interface ConfettiProps {
  count?: number;
  duration?: number;
}

const Confetti = ({ count = 50, duration = 2000 }: ConfettiProps) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  
  useEffect(() => {
    const colors = ["#FFDAD1", "#E9AFA3", "#FDD278", "#A9C8A7", "#9D6B53"];
    
    // Generate confetti pieces
    const newPieces = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 3 + Math.random() * 7,
      rotation: Math.random() * 360
    }));
    
    setPieces(newPieces);
    
    // Remove confetti after duration
    const timer = setTimeout(() => {
      setPieces([]);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [count, duration]);
  
  if (pieces.length === 0) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((piece) => (
        <div 
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}px`,
            height: `${piece.size * 1.5}px`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
