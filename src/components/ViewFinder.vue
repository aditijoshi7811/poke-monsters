<script setup>
import { usePokemonStore } from '@/stores/pokemonStore';
import { useTrainerStore } from '@/stores/trainerStore';
import { computed } from 'vue';
import { capitalize } from '@/composables/useStringUtils';
import { usePokemonAnimation } from '@/composables/usePokemonAnimation';
import EncounterStats from './EncounterStats.vue';
import PokemonImages from './PokemonImages.vue';

const pokemonStore = usePokemonStore();
const trainerStore = useTrainerStore();
const { isAnimatingOut, displayPokemon } = usePokemonAnimation(
    computed(() => pokemonStore.currentPokemon),
    trainerStore,
    400
);

const pokemonTypes = computed(() => {
    if (!displayPokemon.value?.types) return '';
    return displayPokemon.value.types
        .map((t) => capitalize(t.type.name))
        .join(', ');
});

const encounterStats = computed(() => {
    if (!displayPokemon.value) return [];
    return [
        { label: 'Name', value: capitalize(displayPokemon.value.name) },
        { label: 'Type', value: pokemonTypes.value },
        {
            label: 'Height',
            value: `${(displayPokemon.value.height / 10).toFixed(1)} m`
        },
        {
            label: 'Weight',
            value: `${(displayPokemon.value.weight / 10).toFixed(1)} kg`
        }
    ];
});
</script>

<template>
    <div class="pokemon-display">
        <div
            v-if="displayPokemon"
            :class="['pokemon-container', { 'animate-out': isAnimatingOut }]"
        >
            <PokemonImages :pokemon="displayPokemon" />

            <EncounterStats :stats="encounterStats" />
        </div>
        <div v-else class="no-pokemon">
            <p>Click "Find" to encounter a Pokemon!</p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.pokemon-display {
    background: linear-gradient(135deg, $pokemon-white 0%, #f0f0f0 100%);
    border-radius: $radius-lg;
    box-shadow: $shadow-md;
    border: 3px solid $secondary;
    min-height: 300px;
}

.pokemon-container {
    display: flex;
    gap: $spacing-xl;
    align-items: flex-start;
    animation: slideInUp $transition-normal;

    &.animate-out {
        animation: slideOutRight 0.4s ease-in forwards;
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideOutRight {
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
}

.pokemon-images {
    flex: 1;
}

.pokemon-stats {
    flex: 1;
}

.no-pokemon {
    text-align: center;
    padding: $spacing-2xl $spacing-xl;
    color: $text-secondary;
    font-size: $font-size-lg;
}

/* breakpoint-md: 768px for stacking table below images in mobile view */
@media (max-width: 768px) {
    .pokemon-container {
        flex-direction: column;
        gap: $spacing-lg;
    }

    .pokemon-images {
        width: 100%;
    }

    .pokemon-stats {
        width: 100%;
    }
}
</style>
