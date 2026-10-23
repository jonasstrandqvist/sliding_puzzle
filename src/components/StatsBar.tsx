import React from 'react';
import { Trophy, Timer, Footprints } from 'lucide-react';
import { GridSize, RecordEntry } from '../types';

interface StatsBarProps {
  moves: number;
  seconds: number;
  gridSize: GridSize;
  bestRecord?: RecordEntry;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  moves,
  seconds,
  gridSize,
  bestRecord,
}) => {
  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-xl mx-auto flex items-center justify-between px-3 py-2 text-xs text-neutral-400">
      {/* Moves counter */}
      <div className="flex items-center gap-1.5">
        <Footprints className="w-3.5 h-3.5 text-neutral-500" />
        <span className="text-neutral-500 font-medium">Moves</span>
        <span className="font-mono tabular-nums text-sm font-semibold text-white">
          {moves}
        </span>
      </div>

      <span aria-hidden="true" className="text-neutral-700">·</span>

      {/* Timer */}
      <div className="flex items-center gap-1.5">
        <Timer className="w-3.5 h-3.5 text-neutral-500" />
        <span className="text-neutral-500 font-medium">Time</span>
        <span className="font-mono tabular-nums text-sm font-semibold text-white">
          {formatTime(seconds)}
        </span>
      </div>

      <span aria-hidden="true" className="text-neutral-700">·</span>

      {/* Best record for this grid */}
      <div className="flex items-center gap-1.5">
        <Trophy className="w-3.5 h-3.5 text-amber-500/80" />
        <span className="text-neutral-500 font-medium">Best ({gridSize}×{gridSize})</span>
        <span className="font-mono tabular-nums text-xs text-neutral-300">
          {bestRecord ? `${bestRecord.bestMoves} m / ${formatTime(bestRecord.bestTime)}` : 'None yet'}
        </span>
      </div>
    </div>
  );
};
