import { ref, computed } from 'vue';

export function useFilterable(items, filterFn) {
  const selectedFilters = ref(new Set());

  const toggleFilter = (filter) => {
    if (selectedFilters.value.has(filter)) selectedFilters.value.delete(filter);
    else selectedFilters.value.add(filter);
  };

  const clearFilters = () => selectedFilters.value.clear();

  const filteredItems = computed(() => {
    if (selectedFilters.value.size === 0) return items.value;
    return items.value.filter(item => filterFn(item, selectedFilters.value));
  });

  return { selectedFilters, toggleFilter, clearFilters, filteredItems };
}
