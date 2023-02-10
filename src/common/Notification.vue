<template>
  <div class="notification">
    <icon class="notification__icon" :name="iconName" />
    <div class="notification__details">
      <h5 class="notification__title">
        {{ title }}
      </h5>
      <p class="notification__message">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'

withDefaults(
  defineProps<{
    title?: string
    message: string
    iconName?: ICON_NAMES
  }>(),
  {
    title: '',
    iconName: ICON_NAMES.check,
  },
)
</script>

<style lang="scss">
@import 'vue-toastification/src/scss/index';

.Vue-Toastification__toast {
  &--success {
    background: var(--success-dark);
  }

  &--error {
    background: var(--error-dark);
  }

  &--warning {
    background: var(--warning-dark);
  }

  &--info {
    background: var(--primary-main);
  }
}

.notification {
  display: grid;
  place-items: center;
  grid-template-columns: max-content 1fr;
  grid-gap: toRem(16);
}

.notification .notification__icon {
  max-width: toRem(48);
  max-height: toRem(48);
}

.notification__details {
  display: grid;
  width: 100%;
}

.notification__title {
  @include text-color-invert;
}

.notification__message {
  @include text-color-invert;
}
</style>
