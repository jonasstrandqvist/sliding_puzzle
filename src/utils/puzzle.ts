import { GridSize, MoveDirection, RecordEntry } from '../types';

export function createSolvedBoard(size: GridSize): number[] {
  const total = size * size;
  return Array.from({ length: total }, (_, i) => i);
}

export function isSolved(board: number[]): boolean {
  return board.every((tile, idx) => tile === idx);
}

export function getBlankIndex(board: number[], size: GridSize): number {
  const blankId = size * size - 1;
  return board.indexOf(blankId);
}

export function getRowCol(index: number, size: GridSize): { row: number; col: number } {
  return {
    row: Math.floor(index / size),
    col: index % size,
  };
}

export function getIndex(row: number, col: number, size: GridSize): number {
  return row * size + col;
}

/**
 * Returns the valid adjacent neighbor indices of the blank tile
 */
export function getAdjacentIndices(blankIndex: number, size: GridSize): number[] {
  const { row, col } = getRowCol(blankIndex, size);
  const neighbors: number[] = [];

  if (row > 0) neighbors.push(getIndex(row - 1, col, size)); // above
  if (row < size - 1) neighbors.push(getIndex(row + 1, col, size)); // below
  if (col > 0) neighbors.push(getIndex(row, col - 1, size)); // left
  if (col < size - 1) neighbors.push(getIndex(row, col + 1, size)); // right

  return neighbors;
}

/**
 * Generates a guaranteed-solvable board by performing a random walk
 * from the solved state.
 */
export function shuffleBoard(size: GridSize, stepCount = 120): number[] {
  let board = createSolvedBoard(size);
  let blankPos = size * size - 1;
  let lastPos = -1;

  // Use more steps for larger boards
  const actualSteps = size === 3 ? 90 : size === 4 ? 160 : 260;

  for (let i = 0; i < actualSteps; i++) {
    const validMoves = getAdjacentIndices(blankPos, size).filter((pos) => pos !== lastPos);
    const chosenPos = validMoves[Math.floor(Math.random() * validMoves.length)];

    // Swap blank with chosen
    board[blankPos] = board[chosenPos];
    board[chosenPos] = size * size - 1;

    lastPos = blankPos;
    blankPos = chosenPos;
  }

  // Ensure it's not accidentally solved
  if (isSolved(board)) {
    const validMoves = getAdjacentIndices(blankPos, size);
    const chosenPos = validMoves[0];
    board[blankPos] = board[chosenPos];
    board[chosenPos] = size * size - 1;
  }

  return board;
}

/**
 * Check if clicked tile can slide towards the blank space (including multi-tile line slides).
 * Returns array of indices that need to shift, ordered from closest to blank to clicked.
 */
export function getTilesToSlide(clickedPos: number, blankPos: number, size: GridSize): number[] | null {
  if (clickedPos === blankPos) return null;

  const clicked = getRowCol(clickedPos, size);
  const blank = getRowCol(blankPos, size);

  // Same row
  if (clicked.row === blank.row) {
    const tiles: number[] = [];
    const step = clicked.col < blank.col ? 1 : -1;
    // From adjacent to blank down to clickedPos
    for (let c = blank.col - step; ; c -= step) {
      tiles.push(getIndex(clicked.row, c, size));
      if (c === clicked.col) break;
    }
    return tiles;
  }

  // Same column
  if (clicked.col === blank.col) {
    const tiles: number[] = [];
    const step = clicked.row < blank.row ? 1 : -1;
    // From adjacent to blank down to clickedPos
    for (let r = blank.row - step; ; r -= step) {
      tiles.push(getIndex(r, clicked.col, size));
      if (r === clicked.row) break;
    }
    return tiles;
  }

  return null;
}

/**
 * Execute slide move for one or more tiles into the empty space.
 * Returns new board array.
 */
export function applySlide(board: number[], tilesToSlide: number[], blankPos: number, size: GridSize): number[] {
  const newBoard = [...board];
  const blankId = size * size - 1;

  // The first tile in tilesToSlide moves into blankPos,
  // subsequent tiles move into the position vacated by previous
  let targetPos = blankPos;
  for (const pos of tilesToSlide) {
    newBoard[targetPos] = newBoard[pos];
    targetPos = pos;
  }
  newBoard[targetPos] = blankId;

  return newBoard;
}

/**
 * Move by directional key (up, down, left, right)
 * Direction indicates the direction a tile will slide INTO the blank space.
 * e.g., 'up' means the tile below the blank moves UP into the blank.
 */
export function getTileForDirection(direction: MoveDirection, blankPos: number, size: GridSize): number | null {
  const { row, col } = getRowCol(blankPos, size);

  switch (direction) {
    case 'up': // tile below slides up
      return row < size - 1 ? getIndex(row + 1, col, size) : null;
    case 'down': // tile above slides down
      return row > 0 ? getIndex(row - 1, col, size) : null;
    case 'left': // tile to the right slides left
      return col < size - 1 ? getIndex(row, col + 1, size) : null;
    case 'right': // tile to the left slides right
      return col > 0 ? getIndex(row, col - 1, size) : null;
  }
}

/**
 * Total Manhattan distance of non-empty tiles to their target positions
 */
export function calculateManhattanDistance(board: number[], size: GridSize): number {
  let total = 0;
  const blankId = size * size - 1;

  for (let pos = 0; pos < board.length; pos++) {
    const tileId = board[pos];
    if (tileId === blankId) continue;

    const current = getRowCol(pos, size);
    const target = getRowCol(tileId, size);

    total += Math.abs(current.row - target.row) + Math.abs(current.col - target.col);
  }

  return total;
}

/**
 * Get hint tile: Find the adjacent tile to blank that yields lowest Manhattan distance
 */
export function getHintTile(board: number[], size: GridSize, lastMovedPos: number = -1): number | null {
  const blankPos = getBlankIndex(board, size);
  const adjacent = getAdjacentIndices(blankPos, size);

  let bestMove: number | null = null;
  let minDistance = Infinity;

  for (const pos of adjacent) {
    // Avoid recommending reversing the immediately executed move unless necessary
    const penalty = pos === lastMovedPos ? 0.5 : 0;
    
    // Simulate move
    const simulatedBoard = [...board];
    simulatedBoard[blankPos] = simulatedBoard[pos];
    simulatedBoard[pos] = size * size - 1;

    const dist = calculateManhattanDistance(simulatedBoard, size) + penalty;
    if (dist < minDistance) {
      minDistance = dist;
      bestMove = pos;
    }
  }

  return bestMove;
}

/**
 * LocalStorage records helper
 */
const STORAGE_KEY = 'faunashift_records_v1';

export function getSavedRecords(): Record<string, RecordEntry> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveRecord(gridSize: GridSize, animalId: string, moves: number, seconds: number): boolean {
  try {
    const records = getSavedRecords();
    const key = `${gridSize}x${gridSize}`;
    const existing = records[key];

    let isNewBest = false;
    if (!existing || moves < existing.bestMoves || (moves === existing.bestMoves && seconds < existing.bestTime)) {
      records[key] = {
        gridSize,
        animalId,
        bestMoves: moves,
        bestTime: seconds,
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      isNewBest = true;
    }
    return isNewBest;
  } catch {
    return false;
  }
}
