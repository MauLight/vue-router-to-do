import { mount } from '@vue/test-utils'
import LoginForm from './LoginForm.vue'
import axios from 'axios'
import { toast } from 'vue3-toastify'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('axios')
vi.mock('vue3-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}))

describe('LoginForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(LoginForm, {
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
    wrapper.vm.password = 'testpassword'
    axios.post.mockResolvedValue({ data: {} })

    await wrapper.vm.handleSubmit()

    expect(axios.post).toHaveBeenCalledWith(
      `${import.meta.env.VITE_BACKEND}/login`,
      {
        username: 'testuser',
        password: 'testpassword'
      }
    )
  })
})
