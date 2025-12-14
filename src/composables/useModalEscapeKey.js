import { watch, onUnmounted } from 'vue';

/**
 * Composable for handling Escape key functionality in modals.
 * Manages focus and keyboard listeners when modal opens/closes.
 *
 * @param {Ref<boolean>} isOpenRef - Reactive reference to modal open state
 * @param {Function} onClose - Callback function to execute when Escape is pressed
 * @param {string} modalSelector - CSS selector for the modal element to focus (default: '.modal-content')
 *
 * @example
 * const { } = useModalEscapeKey(isOpen, handleClose, '.quit-modal');
 */
export const useModalEscapeKey = (
    isOpenRef,
    onClose,
    modalSelector = '.modal-content'
) => {
    /**
     * Handles Escape key press at document level.
     * @param {KeyboardEvent} e - The keyboard event.
     */
    const handleDocumentKeyDown = (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
        }
    };

    /**
     * Manage focus and keyboard listeners when modal opens/closes.
     */
    watch(isOpenRef, (isOpen) => {
        if (isOpen) {
            // Add escape key listener
            document.addEventListener('keydown', handleDocumentKeyDown);
            // Move focus to modal content
            setTimeout(() => {
                const modalContent = document.querySelector(modalSelector);
                if (modalContent) {
                    modalContent.focus();
                }
            }, 0);
        } else {
            document.removeEventListener('keydown', handleDocumentKeyDown);
        }
    });

    // Cleanup on component unmount
    onUnmounted(() => {
        document.removeEventListener('keydown', handleDocumentKeyDown);
    });
};
