<script setup>
import { usePokemonStore } from '@/stores/pokemonStore';
import { useTrainerStore } from '@/stores/trainerStore';
import { computed, ref } from 'vue';
import { capitalize } from '@/composables/useStringUtils';
import { usePokemonCatchMechanic } from '@/composables/usePokemonCatchMechanic';
import { useRandomPokemon } from '@/composables/useRandomPokemon';

const pokemonStore = usePokemonStore();
const trainerStore = useTrainerStore();

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
// Unique Pokemon count and total captures for the trainer
const uniqueCount = computed(
    () => new Set(trainerStore.caughtPokemon.map((p) => p.name)).size
);

const handleFind = async () => {
    isFindingPokemon.value = true;
    if (hasPokemon.value) return;
    // reset failures for a new encounter
    resetCatch();

    try {
        // If generation data is missing, fetch it first
        const genId = pokemonStore.selectedGeneration;
        if (!pokemonStore.pokemonListByGeneration[genId]) {
            await pokemonStore.fetchPokemonListByGeneration(genId);
        }

        const pokemon = await fetchRandomPokemon(
            pokemonStore.selectedGeneration
        );
        if (pokemon)
            pokemonStore.addEvent(`${capitalize(pokemon.name)} appeared!`);
        isFindingPokemon.value = false;
    } catch (err) {
        pokemonStore.addEvent('Error finding Pokemon. Try again!');
        isFindingPokemon.value = false;
    }
};

const handleIgnore = () => {
    if (!pokemonStore.currentPokemon) return;
    pokemonStore.currentPokemon = null;
    resetCatch();
};

const handleThrow = async () => {
    const currentPokemon = pokemonStore.currentPokemon;
    if (!currentPokemon) return;

    pokemonStore.addEvent(
        `${trainerStore.trainerName} throws ball at ${capitalize(currentPokemon.name)}!`
    );
    await attemptThrow();
};

const showCollectionView = () => emit('open-collection');
const quitGame = () => emit('quit-game');
</script>

<template>
    <form id="form-controls" @submit.prevent>
        <fieldset>
            <legend>Controls</legend>

            <!-- Generation selection moved to HomeView -->

            <button
                type="button"
                name="btn-find"
                @click="handleFind"
                :disabled="hasPokemon"
            >
                Find
            </button>
            <button
                type="button"
                name="btn-ignore"
                @click="handleIgnore"
                :disabled="!hasPokemon"
            >
                Ignore
            </button>
            <button
                type="button"
                name="btn-throw"
                @click="handleThrow"
                :disabled="!hasPokemon"
            >
                Throw
            </button>

            <button
                type="button"
                name="btn-collection"
                @click.prevent="showCollectionView"
                aria-label="Open Pokédex"
            >
                Pokedex <span class="pokedex-badge">({{ uniqueCount }})</span>
            </button>

            <button type="button" name="btn-quit" @click.prevent="quitGame">
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
