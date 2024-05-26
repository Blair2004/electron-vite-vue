<script setup>
import DashboardLayout from '@/layout/DashboardLayout.vue';
import HttpServerControl from "@/components/shared/HttpServerControl.vue";

</script>
<template>
    <DashboardLayout>
        <div class="w-full h-full flex-auto flex overflow-y-auto items-center justify-center">
            <div class="mx-auto w-3/4">
                <HttpServerControl></HttpServerControl>
            </div>
        </div>
    </DashboardLayout>    
</template>