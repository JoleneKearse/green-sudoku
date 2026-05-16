import { describe, it, expect } from "vitest";
import { generateCompletedPuzzle } from "./generateCompletedPuzzle";

describe("generateCompletedPuzzle", () => {
    it("creates a valid 9x9 grid", () => {
        const grid = generateCompletedPuzzle();

        expect(grid).toHaveLength(9);
        expect(grid[0]).toHaveLength(9);
    })
})