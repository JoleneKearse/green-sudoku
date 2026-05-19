<script lang="ts">
  import { generateCompletedPuzzle } from "./lib/gamePlay/generateCompletedPuzzle";
  import { removeValuesFromPuzzle } from './lib/gamePlay/removeValuesFromPuzzle';
  import { findHiddenSingles, findNakedSingles } from "./lib/gamePlay/puzzleDifficultyUtils";
  import PlayingGrid from './lib/components/PlayingGrid.svelte'
  import NumberGrid from './lib/components/NumberGrid.svelte'
  import { CELLS_TO_REMOVE_EASY } from "./lib/gamePlay/consts";
  import type { FilledCellValue, SudokuGrid } from "./lib/gamePlay/types";

  const solvedGrid = generateCompletedPuzzle();
  console.table(solvedGrid);

  let puzzleCandidate = $state<SudokuGrid>(
    removeValuesFromPuzzle(solvedGrid, CELLS_TO_REMOVE_EASY),
  );

  let selectedCell = $state<{ row: number; col: number } | null>(null);
  let selectedNumber = $state<FilledCellValue | null>(null);

  function handleCellClick(rowIndex: number, colIndex: number) {
    selectedCell = { row: rowIndex, col: colIndex };
    console.log(`Clicked cell: ${JSON.stringify(selectedCell)}`);
  }

  function placeSelectedNumber(number: FilledCellValue | null) {
	if (!selectedCell) return;

	const { row, col } = selectedCell;

  puzzleCandidate = puzzleCandidate.map((currentRow, rowIndex) =>
		currentRow.map((cell, colIndex) =>
			rowIndex === row && colIndex === col ? (number ?? " ") : cell
		)
	);
  selectedCell = null;
  }

  function handleNumberPick(number: FilledCellValue | null) {
    selectedNumber = number;
    console.log(`Selected number: ${selectedNumber}`);
    placeSelectedNumber(number);
  }

  $effect(() => {
    const nakedSingles = findNakedSingles(puzzleCandidate);
    console.log("Naked singles available:", nakedSingles.length);
    console.table(nakedSingles);
  });

  $effect(() => {
    const hiddenSingles = findHiddenSingles(puzzleCandidate);
    console.log("Hidden singles available:", hiddenSingles.length);
    console.table(hiddenSingles);
  });
</script>
  
<main>
  <PlayingGrid 
    {puzzleCandidate}
    {selectedCell}
    {selectedNumber}
    {handleCellClick}
  />
  <NumberGrid 
    {selectedNumber}
    {handleNumberPick}
  />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
</style>