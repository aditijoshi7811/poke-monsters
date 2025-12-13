import { ref, computed } from 'vue';

export function useSortable(items, sortFunctions = {}) {
  const sortColumn = ref(null);
  const sortDirection = ref('asc');

  const toggleSort = (column) => {
    if (sortColumn.value === column) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn.value = column;
      sortDirection.value = 'asc';
    }
  };

  const getSortIndicator = (column) => {
    if (sortColumn.value !== column) return ' ⇅';
    return sortDirection.value === 'asc' ? ' ↑' : ' ↓';
  };

  const sortedItems = computed(() => {
    if (!sortColumn.value) return items.value;

    const sorted = [...items.value];
    const customSort = sortFunctions[sortColumn.value];
    if (customSort) {
      sorted.sort((a, b) => customSort(a, b, sortDirection.value));
      return sorted;
    }

    sorted.sort((a, b) => {
      let aVal = a[sortColumn.value];
      let bVal = b[sortColumn.value];
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (sortDirection.value === 'asc') return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    });

    return sorted;
  });

  return { sortColumn, sortDirection, toggleSort, getSortIndicator, sortedItems };
}
