<script setup>
import { useI18n } from 'vue-i18n';
import BaseConfirmationModal from './global/BaseConfirmationModal.vue';

const { t } = useI18n();

defineProps({
    isOpen: {
        type: Boolean,
        required: true
    }
});

const emit = defineEmits(['confirm', 'cancel']);

/**
 * Handles the confirmation action to quit the game.
 * Emits the 'confirm' event to the parent component.
 */
const handleConfirm = () => {
    emit('confirm');
};

/**
 * Handles the cancellation action to dismiss the quit confirmation modal.
 * Emits the 'cancel' event to the parent component.
 */
const handleCancel = () => {
    emit('cancel');
};
</script>

<template>
    <BaseConfirmationModal
        :is-open="isOpen"
        :title="t('modals.quitConfirmation.title')"
        :description="t('modals.quitConfirmation.description')"
        :confirm-button-text="t('modals.quitConfirmation.confirmButtonText')"
        :cancel-button-text="t('modals.quitConfirmation.cancelButtonText')"
        :confirm-button-aria-label="t('modals.quitConfirmation.confirmButton')"
        :cancel-button-aria-label="t('modals.quitConfirmation.cancelButton')"
        @confirm="handleConfirm"
        @cancel="handleCancel"
    />
</template>
