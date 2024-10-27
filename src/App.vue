<script setup>
import 'vue3-toastify/dist/index.css'
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="w-screen flex justify-center">
    <div class="relative w-full max-w-[1400px] h-full">
      <nav class="absolute w-full h-[60px] flex gap-x-5 items-center justify-between">
        <RouterLink class="text-[0.9rem]" to="/">
          <img src='/app.png' class="w-5 h-5" />
        </RouterLink>
        <div class="flex gap-x-5">
          <RouterLink class="text-[0.9rem]" to="/">Home</RouterLink>
          <RouterLink class="text-[0.9rem]" to="/add">Add tasks</RouterLink>
        </div>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped></style>
