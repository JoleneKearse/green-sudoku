<script lang="ts">
  import { generateCompletedPuzzle } from "$lib/gamePlay/generateCompletedPuzzle";
  import { removeValuesFromPuzzle } from '$lib/gamePlay/removeValuesFromPuzzle';
  import { findHiddenSingles, findNakedSingles, placeLikelyEasyMoves } from "$lib/gamePlay/puzzleDifficultyUtils";
  import { canSolveWithEasyStrategies } from "$lib/gamePlay/puzzleDifficultyAssignment";
  import { checkCellForCorrectness } from "$lib/gamePlay/playUtils";
  import PlayingGrid from '$lib/components/PlayingGrid.svelte'
  import NumberGrid from '$lib/components/NumberGrid.svelte'
  import { CELLS_TO_REMOVE_EASY } from "$lib/gamePlay/consts";
  import type { CellIndex, Difficulty, FilledCellValue, SudokuGrid } from "$lib/gamePlay/types";

  type CellKey = `${number}-${number}`;

  function buildCellKey(row: number, col: number): CellKey {
    return `${row}-${col}`;
  }

  function getCompletedGroupState(grid: SudokuGrid, solved: SudokuGrid): {
    groupKeys: Set<string>;
    cellsByGroup: Map<string, CellKey[]>;
  } {
    const groupKeys = new Set<string>();
    const cellsByGroup = new Map<string, CellKey[]>();

    for (let row = 0; row < 9; row++) {
      const isComplete = grid[row].every((cell, col) => cell !== null && cell === solved[row][col]);
      if (!isComplete) continue;

      const key = `row-${row}`;
      groupKeys.add(key);
      cellsByGroup.set(
        key,
        Array.from({ length: 9 }, (_, col) => buildCellKey(row, col)),
      );
    }

    for (let col = 0; col < 9; col++) {
      let isComplete = true;

      for (let row = 0; row < 9; row++) {
        if (grid[row][col] === null || grid[row][col] !== solved[row][col]) {
          isComplete = false;
          break;
        }
      }

      if (!isComplete) continue;

      const key = `col-${col}`;
      groupKeys.add(key);
      cellsByGroup.set(
        key,
        Array.from({ length: 9 }, (_, row) => buildCellKey(row, col)),
      );
    }

    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        let isComplete = true;
        const cells: CellKey[] = [];

        for (let row = boxRow * 3; row < boxRow * 3 + 3; row++) {
          for (let col = boxCol * 3; col < boxCol * 3 + 3; col++) {
            cells.push(buildCellKey(row, col));
            if (grid[row][col] === null || grid[row][col] !== solved[row][col]) {
              isComplete = false;
            }
          }
        }

        if (!isComplete) continue;

        const key = `box-${boxRow}-${boxCol}`;
        groupKeys.add(key);
        cellsByGroup.set(key, cells);
      }
    }

    return { groupKeys, cellsByGroup };
  }

  function isPuzzleSolved(grid: SudokuGrid, solved: SudokuGrid): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === null || grid[row][col] !== solved[row][col]) {
          return false;
        }
      }
    }

    return true;
  }

  function generatePuzzleByDifficulty(difficulty: Difficulty): { solvedGrid: SudokuGrid; puzzle: SudokuGrid } {
    while (true) {
      const solved = generateCompletedPuzzle();
      const candidate = removeValuesFromPuzzle(solved, CELLS_TO_REMOVE_EASY);

      if (difficulty === "easy" && canSolveWithEasyStrategies(candidate)) {
        return { solvedGrid: solved, puzzle: candidate };
      }
    }
  }

  const difficulty: Difficulty = "easy";

  const { solvedGrid, puzzle: easyPuzzle } = generatePuzzleByDifficulty(difficulty);
  console.table(solvedGrid);
  const initialPuzzle: SudokuGrid = easyPuzzle;
  let puzzleCandidate = $state<SudokuGrid>(
    initialPuzzle.map((row) => [...row]) as SudokuGrid,
  );

  let isCorrect = $state(true);
  let selectedCell = $state<{ row: number; col: number } | null>(null);
  let selectedNumber = $state<FilledCellValue | null>(null);
  let cellCompletionTicks = $state<number[][]>(
    Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0)),
  );
  let puzzleCompletionTick = $state(0);
  let isPuzzleSolvedNow = $state(isPuzzleSolved(initialPuzzle, solvedGrid));
  let previousCompletedGroupKeys = new Set<string>(
    getCompletedGroupState(initialPuzzle, solvedGrid).groupKeys,
  );
  let wasPuzzleSolved = isPuzzleSolved(initialPuzzle, solvedGrid);

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
    const { groupKeys: currentCompletedGroupKeys, cellsByGroup } = getCompletedGroupState(
      puzzleCandidate,
      solvedGrid,
    );
    const solvedNow = isPuzzleSolved(puzzleCandidate, solvedGrid);

    if (solvedNow) {
      previousCompletedGroupKeys = currentCompletedGroupKeys;
      return;
    }

    const newlyCompletedCells = new Set<CellKey>();

    for (const groupKey of currentCompletedGroupKeys) {
      if (previousCompletedGroupKeys.has(groupKey)) continue;

      const groupCells = cellsByGroup.get(groupKey) ?? [];
      for (const cellKey of groupCells) {
        newlyCompletedCells.add(cellKey);
      }
    }

    if (newlyCompletedCells.size > 0) {
      cellCompletionTicks = cellCompletionTicks.map((rowTicks, rowIndex) =>
        rowTicks.map((tick, colIndex) =>
          newlyCompletedCells.has(buildCellKey(rowIndex, colIndex)) ? tick + 1 : tick,
        ),
      );
    }

    previousCompletedGroupKeys = currentCompletedGroupKeys;
  });

  $effect(() => {
    const solvedNow = isPuzzleSolved(puzzleCandidate, solvedGrid);
    isPuzzleSolvedNow = solvedNow;

    if (solvedNow && !wasPuzzleSolved) {
      puzzleCompletionTick += 1;
    }

    wasPuzzleSolved = solvedNow;
  });

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
    {cellCompletionTicks}
    {puzzleCompletionTick}
    {isPuzzleSolvedNow}
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
    background-image: url('/background.webp');
    background-size: fit;
    background-repeat: no-repeat;
    background-position: center;
  }
</style>