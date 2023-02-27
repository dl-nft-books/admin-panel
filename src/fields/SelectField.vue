<template>
  <div :class="selectFieldClasses">
    <label
      v-if="label"
      class="select-field__label"
      :for="`select-field--${uid}`"
    >
      {{ label }}
    </label>
    <div ref="selectElement" class="select-field__select-wrp">
      <button
        type="button"
        class="select-field__select-head"
        @click="toggleDropdown"
      >
        <template v-if="$slots.head">
          <slot
            name="head"
            :select-field="{
              select,
              isOpen: isDropdownOpen,
              close: closeDropdown,
              open: openDropdown,
              toggle: toggleDropdown,
            }"
          />
        </template>
        <template v-else>
          <template v-if="modelValue">
            {{ title }}
          </template>
          <template v-else>
            <span class="select-field__placeholder">
              {{ props.placeholder }}
            </span>
          </template>
        </template>
        <icon
          :class="[
            'select-field__select-head-indicator',
            {
              'select-field__select-head-indicator--open': isDropdownOpen,
            },
          ]"
          :name="$icons.chevronDown"
        />
      </button>
      <transition name="select-field__select-dropdown">
        <div v-if="isDropdownOpen" class="select-field__select-dropdown">
          <template v-if="$slots.default">
            <slot
              :select-field="{
                select,
                isOpen: isDropdownOpen,
                close: closeDropdown,
                open: openDropdown,
                toggle: toggleDropdown,
              }"
            />
          </template>
          <template v-else-if="valueOptions.length">
            <button
              v-for="(option, idx) in valueOptions"
              :key="`[${idx}] ${option.value}`"
              :class="[
                'select-field__select-dropdown-item',
                {
                  'select-field__select-dropdown-item--active':
                    modelValue === option.value,
                },
              ]"
              type="button"
              @click="select(option.value)"
            >
              {{ option.label }}
            </button>
          </template>
        </div>
      </transition>
    </div>
    <transition
      name="select-field__err-msg-transition"
      @enter="setHeightCSSVar"
      @before-leave="setHeightCSSVar"
    >
      <span v-if="errorMessage" class="select-field__err-msg">
        {{ errorMessage }}
      </span>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@/common'

import { computed, onMounted, ref, useAttrs, watch } from 'vue'
import { useRouter } from '@/router'
import { onClickOutside } from '@vueuse/core'
import { uuid } from 'uuidv4'

const props = withDefaults(
  defineProps<{
    modelValue: string | number
    valueOptions?: { label: string; value: number | string }[]
    label?: string
    placeholder?: string
    errorMessage?: string
  }>(),
  {
    valueOptions: () => [],
    type: 'text',
    label: '',
    placeholder: ' ',
    errorMessage: '',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | string): void
}>()

const attrs = useAttrs()

const uid = uuid()

const selectElement = ref<HTMLDivElement>()

const isDropdownOpen = ref(false)

const router = useRouter()

router.afterEach(() => {
  closeDropdown()
})

const isDisabled = computed(() =>
  ['', 'disabled', true].includes(attrs.disabled as string | boolean),
)

const isReadonly = computed(() =>
  ['', 'readonly', true].includes(attrs.readonly as string | boolean),
)

const title = computed(
  () => props.valueOptions.find(i => i.value === props.modelValue)?.label,
)

const selectFieldClasses = computed(() => ({
  'select-field': true,
  'select-field--error': props.errorMessage,
  'select-field--open': isDropdownOpen.value,
  'select-field--disabled': isDisabled.value,
  'select-field--readonly': isReadonly.value,
}))

const setHeightCSSVar = (element: HTMLElement) => {
  element.style.setProperty(
    '--field-error-msg-height',
    `${element.scrollHeight}px`,
  )
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const openDropdown = () => {
  isDropdownOpen.value = true
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const select = (value: string | number) => {
  if (isDisabled.value || isReadonly.value) return

  emit('update:modelValue', value)
  closeDropdown()
}

onMounted(() => {
  if (selectElement.value) {
    onClickOutside(selectElement, () => {
      closeDropdown()
    })
  }
})

watch(
  () => props.modelValue,
  () => {
    closeDropdown()
  },
)
</script>

<style lang="scss" scoped>
$z-local-index: 1;

.select-field {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  flex: 1;

  &--disabled,
  &--readonly {
    opacity: 0.5;
  }
}

.select-field__label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @include field-label;

  .select-field--error & {
    color: var(--field-error);
  }
}

.select-field__select-wrp {
  display: flex;
  flex-direction: column;
  position: relative;
}

.select-field__select-head {
  padding: var(--field-padding);
  padding-right: calc(var(--field-padding-right) + #{toRem(24)});
  transition-property: box-shadow;
  text-align: left;
  width: 100%;
  height: 100%;
  font-weight: 400;

  @include field-border;

  @include field-text;

  .select-field--error & {
    border-color: var(--field-error);
  }
}

.select-field__placeholder {
  font: inherit;
  opacity: 0.25;
}

.select-field__select-head-indicator {
  pointer-events: none;
  position: absolute;
  top: 50%;
  right: var(--field-padding-right);
  transform: translateY(-50%);
  transition: transform 0.1s ease-in-out;
  width: toRem(18);
  height: toRem(18);
  color: var(--field-text);

  &--open {
    transform: translateY(-50%) rotate(180deg);
  }
}

.select-field__select-dropdown {
  display: flex;
  flex-direction: column;
  position: absolute;
  overflow: hidden;
  top: 0;
  right: 0;
  width: 100%;
  max-height: 500%;
  z-index: $z-local-index;
  background: var(--field-bg);

  @include field-border;
}

.select-field__select-dropdown-enter-active {
  animation: dropdown var(--field-transition-duration);
}

@keyframes dropdown {
  from {
    opacity: 0;
    transform: translateY(20%);
    max-height: 0;
  }

  to {
    opacity: 1;
    transform: translateY(0);
    max-height: 500%;
  }
}

.select-field__select-dropdown-item {
  text-align: left;
  width: 100%;
  padding: var(--field-padding);
  font-weight: 400;

  &:hover {
    background: rgba(var(--primary-main-rgb), 0.05);
  }

  &--active {
    background: rgba(var(--primary-main-rgb), 0.25);
  }
}

.select-field__err-msg {
  @include field-error;
}

.select-field__err-msg-transition-enter-active {
  animation: fade-down var(--field-transition-duration);
}

.select-field__err-msg-transition-leave-active {
  animation: fade-down var(--field-transition-duration) reverse;
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
