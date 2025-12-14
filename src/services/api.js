/**
 * API Service Configuration
 * Base configuration for all API requests using Fetch API
 */

const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'https://pokeapi.co/api/v2';

/**
 * Fetches data from a GET endpoint
 * @param {string} endpoint - The API endpoint (e.g., '/pokemon' or '/users/123')
 * @param {object} options - Additional options (headers, params, etc.)
 * @returns {Promise} - Promise that resolves with the API response data
 */
export const getRequest = async (endpoint, options = {}) => {
    try {
        const url = new URL(`${API_BASE_URL}${endpoint}`);

        // Add query parameters if provided
        if (options.params) {
            Object.entries(options.params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
        }

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        // Handle non-OK responses
        if (!response.ok) {
            throw new Error(
                `API Error: ${response.status} ${response.statusText}`
            );
        }

        // Parse and return JSON response
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('GET request failed:', error);
        throw error;
    }
};

export default {
    getRequest
};
