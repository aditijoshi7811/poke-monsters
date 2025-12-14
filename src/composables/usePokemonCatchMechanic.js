import { ref } from 'vue';
import { capitalize } from './useStringUtils';
import { useI18n } from 'vue-i18n';

/**
 * Composable for managing the Pokémon catch mechanic.
 * @param {Object} trainerStore - The trainer store instance with necessary methods.
 * @param {Object} pokemonStore - The Pokémon store instance with necessary methods and data.
 * @param {Function} emitFn - Function to emit events (e.g., Vue's emit).
 * @return {Object} An object containing failureCount, isLoading, throw function, and reset function.
 */
export function usePokemonCatchMechanic(
    trainerStore,
    pokemonStore,
    emitFn = () => {}
) {
    const { t } = useI18n();
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
                    t('gameEvents.catchSuccess', {
                        name: capitalize(current.name)
                    })
                );
                emitFn('catch-success', capitalize(current.name));
                pokemonStore.currentPokemon = null;
                failureCount.value = 0;
            } else {
                // Failure
                failureCount.value++;
                pokemonStore.addEvent(
                    t('gameEvents.catchFailure', {
                        name: capitalize(current.name)
                    })
                );

                if (failureCount.value >= 2) {
                    pokemonStore.addEvent(
                        t('gameEvents.pokemonRanAway', {
                            name: capitalize(current.name)
                        })
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
