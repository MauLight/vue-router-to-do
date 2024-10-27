<script setup>
import 'vue3-toastify/dist/index.css'
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import { ref, watch } from 'vue'

const router = useRouter()
const route = useRoute()
const hasNav = ref(route.name !== 'login' && route.name !== 'sign')

watch(
  () => route.name,
  (newRoute) => {
    hasNav.value = newRoute !== 'login' && newRoute !== 'sign'
  }
)

const handleLogout = () => {
  localStorage.removeItem('to-do-user')
  router.push({ name: 'login' })

}
</script>

<template>
  <header class="w-screen flex justify-center">
    <div class="relative w-full max-w-[1400px] h-full">
      <nav v-if="hasNav" class="absolute w-full h-[60px] flex gap-x-5 items-center justify-between">
        <RouterLink class="text-[0.9rem]" to="/">
          <img src='/app.png' class="w-5 h-5" />
        </RouterLink>
        <div class="flex items-center gap-x-5">
          <RouterLink class="text-[0.9rem]" to="/">Home</RouterLink>
          <RouterLink class="text-[0.9rem]" to="/add">Add tasks</RouterLink>
          <i @click="handleLogout" class="fa-solid fa-arrow-right-from-bracket cursor-pointer text-[#10100e]"></i>
        </div>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
