import type { CellIndex, SudokuGrid, CellValue } from "./types";

export function checkCellForCorrectness(
    grid: SudokuGrid,
    row: CellIndex,
    col: CellIndex,
    value: CellValue,
    solutionGrid: SudokuGrid
): boolean {
    const playingGridCellValue = grid[row][col];
    const solutionCellValue = solutionGrid[row][col];
    return playingGridCellValue === value && value !== null && value === solutionCellValue;
}