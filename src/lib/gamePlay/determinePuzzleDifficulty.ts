import { isValidPlacement } from "./validateSolvedPuzzle";

import { EMPTY_VALUE, FILLED_VALUES } from "./consts";

import type { CellIndex, SudokuGrid, FilledCellValue, SudokuCell,  } from "./types";



export function getCandidatesForCell(grid: SudokuGrid, row: CellIndex, col: CellIndex): FilledCellValue[] {
    if (grid[row][col] !== EMPTY_VALUE) {
        return [];
    }

    return FILLED_VALUES.filter((value) => isValidPlacement(grid, row, col, value));
}



// search the number of candidates where there is only one possible number it can be
export function findNakedSingles(grid: SudokuGrid): SudokuCell[] {
    const nakedSingles: SudokuCell[] = [];

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cellValue = grid[row][col];

            if (cellValue !== EMPTY_VALUE) {
                continue;
            }

            const candidates = getCandidatesForCell(grid, row as CellIndex, col as CellIndex);

            if (candidates.length === 1) {
                nakedSingles.push({
                    row: row as CellIndex,
                    col: col as CellIndex,
                    value: candidates[0],
                })
            }
        }
    }
    return nakedSingles;
}



// search the candidates for where only one number is only possible in one row, column and 3x3 grid. 
export function findHiddenSingles(grid: SudokuGrid): SudokuCell[] {
    return [
        ...findHiddenSinglesInRow(grid),
        ...findHiddenSinglesInCol(grid),
        ...findHiddenSinglesInGrid(grid),
    ];
}

function findHiddenSinglesInRow(grid: SudokuGrid): SudokuCell[] {
    const hiddenSingles: SudokuCell[] = [];

    for (let row = 0; row < 9; row++) {
        for (const value of FILLED_VALUES) {
            const possibleCols: CellIndex[] = [];

            for (let col = 0; col < 9; col++) {
                const cellValue = grid[row][col];   

                if (cellValue !== EMPTY_VALUE) {
                    continue;
                }

                const canPlaceValue = isValidPlacement(grid, row as CellIndex, col as CellIndex, value);

                if(canPlaceValue) {
                    possibleCols.push(col as CellIndex);
                }
            }

            if (possibleCols.length === 1) {
                hiddenSingles.push({
                    row: row as CellIndex,
                    col: possibleCols[0],
                    value: value,
                })
            }
        }
    }
    return hiddenSingles;
}

function findHiddenSinglesInCol(grid: SudokuGrid): SudokuCell[] {
    const hiddenSingles: SudokuCell[] = [];

    for (let col = 0;col < 9; col++) {
        for (const value of FILLED_VALUES) {
            const possibleRows: CellIndex[] = [];

            for (let row = 0; row < 9; row++) {
                const cellValue = grid[row][col];

                if (cellValue !== EMPTY_VALUE) {
                    continue;
                }

                const canPlaceValue = isValidPlacement(grid, row as CellIndex, col as CellIndex, value);

                if(canPlaceValue) {
                    possibleRows.push(row as CellIndex);
                }
            }
            
            if (possibleRows.length === 1) {
                hiddenSingles.push({
                    row: possibleRows[0],
                    col: col as CellIndex,
                    value: value,
                });
            }
        }
    }
    return hiddenSingles;
}

function findHiddenSinglesInGrid(grid: SudokuGrid): SudokuCell[] {
    const hiddenSingles: SudokuCell[] = [];

    for (let gridStartRow = 0; gridStartRow < 9; gridStartRow += 3) {
        for (let gridStartCol = 0; gridStartCol < 9; gridStartCol += 3) {
            for (const value of FILLED_VALUES) {
                const possibleCells: { row: CellIndex; col: CellIndex }[] = [];

                for (let row = gridStartRow; row < gridStartRow + 3; row++) {
                    for (let col = gridStartCol; col < gridStartCol + 3; col++) {
                        const rowIndex = row as CellIndex;
                        const colIndex = col as CellIndex;

                        const cellValue = grid[rowIndex][colIndex];

                        if (cellValue !== EMPTY_VALUE) {
                            continue;
                        }

                        const canPlaceValue = isValidPlacement(grid, rowIndex, colIndex, value);

                        if(canPlaceValue) {
                            possibleCells.push({ row: rowIndex, col: colIndex });
                        }
                    }
                }

                if (possibleCells.length === 1) {
                    hiddenSingles.push({
                        row: possibleCells[0].row,
                        col: possibleCells[0].col,
                        value: value,
                    });
                }
            }
        }
    }
    return hiddenSingles;
}