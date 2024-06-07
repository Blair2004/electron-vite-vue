<script setup lang="ts">
import Input from "./ui/input/Input.vue";
import Label from "./ui/label/Label.vue";
import Switch from "./ui/switch/Switch.vue";
import Textarea from "./ui/textarea/Textarea.vue";
import { Field } from "@/interfaces/Field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { provide } from "vue";

interface Props {
    field: Field
}

const emit = defineEmits(['change']);

const props =   defineProps<Props>();

function checkSwitchState( event: boolean, field: Field ) {
    field.value = event;
}

</script>
<template>
    <div class="grid w-full max-w-sm items-center gap-1.5 mb-4" v-if="[ 'text', 'password', 'number', 'email' ].includes( field.type )">
        <Label class="text-sm" :for="field.name">{{ field.label }}</Label>
        <Input v-model="field.value" ref="fieldRef" :disabled="field.disabled" :type="field.type" :placeholder="field.placeholder || ''" />
        <small class="text-xs">{{ field.description }}</small>
    </div>
    <div class="grid w-full max-w-sm items-center gap-1.5 mb-4" v-if="[ 'textarea' ].includes( field.type )">
        <Label class="text-sm" :for="field.name">{{ field.label }}</Label>
        <Textarea :disabled="field.disabled" :type="field.type" v-model="field.value" :placeholder="field.placeholder || ''"></Textarea>
        <small class="text-xs">{{ field.description }}</small>
    </div>
    <div class="grid w-full max-w-sm items-center gap-1.5 mb-4" v-if="[ 'switch' ].includes( field.type )">
        <Label class="text-sm" :for="field.name">{{ field.label }}</Label>
        <Switch :checked="field.value" @update:checked="checkSwitchState( $event, field )"/>
        <small class="text-xs">{{ field.description }}</small>
    </div>
    <div class="grid w-full max-w-sm items-center gap-1.5 mb-4" v-if="[ 'select' ].includes( field.type )">
        <Label class="text-sm" :for="field.name">{{ field.label }}</Label>
        <Select v-model="field.value" :disabled="field.disabled">
            <SelectTrigger>
                <SelectValue :placeholder="field.placeholder" />
            </SelectTrigger>
            <SelectContent>
            <SelectGroup v-if="field.options">
                <SelectLabel>{{ field.label }}</SelectLabel>
                <SelectItem v-for="option of field.options" :value="option.value">
                {{ option.label }}
                </SelectItem>
            </SelectGroup>
            </SelectContent>
        </Select>
        <small class="text-xs">{{ field.description }}</small>
    </div>
</template>