import { ref, watch } from 'vue';

/**
 * Composable for handling Pokémon animation transitions.
 * @param {Ref<Object|null>} pokemonRef - A ref containing the current Pokémon object or null.
 * @param {Object} trainerStore - The trainer store containing caught Pokémon data.
 * @param {number} animationDuration - Duration of the animation in milliseconds.
 * @return {Object} An object containing isAnimatingOut and displayPokemon refs.
 */
export function usePokemonAnimation(
    pokemonRef,
    trainerStore,
    animationDuration = 400
) {
    const isAnimatingOut = ref(false);
    const displayPokemon = ref(null);
    const lastCaughtCount = ref(0);

    const clearDisplay = () => {
        displayPokemon.value = null;
        isAnimatingOut.value = false;
    };

    watch(
        () => pokemonRef.value,
        (newPokemon, oldPokemon) => {
            if (newPokemon) {
                isAnimatingOut.value = false;
                displayPokemon.value = newPokemon;
                lastCaughtCount.value = trainerStore.caughtPokemon.length;
            } else if (oldPokemon) {
                const isCaught =
                    trainerStore.caughtPokemon.length > lastCaughtCount.value;
                if (isCaught) clearDisplay();
                else {
                    isAnimatingOut.value = true;
                    setTimeout(clearDisplay, animationDuration);
                }
            }
        }
    );

    return { isAnimatingOut, displayPokemon };
}
