import { Play, Pause } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface MusicPlayerProps {
  title: string;
  src: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function MusicPlayer({ title, src, isSelected, onSelect }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isSelected && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isSelected, isPlaying]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      onSelect(); // Auto select when playing
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      onClick={onSelect}
      className={cn(
        "flex items-center justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer group hover:shadow-md",
        isSelected
          ? "border-primary/50 bg-primary/5 shadow-primary/10"
          : "border-border bg-white/50 hover:bg-white/80"
      )}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
            isSelected ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "bg-secondary text-secondary-foreground"
          )}
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
        </button>
        <div className="flex flex-col">
          <span className={cn("font-medium", isSelected ? "text-primary" : "text-foreground")}>{title}</span>
          <span className="text-xs text-muted-foreground">Preview track</span>
        </div>
      </div>
      
      <div className={cn(
        "w-4 h-4 rounded-full border-2 transition-all",
        isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
      )} />

      <audio ref={audioRef} src={src} onEnded={() => setIsPlaying(false)} />
    </div>
  );
}
