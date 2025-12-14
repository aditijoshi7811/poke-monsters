import { ref } from 'vue';

/**
 * Composable for triggering and managing success animations.
 * @param {number} duration - Duration of the success animation in milliseconds.
 * @return {Object} An object containing showAnimation, animationData refs, and trigger function.
 */
export function useSuccessAnimation(duration = 1000) {
    const showAnimation = ref(false);
    const animationData = ref(null);

    const trigger = (data = null) => {
        animationData.value = data;
        showAnimation.value = true;
        setTimeout(() => (showAnimation.value = false), duration);
    };

    return { showAnimation, animationData, trigger };
}
