<script lang="ts">
  import { generateCompletedPuzzle } from "./lib/gamePlay/generateCompletedPuzzle";
  import { removeValuesFromPuzzle } from './lib/gamePlay/removeValuesFromPuzzle';
  import { findHiddenSingles, findNakedSingles, placeLikelyEasyMoves } from "./lib/gamePlay/puzzleDifficultyUtils";
  import { canSolveWithEasyStrategies } from "./lib/gamePlay/puzzleDifficultyAssignment";
  import { checkCellForCorrectness } from "./lib/gamePlay/playUtils";
  import PlayingGrid from './lib/components/PlayingGrid.svelte'
  import NumberGrid from './lib/components/NumberGrid.svelte'
  import { CELLS_TO_REMOVE_EASY } from "./lib/gamePlay/consts";
  import type { CellIndex, Difficulty, FilledCellValue, SudokuGrid } from "./lib/gamePlay/types";

  function generatePuzzleByDifficulty(difficulty: Difficulty): { solvedGrid: SudokuGrid; puzzle: SudokuGrid } {
    while (true) {
      const solved = generateCompletedPuzzle();
      const candidate = removeValuesFromPuzzle(solved, CELLS_TO_REMOVE_EASY);

      if (difficulty === "easy" && canSolveWithEasyStrategies(candidate)) {
        return { solvedGrid: solved, puzzle: candidate };
      }
    }
  }

  let difficulty = $state<Difficulty>("easy");

  const { solvedGrid, puzzle: easyPuzzle } = generatePuzzleByDifficulty(difficulty);
  console.table(solvedGrid);
  const initialPuzzle: SudokuGrid = easyPuzzle;
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

  $effect(() => {
    const easyPreview = placeLikelyEasyMoves(puzzleCandidate, 3);

    console.table(easyPreview.placedMoves);
    console.table(easyPreview.nakedSinglesAfter);
    console.table(easyPreview.hiddenSinglesAfter);

    console.log("Placed moves:", easyPreview.placedMoves.length);
    console.log("Naked singles after:", easyPreview.nakedSinglesAfter.length);
    console.log("Hidden singles after:", easyPreview.hiddenSinglesAfter.length);
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