import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { Animal } from '../types';

interface HeaderProps {
  currentAnimal: Animal;
  onOpenAnimals: () => void;
  onOpenHowToPlay: () => void;
  onOpenRecords: () => void;
  onRandomAnimal: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentAnimal,
  onOpenAnimals,
  onOpenHowToPlay,
  onOpenRecords,
  onRandomAnimal,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="w-full max-w-6xl mx-auto flex items-center justify-between gap-8 px-6 py-4 border-b border-neutral-800/80">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.location.reload();
          }}
          className="text-xl font-bold tracking-tight text-white font-display hover:text-neutral-300 transition-colors whitespace-nowrap shrink-0"
        >
          FaunaShift
        </a>
        <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-neutral-700" />
        <span className="hidden sm:inline-block text-xs text-neutral-400 font-medium">
          {currentAnimal.name}
        </span>
      </div>

      {/* Zone 2: 4-5 concise single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
        <button
          onClick={onOpenAnimals}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Choose Animal
        </button>
        <button
          onClick={onOpenHowToPlay}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          How to Play
        </button>
        <button
          onClick={onOpenRecords}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Best Records
        </button>
        <button
          onClick={onToggleMute}
          aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-xs"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4 text-neutral-300" />}
          <span>{isMuted ? 'Muted' : 'Sound On'}</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onRandomAnimal}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-200 active:scale-98 transition-all rounded-lg whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Random Animal</span>
        </button>
      </div>
    </header>
  );
};
