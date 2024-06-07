<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Button from '@/components/ui/button/Button.vue';
import { Options } from '@/interfaces/Options';
import { store } from '@/store';
import { Ref, onUnmounted, ref } from 'vue';

const options: Ref<Options> = ref({});
const subscription = store.select((state: any) => state.options).subscribe((storeOptions: Options) => {
    options.value = storeOptions;
});

/**
 * Hooks
 * ----------------
 */
onUnmounted( () => {
    subscription.unsubscribe();
});
</script>
<template>
    <div class="flex flex-col flex-auto h-full">
        <div class="h-10 flex-shrink-0 bg-blue-500 flex justify-center items-center" v-if="options.app_status === 'demo'">
            <div class="flex justify-center items-center -mx-2">
                <div class="px-2 font-bold text-sm text-white">
                    You're using the Demo version of Nexo Print Server.
                </div>
                <div class="px-2">
                    <Button class="text-xs h-6">Upgrade Now</Button>
                </div>
            </div>
        </div>
        <div class="flex flex-auto overflow-hidden">
            <div id="aside" class="w-48 overflow-y-auto bg-card flex-shrink-0">
                <div class="w-full flex items-center justify-center">
                    <img src="@/assets/images/logo.png" alt="Nexo Print Server" class="p-10">
                </div>
                <div class="flex flex-col ml-2">
                    <router-link class="py-1 px-2 flex-auto inline-block border-l-2 border-blue-200 hover:border-blue-800 cursor-pointer" to="/dashboard">Dashboard</router-link>
                    <router-link class="py-1 px-2 flex-auto inline-block border-l-2 border-blue-200 hover:border-blue-800 cursor-pointer" to="/dashboard/printers">Printers</router-link>
                    <router-link class="py-1 px-2 flex-auto inline-block border-l-2 border-blue-200 hover:border-blue-800 cursor-pointer" to="/dashboard/settings">Settings</router-link>
                </div>
            </div>
            <div id="main" class="flex-auto overflow-y-auto">
                <div class="p-2 h-16 -mb-16 flex justify-between">
                    <div id="layout-controls"></div>
                    <div id="avatar-section">
                        <div class="rounded-full border">
                            <Avatar>
                                <AvatarImage src="https://github.com/radix-vue.png" alt="@radix-vue" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </div>
                <div class="pt-16">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>