import { ref, watch } from 'vue';

export function usePokemonAnimation(pokemonRef, trainerStore, animationDuration = 400) {
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
        const isCaught = trainerStore.caughtPokemon.length > lastCaughtCount.value;
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
