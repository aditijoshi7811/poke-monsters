<script setup>
import { useTrainerStore } from '@/stores/trainerStore';
import { usePokemonStore } from '@/stores/pokemonStore';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { useSuccessAnimation } from '@/composables/useSuccessAnimation';
import GameControls from '@/components/GameControls.vue';
import ViewFinder from '@/components/ViewFinder.vue';
import EventLog from '@/components/EventLog.vue';
import CollectionModal from '@/components/CollectionModal.vue';
import QuitConfirmationModal from '@/components/QuitConfirmationModal.vue';
import { onMounted } from 'vue';

const trainerStore = useTrainerStore();
const pokemonStore = usePokemonStore();
const router = useRouter();
const { t } = useI18n();
const isCollectionModalOpen = ref(false);
const showQuitConfirmation = ref(false);

// Load trainer data from localStorage in case user refreshes the page
onMounted(async () => {
    trainerStore.loadTrainerName();
    trainerStore.loadCaughtPokemon();

    // Restore selectedGeneration from localStorage
    const savedGeneration = localStorage.getItem('selectedGeneration');
    if (savedGeneration) {
        pokemonStore.selectedGeneration = Number(savedGeneration);
    }

    // Ensure the generation's pokemon list is preloaded when the user starts the game
    try {
        await pokemonStore.fetchPokemonListByGeneration(
            pokemonStore.selectedGeneration
        );
    } catch (err) {
        // show error in store so user can see it in event log
        alert(t('gameEvents.generationLoadError'));
        return;
    }
});

const {
    showAnimation: showCatchSuccess,
    animationData: caughtPokemonName,
    trigger: triggerSuccess
} = useSuccessAnimation(1000);

/**
 * Opens the collection modal by setting the corresponding state to true.
 * @return {void}
 */
const openCollectionModal = () => {
    isCollectionModalOpen.value = true;
};
/**
 * Closes the collection modal by setting the corresponding state to false.
 * @return {void}
 */
const closeCollectionModal = () => {
    isCollectionModalOpen.value = false;
};
/**
 * Handles the successful catch of a Pokémon.
 * Triggers the success animation with the caught Pokémon's name.
 * @param {string} pokemonName - The name of the caught Pokémon.
 * @return {void}
 */
const handleCatchSuccess = (pokemonName) => {
    triggerSuccess(pokemonName);
};

/**
 * Handles the quit game action by displaying the quit confirmation modal.
 * @return {void}
 */
const handleQuitClick = () => {
    showQuitConfirmation.value = true;
};

/**
 * Confirms the quit action, saves the trainer's caught Pokémon,
 * clears the stores, and navigates back to the title screen.
 * @return {void}
 */
const confirmQuit = () => {
    trainerStore.saveCaughtPokemon();
    trainerStore.clearStore();
    pokemonStore.clearStore();
    showQuitConfirmation.value = false;
    router.push('/');
};

/**
 * Cancels the quit action by hiding the quit confirmation modal.
 * @return {void}
 */
const cancelQuit = () => {
    showQuitConfirmation.value = false;
};
</script>

<template>
    <main class="capture-view">
        <header class="capture-header">
            <h1>
                {{
                    t('capture.headerTitle', { name: trainerStore.trainerName })
                }}
            </h1>
        </header>

        <section class="capture-content">
            <GameControls
                @open-collection="openCollectionModal"
                @catch-success="handleCatchSuccess"
                @quit-game="handleQuitClick"
            />
            <ViewFinder />
            <EventLog />
        </section>

        <!-- Success Animation -->
        <div v-if="showCatchSuccess" class="catch-success-overlay">
            <div class="catch-success-animation">
                <div class="success-icon">✨</div>
                <div class="success-text">
                    {{
                        t('capture.caughtMessage', { name: caughtPokemonName })
                    }}
                </div>
                <div class="success-sparkles">
                    <span class="sparkle"></span>
                    <span class="sparkle"></span>
                    <span class="sparkle"></span>
                </div>
            </div>
        </div>

        <!-- Quit Confirmation Modal -->
        <QuitConfirmationModal
            :is-open="showQuitConfirmation"
            @confirm="confirmQuit"
            @cancel="cancelQuit"
        />

        <CollectionModal
            :is-open="isCollectionModalOpen"
            @close="closeCollectionModal"
        />
    </main>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.capture-view {
    min-height: 100vh;
    background-color: $background;

    .capture-header {
        background: linear-gradient(135deg, $pokemon-white 0%, #f0f0f0 100%);
        border-bottom: 3px solid $primary;
        box-shadow: $shadow-md;
        h1 {
            font-size: $font-size-2xl;
            margin-bottom: -1rem;
            color: $primary;
            padding: 2rem;
            text-align: center;
        }
    }

    .capture-content {
        display: flex;
        flex-direction: column;
        gap: $spacing-md;
        max-width: 1200px;
        margin: 0 auto;
    }
}

/* Mobile responsive */
@media (max-width: 768px) {
    .capture-content {
        margin: $spacing-md !important;
    }
}

.catch-success-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 2000;
    animation: fadeIn 0.3s ease-in;
}

.catch-success-animation {
    background: linear-gradient(
        135deg,
        $secondary 0%,
        darken($secondary, 10%) 100%
    );
    color: $pokemon-white;
    padding: $spacing-2xl;
    border-radius: $radius-lg;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.success-icon {
    font-size: 80px;
    margin-bottom: $spacing-lg;
    animation: spin 0.8s ease-in-out;
}

.success-text {
    font-size: $font-size-2xl;
    font-weight: 700;
    margin-bottom: $spacing-xl;
    text-transform: capitalize;
    animation: slideDown 0.5s ease-out 0.2s both;
}

.success-sparkles {
    display: flex;
    justify-content: center;
    gap: $spacing-lg;
}

.sparkle {
    display: inline-block;
    width: 12px;
    height: 12px;
    background-color: $pokemon-white;
    border-radius: 50%;
    animation: twinkle 1s ease-in-out infinite;

    &:nth-child(1) {
        animation-delay: 0s;
    }

    &:nth-child(2) {
        animation-delay: 0.2s;
    }

    &:nth-child(3) {
        animation-delay: 0.4s;
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

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes twinkle {
    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.3;
        transform: scale(0.5);
    }
}

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

.quit-modal {
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
</style>
