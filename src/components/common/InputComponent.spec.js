import { mount } from '@vue/test-utils'
import InputComponent from './InputComponent.vue'
import { describe, expect, it } from 'vitest'

describe('InputComponent', () => {
  it('renders with correct props', () => {
    const wrapper = mount(InputComponent, {
      props: {
        label: 'Username',
        type: 'text'
      }
    })

    const label = wrapper.find('label')
    const input = wrapper.find('input')
    expect(label.text()).toBe('Username')
    expect(input.attributes('type')).toBe('text')
  })

  it('updates fieldValue and emits input-value event on input', async () => {
    const wrapper = mount(InputComponent, {
      props: {
        label: 'Username',
        type: 'text'
      }
    })

    const input = wrapper.find('input')
    await input.setValue('testuser')

    expect(wrapper.vm.fieldValue).toBe('testuser')
    expect(wrapper.emitted('input-value')).toBeTruthy()
    expect(wrapper.emitted('input-value')[0]).toEqual(['testuser'])
  })

  it('handles label animation correctly', async () => {
    const wrapper = mount(InputComponent, {
      props: {
        label: 'Username',
        type: 'text'
      }
    })

    const input = wrapper.find('input')
    const label = wrapper.find('label')

    expect(label.classes()).toContain('top-3')
    expect(label.classes()).toContain('text-[16px]')

    await input.trigger('focus')
    expect(wrapper.vm.labelAnimation).toBe(true)
    expect(label.classes()).toContain('top-1')
    expect(label.classes()).toContain('text-[12px]')

    await input.trigger('blur')
    expect(wrapper.vm.labelAnimation).toBe(false)
    expect(label.classes()).toContain('top-3')
    expect(label.classes()).toContain('text-[16px]')
  })
})
