<template>
  <div class="app-shell">
    <Toast />
    <ConfirmDialog />
    <router-view />
  </div>
  
</template>

<script setup>
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
</script>

<style>
.app-shell{
  min-height: 100vh;
  background-color: #f6f7f9;
}
</style>


