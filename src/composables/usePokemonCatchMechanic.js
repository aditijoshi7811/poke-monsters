import { ref } from 'vue';
import { capitalize } from './useStringUtils';

/**
 * Handles the catch mechanic: success chance + failure/runaway logic.
 * Uses the stores directly so it stays simple to use from components.
 */
export function usePokemonCatchMechanic(
    trainerStore,
    pokemonStore,
    emitFn = () => {}
) {
    const failureCount = ref(0);
    const isLoading = ref(false);
    const successRate = 2 / 3; // 66.67%

    const attemptThrow = async () => {
        if (!pokemonStore.currentPokemon) return;
        isLoading.value = true;
        try {
            const random = Math.random();
            const current = pokemonStore.currentPokemon;

            if (random < successRate) {
                // Success
                trainerStore.addCaughtPokemon(current);
                pokemonStore.addEvent(
                    `Success! ${capitalize(current.name)} was caught!`
                );
                emitFn('catch-success', capitalize(current.name));
                pokemonStore.currentPokemon = null;
                failureCount.value = 0;
            } else {
                // Failure
                failureCount.value++;
                pokemonStore.addEvent(
                    ` Failed to catch ${capitalize(current.name)}.You can try again!`
                );

                if (failureCount.value >= 2) {
                    pokemonStore.addEvent(
                        `${capitalize(current.name)} ran away!`
                    );
                    pokemonStore.currentPokemon = null;
                    failureCount.value = 0;
                }
            }
        } catch (err) {
            console.error('usePokemonCatchMechanic attemptThrow error:', err);
        } finally {
            isLoading.value = false;
        }
    };

    const reset = () => {
        failureCount.value = 0;
    };

    return { failureCount, isLoading, throw: attemptThrow, reset };
}
