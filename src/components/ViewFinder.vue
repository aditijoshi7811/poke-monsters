<script setup>
import { usePokemonStore } from '@/stores/pokemonStore';
import { useTrainerStore } from '@/stores/trainerStore';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { capitalize } from '@/composables/useStringUtils';
import { usePokemonAnimation } from '@/composables/usePokemonAnimation';
import EncounterStats from './EncounterStats.vue';
import PokemonImages from './PokemonImages.vue';

const pokemonStore = usePokemonStore();
const trainerStore = useTrainerStore();
const { t } = useI18n();
const announcementText = ref('');
const pokemonImagesRef = ref(null);
const encounterStatsRef = ref(null);

/**
 * Handle Tab/Shift+Tab navigation between images and stats sections
 * Also handles arrow keys for vertical navigation
 */
const handleSectionNavigation = (e) => {
    const sections = [pokemonImagesRef.value, encounterStatsRef.value].filter(
        Boolean
    );
    const currentFocused = document.activeElement;
    const currentIndex = sections.findIndex(
        (section) =>
            section === currentFocused || section?.contains(currentFocused)
    );

    if (e.key === 'Tab') {
        if (e.shiftKey) {
            // Shift+Tab - move to previous section
            if (currentIndex === 1) {
                e.preventDefault();
                pokemonImagesRef.value?.focus();
            }
        } else {
            // Tab - move to next section
            if (currentIndex === 0) {
                e.preventDefault();
                encounterStatsRef.value?.focus();
            }
        }
    } else if (e.key === 'ArrowDown' && currentIndex !== -1) {
        // Arrow Down - move to next section
        if (currentIndex === 0) {
            e.preventDefault();
            encounterStatsRef.value?.focus();
        }
    } else if (e.key === 'ArrowUp' && currentIndex !== -1) {
        // Arrow Up - move to previous section
        if (currentIndex === 1) {
            e.preventDefault();
            pokemonImagesRef.value?.focus();
        }
    }
};

// Use the usePokemonAnimation composable to manage animation state
const { isAnimatingOut, displayPokemon } = usePokemonAnimation(
    computed(() => pokemonStore.currentPokemon),
    trainerStore,
    400
);

/**
 * Computes a formatted string of the Pokémon's types.
 * @return {string} A comma-separated string of capitalized Pokémon type names.
 */
const pokemonTypes = computed(() => {
    if (!displayPokemon.value?.types) return '';
    return displayPokemon.value.types
        .map((t) => capitalize(t.type.name))
        .join(', ');
});

/**
 * Computes an array of encounter statistics for the displayed Pokémon.
 * @return {Array<{ label: string, value: string }>} An array of objects containing stat labels and their corresponding values.
 */
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

/**
 * Computes a detailed announcement of the encountered Pokémon's stats for screen readers.
 * This will be read aloud by voice-over when a Pokémon is found.
 * @return {string} A formatted string with Pokémon name and all stats.
 */
const pokemonStatsAnnouncement = computed(() => {
    if (!displayPokemon.value) return '';
    const name = capitalize(displayPokemon.value.name);
    const type = pokemonTypes.value;
    const height = `${(displayPokemon.value.height / 10).toFixed(1)} m`;
    const weight = `${(displayPokemon.value.weight / 10).toFixed(1)} kg`;
    return `${name} ${t('viewFinder.encounterAnnouncementPrefix')}${type}. ${t('viewFinder.encounterAnnouncementHeight')}${height}. ${t('viewFinder.encounterAnnouncementWeight')}${weight}.`;
});

/**
 * Watch for animation completion to announce stats
 */
watch(
    () => isAnimatingOut.value,
    (animatingOut) => {
        if (!animatingOut && displayPokemon.value) {
            // Animation completed, announce stats
            announcementText.value = pokemonStatsAnnouncement.value;
        } else if (animatingOut) {
            // Animation starting, clear announcement
            announcementText.value = '';
        }
    }
);

/**
 * Clear announcement when Pokemon is dismissed
 */
watch(
    () => displayPokemon.value,
    (newPokemon) => {
        if (!newPokemon) {
            announcementText.value = '';
        }
    }
);
</script>

<template>
    <div
        class="pokemon-display"
        role="region"
        :aria-label="t('viewFinder.regionLabel')"
    >
        <!-- Announcement region for voice-over - always in DOM, content controlled by watchers -->
        <div
            class="pokemon-announcement"
            role="status"
            aria-live="assertive"
            aria-atomic="true"
        >
            {{ announcementText }}
        </div>

        <div
            v-if="displayPokemon"
            :class="['pokemon-container', { 'animate-out': isAnimatingOut }]"
            @keydown="handleSectionNavigation"
        >
            <PokemonImages :pokemon="displayPokemon" />

            <EncounterStats :stats="encounterStats" />
        </div>
        <div v-else class="no-pokemon">
            <p>{{ t('viewFinder.noPokedexMessage') }}</p>
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

/* Hidden announcement region for screen readers - keeps it in accessibility tree */
.pokemon-announcement {
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

@media (max-width: $breakpoint-md) {
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
