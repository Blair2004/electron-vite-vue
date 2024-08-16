<script setup lang="ts">
import DashboardLayout from '@/layout/DashboardLayout.vue';
import { IpcRenderer } from 'electron';
import { Ref, onMounted, ref } from 'vue';

declare const ipcRenderer: IpcRenderer;
const printers:Ref<any[]> =  ref([]);

onMounted( async () => {
    printers.value =    await ipcRenderer.invoke( 'get-printers' );
    console.log({ printers });
})
</script>
<template>
    <DashboardLayout>
        <div class="p-4">
            <h1 class="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-5xl">Printers</h1>
            <small>Configure the printers and sync to the cloud.</small>
        </div>
        <div class="px-4">
            <!-- <Accordion type="single" class="w-full" collapsible :default-value="defaultValue">
                <AccordionItem v-for="item in accordionItems" :key="item.value" :value="item.value">
                <AccordionTrigger>{{ item.title }}</AccordionTrigger>
                <AccordionContent>
                    {{ item.content }}
                </AccordionContent>
                </AccordionItem>
            </Accordion> -->
        </div>
    </DashboardLayout>    
</template>