<script setup>
const props = defineProps({
    stats: {
        type: Array,
        required: false,
        default: () => []
    },
});
</script>

<template>
    <div class="pokemon-stats">
        <table class="stats-table" v-if="props.stats && props.stats.length">
            <tbody>
                <tr v-for="stat in props.stats" :key="stat.label">
                    <td class="label">{{ stat.label }}</td>
                    <td class="value">{{ stat.value }}</td>
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

.stats-table tbody tr {
    border-bottom: 1px solid $border-color;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: rgba($secondary, 0.05);
        transition: background-color $transition-fast;
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
@media (max-width: 768px) {
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
