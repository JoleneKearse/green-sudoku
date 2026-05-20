import { isValidPlacement } from "./validateSolvedPuzzle";
import { EMPTY_VALUE, FILLED_VALUES } from "./consts";
import type { CellIndex, SudokuGrid, FilledCellValue, SudokuCell, LikelyLookSpot } from "./types";
import { findLikelyFirstCandidates } from "./likelyFirstCandidates";

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

// Helper function to deduplicate moves that may be found by both hidden and naked single strategies
function deduplicateMoves(moves: SudokuCell[]): SudokuCell[] {
    const uniqueMoves = new Set<string>();

    return moves.filter((move) => {
        const key = `${move.row}-${move.col}-${move.value}`;

        if (uniqueMoves.has(key)) {
            return false;
        }

        uniqueMoves.add(key);
        return true;
    })
}

// Calculate the moves based on the naked and hidden singles strategies
export function findLikelyMoves(grid: SudokuGrid): SudokuCell[] {
    return deduplicateMoves([
        ...findNakedSingles(grid),
        ...findHiddenSingles(grid),
    ]);
}

// Find if a move is inside a likely look spot
function isMoveInLikelyLookSpot(move: SudokuCell, spot: LikelyLookSpot): boolean {
    if (spot.type === "row") {
        return move.row === spot.index;
    }

    if (spot.type === "col") {
        return move.col === spot.index;
    }

    if (spot.type === "grid") {
        const moveGridIndex = Math.floor(move.row / 3) * 3 + Math.floor(move.col / 3);
        return moveGridIndex === spot.index;
    }

    return false;
}

function findLikelyEasyMove(grid: SudokuGrid): SudokuCell | null {
    const likelyLookSpots = findLikelyFirstCandidates(grid);
    const easyMoves = findLikelyMoves(grid);

    for (const spot of likelyLookSpots) {
        const moveInSpot = easyMoves.find((move) => isMoveInLikelyLookSpot(move, spot));

        if (moveInSpot) {
            return moveInSpot;
        }
    }
    return easyMoves[0] ?? null;
}

export function placeLikelyEasyMoves(grid: SudokuGrid, numberOfMoves: number): { gridAfterMoves: SudokuGrid, placedMoves: SudokuCell[], nakedSinglesAfter: SudokuCell[], hiddenSinglesAfter: SudokuCell[] } {
    const workingGrid = grid.map((row) => [...row]) as SudokuGrid;
    const placedMoves: SudokuCell[] = [];

    for (let i = 0; i < numberOfMoves; i++) {
        const move = findLikelyEasyMove(workingGrid);

        if (!move) {
            break;
        }

        workingGrid[move.row][move.col] = move.value;
        placedMoves.push(move);
    }

    return {
        gridAfterMoves: workingGrid,
        placedMoves,
        nakedSinglesAfter: findNakedSingles(workingGrid),
        hiddenSinglesAfter: findHiddenSingles(workingGrid),
    }
}
