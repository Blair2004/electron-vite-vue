<template>
    <Authentication v-if="! options.app_key"/>
    <Setup v-if="options.app_key"/>
</template>
<script setup lang="ts">
import Authentication from './CloudPrint/Authentication.vue';
import Setup from './CloudPrint/Setup.vue';

const options:any   = {
    // app_key: false,
    app_key: 'azdazd',
}
</script>