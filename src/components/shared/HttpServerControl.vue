<script setup lang="ts">
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayIcon } from '@radix-icons/vue';
</script>
<template>
    <Card>
        <CardHeader>
            <CardTitle>Start Server</CardTitle>
            <CardDescription>Create an HTTP server to expose Printers to NexoPOS</CardDescription>
        </CardHeader>
        <CardFooter>
            <Button class="w-full">
                <PlayIcon class="text-lg mr-2"/>
                Start Server
            </Button>
        </CardFooter>
    </Card>
</template>