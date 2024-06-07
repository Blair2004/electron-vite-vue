<script setup lang="ts">
import DashboardLayout from '@/layout/DashboardLayout.vue';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import General from './Settings/General.vue';
import CloudPrint from './Settings/CloudPrint.vue';
import About from "./Settings/About.vue";
import { store } from '@/store';
import { State } from '@/interfaces/State';
import { Options } from '@/interfaces/Options';
import { Ref, onUnmounted, ref } from 'vue';
import { ExclamationTriangleIcon } from '@radix-icons/vue';
import Alert from '@/components/ui/alert/Alert.vue';
import AlertTitle from '@/components/ui/alert/AlertTitle.vue';
import AlertDescription from '@/components/ui/alert/AlertDescription.vue';

const options: Ref<Options> = ref({});

const subscription = store.select( ( state:State ) => state.options ).subscribe( ( storeOptions: Options ) => {
    options.value = storeOptions;
});

/**
 * Hooks
 * --------------------
 */
onUnmounted( () => {
    subscription.unsubscribe();
});
</script>
<template>
    <DashboardLayout>
        <div class="p-4">
            <h1 class="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-5xl">Settings</h1>
            <small>Configure how Nexo Print Server works.</small>
        </div>
        <div class="px-4 pb-4">
            <Alert v-if="options.app_status === 'demo'">
                <ExclamationTriangleIcon class="w-4 h-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                Some fields are disabled as they are only available in the full version of Nexo Print Server.
                </AlertDescription>
            </Alert>
            <br>
            <Tabs default-value="general">
                <TabsList>
                    <TabsTrigger value="general">
                        General
                    </TabsTrigger>
                    <TabsTrigger v-if="options.app_status === 'licensed'" value="cloud-print">
                        Cloud Print
                    </TabsTrigger>
                    <TabsTrigger value="about">
                        About
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="general" class="pt-4">
                    <General/>
                </TabsContent>
                <TabsContent value="cloud-print">
                    <CloudPrint/>
                </TabsContent>
                <TabsContent value="about">
                    <About/>
                </TabsContent>
            </Tabs>
        </div>
    </DashboardLayout>    
</template>