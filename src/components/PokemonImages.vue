<script setup>
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { capitalize } from '@/composables/useStringUtils';

const { t } = useI18n();
const frontImageRef = ref(null);
const backImageRef = ref(null);

/**
 * Handle arrow key navigation between front and back images
 */
const handleImageNavigation = (e) => {
    if (e.key === 'ArrowRight') {
        e.preventDefault();
        backImageRef.value?.focus();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        frontImageRef.value?.focus();
    }
};

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
            <h3>{{ t('viewFinder.frontViewLabel') }}</h3>
            <button
                v-if="pokemon.sprites?.front_default"
                ref="frontImageRef"
                class="pokemon-img-button"
                type="button"
                :aria-label="
                    t('accessibility.pokemonImageFront', {
                        name: capitalize(pokemon.name)
                    })
                "
                @keydown="handleImageNavigation"
            >
                <img
                    :src="pokemon.sprites.front_default"
                    alt=""
                    class="pokemon-img"
                    loading="lazy"
                    aria-hidden="true"
                />
            </button>
            <p v-else class="no-image" role="status" aria-live="polite">
                {{
                    t('viewFinder.noFrontImage', {
                        name: capitalize(pokemon.name)
                    })
                }}
            </p>
        </div>

        <div class="image-container">
            <h3>{{ t('viewFinder.backViewLabel') }}</h3>
            <button
                v-if="pokemon.sprites?.back_default"
                ref="backImageRef"
                class="pokemon-img-button"
                type="button"
                :aria-label="
                    t('accessibility.pokemonImageBack', {
                        name: capitalize(pokemon.name)
                    })
                "
                @keydown="handleImageNavigation"
            >
                <img
                    :src="pokemon.sprites.back_default"
                    alt=""
                    class="pokemon-img"
                    loading="lazy"
                    aria-hidden="true"
                />
            </button>
            <p v-else class="no-image" role="status" aria-live="polite">
                {{
                    t('viewFinder.noBackImage', {
                        name: capitalize(pokemon.name)
                    })
                }}
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
    display: block;

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
}

.pokemon-img-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    border-radius: $radius-md;
    transition: all $transition-normal;
    position: relative;

    &:hover {
        .pokemon-img {
            box-shadow: 0 0 0 3px $secondary;
            transform: scale(1.05);
        }
    }

    &:focus {
        outline: $focus-outline;
        outline-offset: $focus-outline-offset;
    }

    &:focus-visible {
        outline: 3px solid $secondary;
        outline-offset: 4px;
        box-shadow: 0 0 0 6px rgba($secondary, 0.15);
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;

        &:hover .pokemon-img {
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
