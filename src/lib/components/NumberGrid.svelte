<script lang="ts">
import EraseIcon from "./EraseIcon.svelte";
    import { FILLED_VALUES } from "../gamePlay/consts";
    import type { FilledCellValue } from "../gamePlay/types";

    const keyboardValues: (FilledCellValue | "erase")[] = [...FILLED_VALUES, "erase"];

    let { selectedNumber, handleNumberPick } = $props<{
        selectedNumber: FilledCellValue | null;
        handleNumberPick: (number: FilledCellValue | null) => void;
    }>();
</script>

<div class="number-grid">
    {#each keyboardValues as value}
        <button class="number-button" onclick={() => handleNumberPick(value === "erase" ? null : value)}>
            {#if value === "erase"}
                <EraseIcon />
            {:else}
                {value}
            {/if}
        </button>
    {/each}
</div>

<style>
    .number-grid {
        display: grid;
        grid-template-rows: repeat(2, 1fr);
        grid-template-columns: repeat(5, 1fr);
        align-items: center;
        justify-content: center;
        gap: 6px;
        max-width: 288px;
        margin-top: 16px;
    }

    .number-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        padding: 6px;
        font-size: 16px;
        border: 1px solid var(--border-playing);
        border-radius: 8px;
        background-color: var(--bg-blur); 
        backdrop-filter: blur(1.75px);
        color: var(--text-primary);
        cursor: pointer;
    }

    .number-button:hover {
        border-color: var(--border-3grid);
    }
</style>