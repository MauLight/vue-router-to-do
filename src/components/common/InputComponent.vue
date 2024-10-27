<script>
export default {
  props: ['label', 'type'],
  data() {
    return {
      fieldValue: '',
      labelAnimation: false
    }
  },
  computed: {
    labelClass() {
      return {
        'absolute': true,
        'top-1 pl-2 text-[12px] text-blue-400': this.labelAnimation || this.fieldValue.length > 0,
        'top-3 pl-2 text-[16px] text-gray-600': !(this.labelAnimation || this.fieldValue.length > 0),
        'font-light transition-all duration-200': true
      }
    }
  },
  methods: {
    emitInputValue() {
      this.$emit('input-value', this.fieldValue)
    }
  }
}
</script>

<template>
  <div class="w-1/2 xl:w-1/3 flex items-center gap-x-2">
    <div class='relative w-full h-[50px] border border-blue-500 rounded-[8px] px-2 overflow-hidden'>
      <label :class="labelClass">{{ label }}</label>
      <input v-model="fieldValue" @input="emitInputValue" @focus="labelAnimation = true"
        @mousedown="labelAnimation = true" @blur="labelAnimation = false" :type="type"
        class='absolute flex items-end pt-4 h-full font-light text-[0.8rem] text-gray-600 bg-transparent bottom-0 px-2 w-full ring-0 focus:ring-0 focus:outline-none' />
    </div>
  </div>
</template>
