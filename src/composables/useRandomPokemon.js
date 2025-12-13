import { ref } from 'vue';

export function useRandomPokemon(pokemonStore) {
    const isLoading = ref(false);

    const fetchRandomPokemon = async (generation) => {
        isLoading.value = true;
        try {
            // Expect generation to be pre-fetched on start; do not fetch here
            const genId = generation || pokemonStore.selectedGeneration;
            const genData = pokemonStore.pokemonListByGeneration[genId];
            if (!genData)
                throw new Error(
                    `Generation ${genId} data is not loaded; fetch it before requesting a random Pokémon.`
                );

            const speciesList = genData.pokemon_species || [];
            if (speciesList.length === 0)
                throw new Error(`No pokemon in generation ${genId}`);

            const randomSpecies =
                speciesList[Math.floor(Math.random() * speciesList.length)];

            // Use the store helper to fetch and set full Pokemon
            const pokemon = await pokemonStore.setCurrentPokemon(
                randomSpecies.name
            );
            return pokemon;
        } catch (err) {
            console.error('useRandomPokemon error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    return { isLoading, fetchRandomPokemon };
}
