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

/**
 * Fetches data from a POST endpoint
 * @param {string} endpoint - The API endpoint
 * @param {object} body - The request body data
 * @param {object} options - Additional options (headers, etc.)
 * @returns {Promise} - Promise that resolves with the API response data
 */
export const postRequest = async (endpoint, body, options = {}) => {
    try {
        const url = `${API_BASE_URL}${endpoint}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            body: JSON.stringify(body),
            ...options
        });

        if (!response.ok) {
            throw new Error(
                `API Error: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('POST request failed:', error);
        throw error;
    }
};

export default {
    getRequest,
    postRequest
};
