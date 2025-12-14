<script setup>
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const { t } = useI18n();
const tableRef = ref(null);

const props = defineProps({
    stats: {
        type: Array,
        required: false,
        default: () => []
    }
});

/**
 * Handle arrow key navigation within the stats table
 */
const handleTableNavigation = (e) => {
    if (!tableRef.value) return;

    const tableRows = Array.from(tableRef.value.querySelectorAll('tbody tr'));
    const currentRow = e.target.closest('tr');
    const currentIndex = tableRows.indexOf(currentRow);

    if (e.key === 'ArrowDown' && currentIndex < tableRows.length - 1) {
        e.preventDefault();
        tableRows[currentIndex + 1].focus();
    } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        e.preventDefault();
        tableRows[currentIndex - 1].focus();
    }
};
</script>

<template>
    <div class="pokemon-stats">
        <table
            ref="tableRef"
            class="stats-table"
            v-if="props.stats && props.stats.length"
            role="grid"
            :aria-label="t('viewFinder.statsLabel')"
        >
            <thead class="sr-only">
                <tr>
                    <th scope="col">
                        {{ t('accessibility.filterPanelAriaLabel') }}
                    </th>
                    <th scope="col">Value</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(stat, index) in props.stats"
                    :key="stat.label"
                    :data-stat="stat.label.toLowerCase()"
                    tabindex="0"
                    role="row"
                    :aria-rowindex="index + 2"
                    @keydown="handleTableNavigation"
                >
                    <th scope="row" class="label">{{ stat.label }}</th>
                    <td class="value" :data-label="stat.label">
                        {{ stat.value }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.pokemon-stats {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.stats-table {
    width: 100%;
    border-collapse: collapse;
    background-color: $pokemon-white;
    border-radius: $radius-lg;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Screen reader only class for hidden but accessible content */
:deep(.sr-only) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}

.stats-table tbody tr {
    border-bottom: 1px solid $border-color;
    transition: background-color $transition-fast;
    outline: 2px solid transparent;
    outline-offset: -2px;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: rgba($secondary, 0.05);
    }

    &:focus {
        background-color: rgba($secondary, 0.1);
    }

    &:focus-visible {
        background-color: rgba($secondary, 0.15);
        box-shadow: inset 0 0 0 2px rgba($secondary, 0.2);
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
}

.stats-table td {
    padding: $spacing-lg $spacing-md;
}

.label {
    font-weight: 700;
    color: $secondary;
    width: 40%;
}

.value {
    color: $text-primary;
    text-transform: capitalize;
}

/* breakpoint-md: 768px from variables.scss */
@media (max-width: $breakpoint-md) {
    .stats-table {
        font-size: $font-size-base;
    }

    .stats-table td {
        padding: $spacing-md $spacing-sm;
    }

    .label {
        width: 50%;
    }
}
</style>
