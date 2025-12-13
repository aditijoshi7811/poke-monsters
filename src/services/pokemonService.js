/**
 * Pokemon Service
 * Handles all Pokemon-related API calls
 */

import { getRequest, postRequest } from './api.js';

// /**
//  * Fetches a list of all Pokemon
//  * @param {object} params - Query parameters (limit, offset, etc.)
//  * @returns {Promise} - Promise that resolves with Pokemon list
//  */
// export const getPokemonList = async (params = {}) => {
//     return getRequest('/pokemon', { params });
// };

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

// /**
//  * Fetches Pokemon by type
//  * @param {string} type - Pokemon type (fire, water, grass, etc.)
//  * @returns {Promise} - Promise that resolves with Pokemon of that type
//  */
// export const getPokemonByType = async (type) => {
//     return getRequest(`/type/${type}`);
// };

// /**
//  * Searches for Pokemon by name
//  * @param {string} query - Search query
//  * @returns {Promise} - Promise that resolves with search results
//  */
// export const searchPokemon = async (query) => {
//     return getRequest('/pokemon', { params: { q: query } });
// };

// /**
//  * Catches a Pokemon (posts to backend)
//  * @param {object} catchData - Data about the catch (pokemonId, trainerId, etc.)
//  * @returns {Promise} - Promise that resolves with catch result
//  */
// export const catchPokemon = async (catchData) => {
//     return postRequest('/catch', catchData);
// };

export default {
    // getPokemonList,
    getPokemonListByGeneration,
    getPokemonById,
    // getPokemonByType,
    // searchPokemon,
    // catchPokemon,
};
