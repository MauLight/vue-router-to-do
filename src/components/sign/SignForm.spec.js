import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { toast } from 'vue3-toastify'
import SignForm from './SignForm.vue'
import axios from 'axios'

vi.mock('axios')
vi.mock('vue3-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}))

describe('SignForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(SignForm, {
      global: {
        stubs: {
          InputComponent: true
        }
      }
    })
  })

  it('renders', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('displays error if username or password is empty on submit', async () => {
    wrapper.vm.username = ''
    wrapper.vm.password = ''
    await wrapper.vm.handleSubmit()
    expect(toast.error).toHaveBeenCalledWith('Please add a username and a password.')
  })

  it('submits successfully with all data', async () => {
    wrapper.vm.username = 'testuser'
    wrapper.vm.password = 'Testpassword1234.'
    axios.post.mockResolvedValue({ data: {} })

    await wrapper.vm.handleSubmit()

    expect(axios.post).toHaveBeenCalledWith(
      `${import.meta.env.VITE_BACKEND}/user`,
      {
        username: 'testuser',
        password: 'Testpassword1234.'
      }
    )
    expect(toast.success).toHaveBeenCalledWith('User created successfully.')
  })
})
