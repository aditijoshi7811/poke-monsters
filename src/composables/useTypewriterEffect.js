import { ref, watch, onUnmounted } from 'vue';

/**
 * Composable for creating a typewriter effect on text content.
 * @param {Ref<String>} sourceRef - A ref containing the source text to be displayed with typewriter effect.
 * @param {number} speed - Speed of typing in milliseconds per character.
 * @return {Object} An object containing displayedText, isTyping refs, and startTyping and stop functions.
 */
export function useTypewriterEffect(sourceRef, speed = 50) {
    const displayedText = ref('');
    const isTyping = ref(false);
    let intervalId = null;

    const startTyping = (content) => {
        if (intervalId) clearInterval(intervalId);
        displayedText.value = '';
        isTyping.value = true;
        let i = 0;
        intervalId = setInterval(() => {
            if (i < content.length) {
                displayedText.value += content[i];
                i += 1;
            } else {
                isTyping.value = false;
                clearInterval(intervalId);
                intervalId = null;
            }
        }, speed);
    };

    const stop = () => {
        if (intervalId) clearInterval(intervalId);
        isTyping.value = false;
        intervalId = null;
    };

    watch(
        () => sourceRef.value,
        (newVal) => {
            if (newVal) startTyping(newVal);
        }
    );

    onUnmounted(() => stop());

    return { displayedText, isTyping, startTyping, stop };
}
