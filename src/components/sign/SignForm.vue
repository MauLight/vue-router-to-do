<script>
import InputComponent from '../common/InputComponent.vue'
import { toast } from 'vue3-toastify'
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const url = import.meta.env.VITE_BACKEND

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
        await axios.post(`${url}/user`, user)
        toast.success('User created succesfully.')
        setTimeout(() => {
          router.push({ name: 'login' })
        }, 1500)
      } catch (error) {
        toast.error(error.response.data.message)
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
