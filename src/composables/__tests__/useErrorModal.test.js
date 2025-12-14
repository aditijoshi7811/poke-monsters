import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useErrorModal } from '../useErrorModal';

// Mock vue-router
vi.mock('vue-router', () => ({
    useRouter: () => ({
        push: vi.fn()
    })
}));

describe('useErrorModal', () => {
    /**
     * Test: returns required properties and methods
     */
    it('returns errorModalOpen, errorMessage, showError, and closeErrorAndGoHome', () => {
        const modal = useErrorModal();
        
        expect(modal).toHaveProperty('errorModalOpen');
        expect(modal).toHaveProperty('errorMessage');
        expect(modal).toHaveProperty('showError');
        expect(modal).toHaveProperty('closeErrorAndGoHome');
    });

    /**
     * Test: modal is closed by default
     */
    it('has modal closed by default', () => {
        const { errorModalOpen } = useErrorModal();
        expect(errorModalOpen.value).toBe(false);
    });

    /**
     * Test: showError opens modal with message
     */
    it('opens modal when showError is called', () => {
        const { errorModalOpen, errorMessage, showError } = useErrorModal();
        
        showError('Test error');
        expect(errorModalOpen.value).toBe(true);
        expect(errorMessage.value).toBe('Test error');
    });

    /**
     * Test: closeErrorAndGoHome closes modal
     */
    it('closes modal when closeErrorAndGoHome is called', () => {
        const { errorModalOpen, showError, closeErrorAndGoHome } = useErrorModal();
        
        showError('Test');
        closeErrorAndGoHome();
        expect(errorModalOpen.value).toBe(false);
    });

    /**
     * Test: closeErrorAndGoHome clears error message
     */
    it('clears error message when closing', () => {
        const { errorMessage, showError, closeErrorAndGoHome } = useErrorModal();
        
        showError('Error message');
        closeErrorAndGoHome();
        expect(errorMessage.value).toBe('');
    });
});
