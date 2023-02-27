<template>
  <div :class="classes">
    <label v-if="label" class="date-field__label" :for="`date-field--${uid}`">
      {{ label }}
    </label>
    <input
      ref="dateInput"
      :id="`date-field--${uid}`"
      type="date"
      class="date-field__input"
      :placeholder="placeholder"
      :min="minDate"
      :disabled="disabled"
      :value="modelValue"
      v-on="listeners"
    />
    <div class="date-field__icon-wrp">
      <icon class="date-field__icon" :name="iconName" />
    </div>
    <transition
      name="date-field__err-msg-transition"
      @enter="setHeightCSSVar"
      @before-leave="setHeightCSSVar"
    >
      <span v-if="errorMessage" class="date-field__err-msg">
        {{ errorMessage }}
      </span>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ICON_NAMES } from '@/enums'
import { Icon } from '@/common'

import { computed, ref } from 'vue'
import { uuid } from 'uuidv4'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    minDate: string
    placeholder?: string
    label?: string
    disabled?: boolean
    iconName?: ICON_NAMES
    errorMessage?: string
  }>(),
  {
    modelValue: '',
    placeholder: '',
    label: '',
    disabled: false,
    iconName: ICON_NAMES.calendar,
    errorMessage: '',
  },
)

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const uid = uuid()

const dateInput = ref<HTMLInputElement | null>(null)

const listeners = computed(() => ({
  input: (event: Event) => {
    const eventTarget = event.target as HTMLInputElement

    if (props.modelValue === eventTarget.value) return
    emit('update:modelValue', eventTarget.value)
  },
}))

const setHeightCSSVar = (element: HTMLElement) => {
  element.style.setProperty(
    '--field-error-msg-height',
    `${element.scrollHeight}px`,
  )
}

const classes = computed(() => [
  'date-field',
  props.errorMessage ? 'date-field--error' : '',
])
</script>

<style lang="scss" scoped>
.date-field {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  flex: 1;
}

.date-field__label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @include field-label;

  .date-field--error & {
    color: var(--field-error);
  }
}

.date-field__input {
  padding: var(--field-padding);
  transition-property: box-shadow;
  margin-bottom: toRem(10);

  @include field-text;

  @include field-border;

  .date-field--error & {
    border-color: var(--field-error);
  }

  &:is([disabled]) {
    opacity: 0.5;
  }

  &:not([disabled]):focus {
    box-sizing: border-box;
    box-shadow: 0 0 0 toRem(1.5) var(--field-border-focus);
    border-color: var(--field-border-focus);
  }

  &:not([disabled]):not(:focus):hover {
    border-color: var(--field-border-hover);
  }

  &::-webkit-calendar-picker-indicator {
    position: absolute;
    right: 0;
    width: 100%;
    height: 70%;
    margin: 0;
    padding: 0;
    opacity: 0;
    cursor: pointer;
  }
}

.date-field__icon-wrp {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 60%;
  right: calc(var(--field-padding-right) * 3 / 2);
  transform: translate(50%, -50%);
  transition: 0.1s ease-in-out;
  transition-property: top;

  .date-field--error & {
    top: 50%;
  }
}

.date-field__icon {
  width: toRem(18);
  height: toRem(18);
}

.date-field__err-msg-transition-enter-active {
  animation: fade-down var(--field-transition-duration);
}

.date-field__err-msg-transition-leave-active {
  animation: fade-down var(--field-transition-duration) reverse;
}

.date-field__err-msg {
  @include field-error;

  margin-top: 0;
}

@keyframes fade-down {
  from {
    height: 0;
  }

  to {
    height: var(--field-error-msg-height);
  }
}
</style>
