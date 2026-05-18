import type { FilledCellValue, SudokuGrid, CellIndex } from "./types";



function isValueInRow(grid: SudokuGrid, row: CellIndex, value: FilledCellValue) {
  return grid[row].includes(value);
}

function isValueInCol(grid: SudokuGrid, col: CellIndex, value: FilledCellValue) {
  return grid.some((row) => row[col] === value);
}

function isValueInGrid(grid: SudokuGrid, row: CellIndex,
    col: CellIndex, value: FilledCellValue
) {
  const gridStartRow = Math.floor(row / 3) * 3;
  const gridStartCol = Math.floor(col / 3) * 3;

  for (let r = gridStartRow; r < gridStartRow + 3; r++) {
    for (let c = gridStartCol; c < gridStartCol + 3; c++) {
      if (grid[r][c] === value) {
        return true;
      }
    }
  }
  return false; 
}

export function isValidPlacement(grid: SudokuGrid, row: CellIndex, col: CellIndex, value: FilledCellValue) {
  return !isValueInRow(grid, row, value) &&
         !isValueInCol(grid, col, value) &&
         !isValueInGrid(grid, row, col, value);
}
