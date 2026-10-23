import React from 'react';
import { X, MousePointer, Keyboard, Eye, Lightbulb, Trophy } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white font-display">How to Play</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-neutral-300 leading-relaxed max-h-[75vh] overflow-y-auto">
          {/* Section 1: Objective */}
          <div className="space-y-1.5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Objective</span>
            </h3>
            <p className="text-neutral-400">
              Slide tiles across the board into the empty slot until all pieces align in sequential order to restore the complete high-resolution wildlife photograph.
            </p>
          </div>

          {/* Section 2: Moving Tiles */}
          <div className="space-y-1.5 pt-2 border-t border-neutral-800">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <MousePointer className="w-4 h-4 text-neutral-400" />
              <span>Mouse & Touch Controls</span>
            </h3>
            <ul className="list-disc list-inside text-neutral-400 space-y-1 pl-1">
              <li>Click or tap any tile adjacent to the empty space to slide it.</li>
              <li>Multi-Tile Slide: Click any tile in the same row or column as the empty space to slide multiple pieces at once!</li>
              <li>On mobile or tablet, swipe anywhere on the board in the desired slide direction.</li>
            </ul>
          </div>

          {/* Section 3: Keyboard Shortcuts */}
          <div className="space-y-1.5 pt-2 border-t border-neutral-800">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-neutral-400" />
              <span>Keyboard Shortcuts</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-neutral-400 font-mono text-[11px]">
              <div className="p-2 rounded bg-neutral-950 border border-neutral-800/80">
                <span className="text-white font-bold">Arrow Keys / WASD</span>
                <p className="text-[10px] text-neutral-500 font-sans mt-0.5">Slide tiles</p>
              </div>
              <div className="p-2 rounded bg-neutral-950 border border-neutral-800/80">
                <span className="text-white font-bold">Spacebar (Hold)</span>
                <p className="text-[10px] text-neutral-500 font-sans mt-0.5">Peek original image</p>
              </div>
              <div className="p-2 rounded bg-neutral-950 border border-neutral-800/80">
                <span className="text-white font-bold">U / Ctrl+Z</span>
                <p className="text-[10px] text-neutral-500 font-sans mt-0.5">Undo last move</p>
              </div>
              <div className="p-2 rounded bg-neutral-950 border border-neutral-800/80">
                <span className="text-white font-bold">H</span>
                <p className="text-[10px] text-neutral-500 font-sans mt-0.5">Show move hint</p>
              </div>
            </div>
          </div>

          {/* Section 4: Features */}
          <div className="space-y-1.5 pt-2 border-t border-neutral-800">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-neutral-400" />
              <span>Helper Tools</span>
            </h3>
            <p className="text-neutral-400">
              Stuck? Toggle the <span className="text-white font-medium">Numbers</span> button to see coordinate indices on tiles, or press <span className="text-amber-400 font-medium">Hint</span> to view an algorithmically calculated next slide towards the solution.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-neutral-800 bg-neutral-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
          >
            Got it, Let's Play
          </button>
        </div>
      </div>
    </div>
  );
};
