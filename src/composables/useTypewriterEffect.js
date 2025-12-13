import { ref, watch, onUnmounted } from 'vue';

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

  watch(() => sourceRef.value, (newVal) => {
    if (newVal) startTyping(newVal);
  });

  onUnmounted(() => stop());

  return { displayedText, isTyping, startTyping, stop };
}
