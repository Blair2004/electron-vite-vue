<template>
    {{ options }}
    <Demo v-if="options.app_status === 'demo'"/>
    <Licensed v-else-if="options.app_status === 'licensed'"/>
</template>
<script setup lang="ts">
import { State } from '@/interfaces/State';
import { store } from '@/store';
import { Ref, onUnmounted, ref } from 'vue';
import Demo from './About/Demo.vue';
import Licensed from './About/Licensed.vue';
import { Options } from '@/interfaces/Options';

const options: Ref<Options>   =   ref({});
const subscriber = store.observable.subscribe( (state: State ) => {
    console.log({ state })
    if ( state.type === 'store-options' ) {
        options.value = state.data;
        console.log({ options })
    }
});

/**
 * onUnmounted
 */
onUnmounted( () => {
    subscriber.unsubscribe();
    console.log({ subscriber })
});
</script>