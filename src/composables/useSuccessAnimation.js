import { ref } from 'vue';

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
