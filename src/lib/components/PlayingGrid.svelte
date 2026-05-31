<script lang="ts">
  let {
    puzzleCandidate,
    initialPuzzle,
    isCorrect,
    selectedCell,
    unavailableKeyboardFillCell,
    cellCompletionTicks,
    puzzleCompletionTick,
    isPuzzleSolvedNow,
    handleCellClick,
    handleKeyDown,
  } = $props<{
    puzzleCandidate: SudokuGrid;
    initialPuzzle: SudokuGrid;
    isCorrect: boolean;
    selectedCell: { row: number; col: number } | null;
    unavailableKeyboardFillCell: { row: number; col: number } | null;
    selectedNumber: FilledCellValue | null;
    cellCompletionTicks: number[][];
    puzzleCompletionTick: number;
    isPuzzleSolvedNow: boolean;
    handleCellClick: (rowIndex: number, colIndex: number) => void;
    handleKeyDown: (row: number, col: number, event: KeyboardEvent) => void;
  }>();
  import type { FilledCellValue, SudokuGrid } from "../gamePlay/types";
</script>

<section class="playing-grid">
  {#each puzzleCandidate as row, rowIndex}
    {#each row as cell, colIndex}
      <button
        class="cell"
        onkeydown={(event) => handleKeyDown(rowIndex, colIndex, event)}
        class:selected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
        class:thick-left={colIndex === 3 || colIndex === 6}
        class:thick-top={rowIndex === 3 || rowIndex === 6}
        class:no-border-right= {colIndex === 8}
        class:no-border-bottom={rowIndex === 8}
        class:user-filled={initialPuzzle[rowIndex][colIndex] === null && cell !== null}
        class:wrong-user-filled={
          !isCorrect
          && selectedCell?.row === rowIndex
          && selectedCell?.col === colIndex
          && (unavailableKeyboardFillCell?.row !== rowIndex
            || unavailableKeyboardFillCell?.col !== colIndex)
        }
        class:wrong-unavailable-keyboard-fill={
          unavailableKeyboardFillCell?.row === rowIndex
          && unavailableKeyboardFillCell?.col === colIndex
        }
        onclick={() => handleCellClick(rowIndex, colIndex)}
      >
        {#key cellCompletionTicks[rowIndex][colIndex]}
          {#if !isPuzzleSolvedNow && cellCompletionTicks[rowIndex][colIndex] > 0}
            <span class="completion-ripple" aria-hidden="true"></span>
          {/if}
        {/key}
        {#key `${rowIndex}-${colIndex}-${puzzleCompletionTick}`}
          <span
            class="cell-value"
            class:puzzle-complete-bounce={puzzleCompletionTick > 0 && cell !== null}
          >
            {cell}
          </span>
        {/key}
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
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
    transform-origin: center center;
    will-change: transform;
  }

  .puzzle-complete-bounce {
    animation: puzzle-complete-bounce 1.1s cubic-bezier(0.22, 0.78, 0.27, 1) forwards;
  }

  @keyframes puzzle-complete-bounce {
    0% {
      transform: scale(1);
    }
    20% {
      transform: scale(1.18);
    }
    40% {
      transform: scale(0.95);
    }
    62% {
      transform: scale(1.12);
    }
    78% {
      transform: scale(0.98);
    }
    100% {
      transform: scale(1);
    }
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
    filter: blur(1.3px);
    animation: completion-ripple 1.25s ease-out forwards;
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

  .wrong-unavailable-keyboard-fill {
    color: var(--text-warning);
    animation: wrong-entry-blink 0.3s ease-in-out 2;
  }

  @keyframes wrong-entry-blink {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      opacity: 0;
    }
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