import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Global error state
const errorModalOpen = ref(false);
const errorMessage = ref('');

/**
 * Composable to manage global error modal state
 * @returns {Object} - Error modal state and functions
 */
export const useErrorModal = () => {
    const router = useRouter();

    /**
     * Shows the error modal with a message
     * @param {string} message - Error message to display
     */
    const showError = (message = '') => {
        errorMessage.value = message;
        errorModalOpen.value = true;
    };

    /**
     * Closes the error modal and navigates to home
     */
    const closeErrorAndGoHome = () => {
        errorModalOpen.value = false;
        errorMessage.value = '';
        router.push('/');
    };

    return {
        errorModalOpen,
        errorMessage,
        showError,
        closeErrorAndGoHome
    };
};
