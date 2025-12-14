<script setup>
import { capitalize } from '@/composables/useStringUtils';

defineProps({
    pokemon: {
        type: Object,
        required: true,
        validator: (value) => value && (value.name || value.sprites)
    }
});
</script>

<template>
    <div class="pokemon-images">
        <div class="image-container">
            <h3>Front View</h3>
            <img
                v-if="pokemon.sprites?.front_default"
                :src="pokemon.sprites.front_default"
                :alt="`${capitalize(pokemon.name)} - front facing Pokemon sprite`"
                class="pokemon-img"
                loading="lazy"
            />
            <p v-else class="no-image" role="status" aria-live="polite">
                No front image available for {{ capitalize(pokemon.name) }}
            </p>
        </div>

        <div class="image-container">
            <h3>Back View</h3>
            <img
                v-if="pokemon.sprites?.back_default"
                :src="pokemon.sprites.back_default"
                :alt="`${capitalize(pokemon.name)} - back facing Pokemon sprite`"
                class="pokemon-img"
                loading="lazy"
            />
            <p v-else class="no-image" role="status" aria-live="polite">
                No back image available for {{ capitalize(pokemon.name) }}
            </p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.pokemon-images {
    flex: 1;
    display: flex;
    gap: $spacing-lg;
    justify-content: center;
}

.image-container {
    text-align: center;
}

.image-container h3 {
    color: $secondary;
    margin-bottom: $spacing-md;
    font-size: $font-size-lg;
}

.pokemon-img {
    width: 200px;
    height: 200px;
    image-rendering: pixelated;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: $radius-md;
    padding: $spacing-md;
    border: 2px solid $secondary;
    transition: all $transition-normal;
    cursor: pointer;

    &:hover {
        box-shadow: 0 0 0 3px $secondary;
        transform: scale(1.05);
    }

    &:focus {
        outline: $focus-outline;
        outline-offset: $focus-outline-offset;
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;

        &:hover {
            transform: none;
        }
    }
}

.no-image {
    width: 200px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
    border-radius: $radius-md;
    color: $text-secondary;
    margin: 0;
}

/* breakpoint-md: 768px from variables.scss */
@media (max-width: $breakpoint-md) {
    .pokemon-images {
        justify-content: center;
        width: 100%;
    }

    .pokemon-img {
        width: 150px;
        height: 150px;
    }

    .no-image {
        width: 150px;
        height: 150px;
    }
}
</style>
