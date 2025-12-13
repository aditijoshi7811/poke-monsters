<script setup>
import { useTrainerStore } from '@/stores/trainerStore';
import { computed, ref } from 'vue';
import { capitalize } from '@/composables/useStringUtils';
import { useSortable } from '@/composables/useSortable';
import { useFilterable } from '@/composables/useFilterable';

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true
    }
});

const emit = defineEmits(['close']);

const trainerStore = useTrainerStore();

// Sort menu state
const showSortMenu = ref(false);
const showFilterPanel = ref(false);

// Custom sort functions for specific columns
const sortFunctions = {
    id: (a, b, direction) => {
        if (direction === 'asc') {
            return a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
        } else {
            return a.id < b.id ? 1 : a.id > b.id ? -1 : 0;
        }
    },
    name: (a, b, direction) => {
        const aVal = a.name.toLowerCase();
        const bVal = b.name.toLowerCase();
        if (direction === 'asc') {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        }
    },
    height: (a, b, direction) => {
        if (direction === 'asc') {
            return a.height > b.height ? 1 : a.height < b.height ? -1 : 0;
        } else {
            return a.height < b.height ? 1 : a.height > b.height ? -1 : 0;
        }
    },
    weight: (a, b, direction) => {
        if (direction === 'asc') {
            return a.weight > b.weight ? 1 : a.weight < b.weight ? -1 : 0;
        } else {
            return a.weight < b.weight ? 1 : a.weight > b.weight ? -1 : 0;
        }
    },
    speed: (a, b, direction) => {
        const aVal = a.speedDisplay === 'N/A' ? 0 : a.speedDisplay;
        const bVal = b.speedDisplay === 'N/A' ? 0 : b.speedDisplay;
        if (direction === 'asc') {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        }
    }
};
// Prepare Pokemon data with computed properties for display
const pokemonTypes = computed(() => {
    const uniquePokemonMap = new Map();
    // Precompute counts by name so we can show how many times each Pokemon was captured
    const counts = {};
    trainerStore.caughtPokemon.forEach((p) => {
        counts[p.name] = (counts[p.name] || 0) + 1;
    });

    trainerStore.caughtPokemon.forEach((pokemon) => {
        // Only keep the first occurrence of each Pokemon (by name)
        if (!uniquePokemonMap.has(pokemon.name)) {
            const types =
                pokemon.types?.map((t) => capitalize(t.type.name)).join(', ') ||
                'Unknown';
            uniquePokemonMap.set(pokemon.name, {
                ...pokemon,
                typesDisplay: types,
                heightDisplay: `${(pokemon.height / 10).toFixed(1)} m`,
                weightDisplay: `${(pokemon.weight / 10).toFixed(1)} kg`,
                speedDisplay: pokemon.speed || 'N/A',
                count: counts[pokemon.name] || 1
            });
        }
    });

    return Array.from(uniquePokemonMap.values());
});

/**
 * Filters a Pokemon based on selected types.
 * @param {Object} pokemon - The Pokemon object to filter.
 * @param {Set} selectedTypes - The set of selected types to filter by.
 * @return {Boolean} - True if the Pokemon matches any of the selected types, false otherwise.
 */
const filterByType = (pokemon, selectedTypes) => {
    const pokemonTypesList = pokemon.typesDisplay
        .split(', ')
        .map((t) => t.trim());
    return pokemonTypesList.some((type) => selectedTypes.has(type));
};


// Composables for filtering and sorting
const {
    selectedFilters: selectedTypes,
    toggleFilter: toggleTypeFilter,
    clearFilters,
    filteredItems
} = useFilterable(pokemonTypes, filterByType);
const { sortColumn, sortDirection, toggleSort, getSortIndicator, sortedItems } =
    useSortable(filteredItems, sortFunctions);



/**
 * Toggles the visibility of the filter panel. 
 */
const toggleFilterPanel = () => {
    showFilterPanel.value = !showFilterPanel.value;
};

/**
 * Toggles the visibility of the sort menu.
 */ 
const toggleSortMenu = () => {
    showSortMenu.value = !showSortMenu.value;
};

/**
 * Handles keydown events on filter checkboxes for accessibility.
 * @param {KeyboardEvent} e - The keyboard event.
 * @param {String} type - The Pokemon type associated with the checkbox.
 */
const handleFilterCheckboxKeydown = (e, type) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTypeFilter(type);
    }
};

/**
 * Handles keydown events on table headers for sorting accessibility.
 * @param {KeyboardEvent} e - The keyboard event.
 * @param {String} columnName - The column name to sort by.
 */
const handleHeaderKeydown = (e, columnName) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleSort(columnName);
    }
};

/**
 * Closes the modal by emitting the 'close' event.
 */
const closeModal = () => {
    emit('close');
};

 /**
  * Handles keydown events for closing the modal with the Escape key.
  * @param {KeyboardEvent} e - The keyboard event.
  */
const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
};

// Total unique caught Pokemon
const totalCaught = computed(() => trainerStore.caughtPokemon.length);

// Unique count for the currently displayed list (used in header badges)
const uniqueCount = computed(() => sortedItems.value.length);

// Total captured among the currently displayed Pokemon (counts duplicates)
const displayedTotalCaptured = computed(() => {
    const namesSet = new Set(sortedItems.value.map((p) => p.name));
    return trainerStore.caughtPokemon.filter((p) => namesSet.has(p.name))
        .length;
});


// Get all unique types from caught Pokemon
const allTypes = computed(() => {
    const typesSet = new Set();
    pokemonTypes.value.forEach((pokemon) => {
        // Split comma-separated types and add each as a separate type
        const types = pokemon.typesDisplay.split(', ').map((t) => t.trim());
        types.forEach((type) => typesSet.add(type));
    });
    return Array.from(typesSet).sort();
});
</script>

<template>
    <teleport to="body">
        <div
            v-if="isOpen"
            class="modal-overlay"
            @click="closeModal"
            @keydown="handleKeyDown"
        >
            <div
                class="modal-content"
                role="dialog"
                aria-modal="true"
                aria-labelledby="pokedexTitle"
                @click.stop
            >
                <div class="modal-header">
                    <h2 id="pokedexTitle">My Pokédex</h2>
                    <div class="header-actions">
                        <div class="sort-menu-wrapper">
                            <button
                                type="button"
                                class="sort-btn"
                                aria-label="Toggle sort menu"
                                @click="toggleSortMenu"
                                :class="{ active: showSortMenu }"
                            >
                                ⇅ Sort
                            </button>
                            <div v-if="showSortMenu" class="sort-dropdown">
                                <button
                                    v-for="col in [
                                        'id',
                                        'name',
                                        'height',
                                        'weight',
                                        'speed'
                                    ]"
                                    :key="col"
                                    type="button"
                                    class="sort-option"
                                    @click="toggleSort(col)"
                                    :class="{ active: sortColumn === col }"
                                >
                                    {{ capitalize(col) }}
                                    {{
                                        sortColumn === col
                                            ? sortDirection === 'asc'
                                                ? '↑'
                                                : '↓'
                                            : '⇅'
                                    }}
                                </button>
                            </div>
                        </div>
                        <button
                            type="button"
                            class="filter-btn"
                            @click="toggleFilterPanel"
                            :class="{ active: showFilterPanel }"
                            :aria-expanded="showFilterPanel"
                            aria-controls="filterPanel"
                        >
                            <span class="filter-icon" aria-hidden="true">
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    focusable="false"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M6 9l6 6 6-6"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </span>
                            Filter by Type
                        </button>
                        <button
                            type="button"
                            aria-label="Close modal"
                            class="close-btn"
                            @click="closeModal"
                        >
                            ✕
                        </button>
                    </div>
                </div>
                <!-- Filter Panel -->
                <div
                    v-if="showFilterPanel"
                    id="filterPanel"
                    class="filter-panel"
                    role="region"
                    aria-labelledby="filterHeading"
                >
                    <div class="filter-content">
                        <h3 id="filterHeading">Filter by Type</h3>
                        <div class="type-checkboxes">
                            <label
                                v-for="type in allTypes"
                                :key="type"
                                class="checkbox-label"
                            >
                                <input
                                    type="checkbox"
                                    :checked="selectedTypes.has(type)"
                                    @change="toggleTypeFilter(type)"
                                    @keydown="
                                        handleFilterCheckboxKeydown(
                                            $event,
                                            type
                                        )
                                    "
                                />
                                {{ type }}
                            </label>
                        </div>
                        <button
                            v-if="selectedTypes.size > 0"
                            type="button"
                            class="clear-btn"
                            @click="clearFilters"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                <div class="modal-body">
                    <div v-if="totalCaught === 0" class="no-pokemon">
                        <p>No Pokemon caught yet! Go out and find some!</p>
                    </div>
                    <div v-else class="collection-table-wrapper">
                        <table class="collection-table">
                            <thead>
                                <tr>
                                    <th
                                        class="sortable"
                                        @click="toggleSort('id')"
                                        @keydown="
                                            handleHeaderKeydown($event, 'id')
                                        "
                                        tabindex="0"
                                        role="button"
                                        aria-label="Sort by ID"
                                    >
                                        ID{{ getSortIndicator('id') }}
                                    </th>
                                    <th class="cell-number">Number</th>
                                    <th>Image</th>
                                    <th
                                        class="sortable"
                                        @click="toggleSort('name')"
                                        @keydown="
                                            handleHeaderKeydown($event, 'name')
                                        "
                                        tabindex="0"
                                        role="button"
                                        aria-label="Sort by Name"
                                    >
                                        Name{{ getSortIndicator('name') }}
                                    </th>
                                    <th>Type</th>
                                    <th
                                        class="sortable"
                                        @click="toggleSort('height')"
                                        @keydown="
                                            handleHeaderKeydown(
                                                $event,
                                                'height'
                                            )
                                        "
                                        tabindex="0"
                                        role="button"
                                        aria-label="Sort by Height"
                                    >
                                        Height{{ getSortIndicator('height') }}
                                    </th>
                                    <th
                                        class="sortable"
                                        @click="toggleSort('weight')"
                                        @keydown="
                                            handleHeaderKeydown(
                                                $event,
                                                'weight'
                                            )
                                        "
                                        tabindex="0"
                                        role="button"
                                        aria-label="Sort by Weight"
                                    >
                                        Weight{{ getSortIndicator('weight') }}
                                    </th>
                                    <th
                                        class="sortable"
                                        @click="toggleSort('speed')"
                                        @keydown="
                                            handleHeaderKeydown($event, 'speed')
                                        "
                                        tabindex="0"
                                        role="button"
                                        aria-label="Sort by Speed"
                                    >
                                        Speed{{ getSortIndicator('speed') }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="pokemon in sortedItems"
                                    :key="pokemon.id"
                                >
                                    <td class="cell-id">{{ pokemon.id }}</td>
                                    <td class="cell-number">
                                        {{ pokemon.count || 1 }}
                                    </td>
                                    <td class="cell-image">
                                        <img
                                            v-if="pokemon.image"
                                            :src="pokemon.image"
                                            :alt="`${pokemon.name} sprite`"
                                            class="pokemon-sprite"
                                        />
                                    </td>
                                    <td class="cell-name">
                                        {{ capitalize(pokemon.name) }}
                                    </td>
                                    <td class="cell-type">
                                        {{ pokemon.typesDisplay }}
                                    </td>
                                    <td class="cell-stat">
                                        {{ pokemon.heightDisplay }}
                                    </td>
                                    <td class="cell-stat">
                                        {{ pokemon.weightDisplay }}
                                    </td>
                                    <td class="cell-stat">
                                        {{ pokemon.speedDisplay }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <div
                        class="footer-stats"
                        role="status"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        <span
                            class="thin-badge"
                            :aria-label="`Unique Pokémon currently shown: ${uniqueCount}`"
                        >
                            <span class="sr-only"
                                >Unique Pokémon currently shown:
                            </span>
                            <span aria-hidden="true">Unique shown:</span>
                            <strong aria-hidden="true">{{
                                uniqueCount
                            }}</strong>
                        </span>
                        <span
                            class="thin-badge"
                            :aria-label="`Total Pokémon captured: ${displayedTotalCaptured}`"
                        >
                            <span class="sr-only"
                                >Total Pokémon captured:
                            </span>
                            <span aria-hidden="true">Total:</span>
                            <strong aria-hidden="true">{{
                                displayedTotalCaptured
                            }}</strong>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: $spacing-lg;
    animation: fadeIn $transition-fast;

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
}

.modal-content {
    background-color: $pokemon-white;
    border-radius: $radius-lg;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
    max-width: 90vw;
    max-height: 90vh;
    // min-height: 90vh;
    display: flex;
    flex-direction: column;
    animation: slideUp $transition-normal;

    @keyframes slideUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-lg;
    border-bottom: 2px solid $border-color;
    background: linear-gradient(135deg, $pokemon-white 0%, #f0f0f0 100%);

    h2 {
        margin: 0;
        color: $primary;
        font-size: $font-size-xl;
    }

    .header-actions {
        display: flex;
        gap: $spacing-md;
        align-items: center;
    }

    .filter-btn {
        padding: $spacing-sm $spacing-md;
        background-color: $secondary;
        color: $pokemon-white;
        border: none;
        border-radius: $radius-md;
        cursor: pointer;
        font-weight: 600;
        transition: background-color $transition-fast;
        font-size: $font-size-sm;
        display: inline-block;

        &:hover {
            background-color: darken($secondary, 10%);
        }

        &.active {
            background-color: darken($secondary, 15%);
            /* Visual indicator: slightly larger and inner icon rotation */
            transform: translateY(-1px);
        }

        /* animate the inline SVG icon instead of using a pseudo-element */
        .filter-icon {
            display: inline-flex;
            margin-right: $spacing-sm;
        }
        .filter-icon svg {
            transition: transform $transition-fast ease;
            transform-origin: center;
            width: 14px;
            height: 14px;
        }
        &.active .filter-icon svg {
            transform: rotate(180deg) translateY(2px);
        }

        &:focus {
            outline: $focus-outline;
            outline-offset: $focus-outline-offset;
        }
    }

    .sort-btn {
        padding: $spacing-sm $spacing-md;
        background-color: $primary;
        color: $pokemon-white;
        border: none;
        border-radius: $radius-md;
        cursor: pointer;
        font-weight: 600;
        transition: background-color $transition-fast;
        font-size: $font-size-sm;
        display: inline-flex; /* show sort button on desktop */

        &:hover {
            background-color: darken($primary, 10%);
        }

        &.active {
            background-color: darken($primary, 15%);
        }

        &:focus {
            outline: $focus-outline;
            outline-offset: $focus-outline-offset;
        }
    }

    .sort-menu-wrapper {
        position: relative;
        display: none;
    }

    .sort-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        background-color: $pokemon-white;
        border: 1px solid $border-color;
        border-radius: $radius-md;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        min-width: 160px;
        z-index: 1001;
        margin-top: $spacing-sm;
    }

    .sort-option {
        display: block;
        width: 100%;
        padding: $spacing-md $spacing-lg;
        background: none;
        border: none;
        text-align: left;
        cursor: pointer;
        font-size: $font-size-sm;
        color: $text-primary;
        transition: background-color $transition-fast;

        &:hover {
            background-color: rgba($secondary, 0.1);
        }

        &.active {
            background-color: rgba($primary, 0.1);
            font-weight: 600;
            color: $primary;
        }

        &:focus {
            outline: $focus-outline;
            outline-offset: -2px;
        }
    }

    .close-btn {
        background: none;
        border: none;
        font-size: $font-size-lg;
        cursor: pointer;
        color: $text-primary;
        padding: 0;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: $radius-md;
        transition: background-color $transition-fast;

        &:hover {
            background-color: rgba($primary, 0.1);
        }

        &:focus {
            outline: $focus-outline;
            outline-offset: $focus-outline-offset;
        }
    }
}

.modal-body {
    flex: 1;
    overflow-y: auto;
    padding: $spacing-lg;
    padding-bottom: $spacing-xl; /* make space for sticky footer */
}

.no-pokemon {
    text-align: center;
    padding: $spacing-2xl $spacing-lg;
    color: $text-secondary;
    font-size: $font-size-lg;
}

.collection-table-wrapper {
    overflow-x: auto;
    overflow-y: auto; /* enable vertical scrolling for long tables */
    max-height: 55vh; /* limit height so header can stick and body scrolls */
    border-radius: $radius-md;
    border: 1px solid $border-color;
}

.modal-footer {
    padding: $spacing-sm $spacing-lg;
    border-top: 1px solid $border-color;
    background: linear-gradient(180deg, $pokemon-white 0%, #f6f6f6 100%);
    position: sticky;
    bottom: 0;
    z-index: 8;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.footer-stats {
    display: flex;
    gap: $spacing-sm;
    align-items: center;
}

/* .thin-badge: consolidated below */

.collection-table {
    width: 100%;
    border-collapse: collapse;
    background-color: $pokemon-white;
    th {
        background: $pokemon-white !important;
    }
}

.collection-stats-bar {
    display: flex;
    gap: $spacing-md;
    padding: $spacing-sm $spacing-md;
    align-items: center;
    border-bottom: 1px solid $border-color;
}

.thin-badge {
    background: transparent;
    border: 1px solid rgba($border-color, 0.12);
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-sm;
    font-weight: 700;
    color: $text-primary; /* ensure readable contrast */
    font-size: $font-size-sm; /* make badges readable (>=14px) */
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
}
.thin-badge strong {
    color: $primary; /* emphasize numbers in the brand primary color for clarity */
}

.collection-table thead tr {
    position: sticky; /* ensure individual cells remain aligned when scrolled horizontally */
    top: 0;
}

.collection-table th {
    padding: $spacing-md $spacing-lg;
    text-align: left;
    font-weight: 700;
    font-size: $font-size-sm;

    &.sortable {
        cursor: pointer;
        user-select: none;
        transition: background-color $transition-fast;

        &:hover {
            background-color: darken($secondary, 5%);
        }

        &:focus {
            outline: $focus-outline;
            outline-offset: -2px;
            background-color: darken($secondary, 8%);
        }
    }
}

.collection-table tbody tr {
    border-bottom: 1px solid $border-color;
    transition: background-color $transition-fast;

    &:hover {
        background-color: rgba($secondary, 0.05);
    }

    &:last-child {
        border-bottom: none;
    }
}

.collection-table td {
    padding: $spacing-md $spacing-lg;
    font-size: $font-size-sm;
}

.cell-id {
    font-weight: 600;
    color: $secondary;
    width: 50px;
}
.cell-number {
    font-weight: 700;
    min-width: 40px;
    text-align: center;
}

.cell-image {
    width: 70px;
    text-align: center;
}

.pokemon-sprite {
    width: 50px;
    height: 50px;
    image-rendering: pixelated;
}

.cell-name {
    font-weight: 600;
    color: $text-primary;
    min-width: 100px;
}

.cell-type {
    color: $text-primary;
    min-width: 120px;
}

.cell-stat {
    color: $text-secondary;
    text-align: center;
    min-width: 70px;
}

.filter-panel {
    padding: $spacing-lg;
    background-color: rgba($secondary, 0.05);
    border-bottom: 1px solid $border-color;
}

.filter-content {
    h3 {
        margin: 0 0 $spacing-md 0;
        color: $text-primary;
        font-size: $font-size-md;
    }

    .type-checkboxes {
        display: flex;
        flex-wrap: wrap;
        gap: $spacing-md;
        margin-bottom: $spacing-lg;
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        cursor: pointer;
        font-size: $font-size-sm;
        color: $text-primary;

        input[type='checkbox'] {
            cursor: pointer;
            width: 18px;
            height: 18px;
        }

        &:hover {
            color: $secondary;
        }
    }

    .clear-btn {
        padding: $spacing-sm $spacing-md;
        background-color: $primary;
        color: $pokemon-white;
        border: none;
        border-radius: $radius-md;
        cursor: pointer;
        font-weight: 600;
        transition: background-color $transition-fast;
        font-size: $font-size-sm;

        &:hover {
            background-color: darken($primary, 10%);
        }

        &:focus {
            outline: $focus-outline;
            outline-offset: $focus-outline-offset;
        }
    }
}

/* Mobile responsive */
@media (max-width: 768px) {
    .modal-overlay {
        padding: $spacing-sm;
    }

    .modal-content {
        max-width: 100%;
        max-height: 95vh;
    }

    .modal-header {
        h2 {
            font-size: $font-size-lg;
        }

        .header-actions {
            width: 100%;
            display: flex;
            gap: $spacing-sm;
            flex-wrap: wrap;

            .sort-menu-wrapper {
                display: flex;
                flex: 1;
                min-width: 100px;
                position: relative;
            }

            .sort-btn {
                display: inline-block;
                flex: 1;
            }

            .filter-btn {
                display: inline-block;
                flex: 1;
                min-width: 100px;
            }

            .close-btn {
                flex: 0;
            }
        }
    }

    .collection-table-wrapper {
        overflow-x: visible;
    }

    .collection-table {
        border: none;
    }

    .collection-table thead {
        display: none;
    }

    .collection-table tbody {
        display: block;
    }

    .collection-table tr {
        display: block;
        border: 1px solid $border-color;
        border-radius: $radius-md;
        margin-bottom: $spacing-md;
        background-color: $pokemon-white;
        padding: $spacing-md;
    }

    .collection-table td {
        display: flex;
        align-items: center;
        gap: $spacing-md;
        padding: $spacing-sm 0;
        font-size: $font-size-sm;
        border-bottom: none;
        margin-bottom: $spacing-sm;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .cell-id {
        &::before {
            content: 'ID: ';
            font-weight: 700;
            color: $secondary;
            min-width: auto;
        }
    }

    .cell-image {
        &::before {
            content: 'Image: ';
            font-weight: 700;
            color: $secondary;
            min-width: auto;
        }

        img {
            width: 40px;
            height: 40px;
        }
    }

    .cell-name {
        &::before {
            content: 'Name: ';
            font-weight: 700;
            color: $secondary;
            min-width: auto;
        }
    }
    .cell-number {
        &::before {
            content: 'Number: ';
            font-weight: 700;
            color: $secondary;
            min-width: auto;
        }
    }

    .cell-type {
        &::before {
            content: 'Type: ';
            font-weight: 700;
            color: $secondary;
            min-width: auto;
        }
    }

    .cell-stat {
        &::before {
            font-weight: 700;
            color: $secondary;
            min-width: auto;
        }

        &:nth-of-type(5)::before {
            content: 'Height: ';
        }

        &:nth-of-type(6)::before {
            content: 'Weight: ';
        }

        &:nth-of-type(7)::before {
            content: 'Speed: ';
        }
    }

    .pokemon-sprite {
        width: 50px;
        height: 50px;
    }
}
</style>
