import { findHiddenSingles, findNakedSingles, placeLikelyEasyMoves } from "./puzzleDifficultyUtils";
import type { SudokuGrid } from "./types";

export function canSolveWithEasyStrategies(grid: SudokuGrid): boolean {
    const hiddenSingles = findHiddenSingles(grid);
    const nakedSingles = findNakedSingles(grid);

    if (hiddenSingles.length > 20 && nakedSingles.length > 3) {
        return true;
    }

    const { gridAfterMoves: gridAfterFirst, hiddenSinglesAfter: hiddenAfterFirst } = placeLikelyEasyMoves(grid, 1);

    if (hiddenAfterFirst.length > 17) {
        return true;
    }

    const { hiddenSinglesAfter: hiddenAfterSecond } = placeLikelyEasyMoves(gridAfterFirst, 1);

    return hiddenAfterSecond.length > 15;
}