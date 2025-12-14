<script setup>
import { useI18n } from 'vue-i18n';
import BaseConfirmationModal from './BaseConfirmationModal.vue';
import { useErrorModal } from '@/composables/useErrorModal';

const { t } = useI18n();
const { errorModalOpen, errorMessage, closeErrorAndGoHome } = useErrorModal();

/**
 * Handles the OK button click - closes modal and navigates to home
 */
const handleOk = () => {
    closeErrorAndGoHome();
};
</script>

<template>
    <BaseConfirmationModal
        :is-open="errorModalOpen"
        :title="t('modals.apiError.title')"
        :description="errorMessage || t('modals.apiError.defaultMessage')"
        :confirm-button-text="t('modals.apiError.okButton')"
        :cancel-button-text="''"
        :confirm-button-aria-label="t('modals.apiError.okButton')"
        @confirm="handleOk"
        @cancel="handleOk"
    />
</template>
