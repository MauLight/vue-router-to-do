<script setup>
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { onMounted, ref } from 'vue'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const id = route.params.id

//* Check if create or update by checking if a query was passed in the url.
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
  //* If update, pass current values to the form.
  if (isUpdate) {
    name.value = route.query.name || ''
    description.value = route.query.description || ''
    dueDate.value = route.query.dueDate ? route.query.dueDate.split('T')[0] : ''
    priority.value = route.query.priority || 0
  }
})

const handleSubmit = async () => {
  //* name is a required field.
  if (name.value === '') {
    toast.error('Please add all the fields.')
    return
  }

  try {
    //* Retrieve token and userId from localStorage.
    const userId = await JSON.parse(localStorage.getItem('to-do-user')).id
    const token = await JSON.parse(localStorage.getItem('to-do-user')).token

    const newTask = {
      userId,
      name: name.value,
      description: description.value,
      dueDate: dueDate.value,
      priority: priority.value
    }

    //* Run update or create method depending on desired action.
    if (isUpdate) {
      await axios.put(`${url}/tasks/${id}`, newTask, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      toast.success('Task added succesfully.')
      setTimeout(() => {
        router.push({ name: 'home' })
      }, 1500)
    } else {
      await axios.post(`${url}/tasks`, newTask, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      toast.success('Task added succesfully.')
      setTimeout(() => {
        router.push({ name: 'home' })
      }, 1500)
    }

    //* Reset form upon completion.
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
