<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRouter } from 'vue-router';

import { ref } from 'vue';
import { Label } from '@/components/ui/label';

const router = useRouter();
const appID = ref('');
const appKey = ref('');
const file = ref('');

console.log( useRouter() );

const verifyToken = () => {
    // Navigate to the desired component
    router.push('/select-license');
};

const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const contents = e.target.result;
        try {
            const jsonData = JSON.parse(contents);
            // Do something with the JSON data
        } catch (error) {
            console.error('Invalid JSON file');
        }
    };

    reader.readAsText(file);
};

</script>
<template>
    <div class="w-full p-4 flex flex-col items-center bg-background">
        <div class="mx-auto w-56 flex items-center justify-center">
            <div class="h-32">LOGO</div>
        </div>
        <Card class="w-full md:w-2/3">
            <CardHeader>
                <CardTitle>Authenticate</CardTitle>
                <CardDescription>with my.nexopos.com</CardDescription>
            </CardHeader>
            <CardContent>
                <div class="text-sm text-center">
                    Thank you for using Nexo Print Server. In order to use the application, you need to create a Client and provide the created client credentials.
                </div>
                <br>
                <div class="text-sm text-center">
                    While creating the client, make sure the Redirect URL is "https://my.nexopos.com/nps"
                </div>
                <br>
                <div>
                    <div class="mb-2">
                        <Input v-model="appID" placeholder="App ID" />
                    </div>
                    <div class="mb-2">
                        <Input v-model="appKey" placeholder="Secret Key" />
                    </div>
                </div>
                <div class="flex justify-center border-t-4 relative my-4"><span class="bg-white px-4 font-bold -top-4 absolute">OR</span></div>
                <div>
                    <div class="mb-2">
                        <div class="grid w-full items-center gap-1.5">
                            <Label for="picture">Token File</Label>
                            <Input @change="handleFileChange( $event )" id="picture" type="file" />
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter class="flex justify-between">
                <Button @click="verifyToken()">
                    Authenticate
                </Button>
            </CardFooter>
        </Card>
    </div>
</template>