<script setup>
import { useI18n } from 'vue-i18n';
import { useModalEscapeKey } from '@/composables/useModalEscapeKey';

const { t } = useI18n();

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    confirmButtonText: {
        type: String,
        required: true
    },
    cancelButtonText: {
        type: String,
        required: true
    },
    confirmButtonAriaLabel: {
        type: String,
        default: ''
    },
    cancelButtonAriaLabel: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['confirm', 'cancel']);

/**
 * Handles the confirmation action.
 * Emits the 'confirm' event to the parent component.
 */
const handleConfirm = () => {
    emit('confirm');
};

/**
 * Handles the cancellation action.
 * Emits the 'cancel' event to the parent component.
 */
const handleCancel = () => {
    emit('cancel');
};

// Use composable for Escape key modal functionality
useModalEscapeKey(() => props.isOpen, handleCancel, '.confirmation-modal');
</script>

<template>
    <div v-if="isOpen" class="modal-overlay" @click="handleCancel">
        <div class="confirmation-modal" @click.stop tabindex="-1">
            <h2>{{ title }}</h2>
            <p>{{ description }}</p>
            <div class="modal-actions">
                <button
                    class="btn-yes"
                    @click="handleConfirm"
                    :aria-label="confirmButtonAriaLabel || confirmButtonText"
                >
                    {{ confirmButtonText }}
                </button>
                <button
                    class="btn-no"
                    @click="handleCancel"
                    :aria-label="cancelButtonAriaLabel || cancelButtonText"
                >
                    {{ cancelButtonText }}
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    animation: fadeIn 0.3s ease-in;
}

.confirmation-modal {
    background: linear-gradient(135deg, $pokemon-white 0%, #f0f0f0 100%);
    border-radius: $radius-lg;
    padding: $spacing-2xl;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 400px;
    text-align: center;
    animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);

    h2 {
        color: $primary;
        font-size: $font-size-2xl;
        margin-bottom: $spacing-md;
        margin-top: 0;
    }

    p {
        color: $text-primary;
        font-size: $font-size-md;
        margin-bottom: $spacing-2xl;
        line-height: 1.5;
    }
}

.modal-actions {
    display: flex;
    gap: $spacing-md;
    justify-content: center;

    button {
        padding: $spacing-md $spacing-lg;
        border: none;
        border-radius: $radius-md;
        font-weight: 600;
        font-size: $font-size-md;
        cursor: pointer;
        transition: all $transition-normal;
        flex: 1;

        &:focus {
            outline: $focus-outline;
            outline-offset: $focus-outline-offset;
        }
    }

    .btn-yes {
        background-color: $primary;
        color: $pokemon-white;

        &:hover {
            background-color: darken($primary, 10%);
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
        }
    }

    .btn-no {
        background-color: $secondary;
        color: $pokemon-white;

        &:hover {
            background-color: darken($secondary, 10%);
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
        }
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes popIn {
    0% {
        transform: scale(0.5) translateY(20px);
        opacity: 0;
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1) translateY(0);
        opacity: 1;
    }
}

@media (max-width: 768px) {
    .confirmation-modal {
        max-width: 90%;
        padding: $spacing-lg;
    }

    .modal-actions {
        flex-direction: column;
    }
}
</style>
