<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { usePokemonStore } from '@/stores/pokemonStore';
import { useRouter } from 'vue-router';
import { useTrainerStore } from '@/stores/trainerStore';

const router = useRouter();
const trainerStore = useTrainerStore();
const pokemonStore = usePokemonStore();
const isTransitioning = ref(false);
const trainerName = ref('');
const inputTrainerName = ref('');
const hasInteracted = ref(false);
const inputRef = ref(null);

// Computed property to check if button should be disabled
const isButtonDisabled = computed(() => !trainerName.value.trim());

// Show error only if user has interacted and field is empty
const shouldShowError = computed(
    () => hasInteracted.value && isButtonDisabled.value
);

// Auto-focus input when component mounts
onMounted(() => {
    if (inputRef.value) {
        inputRef.value.focus();
    }
    // Fetch available generations for the dropdown
    pokemonStore.fetchGenerations().catch((err) => {
        alert('Failed to load Pokémon generations. Please try again.');
        console.error(err);
    });
});

const handleInputInteraction = () => {
    hasInteracted.value = true;
};

const selectRef = ref(null);

const handleSelectKeydown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Programmatically open the select by using showPicker() if available
        if (selectRef.value && selectRef.value.showPicker) {
            selectRef.value.showPicker();
        } else {
            // Fallback: simulate opening by setting size temporarily
            selectRef.value.size =
                selectRef.value.options.length > 5
                    ? 5
                    : selectRef.value.options.length;
        }
    }
};

// Computed generation options (use API data)
const generationOptions = computed(() => {
    return (pokemonStore.generations || [])
        .map((g) => {
            const parts = g.url ? g.url.split('/').filter(Boolean) : [];
            const id = parts.length ? Number(parts[parts.length - 1]) : null;
            return { value: id, label: `Generation ${id}` };
        })
        .filter((o) => o.value != null);
});

// When generations load, ensure selectedGeneration is set to a valid id (first generation) if not already valid
watch(
    () => pokemonStore.generations,
    (gens) => {
        if (Array.isArray(gens) && gens.length) {
            const parts = gens[0].url
                ? gens[0].url.split('/').filter(Boolean)
                : [];
            const firstId = parts.length
                ? Number(parts[parts.length - 1])
                : null;
            if (
                firstId &&
                (!pokemonStore.selectedGeneration ||
                    !generationOptions.value.some(
                        (o) => o.value === pokemonStore.selectedGeneration
                    ))
            ) {
                pokemonStore.selectedGeneration = firstId;
            }
        }
    },
    { immediate: true }
);

const submit = (e) => {
    e.preventDefault();
};

const startGame = async () => {
    // If name empty, show validation and don't start
    if (!trainerName.value || !trainerName.value.trim()) {
        hasInteracted.value = true;
        return;
    }

    // Save trainer name and generation to localStorage
    localStorage.setItem('trainerName', trainerName.value);
    localStorage.setItem(
        'selectedGeneration',
        pokemonStore.selectedGeneration.toString()
    );

    // Store the trainer name in the Pinia store
    trainerStore.setTrainerName(trainerName.value);

    // Store the generation name in the Pinia store
    pokemonStore.setSelectedGeneration(pokemonStore.selectedGeneration);

    // Store the trainer name to display after transition
    inputTrainerName.value = trainerName.value;
    isTransitioning.value = true;

    // Navigate after animation completes
    setTimeout(() => {
        router.push('/capture');
    }, 800);
};
</script>

<template>
    <main
        role="main"
        class="home-view"
        :class="{ 'is-transitioning': isTransitioning }"
    >
        <div class="container">
            <h1>
                Welcome {{ isTransitioning ? inputTrainerName : 'Trainer' }}
            </h1>

            <form id="form-registration" @submit.prevent="submit">
                <label for="trainer-name">Enter Your Trainer Name:</label>
                <input
                    ref="inputRef"
                    type="text"
                    name="trainer-name"
                    id="trainer-name"
                    placeholder="Your name"
                    required
                    aria-required="true"
                    aria-label="Trainer Name"
                    aria-describedby="name-error name-help"
                    v-model="trainerName"
                    @input="handleInputInteraction"
                />

                <label for="generation-select">Select Generation</label>
                <select
                    ref="selectRef"
                    v-model.number="pokemonStore.selectedGeneration"
                    name="generation-select"
                    id="generation-select"
                    aria-label="Select Pokemon generation"
                    @keydown="handleSelectKeydown"
                >
                    <option
                        v-for="g in generationOptions"
                        :key="g.value"
                        :value="g.value"
                    >
                        {{ g.label }}
                    </option>
                </select>

                <p
                    v-if="shouldShowError"
                    id="name-error"
                    class="error-message"
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                >
                    Please enter your trainer name to begin your adventure
                </p>

                <button
                    @click="startGame"
                    :disabled="isButtonDisabled"
                    aria-disabled="isButtonDisabled"
                    aria-label="Start your Pokémon adventure"
                >
                    Start Adventure
                </button>
            </form>
        </div>
    </main>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.home-view {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    width: 100%;
    background: linear-gradient(135deg, $pokemon-white 0%, #f0f0f0 100%);
    transition:
        justify-content $transition-slow,
        align-items $transition-slow;

    .container {
        text-align: center;
        max-width: 600px;
        padding: $spacing-xl;

        h1 {
            margin-bottom: $spacing-xl;
            color: $primary;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
            transition:
                transform $transition-slow,
                font-size $transition-slow,
                margin-bottom $transition-slow;
        }

        form {
            display: flex;
            flex-direction: column;
            gap: $spacing-lg;
            align-items: center;
            transition: opacity $transition-normal;

            label {
                font-size: $font-size-lg;
                font-weight: 600;
                color: $text-primary;
            }

            .loading-text {
                font-size: $font-size-sm;
                color: $text-secondary;
            }

            input {
                padding: $spacing-md $spacing-lg;
                font-size: $font-size-base;
                border-radius: $radius-md;
                border: 3px solid $secondary;
                min-width: 300px;
                background-color: white;
                transition:
                    border-color $transition-normal,
                    box-shadow $transition-normal,
                    background-color $transition-normal;

                &:hover {
                    border-color: $primary;
                    background-color: #f9f9f9;
                    box-shadow: 0 4px 8px rgba(59, 76, 218, 0.15);
                }

                select {
                    padding: $spacing-md $spacing-lg;
                    font-size: $font-size-base;
                    border-radius: $radius-md;
                    border: 1px solid $border-color;
                    min-width: 300px;
                    background-color: white;
                    transition:
                        border-color $transition-normal,
                        box-shadow $transition-normal;

                    &:hover {
                        border-color: $primary;
                    }

                    &:focus {
                        outline: none;
                        box-shadow: 0 0 0 3px rgba($primary, 0.15);
                        border-color: $primary;
                    }
                }

                &:focus {
                    outline: none;
                    border-color: $primary;
                    background-color: white;
                    box-shadow: 0 0 0 3px rgba(238, 21, 21, 0.2);
                }

                @media (max-width: $breakpoint-sm) {
                    min-width: 100%;
                    max-width: 100%;
                }
            }

            button {
                padding: $spacing-md $spacing-xl;
                font-size: $font-size-lg;
                font-weight: 700;
                background-color: $primary;
                color: white;
                border: none;
                border-radius: $radius-lg;
                cursor: pointer;
                min-width: 250px;
                text-transform: uppercase;
                letter-spacing: 1px;
                transition: all $transition-normal;
                box-shadow: $shadow-lg;

                &:hover:not(:disabled) {
                    background-color: $hover-primary;
                    transform: translateY(-3px);
                    box-shadow: 0 12px 20px rgba(238, 21, 21, 0.3);
                }

                &:active:not(:disabled) {
                    transform: translateY(-1px);
                }

                &:focus {
                    outline: $focus-outline;
                    outline-offset: $focus-outline-offset;
                }

                &:disabled {
                    background-color: $pokemon-gray;
                    cursor: not-allowed;
                    opacity: 0.6;
                    box-shadow: $shadow-sm;
                    transform: none;
                }
                &.is-loading::after {
                    content: '';
                    display: inline-block;
                    margin-left: $spacing-sm;
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top-color: rgba(255, 255, 255, 0.9);
                    animation: spin 1s linear infinite;
                }

                @media (max-width: $breakpoint-sm) {
                    min-width: 100%;
                    max-width: 100%;
                }
            }

            .error-message {
                font-size: $font-size-base;
                color: $primary;
                margin: -$spacing-md 0 $spacing-md 0;
                font-weight: 500;
                transition: opacity $transition-normal;

                span {
                    display: block;
                }
            }
        }
    }

    // Transition state when button is clicked
    &.is-transitioning {
        justify-content: center;
        align-items: flex-start;
        padding-top: $spacing-xl;

        .container {
            padding: 0 $spacing-xl;

            h1 {
                font-size: $font-size-2xl;
                margin-bottom: $spacing-md;
            }

            form {
                opacity: 0;
                pointer-events: none;
            }
        }
    }
}

// Accessibility: Respect user's motion preferences
@media (prefers-reduced-motion: reduce) {
    .home-view {
        transition: none;

        .container {
            h1 {
                transition: none;
            }

            form {
                transition: none;
            }
        }

        &.is-transitioning {
            .container {
                h1 {
                    font-size: $font-size-2xl;
                    margin-bottom: $spacing-md;
                }

                form {
                    opacity: 0;
                }
            }
        }
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
