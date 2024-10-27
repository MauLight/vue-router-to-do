<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import axios from 'axios'

const router = useRouter()
const loading = ref(true)
const url = import.meta.env.VITE_BACKEND

const user = JSON.parse(localStorage.getItem('to-do-user'))
if (!user) {
  router.push({ name: 'login' })
}

const tasks = ref(user.tasks || [])
const homeTitle = computed(() => {
  return tasks.value.length > 0 ? 'Your tasks' : ''
})

const handleCreateTask = () => {
  router.push({ name: 'addTask' })
}

const handleUpdateTask = (taskId) => {
  const { name, description, dueDate } = tasks.value.find(task => task.id === taskId) || {}
  router.push({
    name: 'updateTask',
    params: { id: taskId },
    query: { name, description, dueDate }
  })
}

const handleDeleteTask = async (taskId) => {
  try {
    await axios.delete(`${url}/tasks/${taskId}`)
    tasks.value = tasks.value.filter(task => task.id !== taskId)
    toast.success('Task deleted succesfully.')
  } catch (error) {
    toast.error(error.message)
  }
}

onMounted(async () => {
  try {
    const response = await axios.post(`${url}/tasks/${user.id}`, { token: user.token })
    tasks.value = response.data || []
  } catch (error) {
    toast.error(error.response.data.message)
  } finally {
    loading.value = false
  }
})

</script>

<template>
  <div v-if="loading" class="w-full flex justify-center pt-[10rem]">
    <div class="w-full max-w-[1400px] min-h-screen flex flex-col justify-start items-center">
      <p>Loading...</p>
    </div>
  </div>
  <div v-else class="w-full flex justify-center pt-[10rem]">
    <div class="w-full max-w-[1400px] min-h-screen flex flex-col justify-start items-center">
      <h1 class="text-[2rem] mb-10">{{ homeTitle }}</h1>
      <div v-if="tasks.length === 0" class="flex flex-col items-center">
        <p>No tasks available. Please create a new task.</p>
        <button @click="handleCreateTask"
          class="h-10 mt-4 px-4 bg-blue-500 text-[#ffffff] text-[1rem] rounded-[8px]">Create
          Task</button>
      </div>
      <ul class="w-full max-w-[600px]">
        <li v-for="(task, index) in tasks" :key="index" class="flex justify-between p-2 pb-4 border-b border-gray-300">
          <div>
            <h1 class="text-[0.9rem] text-gray-800">{{ task.name }}</h1>
            <p class="text-[0.8rem] text-gray-500">{{ task.description }}</p>
          </div>
          <div class="flex gap-x-2">
            <button @click="handleUpdateTask(task.id)"
              class="h-full text-[0.8rem] text-gray-800 hover:text-[#ffffff] bg-[#ffffff] hover:bg-gray-800 px-2 rounded-[8px] border hover:border-[#ffffff] transition-colors duration-200">Update</button>
            <button @click="handleDeleteTask(task.id)"
              class="h-full text-[0.8rem] text-gray-800 hover:text-[#ffffff] bg-[#ffffff] hover:bg-red-600 px-2 rounded-[8px] border hover:border-[#ffffff] transition-colors duration-200">Delete</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
