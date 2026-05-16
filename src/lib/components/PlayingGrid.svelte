<script lang="ts">
  import { generateCompletedPuzzle } from "../gamePlay/generateCompletedPuzzle";
  import { removeValuesFromPuzzle } from "../gamePlay/removeValuesFromPuzzle";
  import { CELLS_TO_REMOVE_EASY } from "../gamePlay/consts";

  const solvedGrid = generateCompletedPuzzle();
  console.table(solvedGrid);

  const easyPuzzle = removeValuesFromPuzzle(solvedGrid, CELLS_TO_REMOVE_EASY);
</script>

<div class="playing-grid">
  {#each easyPuzzle  as row, rowIndex}
    {#each row as cell, colIndex}
      <div
        class="cell"
        class:thick-left={colIndex === 3 || colIndex === 6}
        class:thick-top={rowIndex === 3 || rowIndex === 6}
        class:no-border-right= {colIndex === 8}
        class:no-border-bottom={rowIndex === 8}
      >
        {cell}
      </div>
    {/each}
  {/each}
</div>

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
    border-right: 1px solid var(--border-cell);
    border-bottom: 1px solid var(--border-cell);
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
</style>