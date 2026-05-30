<script lang="ts">
  let { puzzleCandidate, initialPuzzle, isCorrect, selectedCell, cellCompletionTicks, handleCellClick } = $props<{
    puzzleCandidate: SudokuGrid;
    initialPuzzle: SudokuGrid;
    isCorrect: boolean;
    selectedCell: { row: number; col: number } | null;
    selectedNumber: FilledCellValue | null;
    cellCompletionTicks: number[][];
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
        {#key cellCompletionTicks[rowIndex][colIndex]}
          {#if cellCompletionTicks[rowIndex][colIndex] > 0}
            <span class="completion-ripple" aria-hidden="true"></span>
          {/if}
        {/key}
        <span class="cell-value">{cell}</span>
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
    position: relative;
    overflow: hidden;
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

  .cell-value {
    position: relative;
    z-index: 1;
  }

  .completion-ripple {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 124%;
    height: 164%;
    z-index: 0;
    pointer-events: none;
    opacity: 0;
    background:
      linear-gradient(
        98deg,
        transparent 47%,
        color-mix(in srgb, var(--text-h) 70%, transparent) 50%,
        transparent 53%
      ),
      conic-gradient(
      from 10deg,
      var(--text),
      var(--text-h),
      var(--text-user-filled),
      var(--text-warning),
      var(--text)
    );
    clip-path: polygon(
      50% 0%,
      64% 7%,
      76% 20%,
      84% 36%,
      87% 54%,
      84% 70%,
      76% 84%,
      64% 94%,
      50% 100%,
      36% 96%,
      25% 86%,
      16% 72%,
      12% 56%,
      14% 38%,
      22% 20%,
      34% 7%
    );
    transform-origin: 50% 64%;
    filter: blur(1.8px);
    animation: completion-ripple 2.5s ease-out forwards;
  }

  .completion-ripple::after {
    content: "";
    position: absolute;
    left: 44%;
    top: 92%;
    width: 18%;
    height: 12%;
    border-left: 1.5px solid color-mix(in srgb, var(--text-h) 65%, transparent);
    border-bottom: 1.5px solid color-mix(in srgb, var(--text-h) 65%, transparent);
    border-bottom-left-radius: 90% 100%;
    transform: rotate(28deg);
    filter: blur(0.3px);
  }

  @keyframes completion-ripple {
    0% {
      transform: translate(-50%, -50%) rotate(26deg) scale(0.12);
      opacity: 0;
    }
    20% {
      opacity: 0.24;
    }
    100% {
      transform: translate(-50%, -50%) rotate(26deg) scale(1.55);
      opacity: 0;
    }
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