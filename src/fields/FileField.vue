<script lang="ts" setup>
import { useDropZone } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useFile } from '@/composables'
import { Icon, AppButton } from '@/common'
import { Bus } from '@/helpers'
import { useI18n } from 'vue-i18n'
import { ErrorHandler } from '@/helpers/error-handler'
import { formatBytes } from '@/helpers'

type FileExtension = 'jpg' | 'png' | 'pdf'

const props = withDefaults(
  defineProps<{
    modelValue: File | undefined
    errorMessage?: string
    disabled?: boolean | string
    label?: string
    note?: string
    fileExtensions?: FileExtension[]
    maxSize?: number // MB
  }>(),
  {
    errorMessage: '',
    disabled: false,
    label: '',
    note: '',
    maxSize: 2,
    fileExtensions: () => ['jpg', 'png', 'pdf'],
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: File | undefined): void
}>()

const { t } = useI18n()

const dropZoneRef = ref<HTMLDivElement | null>(null)

const imageExtensions = computed(() => {
  const imageExtMap = ['jpg', 'png']
  return props.fileExtensions
    .filter(el => imageExtMap.includes(el))
    .map(el => '.' + el)
})

const applicationExtensions = computed(() => {
  const imageExtMap = ['pdf']
  return props.fileExtensions
    .filter(el => imageExtMap.includes(el))
    .map(el => '.' + el)
})

useDropZone(dropZoneRef, onDrop)
const { open, file } = useFile([
  {
    description: 'image',
    accept: {
      'image/*': imageExtensions.value,
    },
  },
  {
    description: 'application',
    accept: {
      'application/*': applicationExtensions.value,
    },
  },
])

const maxSizeBytes = computed(() => props.maxSize * 1024 * 1024)

const classes = computed(() =>
  [
    'file-field',
    ...(props.disabled ? ['file-field--disabled'] : []),
    ...(props.errorMessage ? ['file-field--error'] : []),
  ].join(' '),
)

const getFileExtension = (file: File): string => {
  return file.name.split('.').pop()?.toUpperCase() || ''
}

const isValidFileType = (file: File) => {
  return Boolean(
    props.fileExtensions.find(
      item => item.toUpperCase() === getFileExtension(file),
    ),
  )
}

const onChange = (file: File) => {
  if (!isValidFileType(file)) {
    const acceptedExtensions = props.fileExtensions
      .map(item => `.${item.toUpperCase()}`)
      .join(', ')

    Bus.error(
      t('file-field.incorrect-file-type-err', {
        allowedTypes: acceptedExtensions,
        type: `.${getFileExtension(file)}`,
      }),
    )
    return
  }

  if (file.size > maxSizeBytes.value) {
    Bus.error(
      t('file-field.max-size-exceeded-err', {
        maxSize: props.maxSize,
      }),
    )
    return
  }

  emit('update:modelValue', file)
}

function onDrop(files: File[] | null) {
  if (!files?.length) return
  onChange(files[0])
}

const handleOpen = async () => {
  try {
    await open()

    if (!file.value) return
    onChange(file.value)
  } catch (e) {
    ErrorHandler.processWithoutFeedback(e)
  }
}

const setHeightCSSVar = (element: HTMLElement) => {
  element.style.setProperty(
    '--field-error-msg-height',
    `${element.scrollHeight}px`,
  )
}
</script>

<template>
  <div :class="classes">
    <div class="file-field__container">
      <template v-if="modelValue?.name">
        <div class="file-field__file-info">
          <p class="file-field__file-name">
            {{ modelValue?.name }}
          </p>
          <p class="file-field__file-size">
            {{ formatBytes(modelValue?.size) }}
          </p>
          <app-button
            class="file-field__reset-btn"
            scheme="default"
            size="x-small"
            :icon-right="$icons.x"
            @click="emit('update:modelValue', undefined)"
          />
        </div>
      </template>
      <template v-else>
        <button type="button" class="file-field__open-btn" @click="handleOpen">
          <span ref="dropZoneRef" class="file-field__drop-zone" />

          <icon class="file-field__upload-icon" :name="$icons.upload" />
          <p class="file-field__label">
            {{ label }}
          </p>
          <p class="file-field__note">
            {{ note }}
          </p>
        </button>
      </template>
    </div>

    <transition
      name="file-field__err-msg-transition"
      @enter="setHeightCSSVar"
      @before-leave="setHeightCSSVar"
    >
      <span v-if="errorMessage" class="file-field__err-msg">
        {{ errorMessage }}
      </span>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.file-field {
  position: relative;

  &--disabled {
    pointer-events: none;
  }
}

.file-field__container {
  min-width: toRem(300);
  border: toRem(1) dashed var(--field-border);
  border-radius: toRem(9);
  padding: toRem(23) toRem(20);

  .file-field--error & {
    border-color: var(--field-error);
  }
}

.file-field__open-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.file-field__drop-zone {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.file-field__upload-icon {
  color: var(--field-label);
  width: toRem(41);
  height: toRem(41);

  .file-field--error & {
    color: var(--field-error);
  }
}

.file-field__file-name {
  font-size: toRem(16);
  line-height: 1.1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-field__file-size {
  margin-top: toRem(5);
  font-size: toRem(14);
  line-height: 1;
}

.file-field__label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--field-label);
  font-size: toRem(16);
  font-weight: 400;

  .file-field--error & {
    color: var(--field-error);
  }
}

.file-field__note {
  color: var(--field-label);
  font-size: toRem(14);
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  .file-field--error & {
    color: var(--field-error);
  }
}

.file-field__file-info {
  position: relative;
  padding-right: toRem(20);
}

.file-field__reset-btn {
  position: absolute;
  right: 0;
  top: 0;
}

.file-field__err-msg {
  @include field-error;
}

.file-field__err-msg-transition-enter-active {
  animation: fade-down var(--field-transition-duration);
}

.file-field__err-msg-transition-leave-active {
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
