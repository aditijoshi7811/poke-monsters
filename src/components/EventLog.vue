<script setup>
import { usePokemonStore } from '@/stores/pokemonStore';
import { computed, ref, watch } from 'vue';
import { useTrainerStore } from '@/stores/trainerStore';

const pokemonStore = usePokemonStore();
const trainerStore = useTrainerStore();
const displayedText = ref('');
const isTyping = ref(false);
let typeInterval = null;

const eventListText = computed(() => {
    if (pokemonStore.events.length === 0) {
        return 'Happy hunting, ' + trainerStore.trainerName + '!';
    }
    return null;
});

// Watch for new events and trigger typewriter animation
watch(
    () => pokemonStore.events.length,
    () => {
        // Clear previous interval if it exists
        if (typeInterval) {
            clearInterval(typeInterval);
            typeInterval = null;
        }

        if (pokemonStore.events.length > 0) {
            const latestMsg = pokemonStore.events[0].message;
            displayedText.value = '';
            isTyping.value = true;

            let index = 0;

            typeInterval = setInterval(() => {
                if (index < latestMsg.length) {
                    displayedText.value += latestMsg[index];
                    index++;
                } else {
                    isTyping.value = false;
                    clearInterval(typeInterval);
                    typeInterval = null;
                }
            }, 50); // 50ms per character
        }
    }
);
</script>

<template>
    <div class="event-log" role="region" aria-label="Event log and game notifications">
        <div v-if="eventListText" class="event-message">
            {{ eventListText }}
        </div>
        <div v-else class="events-list">
            <div
                v-for="(event, index) in pokemonStore.events"
                :key="event.id"
                class="event-item"
                :class="{ 'latest-event': index === 0 }"
            >
                <span class="event-time">{{ event.timestamp }}</span>
                <span v-if="index === 0" class="event-text typing">
                    {{ displayedText
                    }}<span v-if="isTyping" class="typing-cursor">|</span>
                </span>
                <span v-else class="event-text">{{ event.message }}</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.event-log {
    background-color: $pokemon-white;
    border: 2px solid $secondary;
    border-radius: $radius-md;
    padding: $spacing-lg;
    min-height: 120px;
    max-height: 300px;
    overflow-y: auto;
    box-shadow: $shadow-md;
}

.event-message {
    text-align: center;
    color: $text-secondary;
    font-size: $font-size-lg;
    padding: $spacing-lg 0;
}

.events-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
}

.event-item {
    display: flex;
    gap: $spacing-md;
    padding: $spacing-sm $spacing-md;
    background-color: rgba($secondary, 0.05);
    border-radius: $radius-sm;
    border-left: 3px solid $secondary;
}

.event-time {
    font-size: $font-size-sm;
    color: $text-secondary;
    min-width: 80px;
    font-weight: 600;
}

.event-text {
    color: $text-primary;
    flex: 1;

    &.typing {
        font-family: 'Courier New', monospace;
        min-height: 1.2em;
    }
}

.typing-cursor {
    display: inline-block;
    width: 2px;
    background-color: $secondary;
    margin-left: 2px;
    animation: blink 0.7s infinite;
}

.latest-event {
    background-color: rgba($primary, 0.08);
    border-left-color: $primary;
}

@keyframes blink {
    0%,
    49% {
        opacity: 1;
    }
    50%,
    100% {
        opacity: 0;
    }
}

/* Scrollbar styling */
.event-log::-webkit-scrollbar {
    width: 6px;
}

.event-log::-webkit-scrollbar-track {
    background: rgba($secondary, 0.1);
    border-radius: $radius-sm;
}

.event-log::-webkit-scrollbar-thumb {
    background: $secondary;
    border-radius: $radius-sm;

    &:hover {
        background: darken($secondary, 10%);
    }
}
</style>
