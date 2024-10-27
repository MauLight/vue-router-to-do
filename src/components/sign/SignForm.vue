<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import axios from 'axios'
import InputComponent from '../common/InputComponent.vue'

const username = ref('')
const password = ref('')
const url = import.meta.env.VITE_BACKEND

const router = useRouter()

const labelUsername = 'username'
const labelPassword = 'password'
const typeUsername = 'text'
const typePassword = 'password'

//* Receive @emit values
const handleInputValueUsername = (value) => {
  username.value = value;
}

const handleInputValuePassword = (value) => {
  password.value = value;
}

const handleLogin = () => {
  router.push({ name: 'login' })
}

const handleSubmit = async () => {
  if (username.value === '' || password.value === '') {
    toast.error('Please add a username and a password.')
    return
  }

  const user = {
    username: username.value,
    password: password.value
  }

  try {
    //* Post credentials and navigate to login.
    await axios.post(`${url}/user`, user);
    toast.success('User created successfully.')
    setTimeout(() => {
      router.push({ name: 'login' })
    }, 1500)
  } catch (error) {
    toast.error(error.response.data.message)
  }
}
</script>

<template>
  <div class="w-full flex flex-col gap-y-2 items-center justify-center">
    <InputComponent @input-value="handleInputValueUsername" :label="labelUsername" :type="typeUsername" />
    <InputComponent @input-value="handleInputValuePassword" :label="labelPassword" :type="typePassword" />
    <button @click="handleSubmit"
      class="w-1/2 xl:w-1/3 h-10 mt-2 bg-[#10100e] text-[#ffffff] text-[0.8rem] rounded-[8px]">Submit</button>
  </div>
  <p class="text-[0.8rem]">Already have an account?
    <button @click="handleLogin" class="text-blue-500">Log in</button>
  </p>
</template>
