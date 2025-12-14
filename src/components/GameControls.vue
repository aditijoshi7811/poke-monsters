<script setup>
import { usePokemonStore } from '@/stores/pokemonStore';
import { useTrainerStore } from '@/stores/trainerStore';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { capitalize } from '@/composables/useStringUtils';
import { usePokemonCatchMechanic } from '@/composables/usePokemonCatchMechanic';
import { useRandomPokemon } from '@/composables/useRandomPokemon';

const pokemonStore = usePokemonStore();
const trainerStore = useTrainerStore();
const { t } = useI18n();

const emit = defineEmits(['open-collection', 'catch-success', 'quit-game']);

// useRandomPokemon composable uses preloaded generation data; call it to select random pokemon
const { isLoading: fetchLoading, fetchRandomPokemon } =
    useRandomPokemon(pokemonStore);
const { throw: attemptThrow, reset: resetCatch } = usePokemonCatchMechanic(
    trainerStore,
    pokemonStore,
    (e, d) => emit(e, d)
);

const isFindingPokemon = ref(false);
const hasPokemon = computed(
    () => !!pokemonStore.currentPokemon && !fetchLoading.value
);

/**
 * Computes the number of unique Pokémon caught by the trainer.
 * @return {number} The count of unique Pokémon names in the trainer's caught list.
 */
const uniqueCount = computed(
    () => new Set(trainerStore.caughtPokemon.map((p) => p.name)).size
);

/**
 * Handles the "Find" button click event to encounter a random Pokémon.
 * Disables further finds if a Pokémon is already encountered.
 * Initiates the fetch and updates the event log accordingly.
 * Emits events for success or failure of the fetch operation.
 * @return {Promise<void>} A promise that resolves when the operation is complete.
 */
const handleFind = async () => {
    isFindingPokemon.value = true;
    if (hasPokemon.value) return;
    resetCatch();

    try {
        const pokemon = await fetchRandomPokemon(
            pokemonStore.selectedGeneration
        );
        if (pokemon)
            pokemonStore.addEvent(t('gameEvents.pokemonAppeared', { name: capitalize(pokemon.name) }));
        isFindingPokemon.value = false;
    } catch (err) {
        pokemonStore.addEvent(t('gameEvents.randomError'));
        isFindingPokemon.value = false;
    }
};

/**
 * Handles the "Ignore" button click event to dismiss the current encountered Pokémon.
 * Resets the current Pokémon in the store and the catch mechanic state.
 */
const handleIgnore = () => {
    if (!pokemonStore.currentPokemon) return;
    pokemonStore.currentPokemon = null;
    resetCatch();
};

/**
 * Handles the "Throw" button click event to attempt to catch the current encountered Pokémon.
 * Adds an event log entry for the throw action.
 * Invokes the catch mechanic to process the throw attempt.
 * @return {Promise<void>} A promise that resolves when the throw attempt is complete.
 */
const handleThrow = async () => {
    const currentPokemon = pokemonStore.currentPokemon;
    if (!currentPokemon) return;

    pokemonStore.addEvent(
        t('gameEvents.throwBall', { 
            trainerName: trainerStore.trainerName, 
            pokemonName: capitalize(currentPokemon.name) 
        })
    );
    await attemptThrow();
};

const showCollectionView = () => emit('open-collection');
const quitGame = () => emit('quit-game');
</script>

<template>
    <form id="form-controls" @submit.prevent>
        <fieldset>
            <legend>{{ t('controls.legend') }}</legend>
            <button
                type="button"
                name="btn-find"
                @click="handleFind"
                :disabled="hasPokemon"
                :aria-busy="fetchLoading"
                :aria-label="fetchLoading ? t('controls.findButtonLoading') : t('controls.findButton')"
            >
                Find
            </button>
            <button
                type="button"
                name="btn-ignore"
                @click="handleIgnore"
                :disabled="!hasPokemon"
                :aria-label="t('controls.ignoreButton')"
            >
                Ignore
            </button>
            <button
                type="button"
                name="btn-throw"
                @click="handleThrow"
                :disabled="!hasPokemon"
                :aria-label="t('controls.throwButton')"
            >
                Throw
            </button>

            <button
                type="button"
                name="btn-collection"
                @click.prevent="showCollectionView"
                :aria-label="t('controls.pokedexButton', { count: uniqueCount })"
            >
                Pokedex <span class="pokedex-badge" aria-hidden="true">{{ t('controls.pokedexBadge', { count: uniqueCount }) }}</span>
            </button>

            <button 
                type="button" 
                name="btn-quit" 
                @click.prevent="quitGame"
                :aria-label="t('controls.quitButton')"
            >
                Quit
            </button>
        </fieldset>
    </form>
</template>

<style scoped>
fieldset {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    flex-wrap: wrap;
}
</style>
