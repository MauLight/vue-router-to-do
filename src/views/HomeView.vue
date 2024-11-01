<script setup>
import { computed, onMounted, ref } from 'vue'
import { VueSpinnerIos } from 'vue3-spinners'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import axios from 'axios'

const router = useRouter()
const url = import.meta.env.VITE_BACKEND
const isDelete = ref(false)
const taskId = ref('0')

//* Revoke access if no user is logged in.
const user = JSON.parse(localStorage.getItem('to-do-user'))
if (!user) {
  router.push({ name: 'login' })
}

//* Loader state
const loading = ref(true)
const tasks = ref(user?.tasks || [])

const homeTitle = computed(() => {
  return tasks.value.length > 0 ? 'Your tasks' : ''
})

//* Navigate to create-task view.
const handleCreateTask = () => {
  router.push({ name: 'addTask' })
}

//* Set params and queries for update-task.
const handleUpdateTask = (taskId) => {
  const { name, description, dueDate } = tasks.value.find(task => task.id === taskId) || {}
  router.push({
    name: 'updateTask',
    params: { id: taskId },
    query: { name, description, dueDate }
  })
}

const handleConfirmDelete = async (id) => {
  taskId.value = id
  isDelete.value = true
}

const handleDeleteTask = async () => {
  try {
    await axios.delete(`${url}/tasks/${taskId.value}`, {
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      }
    })

    tasks.value = tasks.value.filter(task => task.id !== taskId.value)
    toast.success('Task deleted succesfully.')
    isDelete.value = false
  } catch (error) {
    toast.error(error.message)
  }
}

const handleCloseModal = () => {
  isDelete.value = false
}

onMounted(async () => {
  try {
    //* Retrieve current user's task list.
    const response = await axios.get(`${url}/tasks/${user.id}`, {
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      }
    })

    tasks.value = response.data || []
  } catch (error) {
    toast.error(error.message)
  } finally {
    loading.value = false
  }
})

</script>

<template>
  <div v-if="loading" class="w-full flex justify-center pt-[10rem]">
    <div class="w-full max-w-[1400px] min-h-screen flex flex-col justify-start items-center">
      <VueSpinnerIos size="20" color="#10100e" />
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
            <button @click="handleConfirmDelete(task.id)"
              class="h-full text-[0.8rem] text-gray-800 hover:text-[#ffffff] bg-[#ffffff] hover:bg-red-600 px-2 rounded-[8px] border hover:border-[#ffffff] transition-colors duration-200">Delete</button>
          </div>
        </li>
      </ul>
    </div>
    <div v-if="isDelete" class="absolute top-0 left-0 w-screen h-screen flex justify-center items-center">
      <div class="w-1/2 flex flex-col gap-y-5 p-5 z-20 bg-[#ffffff] rounded-[15px]">
        <h1>Are you sure you want to delete this entry?</h1>
        <div class="h-10 flex justify-end gap-x-2">
          <button @click="handleCloseModal"
            class="h-full text-[0.8rem] text-gray-800 hover:text-[#ffffff] bg-[#ffffff] hover:bg-gray-800 px-2 rounded-[8px] border hover:border-[#ffffff] transition-colors duration-200">Cancel</button>
          <button @click="handleDeleteTask"
            class="h-full text-[0.8rem] text-gray-800 hover:text-[#ffffff] bg-[#ffffff] hover:bg-red-600 px-2 rounded-[8px] border hover:border-[#ffffff] transition-colors duration-200">Delete</button>
        </div>
      </div>
      <div @click="handleCloseModal"
        class="absolute top-0 left-0 w-screen h-screen flex justify-center items-center bg-[#10100e] opacity-95 z-10">
      </div>
    </div>
  </div>
</template>
