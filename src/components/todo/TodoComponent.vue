<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const id = route.params.id
const isUpdate = route.query && Object.keys(route.query).length > 0
const url = import.meta.env.VITE_BACKEND

const priorityList = [
  { id: 1, priority: 0 },
  { id: 2, priority: 1 },
  { id: 3, priority: 2 }
];

const name = ref('')
const description = ref('')
const dueDate = ref('')
const priority = ref(0)

onMounted(() => {
  if (isUpdate) {
    name.value = route.query.name || ''
    description.value = route.query.description || ''
    dueDate.value = route.query.dueDate ? route.query.dueDate.split('T')[0] : ''
    priority.value = route.query.priority || 0
  }
})

const handleSubmit = async () => {
  if (name.value === '') {
    toast.error('Please add all the fields.')
    return
  }

  try {
    const token = await JSON.parse(localStorage.getItem('to-do-user')).token
    const userId = await JSON.parse(localStorage.getItem('to-do-user')).id

    const newTask = {
      token,
      userId,
      name: name.value,
      description: description.value,
      dueDate: dueDate.value,
      priority: priority.value
    }

    if (isUpdate) {
      await axios.put(`${url}/tasks/${id}`, newTask)
      toast.success('Task added succesfully.')
      setTimeout(() => {
        router.push({ name: 'home' })
      }, 1500)
    } else {
      await axios.post(`${url}/tasks/new`, newTask)
      toast.success('Task added succesfully.')
      setTimeout(() => {
        router.push({ name: 'home' })
      }, 1500)
    }

    name.value = ''
    description.value = ''
    dueDate.value = ''
    priority.value = 0
  } catch (error) {
    toast.error(error.response.data.message)
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="w-[30em] pb-3 border rounded-[10px] overflow-hidden">
    <input v-model="name" class="w-full h-10 px-2 text-[1rem] outline-none placeholder-gray-500" placeholder="Task name"
      type="text" />
    <textarea v-model="description" placeholder="Description"
      class="w-full h-[50px] px-2 outline-none text-[0.8rem] placeholder-gray-400"></textarea>
    <div class="w-full flex gap-x-2 px-2">
      <input v-model="dueDate" class="h-8 w-full px-2 outline-none border rounded-[5px] text-[0.8rem] text-gray-400"
        type="date" />
      <select v-model="priority" class="h-8 w-full px-2 border rounded-[5px] text-[0.8rem] text-gray-400 outline-none"
        name="priority" id="priority">
        <option value="" disabled>Select priority</option>
        <option v-for="elem in priorityList" :key="elem.id" :value="elem.priority">
          {{ elem.priority }}
        </option>
      </select>
      <button v-if="isUpdate" type="submit"
        class="w-full bg-[#10100e] text-[#ffffff] text-[0.8rem] rounded-[5px]">Update</button>
      <button v-else type="submit"
        class="w-full bg-[#10100e] text-[#ffffff] text-[0.8rem] rounded-[5px]">Submit</button>
    </div>
  </form>
</template>
