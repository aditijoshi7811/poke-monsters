import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRandomPokemon } from '../useRandomPokemon';

describe('useRandomPokemon', () => {
    let mockPokemonStore;

    beforeEach(() => {
        mockPokemonStore = {
            selectedGeneration: 1,
            pokemonListByGeneration: {
                1: {
                    pokemon_species: [
                        { name: 'bulbasaur' },
                        { name: 'charmander' },
                        { name: 'squirtle' }
                    ]
                }
            },
            setCurrentPokemon: vi.fn().mockResolvedValue({ name: 'pikachu' })
        };
    });

    /**
     * Test: returns required properties
     */
    it('returns isLoading and fetchRandomPokemon', () => {
        const randomPokemon = useRandomPokemon(mockPokemonStore);

        expect(randomPokemon).toHaveProperty('isLoading');
        expect(randomPokemon).toHaveProperty('fetchRandomPokemon');
    });

    /**
     * Test: isLoading is false initially
     */
    it('has isLoading false by default', () => {
        const { isLoading } = useRandomPokemon(mockPokemonStore);
        expect(isLoading.value).toBe(false);
    });

    /**
     * Test: fetches random pokemon from generation
     */
    it('fetches random pokemon from generation', async () => {
        const { fetchRandomPokemon } = useRandomPokemon(mockPokemonStore);

        const pokemon = await fetchRandomPokemon(1);

        expect(mockPokemonStore.setCurrentPokemon).toHaveBeenCalled();
        expect(pokemon).toEqual({ name: 'pikachu' });
    });

    /**
     * Test: uses selectedGeneration when no generation provided
     */
    it('uses selectedGeneration when generation not provided', async () => {
        const { fetchRandomPokemon } = useRandomPokemon(mockPokemonStore);

        await fetchRandomPokemon();

        expect(mockPokemonStore.setCurrentPokemon).toHaveBeenCalled();
    });

    /**
     * Test: sets isLoading to true while fetching
     */
    it('sets isLoading to true while fetching', async () => {
        const { isLoading, fetchRandomPokemon } = useRandomPokemon(
            mockPokemonStore
        );

        const promise = fetchRandomPokemon(1);
        expect(isLoading.value).toBe(true);

        await promise;
        expect(isLoading.value).toBe(false);
    });

    /**
     * Test: throws error when generation data not loaded
     */
    it('throws error when generation data not loaded', async () => {
        const { fetchRandomPokemon } = useRandomPokemon(mockPokemonStore);

        await expect(fetchRandomPokemon(5)).rejects.toThrow(
            'Generation 5 data is not loaded'
        );
    });

    /**
     * Test: resets isLoading even when error occurs
     */
    it('resets isLoading to false on error', async () => {
        const { isLoading, fetchRandomPokemon } = useRandomPokemon(
            mockPokemonStore
        );

        try {
            await fetchRandomPokemon(5);
        } catch (err) {
            // Expected error
        }

        expect(isLoading.value).toBe(false);
    });
});
