import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTrainerStore = defineStore('trainer', () => {
    const trainerName = ref('');
    const caughtPokemon = ref([]);

    // Set trainer name
    const setTrainerName = (name) => {
        trainerName.value = name;
        caughtPokemon.value = []; // Clear previous collection
        localStorage.setItem('trainerName', name);
        // Load this trainer's collection from localStorage
        const stored = localStorage.getItem(`caughtPokemon_${name}`);
        if (stored) {
            caughtPokemon.value = JSON.parse(stored);
        }
    };

    // Load trainer name from localStorage
    const loadTrainerName = () => {
        const storedName = localStorage.getItem('trainerName');
        if (storedName) {
            trainerName.value = storedName;
        }
    };

    // Add caught Pokemon to collection
    const addCaughtPokemon = (pokemon) => {
        caughtPokemon.value.push({
            id: pokemon.id,
            name: pokemon.name,
            image: pokemon.sprites?.front_default || '',
            types: pokemon.types?.map(t => ({ type: { name: t.type.name } })) || [],
            height: pokemon.height,
            weight: pokemon.weight,
            speed: pokemon.stats?.find(s => s.stat.name === 'speed')?.base_stat || 0,
            caughtAt: new Date().toISOString()
        });
    };

    // Load caught Pokemon from localStorage
    const loadCaughtPokemon = () => {
        const stored = localStorage.getItem(`caughtPokemon_${trainerName.value}`);
        if (stored) {
            caughtPokemon.value = JSON.parse(stored);
        }
    };

    // Save caught Pokemon to localStorage
    const saveCaughtPokemon = () => {
        localStorage.setItem(`caughtPokemon_${trainerName.value}`, JSON.stringify(caughtPokemon.value));
    };

    // Reset trainer data
    const clearStore = () => {
        trainerName.value = '';
        caughtPokemon.value = [];
    };

    return {
        trainerName,
        caughtPokemon,
        setTrainerName,
        loadTrainerName,
        addCaughtPokemon,
        loadCaughtPokemon,
        saveCaughtPokemon,
        clearStore
    };
});
