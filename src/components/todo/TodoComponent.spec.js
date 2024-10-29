import { mount } from '@vue/test-utils'
import TodoComponent from './TodoComponent.vue'
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

describe('TodoComponent', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(TodoComponent, {
      global: {
        mocks: {
          $route: {
            query: {
              name: 'Test Task',
              description: 'Test description',
              dueDate: '2025-01-02',
              priority: '0'
            },
            params: {
              id: '1'
            }
          }
        }
      }
    })
  })

  it('renders', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('displays error if name is empty on submit', async () => {
    wrapper.vm.name = ''
    await wrapper.vm.handleSubmit()
    expect(toast.error).toHaveBeenCalledWith('Please add all the fields')
  })

  it('submits successfully with all data', async () => {
    wrapper.vm.name = 'Test Task'
    wrapper.vm.description = 'Test description'
    wrapper.vm.dueDate = '2025-01-01'
    wrapper.vm.priority = '0'
    axios.post.mockResolvedValue({ data: {} })

    const token = 'some value'
    localStorage.setItem('to-do-user', JSON.stringify({ token, id: 1 }))

    await wrapper.vm.handleSubmit()

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:3001/api/tasks',
      {
        userId: expect.any(Number),
        name: 'Test Task',
        description: 'Test description',
        dueDate: '2025-01-01',
        priority: '0'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    expect(toast.success).toHaveBeenCalledWith('Task added successfully.')
  })
})
