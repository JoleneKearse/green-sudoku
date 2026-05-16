export type CellIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type EmptyCell = "💣";
export type FilledCellValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type CellValue = EmptyCell | FilledCellValue;

export type SudokuGrid = CellValue[][];

export type SudokuCell = {
  row: CellIndex;
  col: CellIndex;
  value: CellValue;
};