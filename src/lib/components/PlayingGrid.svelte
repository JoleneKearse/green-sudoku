<script lang="ts">
  let { puzzleCandidate, initialPuzzle, isCorrect, selectedCell, handleCellClick } = $props<{
    puzzleCandidate: SudokuGrid;
    initialPuzzle: SudokuGrid;
    isCorrect: boolean;
    selectedCell: { row: number; col: number } | null;
    selectedNumber: FilledCellValue | null;
    handleCellClick: (rowIndex: number, colIndex: number) => void;
  }>();
  import type { FilledCellValue, SudokuGrid } from "../gamePlay/types";
</script>

<section class="playing-grid">
  {#each puzzleCandidate as row, rowIndex}
    {#each row as cell, colIndex}
      <button
        class="cell"
        class:selected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
        class:thick-left={colIndex === 3 || colIndex === 6}
        class:thick-top={rowIndex === 3 || rowIndex === 6}
        class:no-border-right= {colIndex === 8}
        class:no-border-bottom={rowIndex === 8}
        class:user-filled={initialPuzzle[rowIndex][colIndex] === null && cell !== null}
        class:wrong-user-filled={!isCorrect && selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
        onclick={() => handleCellClick(rowIndex, colIndex)}
      >
        {cell}
      </button>
    {/each}
  {/each}
</section>

<style>
  .playing-grid {
    display: grid;
    grid-template-columns: repeat(9, 32px);
    grid-template-rows: repeat(9, 32px);
    max-width: fit-content;
    max-height: fit-content;
    border: 4px solid var(--border-playing);
  }

  .cell {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: var(--text-h);
    background-color: var(--bg);;
    border-right: 1px solid var(--border-cell);
    border-bottom: 1px solid var(--border-cell);
  }

  .user-filled {
    color: var(--text-user-filled);
  }

  .wrong-user-filled {
    color: var(--text-warning);
  }

  .thick-left {
    border-left: 2px solid var(--border-3grid);
  }

  .thick-top {
    border-top: 2px solid var(--border-3grid);
  }

  .no-border-right {
    border-right: none;
  }

  .no-border-bottom {
    border-bottom: none;
  }

  .selected {
    background-color: var(--bg-selected);
  }
</style>