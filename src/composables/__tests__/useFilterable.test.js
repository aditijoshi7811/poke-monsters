import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { useFilterable } from '../useFilterable';

describe('useFilterable', () => {
    /**
     * Test: returns required properties
     */
    it('returns selectedFilters, toggleFilter, clearFilters, and filteredItems', () => {
        const items = ref([]);
        const filterFn = () => true;
        const filterable = useFilterable(items, filterFn);

        expect(filterable).toHaveProperty('selectedFilters');
        expect(filterable).toHaveProperty('toggleFilter');
        expect(filterable).toHaveProperty('clearFilters');
        expect(filterable).toHaveProperty('filteredItems');
    });

    /**
     * Test: returns all items when no filters selected
     */
    it('returns all items when no filters are active', () => {
        const items = ref([{ name: 'Pikachu' }, { name: 'Charizard' }]);
        const filterFn = () => true;
        const { filteredItems } = useFilterable(items, filterFn);

        expect(filteredItems.value).toHaveLength(2);
    });

    /**
     * Test: toggleFilter adds filter
     */
    it('adds filter when toggled', () => {
        const items = ref([]);
        const filterFn = () => true;
        const { selectedFilters, toggleFilter } = useFilterable(
            items,
            filterFn
        );

        toggleFilter('Electric');
        expect(selectedFilters.value.has('Electric')).toBe(true);
    });

    /**
     * Test: toggleFilter removes existing filter
     */
    it('removes filter when toggled again', () => {
        const items = ref([]);
        const filterFn = () => true;
        const { selectedFilters, toggleFilter } = useFilterable(
            items,
            filterFn
        );

        toggleFilter('Fire');
        toggleFilter('Fire');
        expect(selectedFilters.value.has('Fire')).toBe(false);
    });

    /**
     * Test: clearFilters removes all filters
     */
    it('clears all filters', () => {
        const items = ref([]);
        const filterFn = () => true;
        const { selectedFilters, toggleFilter, clearFilters } = useFilterable(
            items,
            filterFn
        );

        toggleFilter('Water');
        toggleFilter('Grass');
        clearFilters();
        expect(selectedFilters.value.size).toBe(0);
    });

    /**
     * Test: filters items using provided filter function
     */
    it('filters items based on filter function', () => {
        const items = ref([
            { type: 'Fire' },
            { type: 'Water' },
            { type: 'Fire' }
        ]);
        const filterFn = (item, filters) => filters.has(item.type);
        const { toggleFilter, filteredItems } = useFilterable(items, filterFn);

        toggleFilter('Fire');
        expect(filteredItems.value).toHaveLength(2);
    });
});
