<script lang="ts" setup>
import { InputField } from '@/fields'
import { ref } from 'vue'
import { countBy } from 'lodash-es'

const price = ref('')

const props = withDefaults(
  defineProps<{
    modelValue: string
    numberOfDecimalPlaces?: number
    placeholder?: string
    label?: string
  }>(),
  {
    modelValue: '',
    numberOfDecimalPlaces: 2,
    placeholder: '',
    label: '',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const input = () => {
  price.value = normalizePrice(price.value)
  emit('update:modelValue', price.value)
}

const normalizePrice = (value: string): string => {
  let result = value
  const priceRegex = /^[0-9.]+$/
  const countOfDots = countBy(result)['.'] ?? 0

  result =
    priceRegex.test(result) && countOfDots < 2
      ? result
      : result.substring(0, result.length - 1)

  if (result.includes('.')) {
    const [stringBeforeDot, stringAfterDot] = result.split('.')

    if (!stringBeforeDot.length) {
      result = '0.'
    }

    if (stringAfterDot.length > props.numberOfDecimalPlaces) {
      result =
        stringBeforeDot +
        '.' +
        stringAfterDot.substring(0, props.numberOfDecimalPlaces)
    }
  }

  return result
}
</script>

<template>
  <input-field
    v-model="price"
    :placeholder="placeholder"
    :label="label"
    @input="input"
  />
</template>
