<script setup>
import { usePokemonStore } from '@/stores/pokemonStore';
import { computed, ref, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTrainerStore } from '@/stores/trainerStore';

const pokemonStore = usePokemonStore();
const trainerStore = useTrainerStore();
const { t } = useI18n();
const displayedText = ref('');
const isTyping = ref(false);
const announcementText = ref(''); // Text to announce after typing completes
const focusedEventIndex = ref(null);
const eventLogRef = ref(null);
const eventItemsRef = ref([]);
let typeInterval = null;

const eventListText = computed(() => {
    if (pokemonStore.events.length === 0) {
        return t('eventLog.welcomeMessage', { name: trainerStore.trainerName });
    }
    return null;
});

/**
 * Scroll focused event into view
 */
const scrollIntoView = () => {
    if (focusedEventIndex.value !== null && eventItemsRef.value[focusedEventIndex.value]) {
        eventItemsRef.value[focusedEventIndex.value].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
};

/**
 * Handle event item click
 */
const handleEventClick = (index) => {
    focusedEventIndex.value = index;
};

// Watch for new events and trigger typewriter animation
watch(
    () => pokemonStore.events.length,
    () => {
        // Clear previous interval if it exists
        if (typeInterval) {
            clearInterval(typeInterval);
            typeInterval = null;
        }

        // Reset announcement
        announcementText.value = '';

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
                    // Only announce after typing completes
                    announcementText.value = latestMsg;
                    clearInterval(typeInterval);
                    typeInterval = null;
                }
            }, 50); // 50ms per character
        }
    }
);
</script>

<template>
    <section 
        ref="eventLogRef"
        class="event-log" 
        role="region" 
        :aria-label="t('eventLog.regionLabel') || 'Event Log'"
        :aria-live="focusedEventIndex !== null ? 'off' : 'polite'"
        tabindex="0"
    >
        <!-- Live region for screen reader announcements -->
        <div
            class="sr-only"
            role="status"
            aria-live="assertive"
            aria-atomic="true"
            :aria-label="focusedEventIndex !== null ? `Event ${focusedEventIndex + 1} of ${pokemonStore.events.length}` : ''"
        >
            {{ announcementText }}
        </div>

        <!-- Welcome message when no events -->
        <div v-if="eventListText" class="event-message" role="status">
            {{ eventListText }}
        </div>

        <!-- Events list -->
        <ul v-else class="events-list" role="list">
            <li
                v-for="(event, index) in pokemonStore.events"
                :key="event.id"
                :ref="el => { if (el) eventItemsRef[index] = el }"
                class="event-item"
                :class="{ 
                    'latest-event': index === 0,
                    'focused-event': focusedEventIndex === index
                }"
                role="option"
                :aria-selected="focusedEventIndex === index"
                :aria-label="`${event.message} at ${event.timestamp}`"
                tabindex="0"
                @click="handleEventClick(index)"
                @keydown.stop
            >
                <time class="event-time" :datetime="event.timestamp">
                    {{ event.timestamp }}
                </time>
                <div class="event-content">
                    <span v-if="index === 0" class="event-text typing" aria-live="off">
                        {{ displayedText }}<span v-if="isTyping" class="typing-cursor" aria-hidden="true">|</span>
                    </span>
                    <span v-else class="event-text">{{ event.message }}</span>
                </div>
            </li>
        </ul>
    </section>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

/* Screen reader only text */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}

.event-log {
    background-color: $pokemon-white;
    border: 2px solid $secondary;
    border-radius: $radius-md;
    padding: $spacing-lg;
    min-height: 120px;
    max-height: 300px;
    overflow-y: auto;
    box-shadow: $shadow-md;
    outline: 2px solid transparent;
    outline-offset: 2px;
    transition: outline 0.2s ease, box-shadow 0.2s ease;

    &:focus {
        outline: 2px solid $secondary;
    }

    &:focus-visible {
        outline: 3px solid $secondary;
        box-shadow: $shadow-md, 0 0 0 4px rgba($secondary, 0.15);
    }
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
    list-style: none;
    padding: 0;
    margin: 0;
}

.event-item {
    display: flex;
    gap: $spacing-md;
    padding: $spacing-sm $spacing-md;
    background-color: rgba($secondary, 0.05);
    border-radius: $radius-sm;
    border-left: 3px solid $secondary;
    cursor: pointer;
    transition: all $transition-fast;
    outline: 2px solid transparent;
    outline-offset: -2px;

    &:focus {
        outline: 2px solid $secondary;
        background-color: rgba($secondary, 0.15);
    }

    &:focus-visible {
        outline: 2px solid $secondary;
        background-color: rgba($secondary, 0.2);
        box-shadow: inset 0 0 0 2px rgba($secondary, 0.3);
    }

    &.focused-event {
        background-color: rgba($secondary, 0.15);
        outline: 2px solid $secondary;
        box-shadow: inset 0 0 0 2px rgba($secondary, 0.2);
    }

    &:hover {
        background-color: rgba($secondary, 0.1);
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
}

.event-time {
    font-size: $font-size-sm;
    color: $text-secondary;
    min-width: 80px;
    font-weight: 600;
    flex-shrink: 0;
}

.event-content {
    flex: 1;
}

.event-text {
    color: $text-primary;
    display: block;
    word-break: break-word;

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

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
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

@media (max-width: $breakpoint-md) {
    .event-log {
        max-height: 250px;
    }

    .event-item {
        flex-wrap: wrap;
    }

    .event-time {
        flex-basis: 100%;
    }
}
</style>
