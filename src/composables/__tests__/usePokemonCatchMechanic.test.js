import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePokemonCatchMechanic } from '../usePokemonCatchMechanic';

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key, params) => `${key} ${params?.name || ''}`
    })
}));

describe('usePokemonCatchMechanic', () => {
    let mockTrainerStore;
    let mockPokemonStore;
    let mockEmit;

    beforeEach(() => {
        mockTrainerStore = {
            addCaughtPokemon: vi.fn()
        };
        mockPokemonStore = {
            currentPokemon: { name: 'pikachu', id: 25 },
            addEvent: vi.fn()
        };
        mockEmit = vi.fn();
    });

    /**
     * Test: returns required properties
     */
    it('returns failureCount, isLoading, throw, and reset', () => {
        const catchMechanic = usePokemonCatchMechanic(
            mockTrainerStore,
            mockPokemonStore,
            mockEmit
        );

        expect(catchMechanic).toHaveProperty('failureCount');
        expect(catchMechanic).toHaveProperty('isLoading');
        expect(catchMechanic).toHaveProperty('throw');
        expect(catchMechanic).toHaveProperty('reset');
    });

    /**
     * Test: failureCount starts at zero
     */
    it('has failureCount zero by default', () => {
        const { failureCount } = usePokemonCatchMechanic(
            mockTrainerStore,
            mockPokemonStore
        );

        expect(failureCount.value).toBe(0);
    });

    /**
     * Test: successful catch adds pokemon to trainer
     */
    it('adds pokemon to trainer on successful catch', async () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.5); // Success (< 2/3)

        const { throw: attemptThrow } = usePokemonCatchMechanic(
            mockTrainerStore,
            mockPokemonStore,
            mockEmit
        );

        await attemptThrow();

        expect(mockTrainerStore.addCaughtPokemon).toHaveBeenCalledWith({
            name: 'pikachu',
            id: 25
        });
    });

    /**
     * Test: successful catch emits event
     */
    it('emits catch-success event on success', async () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.5);

        const { throw: attemptThrow } = usePokemonCatchMechanic(
            mockTrainerStore,
            mockPokemonStore,
            mockEmit
        );

        await attemptThrow();

        expect(mockEmit).toHaveBeenCalledWith('catch-success', 'Pikachu');
    });

    /**
     * Test: successful catch clears current pokemon
     */
    it('clears current pokemon on successful catch', async () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.5);

        const { throw: attemptThrow } = usePokemonCatchMechanic(
            mockTrainerStore,
            mockPokemonStore
        );

        await attemptThrow();

        expect(mockPokemonStore.currentPokemon).toBeNull();
    });

    /**
     * Test: failed catch increments failure count
     */
    it('increments failureCount on failed catch', async () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.9); // Failure (> 2/3)

        const { failureCount, throw: attemptThrow } = usePokemonCatchMechanic(
            mockTrainerStore,
            mockPokemonStore
        );

        await attemptThrow();

        expect(failureCount.value).toBe(1);
    });

    /**
     * Test: pokemon runs away after 2 failures
     */
    it('pokemon runs away after 2 failures', async () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.9);

        const { throw: attemptThrow } = usePokemonCatchMechanic(
            mockTrainerStore,
            mockPokemonStore
        );

        await attemptThrow(); // First failure
        await attemptThrow(); // Second failure

        expect(mockPokemonStore.currentPokemon).toBeNull();
    });

    /**
     * Test: reset clears failure count
     */
    it('resets failure count when reset is called', () => {
        const { failureCount, reset } = usePokemonCatchMechanic(
            mockTrainerStore,
            mockPokemonStore
        );

        failureCount.value = 5;
        reset();

        expect(failureCount.value).toBe(0);
    });

    /**
     * Test: does nothing when no current pokemon
     */
    it('does nothing when current pokemon is null', async () => {
        mockPokemonStore.currentPokemon = null;

        const { throw: attemptThrow } = usePokemonCatchMechanic(
            mockTrainerStore,
            mockPokemonStore,
            mockEmit
        );

        await attemptThrow();

        expect(mockTrainerStore.addCaughtPokemon).not.toHaveBeenCalled();
        expect(mockEmit).not.toHaveBeenCalled();
    });
});
