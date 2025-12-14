import { describe, it, expect } from 'vitest';
import { capitalize, useStringUtils } from '../useStringUtils';

describe('useStringUtils', () => {
    /**
     * Test: capitalize function should capitalize first letter
     */
    it('capitalizes first letter of string', () => {
        expect(capitalize('pikachu')).toBe('Pikachu');
    });

    /**
     * Test: capitalize function should handle empty strings
     */
    it('returns empty string when input is empty', () => {
        expect(capitalize('')).toBe('');
    });

    /**
     * Test: capitalize function should handle null/undefined
     */
    it('returns empty string when input is null or undefined', () => {
        expect(capitalize(null)).toBe('');
        expect(capitalize(undefined)).toBe('');
    });

    /**
     * Test: useStringUtils hook returns capitalize function
     */
    it('returns capitalize function from hook', () => {
        const { capitalize: cap } = useStringUtils();
        expect(cap('charizard')).toBe('Charizard');
    });
});
