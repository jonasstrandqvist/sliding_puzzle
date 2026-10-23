/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { PuzzleBoard } from './components/PuzzleBoard';
import { Controls } from './components/Controls';
import { AnimalSelectorModal } from './components/AnimalSelectorModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { RecordsModal } from './components/RecordsModal';
import { VictoryModal } from './components/VictoryModal';
import { ANIMALS } from './data/animals';
import { Animal, GridSize, RecordEntry, MoveDirection } from './types';
import { soundFx } from './utils/audio';
import {
  shuffleBoard,
  isSolved,
  getBlankIndex,
  getTilesToSlide,
  applySlide,
  getTileForDirection,
  getHintTile,
  getSavedRecords,
  saveRecord,
} from './utils/puzzle';

export default function App() {
  const [animals, setAnimals] = useState<Animal[]>(ANIMALS);
  const [currentAnimalIndex, setCurrentAnimalIndex] = useState<number>(0);
  const [gridSize, setGridSize] = useState<GridSize>(3);

  const currentAnimal = animals[currentAnimalIndex] || animals[0];

  // Puzzle State
  const [board, setBoard] = useState<number[]>(() => shuffleBoard(3));
  const [history, setHistory] = useState<number[][]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [isGameSolved, setIsGameSolved] = useState<boolean>(false);

  // Interaction State
  const [showNumbers, setShowNumbers] = useState<boolean>(false);
  const [isPeeking, setIsPeeking] = useState<boolean>(false);
  const [hintPos, setHintPos] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(() => soundFx.getMuted());

  // Modals
  const [isAnimalModalOpen, setIsAnimalModalOpen] = useState<boolean>(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);
  const [isRecordsOpen, setIsRecordsOpen] = useState<boolean>(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  // High score records
  const [records, setRecords] = useState<Record<string, RecordEntry>>(() => getSavedRecords());

  const timerRef = useRef<number | null>(null);

  // Timer runner
  useEffect(() => {
    if (timerActive && !isGameSolved) {
      timerRef.current = window.setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, isGameSolved]);

  // Start new puzzle game with shuffle
  const startNewGame = useCallback(
    (size: GridSize = gridSize) => {
      soundFx.playShuffle();
      const newBoard = shuffleBoard(size);
      setBoard(newBoard);
      setHistory([]);
      setMoves(0);
      setSeconds(0);
      setTimerActive(false);
      setIsGameSolved(false);
      setIsVictoryOpen(false);
      setIsNewRecord(false);
      setHintPos(null);
    },
    [gridSize]
  );

  // Change grid size
  const handleGridSizeChange = (newSize: GridSize) => {
    if (newSize === gridSize) return;
    setGridSize(newSize);
    startNewGame(newSize);
  };

  // Change to random animal
  const handleRandomAnimal = () => {
    const nextIdx = (currentAnimalIndex + 1 + Math.floor(Math.random() * (animals.length - 1))) % animals.length;
    setCurrentAnimalIndex(nextIdx);
    startNewGame(gridSize);
  };

  // Select specific animal
  const handleSelectAnimal = (animal: Animal) => {
    const idx = animals.findIndex((a) => a.id === animal.id);
    if (idx !== -1) {
      setCurrentAnimalIndex(idx);
    }
    startNewGame(gridSize);
  };

  // Add custom photo animal
  const handleUploadCustomAnimal = (customAnimal: Animal) => {
    setAnimals((prev) => [customAnimal, ...prev]);
    setCurrentAnimalIndex(0);
    startNewGame(gridSize);
  };

  // Execute slide move
  const executeSlide = useCallback(
    (clickedPos: number) => {
      if (isGameSolved) return;

      const blankPos = getBlankIndex(board, gridSize);
      const tilesToSlide = getTilesToSlide(clickedPos, blankPos, gridSize);

      if (!tilesToSlide || tilesToSlide.length === 0) {
        soundFx.playInvalid();
        return;
      }

      // Start timer on first move
      if (!timerActive) {
        setTimerActive(true);
      }

      // Play sound
      soundFx.playSlide();

      // Clear any active hint
      if (hintPos !== null) {
        setHintPos(null);
      }

      // Save previous board to history for undo
      setHistory((prev) => [...prev, board]);

      // Calculate new board
      const newBoard = applySlide(board, tilesToSlide, blankPos, gridSize);
      setBoard(newBoard);
      setMoves((prev) => prev + tilesToSlide.length);

      // Check win condition
      if (isSolved(newBoard)) {
        setIsGameSolved(true);
        setTimerActive(false);
        soundFx.playVictory();

        // Trigger confetti
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#38bdf8', '#34d399', '#f472b6', '#a78bfa'],
        });

        // Check & save personal record
        const elapsed = seconds + 1;
        const totalMoves = moves + tilesToSlide.length;
        const isBest = saveRecord(gridSize, currentAnimal.id, totalMoves, elapsed);
        setIsNewRecord(isBest);
        setRecords(getSavedRecords());

        // Show victory modal after brief moment to admire full completed picture
        setTimeout(() => {
          setIsVictoryOpen(true);
        }, 900);
      }
    },
    [board, gridSize, isGameSolved, timerActive, hintPos, seconds, moves, currentAnimal.id]
  );

  // Undo move
  const handleUndo = useCallback(() => {
    if (history.length === 0 || isGameSolved) return;
    const lastBoard = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setBoard(lastBoard);
    setMoves((prev) => Math.max(0, prev - 1));
    soundFx.playSlide();
  }, [history, isGameSolved]);

  // Hint suggestion
  const handleHint = useCallback(() => {
    if (isGameSolved) return;
    const bestMove = getHintTile(board, gridSize);
    if (bestMove !== null) {
      setHintPos(bestMove);
      // Auto clear hint highlight after 3 seconds
      setTimeout(() => {
        setHintPos((curr) => (curr === bestMove ? null : curr));
      }, 3000);
    }
  }, [board, gridSize, isGameSolved]);

  // Swipe / Direction slide
  const handleDirectionSlide = useCallback(
    (direction: MoveDirection) => {
      const blankPos = getBlankIndex(board, gridSize);
      const tilePos = getTileForDirection(direction, blankPos, gridSize);
      if (tilePos !== null) {
        executeSlide(tilePos);
      } else {
        soundFx.playInvalid();
      }
    },
    [board, gridSize, executeSlide]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in inputs or when modal open
      if (
        isAnimalModalOpen ||
        isHowToPlayOpen ||
        isRecordsOpen ||
        isVictoryOpen ||
        e.target instanceof HTMLInputElement
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPeeking(true);
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          handleDirectionSlide('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          handleDirectionSlide('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          handleDirectionSlide('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          handleDirectionSlide('right');
          break;
        case 'u':
        case 'U':
          e.preventDefault();
          handleUndo();
          break;
        case 'h':
        case 'H':
          e.preventDefault();
          handleHint();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          startNewGame(gridSize);
          break;
        case 'm':
        case 'M':
          setIsMuted(soundFx.toggleMute());
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsPeeking(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    handleDirectionSlide,
    handleUndo,
    handleHint,
    startNewGame,
    gridSize,
    isAnimalModalOpen,
    isHowToPlayOpen,
    isRecordsOpen,
    isVictoryOpen,
  ]);

  const handleToggleMute = () => {
    setIsMuted(soundFx.toggleMute());
  };

  const handleClearRecords = () => {
    localStorage.removeItem('faunashift_records_v1');
    setRecords({});
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-amber-500 selection:text-neutral-950">
      {/* Top Bar Contract (Wordmark - Links - Primary Action) */}
      <Header
        currentAnimal={currentAnimal}
        onOpenAnimals={() => setIsAnimalModalOpen(true)}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenRecords={() => setIsRecordsOpen(true)}
        onRandomAnimal={handleRandomAnimal}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Game Stage */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-4 md:py-6 max-w-4xl w-full mx-auto">
        {/* Animal Title & Subtitle Info (Unboxed text) */}
        <div className="text-center mb-3">
          <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 mb-1">
            <span className="font-medium text-white">{currentAnimal.name}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono italic text-neutral-500">{currentAnimal.species}</span>
            <span aria-hidden="true">·</span>
            <span>{currentAnimal.habitat}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
            {currentAnimal.subtitle}
          </h1>
        </div>

        {/* Clean HUD Stats Bar */}
        <StatsBar
          moves={moves}
          seconds={seconds}
          gridSize={gridSize}
          bestRecord={records[`${gridSize}x${gridSize}`]}
        />

        {/* The Hero Sliding Puzzle Board */}
        <div className="my-2">
          <PuzzleBoard
            board={board}
            size={gridSize}
            animal={currentAnimal}
            isSolved={isGameSolved}
            showNumbers={showNumbers}
            isPeeking={isPeeking}
            hintPos={hintPos}
            onTileClick={executeSlide}
            onSwipe={handleDirectionSlide}
          />
        </div>

        {/* Action Controls & Difficulty Segmented Control */}
        <Controls
          gridSize={gridSize}
          onChangeGridSize={handleGridSizeChange}
          onShuffle={() => startNewGame(gridSize)}
          onUndo={handleUndo}
          canUndo={history.length > 0 && !isGameSolved}
          onHint={handleHint}
          isPeeking={isPeeking}
          setIsPeeking={setIsPeeking}
          showNumbers={showNumbers}
          onToggleNumbers={() => setShowNumbers((prev) => !prev)}
        />
      </main>

      {/* Quiet Minimal Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-4 border-t border-neutral-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-2">
        <div className="flex items-center gap-2">
          <span>FaunaShift Wildlife Sliding Puzzle</span>
          <span aria-hidden="true">·</span>
          <span>Arrow keys / WASD to move</span>
          <span aria-hidden="true">·</span>
          <span>Hold Space to peek</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAnimalModalOpen(true)}
            className="hover:text-neutral-300 transition-colors cursor-pointer"
          >
            Gallery
          </button>
          <button
            onClick={() => setIsRecordsOpen(true)}
            className="hover:text-neutral-300 transition-colors cursor-pointer"
          >
            Records
          </button>
          <button
            onClick={() => setIsHowToPlayOpen(true)}
            className="hover:text-neutral-300 transition-colors cursor-pointer"
          >
            Help
          </button>
        </div>
      </footer>

      {/* Modals */}
      <AnimalSelectorModal
        isOpen={isAnimalModalOpen}
        onClose={() => setIsAnimalModalOpen(false)}
        animals={animals}
        currentAnimalId={currentAnimal.id}
        onSelectAnimal={handleSelectAnimal}
        onUploadCustomImage={handleUploadCustomAnimal}
      />

      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      <RecordsModal
        isOpen={isRecordsOpen}
        onClose={() => setIsRecordsOpen(false)}
        records={records}
        onClearRecords={handleClearRecords}
      />

      <VictoryModal
        isOpen={isVictoryOpen}
        animal={currentAnimal}
        gridSize={gridSize}
        moves={moves}
        seconds={seconds}
        isNewRecord={isNewRecord}
        onPlayAgain={() => startNewGame(gridSize)}
        onNextAnimal={handleRandomAnimal}
        onIncreaseDifficulty={
          gridSize < 5
            ? () => {
                handleGridSizeChange((gridSize + 1) as GridSize);
              }
            : undefined
        }
      />
    </div>
  );
}
