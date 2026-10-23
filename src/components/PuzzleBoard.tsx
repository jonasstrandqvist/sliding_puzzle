import React, { useRef } from 'react';
import { GridSize, Animal } from '../types';
import { getRowCol } from '../utils/puzzle';

interface PuzzleBoardProps {
  board: number[];
  size: GridSize;
  animal: Animal;
  isSolved: boolean;
  showNumbers: boolean;
  isPeeking: boolean;
  hintPos: number | null;
  onTileClick: (pos: number) => void;
  onSwipe: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  board,
  size,
  animal,
  isSolved,
  showNumbers,
  isPeeking,
  hintPos,
  onTileClick,
  onSwipe,
}) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const blankId = size * size - 1;

  // Handle touch gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touchEnd = e.changedTouches[0];
    const dx = touchEnd.clientX - touchStartRef.current.x;
    const dy = touchEnd.clientY - touchStartRef.current.y;
    const minSwipeDistance = 30;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > minSwipeDistance) {
        onSwipe(dx > 0 ? 'right' : 'left');
      }
    } else {
      if (Math.abs(dy) > minSwipeDistance) {
        onSwipe(dy > 0 ? 'down' : 'up');
      }
    }
    touchStartRef.current = null;
  };

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Outer framing wrapper with soft ambient back-glow */}
      <div
        className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[480px] md:h-[480px] max-w-[90vw] max-h-[90vw] aspect-square rounded-2xl p-2 bg-neutral-900/90 border border-neutral-800 shadow-2xl backdrop-blur-sm transition-all duration-300"
        style={{
          boxShadow: isSolved
            ? `0 0 45px -5px ${animal.accentColor}44, 0 20px 25px -5px rgba(0, 0, 0, 0.7)`
            : '0 20px 30px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Inner board canvas */}
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-neutral-950/80">
          {/* Tiles */}
          {Array.from({ length: size * size }, (_, tileId) => {
            const isBlankTile = tileId === blankId;
            const currentPos = board.indexOf(tileId);
            const { row, col } = getRowCol(currentPos, size);
            const target = getRowCol(tileId, size);

            const isHint = currentPos === hintPos;
            const isCorrectPosition = currentPos === tileId;

            // Background math:
            // Since background-position uses percentage relative to (container - image),
            // (targetCol / (size - 1)) * 100% perfectly aligns each sub-square slice
            const bgPosX = size > 1 ? (target.col / (size - 1)) * 100 : 0;
            const bgPosY = size > 1 ? (target.row / (size - 1)) * 100 : 0;

            // When solved, the blank tile appears seamlessly to complete the portrait
            if (isBlankTile && !isSolved) {
              return (
                <div
                  key="blank-slot"
                  className="absolute pointer-events-none rounded-lg"
                  style={{
                    width: `${100 / size}%`,
                    height: `${100 / size}%`,
                    transform: `translate3d(${col * 100}%, ${row * 100}%, 0)`,
                  }}
                >
                  <div className="w-full h-full p-0.5 sm:p-1">
                    <div className="w-full h-full rounded-lg bg-neutral-950/90 border border-dashed border-neutral-800/80 flex items-center justify-center">
                      <span className="text-[10px] font-mono text-neutral-700 uppercase tracking-widest">
                        Empty
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={tileId}
                onClick={() => onTileClick(currentPos)}
                role="button"
                tabIndex={0}
                aria-label={`Tile ${tileId + 1}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onTileClick(currentPos);
                  }
                }}
                className={`absolute cursor-pointer will-change-transform ${
                  isBlankTile ? 'transition-opacity duration-500' : ''
                }`}
                style={{
                  width: `${100 / size}%`,
                  height: `${100 / size}%`,
                  transform: `translate3d(${col * 100}%, ${row * 100}%, 0)`,
                  transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: isHint ? 20 : 10,
                }}
              >
                <div
                  className={`relative w-full h-full p-0.5 sm:p-1 group transition-all duration-150 ${
                    isHint ? 'animate-pulse' : ''
                  }`}
                >
                  <div
                    className={`relative w-full h-full rounded-lg overflow-hidden border shadow-sm transition-transform active:scale-[0.98] ${
                      isHint
                        ? 'border-amber-400 ring-2 ring-amber-400/50'
                        : isCorrectPosition && !isSolved
                        ? 'border-neutral-700/60 ring-1 ring-emerald-500/20'
                        : 'border-neutral-800/80 hover:border-neutral-700'
                    }`}
                    style={{
                      backgroundImage: `url(${animal.imageUrl})`,
                      backgroundSize: `${size * 100}% ${size * 100}%`,
                      backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    {/* Subtle top edge specular highlight */}
                    <div className="absolute inset-x-0 top-0 h-px bg-white/20 pointer-events-none" />

                    {/* Number badge */}
                    {showNumbers && (
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] sm:text-xs font-mono font-semibold text-white/90 shadow">
                        {tileId + 1}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Full-bleed Peek Overlay */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-200 z-30 rounded-xl overflow-hidden ${
              isPeeking ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={animal.imageUrl}
              alt={animal.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 px-3 py-1 rounded bg-black/75 backdrop-blur-sm text-xs font-medium text-white border border-white/15">
              Original Reference
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
