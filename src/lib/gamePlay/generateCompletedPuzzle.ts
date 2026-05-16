import { FILLED_VALUES, EMPTY_VALUE } from "./consts";

import { isValidPlacement } from "./validation";

import type {
  FilledCellValue,
  SudokuGrid,
  CellIndex,
  CellValue,
} from "./types";

export function shuffleValues<T>(values: readonly T[]): T[] {
  const shuffled = [...values];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }

  return shuffled;
}

function createEmptyGrid() {
  return Array.from(
    { length: 9 },
    () => Array(9).fill(EMPTY_VALUE) as CellValue[],
  );
}

export function generateCompletedPuzzle() {
  const grid: SudokuGrid = createEmptyGrid();

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const values = shuffleValues(FILLED_VALUES);

      const validValue = values.find((value) =>
        isValidPlacement(grid, row as CellIndex, col as CellIndex, value),
      );

      if (!validValue) {
        return generateCompletedPuzzle();
      }

      grid[row][col] = validValue;
    }
  }

  return grid;
}
