/**
 * Pokemon Service
 * Handles all Pokemon-related API calls
 */

import { getRequest } from './api.js';

/**
 * Fetches Pokemon by generation ID
 * @param {string|number} generationId - Generation ID (1, 2, 3, etc.)
 * @returns {Promise} - Promise that resolves with Pokemon in that generation
 */
export const getPokemonListByGeneration = async (generationId) => {
    return getRequest(`/generation/${generationId}`);
};

/**
 * Fetches list of available generations
 * @returns {Promise} - Promise that resolves with the generations list
 */
export const getGenerations = async () => {
    return getRequest('/generation');
};

/**
 * Fetches details for a specific Pokemon by ID or name
 * @param {string|number} id - Pokemon ID or name
 * @returns {Promise} - Promise that resolves with Pokemon details
 */
export const getPokemonById = async (id) => {
    return getRequest(`/pokemon/${id}`);
};

export default {
    getPokemonListByGeneration,
    getPokemonById
};
