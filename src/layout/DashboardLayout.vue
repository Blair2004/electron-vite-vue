<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
</script>
<template>
    <div class="flex flex-auto h-full">
        <div id="aside" class="w-48 overflow-y-auto bg-card flex-shrink-0">
            <div class="w-full h-32 flex items-center justify-center">
                LOGO
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
</template>