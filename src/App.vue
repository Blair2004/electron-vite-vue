<script setup lang="ts">
import Dialog from './components/shared/Dialog.vue';
import Toast from './components/shared/Toast.vue';

</script>
<template>
  <router-view></router-view>
  <Toast/>
  <Dialog/>
</template>