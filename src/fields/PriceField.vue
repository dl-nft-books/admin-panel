<script lang="ts" setup>
import { InputField } from '@/fields'
import { ref } from 'vue'

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
  let price = value

  const formatValue = price.replace(/,/, '.')
  const resString = formatValue.match(
    `\\d*\\.?\\d{0,${props.numberOfDecimalPlaces}}`,
  )
  price = Array.isArray(resString) ? resString[0] : ''
  if (price === '.') price = '0.'

  const res = price.match(`\\d*\\.?\\d{0,${props.numberOfDecimalPlaces}}`)

  return res ? res[0] : ''
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
