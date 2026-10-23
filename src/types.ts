export type GridSize = 3 | 4 | 5;

export interface Animal {
  id: string;
  name: string;
  subtitle: string;
  species: string;
  habitat: string;
  fact: string;
  imageUrl: string;
  accentColor: string;
}

export interface TileData {
  id: number; // original solved index (0 to size*size - 1)
  currentPos: number; // current position in grid (0 to size*size - 1)
  isCorrect: boolean;
}

export interface RecordEntry {
  gridSize: GridSize;
  animalId: string;
  bestMoves: number;
  bestTime: number; // in seconds
  completedAt: string;
}

export type MoveDirection = 'up' | 'down' | 'left' | 'right';
