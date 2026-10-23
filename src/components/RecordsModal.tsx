import React from 'react';
import { X, Trophy, Trash2 } from 'lucide-react';
import { RecordEntry } from '../types';

interface RecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: Record<string, RecordEntry>;
  onClearRecords: () => void;
}

export const RecordsModal: React.FC<RecordsModalProps> = ({
  isOpen,
  onClose,
  records,
  onClearRecords,
}) => {
  if (!isOpen) return null;

  const difficulties = [
    { key: '3x3', title: '3×3 Casual Grid', tiles: '8 Tiles' },
    { key: '4x4', title: '4×4 Classic 15-Puzzle', tiles: '15 Tiles' },
    { key: '5x5', title: '5×5 Master Grid', tiles: '24 Tiles' },
  ];

  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const hasAnyRecord = Object.keys(records).length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white font-display">Hall of Records</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          {difficulties.map((diff) => {
            const record = records[diff.key];

            return (
              <div
                key={diff.key}
                className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80"
              >
                <div>
                  <h4 className="text-sm font-semibold text-white">{diff.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                    <span>{diff.tiles}</span>
                    {record && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{new Date(record.completedAt).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  {record ? (
                    <div>
                      <div className="font-mono tabular-nums text-sm font-bold text-amber-400">
                        {record.bestMoves} moves
                      </div>
                      <div className="font-mono tabular-nums text-xs text-neutral-400">
                        {formatTime(record.bestTime)}
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-neutral-600 italic">No record yet</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800 bg-neutral-950/60">
          {hasAnyRecord ? (
            <button
              onClick={onClearRecords}
              className="flex items-center gap-1.5 text-xs text-red-400/80 hover:text-red-300 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Records</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
