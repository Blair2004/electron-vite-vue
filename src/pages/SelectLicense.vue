<script setup>
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { ReloadIcon } from "@radix-icons/vue";

import { Input } from '@/components/ui/input';
import { useRouter } from 'vue-router';

const router    =   useRouter();

function assignLicense() {
    return router.push( '/dashboard' );
}

function enableDemo() {
    return router.push( '/dashboard' );
}

</script>
<template>
    <div class="w-full p-4 flex flex-col items-center bg-background">
        <div class="mx-auto w-56 flex items-center justify-center">
            <div class="h-32">LOGO</div>
        </div>
        <Card class="w-full md:w-2/3">
            <CardHeader>
                <CardTitle>Activate Your License</CardTitle>
                <CardDescription>assign a valid license to this installation.</CardDescription>
            </CardHeader>
            <CardContent>
                <div class="text-sm text-justify">
                    Now that we're able to connect to your account, you need to assign the license that you want to use with Nexo Print Server.
                </div>
                <br>
                <div class="text-sm text-justify">
                    Alternatively, you can start using a limited version of Nexo Print Server right away. Note that you can upgrade later from the settings.
                </div>
                <br>
                <div>
                    <div class="mb-2">
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a fruit" />
                                </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Fruits</SelectLabel>
                                    <SelectItem value="apple">
                                    Apple
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <br>
                        <Button @click="assignLicense()" class="mr-2">
                            Select License
                        </Button>
                        <Button @click="enableDemo()" class="mr-2">
                            Use Free Version
                        </Button>                        
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</template>