import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
    getPokemonListByGeneration,
    getPokemonById,
    getGenerations
} from '@/services/pokemonService';

export const usePokemonStore = defineStore('pokemon', () => {
    // Store Pokemon list by generation
    const pokemonListByGeneration = ref({});

    // Current Pokemon details
    const currentPokemon = ref(null);
    const isLoading = ref(false);
    const error = ref(null);

    // Selected generation
    const selectedGeneration = ref(1);
    // Generations list (from API /generation)
    const generations = ref([]);
    const isLoadingGenerations = ref(false);

    // Event log
    const events = ref([]);

    // Flag to track if Pokemon is being cleared for animation (Ignore/runaway) vs caught
    const shouldAnimateOut = ref(false);

    const setSelectedGeneration = (genId) => {
        localStorage.setItem('selectedGeneration', genId.toString());
    };
    /**
     * Fetch Pokemon list by generation
     * Returns from store if already loaded, otherwise fetches from API
     * @param {number} generationId - Generation ID (1, 2, 3, etc.)
     * @returns {Promise} - Pokemon list for that generation
     */
    const fetchPokemonListByGeneration = async (generationId) => {
        // If generationId not provided, try to get from localStorage
        let genId = generationId;
        if (!genId) {
            const savedGeneration = localStorage.getItem('selectedGeneration');
            genId = savedGeneration ? Number(savedGeneration) : 1;
        }

        // Return data if already in store
        if (pokemonListByGeneration.value[genId]) {
            return pokemonListByGeneration.value[genId];
        }

        try {
            isLoading.value = true;
            error.value = null;
            const data = await getPokemonListByGeneration(genId);

            // Store in Pinia store
            pokemonListByGeneration.value[genId] = data;
            return data;
        } catch (err) {
            error.value = err.message;
            console.error('Failed to fetch Pokemon generation:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Fetch the list of generations from the API and cache in store
     */
    const fetchGenerations = async () => {
        // Already loaded
        if (generations.value.length > 0) {
            return generations.value;
        }
        try {
            isLoadingGenerations.value = true;
            const data = await getGenerations();
            // Expect data.results to be an array of { name, url }
            generations.value = data.results || [];
            return generations.value;
        } catch (err) {
            console.error('Failed to fetch generations:', err);
            throw err;
        } finally {
            isLoadingGenerations.value = false;
        }
    };

    /**
     * Fetch and set current Pokemon
     * @param {string|number} pokemonId - Pokemon ID or name
     * @returns {Promise} - Pokemon details
     */
    const setCurrentPokemon = async (pokemonId) => {
        try {
            isLoading.value = true;
            error.value = null;
            const pokemon = await getPokemonById(pokemonId);
            currentPokemon.value = pokemon;
            return pokemon;
        } catch (err) {
            error.value = err.message;
            console.error('Failed to fetch Pokemon:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Get current Pokemon
     * @returns {object} - Current Pokemon data
     */
    const getCurrentPokemon = () => {
        return currentPokemon.value;
    };

    /**
     * Clear all store data
     */
    const clearStore = () => {
        pokemonListByGeneration.value = {};
        currentPokemon.value = null;
        events.value = [];
    };

    /**
     * Add event to log
     * @param {string} message - Event message
     */
    const addEvent = (message) => {
        events.value.unshift({
            id: Date.now(),
            message,
            timestamp: new Date().toLocaleTimeString()
        });
    };

    return {
        // State
        pokemonListByGeneration,
        generations,
        isLoadingGenerations,
        currentPokemon,
        isLoading,
        error,
        events,
        shouldAnimateOut,
        selectedGeneration,
        setSelectedGeneration,
        // Actions
        fetchPokemonListByGeneration,
        fetchGenerations,
        setCurrentPokemon,
        getCurrentPokemon,
        clearStore,
        addEvent
    };
});
