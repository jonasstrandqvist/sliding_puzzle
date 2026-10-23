import React from 'react';
import { Trophy, Star, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { Animal, GridSize } from '../types';

interface VictoryModalProps {
  isOpen: boolean;
  animal: Animal;
  gridSize: GridSize;
  moves: number;
  seconds: number;
  isNewRecord: boolean;
  onPlayAgain: () => void;
  onNextAnimal: () => void;
  onIncreaseDifficulty?: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  animal,
  gridSize,
  moves,
  seconds,
  isNewRecord,
  onPlayAgain,
  onNextAnimal,
  onIncreaseDifficulty,
}) => {
  if (!isOpen) return null;

  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate rating stars
  const getRating = (): number => {
    const baseMoves = gridSize === 3 ? 35 : gridSize === 4 ? 80 : 160;
    if (moves <= baseMoves) return 3;
    if (moves <= baseMoves * 1.8) return 2;
    return 1;
  };

  const stars = getRating();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Full completed image preview at top */}
        <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
          <img
            src={animal.imageUrl}
            alt={animal.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
          
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <span className="text-[11px] font-mono tracking-wider uppercase text-amber-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Puzzle Solved!
              </span>
              <h2 className="text-xl font-bold text-white font-display">
                {animal.name}
              </h2>
            </div>
            
            {/* Star Rating */}
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((starIdx) => (
                <Star
                  key={starIdx}
                  className={`w-5 h-5 ${
                    starIdx <= stars
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-neutral-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content & Stats */}
        <div className="p-6 space-y-4">
          {/* New Record Banner */}
          {isNewRecord && (
            <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Personal Best Record Smashed!</span>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80">
              <span className="text-[10px] text-neutral-500 font-medium">Difficulty</span>
              <div className="text-sm font-bold text-white font-mono mt-0.5">
                {gridSize}×{gridSize}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80">
              <span className="text-[10px] text-neutral-500 font-medium">Moves</span>
              <div className="text-sm font-bold text-white font-mono mt-0.5">
                {moves}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80">
              <span className="text-[10px] text-neutral-500 font-medium">Time</span>
              <div className="text-sm font-bold text-white font-mono mt-0.5">
                {formatTime(seconds)}
              </div>
            </div>
          </div>

          {/* Wildlife Fact */}
          <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800/60 text-xs text-neutral-400 leading-relaxed">
            <span className="text-neutral-300 font-semibold block mb-0.5">Wildlife Spotlight</span>
            {animal.fact}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex flex-col sm:flex-row gap-2">
          <button
            onClick={onPlayAgain}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-neutral-300 bg-neutral-800 hover:bg-neutral-700 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Play Again</span>
          </button>

          <button
            onClick={onNextAnimal}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer shadow"
          >
            <span>Next Animal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {onIncreaseDifficulty && gridSize < 5 && (
            <button
              onClick={onIncreaseDifficulty}
              className="flex items-center justify-center px-3 py-2.5 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-neutral-900 border border-amber-500/20 hover:border-amber-500/40 rounded-lg transition-colors cursor-pointer"
            >
              {gridSize + 1}×{gridSize + 1} Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
