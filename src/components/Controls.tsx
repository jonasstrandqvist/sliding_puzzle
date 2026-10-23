import React from 'react';
import { RotateCcw, Undo2, Lightbulb, Eye, Hash } from 'lucide-react';
import { GridSize } from '../types';

interface ControlsProps {
  gridSize: GridSize;
  onChangeGridSize: (size: GridSize) => void;
  onShuffle: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onHint: () => void;
  isPeeking: boolean;
  setIsPeeking: (peeking: boolean) => void;
  showNumbers: boolean;
  onToggleNumbers: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  gridSize,
  onChangeGridSize,
  onShuffle,
  onUndo,
  canUndo,
  onHint,
  isPeeking,
  setIsPeeking,
  showNumbers,
  onToggleNumbers,
}) => {
  const gridOptions: { size: GridSize; label: string; desc: string }[] = [
    { size: 3, label: '3×3', desc: 'Casual' },
    { size: 4, label: '4×4', desc: 'Classic' },
    { size: 5, label: '5×5', desc: 'Master' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-4 mt-4">
      {/* Grid Size Segmented Selector */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
          {gridOptions.map((opt) => {
            const isActive = gridSize === opt.size;
            return (
              <button
                key={opt.size}
                onClick={() => onChangeGridSize(opt.size)}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-neutral-800 text-white shadow-sm font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>{opt.label}</span>
                <span className="text-[10px] text-neutral-500 font-normal">({opt.desc})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {/* Shuffle / Restart */}
        <button
          onClick={onShuffle}
          title="Restart & Reshuffle (R)"
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-neutral-200 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:text-white rounded-lg transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
          <span>Shuffle</span>
        </button>

        {/* Undo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo last move (U or Ctrl+Z)"
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
            canUndo
              ? 'text-neutral-200 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:text-white cursor-pointer active:scale-95'
              : 'text-neutral-600 bg-neutral-900/50 border border-neutral-900 cursor-not-allowed opacity-50'
          }`}
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span>Undo</span>
        </button>

        {/* Hint */}
        <button
          onClick={onHint}
          title="Get a move suggestion (H)"
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-neutral-200 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:text-white rounded-lg transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Hint</span>
        </button>

        {/* Peek Original Image (Hold or Click) */}
        <button
          onMouseDown={() => setIsPeeking(true)}
          onMouseUp={() => setIsPeeking(false)}
          onMouseLeave={() => setIsPeeking(false)}
          onTouchStart={() => setIsPeeking(true)}
          onTouchEnd={() => setIsPeeking(false)}
          title="Hold Space or mouse to Peek original image"
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            isPeeking
              ? 'text-white bg-amber-600/30 border border-amber-500/50'
              : 'text-neutral-200 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-neutral-400" />
          <span>{isPeeking ? 'Peeking...' : 'Hold to Peek'}</span>
        </button>

        {/* Toggle Numbers Overlay */}
        <button
          onClick={onToggleNumbers}
          title="Toggle Tile Number Guides"
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            showNumbers
              ? 'text-white bg-neutral-800 border border-neutral-700 shadow-sm'
              : 'text-neutral-400 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:text-white'
          }`}
        >
          <Hash className="w-3.5 h-3.5" />
          <span>Numbers {showNumbers ? 'On' : 'Off'}</span>
        </button>
      </div>
    </div>
  );
};
