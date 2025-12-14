import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { useSortable } from '../useSortable';

describe('useSortable', () => {
    /**
     * Test: returns required properties
     */
    it('returns sorting state and methods', () => {
        const items = ref([]);
        const sortFns = {};
        const sortable = useSortable(items, sortFns);

        expect(sortable).toHaveProperty('sortColumn');
        expect(sortable).toHaveProperty('sortDirection');
        expect(sortable).toHaveProperty('toggleSort');
        expect(sortable).toHaveProperty('getSortIndicator');
        expect(sortable).toHaveProperty('sortedItems');
    });

    /**
     * Test: initial sort direction is ascending
     */
    it('has ascending direction by default', () => {
        const items = ref([]);
        const sortFns = {};
        const { sortDirection } = useSortable(items, sortFns);

        expect(sortDirection.value).toBe('asc');
    });

    /**
     * Test: toggleSort sets sort column
     */
    it('sets sort column when toggled', () => {
        const items = ref([]);
        const sortFns = { name: () => 0 };
        const { sortColumn, toggleSort } = useSortable(items, sortFns);

        toggleSort('name');
        expect(sortColumn.value).toBe('name');
    });

    /**
     * Test: toggleSort toggles direction on same column
     */
    it('toggles direction when same column clicked', () => {
        const items = ref([]);
        const sortFns = { id: () => 0 };
        const { sortDirection, toggleSort } = useSortable(items, sortFns);

        toggleSort('id');
        expect(sortDirection.value).toBe('asc');
        toggleSort('id');
        expect(sortDirection.value).toBe('desc');
    });

    /**
     * Test: getSortIndicator returns correct indicator
     */
    it('returns sort indicator for column', () => {
        const items = ref([]);
        const sortFns = { name: () => 0 };
        const { toggleSort, getSortIndicator } = useSortable(items, sortFns);

        toggleSort('name');
        expect(getSortIndicator('name')).toBe(' ↑');
        expect(getSortIndicator('id')).toBe(' ⇅');
    });

    /**
     * Test: sorts items using sort function
     */
    it('sorts items using provided sort function', () => {
        const items = ref([{ id: 3 }, { id: 1 }, { id: 2 }]);
        const sortFns = {
            id: (a, b, dir) => (dir === 'asc' ? a.id - b.id : b.id - a.id)
        };
        const { toggleSort, sortedItems } = useSortable(items, sortFns);

        toggleSort('id');
        expect(sortedItems.value[0].id).toBe(1);
        expect(sortedItems.value[2].id).toBe(3);
    });
});
