<script setup lang="ts">
import DashboardLayout from '@/layout/DashboardLayout.vue';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import General from './Settings/General.vue';
import CloudPrint from './Settings/CloudPrint.vue';


</script>
<template>
    <DashboardLayout>
        <div class="p-4">
            <h1 class="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-5xl">Settings</h1>
            <small>Configure how Nexo Print Server works.</small>
        </div>
        <div class="p-4">
            <Tabs default-value="general">
                <TabsList>
                    <TabsTrigger value="general">
                        General
                    </TabsTrigger>
                    <TabsTrigger value="cloud-print">
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
                    Change your password here.
                </TabsContent>
            </Tabs>
        </div>
    </DashboardLayout>    
</template>