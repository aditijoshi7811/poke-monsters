<script setup>
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';
import '@/styles/global.scss';



</script>

<template>
    <RouterView />
</template>

<style scoped lang="scss">
@import '@/styles/variables.scss';

:deep(main) {
    min-height: 100vh;
    background-color: $background;
}
</style>
