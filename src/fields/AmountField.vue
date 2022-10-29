<script lang="ts" setup>
import { InputField } from '@/fields'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    numberOfDecimalPlaces?: number
    placeholder?: string
    label?: string
    errorMessage?: string
  }>(),
  {
    modelValue: '',
    numberOfDecimalPlaces: 2,
    placeholder: '',
    label: '',
    errorMessage: '',
  },
)

const price = ref(props.modelValue)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const input = () => {
  price.value = normalizePrice(price.value)
  emit('update:modelValue', price.value)
}

function normalizePrice(value: string): string {
  const formatValue = value.replace(/,/, '.')
  const normalizedValue = formatValue.match(
    `\\d*\\.?\\d{0,${props.numberOfDecimalPlaces}}`,
  )?.[0]

  return normalizedValue === '.' ? '0.' : normalizedValue || ''
}
</script>

<template>
  <input-field
    v-model="price"
    v-bind="$attrs"
    :placeholder="placeholder"
    :label="label"
    :error-message="errorMessage"
    @input="input"
  />
</template>
