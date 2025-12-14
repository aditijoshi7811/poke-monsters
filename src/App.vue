<script setup>
import { RouterView } from 'vue-router';
import { useI18n } from 'vue-i18n';
import '@/styles/global.scss';

const { t } = useI18n();
</script>

<template>
    <RouterView />
</template>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.skip-to-main {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
    background: $primary;
    color: white;
    padding: $spacing-md;
    z-index: 100;
    text-decoration: none;
    font-weight: 600;
    border-radius: $radius-md;

    /* Show on focus or for screen readers */
    &:focus,
    &:focus-visible {
        position: absolute;
        width: auto;
        height: auto;
        padding: $spacing-md;
        margin: 0;
        overflow: visible;
        clip: auto;
        white-space: normal;
        top: $spacing-md;
        left: $spacing-md;
        outline: $focus-outline;
        outline-offset: $focus-outline-offset;
    }
}

:deep(main) {
    min-height: 100vh;
    background-color: $background;
}
</style>
