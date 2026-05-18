import { shuffleValues } from "./generateCompletedPuzzle";

import type { CellIndex, SudokuGrid } from "./types";

import { EMPTY_VALUE, CELLS_TO_REMOVE_EASY } from "./consts";



export function removeValuesFromPuzzle(completedPuzzle: SudokuGrid, numberToRemove: number = CELLS_TO_REMOVE_EASY) {
    const puzzle = completedPuzzle.map((row) => [...row]) as SudokuGrid;

    const cellPositions: { row: CellIndex; col: CellIndex }[] = [];

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            cellPositions.push({row: row as CellIndex, col: col as CellIndex});
        }
    }

    const shuffledPositions = shuffleValues(cellPositions);

    for (let i = 0; i < numberToRemove; i++) {
        const { row, col } = shuffledPositions[i];
        puzzle[row][col] = EMPTY_VALUE;
    }

    return puzzle;
}