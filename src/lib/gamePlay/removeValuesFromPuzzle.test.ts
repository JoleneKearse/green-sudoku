import { expect, it, describe } from "vitest";

import { removeValuesFromPuzzle } from "./removeValuesFromPuzzle";
import { generateCompletedPuzzle } from "./generateCompletedPuzzle";

import { EMPTY_VALUE } from "./consts";

describe("removeValuesFromPuzzle", () => {
  it("should remove the specified number of values from the puzzle", () => {
    const completedPuzzle = generateCompletedPuzzle();
    const cellsToRemove = 45;
    const modifiedPuzzle = removeValuesFromPuzzle(completedPuzzle, cellsToRemove);

    let removedCount = 0;
    for (let row of modifiedPuzzle) {
      for (let cell of row) {
        if (cell === EMPTY_VALUE) {
          removedCount++;
        }
      }
    }

    expect(removedCount).toBe(cellsToRemove);
  });
});