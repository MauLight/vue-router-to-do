<script>
import InputComponent from '../common/InputComponent.vue'
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const router = useRouter()
const url = import.meta.env.VITE_BACKEND


//* Set initial form state
const username = ref('')
const password = ref('')

export default {
  components: {
    InputComponent
  },
  data() {
    return {
      labelUsername: 'username',
      labelPassword: 'password',
      typeUsername: 'text',
      typePassword: 'password'
    }
  },
  methods: {
    //* Receive @emit values
    handleInputValueUsername(value) {
      username.value = value
    },
    handleInputValuePassword(value) {
      password.value = value
    },
    async handleSubmit() {

      if (username.value === '' || password.value === '') {
        toast.error('Please add a username and a password.')
        return
      }

      const user = {
        username: username.value,
        password: password.value
      }

      try {
        //* Post user credentials and save respose to localStorage
        const response = await axios.post(`${url}/login`, user)
        localStorage.setItem('to-do-user', JSON.stringify(response.data))
        router.push({ name: 'home' })
      } catch (error) {
        toast.error(error.message)
      }
    }
  }
}

</script>

<template>
  <form @submit.prevent="handleSubmit" class="w-full flex flex-col gap-y-2 items-center justify-center">
    <InputComponent @input-value="handleInputValueUsername" :label="labelUsername" :type="typeUsername" />
    <InputComponent @input-value="handleInputValuePassword" :label="labelPassword" :type="typePassword" />
    <button @click="handleSubmit"
      class="w-1/2 xl:w-1/3 h-10 mt-2 bg-[#10100e] text-[#ffffff] text-[0.8rem] rounded-[8px]">Submit</button>
  </form>
</template>
