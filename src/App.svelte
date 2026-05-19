<script lang="ts">
  import { generateCompletedPuzzle } from "./lib/gamePlay/generateCompletedPuzzle";
  import { removeValuesFromPuzzle } from './lib/gamePlay/removeValuesFromPuzzle';
  import { findHiddenSingles, findNakedSingles } from "./lib/gamePlay/puzzleDifficultyUtils";
  import { checkCellForCorrectness } from "./lib/gamePlay/playUtils";
  import PlayingGrid from './lib/components/PlayingGrid.svelte'
  import NumberGrid from './lib/components/NumberGrid.svelte'
  import { CELLS_TO_REMOVE_EASY } from "./lib/gamePlay/consts";
  import type { CellIndex, FilledCellValue, SudokuGrid } from "./lib/gamePlay/types";

  const solvedGrid = generateCompletedPuzzle();
  console.table(solvedGrid);

  const initialPuzzle: SudokuGrid = removeValuesFromPuzzle(
    solvedGrid,
    CELLS_TO_REMOVE_EASY,
  );

  let puzzleCandidate = $state<SudokuGrid>(
    initialPuzzle.map((row) => [...row]) as SudokuGrid,
  );
  let isCorrect = $state(true);

  let selectedCell = $state<{ row: number; col: number } | null>(null);
  let selectedNumber = $state<FilledCellValue | null>(null);

  function checkSelectedCell(row: number, col: number, number: FilledCellValue | null) {
    if (initialPuzzle[row][col] !== null || number === null) {
      return true;
    }

    return checkCellForCorrectness(
      puzzleCandidate,
      row as CellIndex,
      col as CellIndex,
      number,
      solvedGrid,
    );
  }

  function handleCellClick(rowIndex: number, colIndex: number) {
    selectedCell = { row: rowIndex, col: colIndex };
    isCorrect = true;
    console.log(`Clicked cell: ${JSON.stringify(selectedCell)}`);
  }

  function placeSelectedNumber(number: FilledCellValue | null, row?: number, col?: number) {
	const targetRow = row ?? selectedCell?.row;
	const targetCol = col ?? selectedCell?.col;

	if (targetRow === undefined || targetCol === undefined) return;

	if (initialPuzzle[targetRow][targetCol] !== null) {
		selectedCell = null;
		return;
	}

  puzzleCandidate = puzzleCandidate.map((currentRow, rowIndex) =>
    currentRow.map((cell, colIndex) =>
      rowIndex === targetRow && colIndex === targetCol ? (number ?? null) : cell
    )
  );

  isCorrect = checkSelectedCell(targetRow, targetCol, number);

  if (isCorrect || number === null) {
    selectedCell = null;
  }
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
    {initialPuzzle}
    {isCorrect}
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