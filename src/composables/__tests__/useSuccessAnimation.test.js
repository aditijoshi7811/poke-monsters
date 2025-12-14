import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useSuccessAnimation } from '../useSuccessAnimation';

describe('useSuccessAnimation', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    /**
     * Test: returns required properties
     */
    it('returns showAnimation, animationData, and trigger', () => {
        const animation = useSuccessAnimation();
        expect(animation).toHaveProperty('showAnimation');
        expect(animation).toHaveProperty('animationData');
        expect(animation).toHaveProperty('trigger');
    });

    /**
     * Test: showAnimation is false initially
     */
    it('has showAnimation false by default', () => {
        const { showAnimation } = useSuccessAnimation();
        expect(showAnimation.value).toBe(false);
    });

    /**
     * Test: trigger sets showAnimation to true
     */
    it('sets showAnimation to true when triggered', () => {
        const { showAnimation, trigger } = useSuccessAnimation();
        trigger();
        expect(showAnimation.value).toBe(true);
    });

    /**
     * Test: trigger stores animation data
     */
    it('stores animation data when triggered', () => {
        const { animationData, trigger } = useSuccessAnimation();
        trigger('Pikachu');
        expect(animationData.value).toBe('Pikachu');
    });

    /**
     * Test: animation resets after duration
     */
    it('resets showAnimation after duration', () => {
        const { showAnimation, trigger } = useSuccessAnimation(1000);
        trigger();
        expect(showAnimation.value).toBe(true);
        
        vi.advanceTimersByTime(1000);
        expect(showAnimation.value).toBe(false);
    });
});
