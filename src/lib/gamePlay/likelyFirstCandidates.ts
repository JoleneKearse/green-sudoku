import { EMPTY_VALUE } from "./consts";
import type { CellIndex, LikelyLookSpot, SudokuGrid } from "./types";

// Count clues in each row, column and 3x3 grid 
function countCluesInRow(grid: SudokuGrid, row: CellIndex): number {
    let count = 0;

    for (let col = 0; col < 9; col++) {
        if (grid[row][col] !== EMPTY_VALUE) {
            count++;
        }
    }
    return count;
}

function countCluesInCol(grid: SudokuGrid, col: CellIndex): number {
    let count = 0;

    for (let row = 0; row < 9; row++) {
        if (grid[row][col] !== EMPTY_VALUE) {
            count++;
        }
    }
    return count;
}

function countCluesInGrid(grid: SudokuGrid, gridIndex: CellIndex): number {
    let count = 0;

    const gridStartRow = Math.floor(gridIndex / 3) * 3;
    const gridStartCol = (gridIndex % 3) * 3;

    for (let row = gridStartRow; row < gridStartRow + 3; row++) {
        for (let col = gridStartCol; col < gridStartCol + 3; col++) {
            if (grid[row][col] !== EMPTY_VALUE) {
                count++;
            }
        }
    }
    return count;
}

// Find likely first candidates based on clue counts in rows, columns and grids and how the user's eye might be drawn to them.  High density of clues from left to right, top to bottom.
export function findLikelyFirstCandidates(grid: SudokuGrid): LikelyLookSpot[] {
    const spots: LikelyLookSpot[] = [];

    for (let i = 0; i < 9; i++) {
        const index = i as CellIndex;

        const rowClues = countCluesInRow(grid, index);
        const colClues = countCluesInCol(grid, index);
        const gridClues = countCluesInGrid(grid, index);

        if (rowClues < 9) {
            spots.push({
                type: "row",
                index,
                clueCount: rowClues,
                emptyCount: 9 - rowClues,
                score: getLookScore(rowClues),
            });
        }

        if (colClues < 9) {
            spots.push({
                type: "col",
                index,
                clueCount: colClues,
                emptyCount: 9 - colClues,
                score: getLookScore(colClues),
            });
        }

        if (gridClues < 9) {
            spots.push({
                type: "grid",
                index,
                clueCount: gridClues,
                emptyCount: 9 - gridClues,
                score: getLookScore(gridClues),
            });
        }
    }

    return spots.sort((a, b) => {
        if (a.score !== b.score) return b.score - a.score;
        if (a.clueCount !== b.clueCount) return b.clueCount - a.clueCount;

        return a.index - b.index;
    });

    function getLookScore(clueCount: number): number {
        if (clueCount === 8) return 100;
        if (clueCount === 7) return 90;
        if (clueCount === 6) return 70;
        if (clueCount === 5) return 45;
        if (clueCount === 4) return 25;
        if (clueCount === 3) return 10;

        return 0;
    }
}