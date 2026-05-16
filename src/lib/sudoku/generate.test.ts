import { describe, it, expect } from "vitest";
import { generateSudokuGrid } from "./generate";

describe("generateSudokuGrid", () => {
    it("creates a valid 9x9 grid", () => {
        const grid = generateSudokuGrid();

        expect(grid).toHaveLength(9);
        expect(grid[0]).toHaveLength(9);
    })
})