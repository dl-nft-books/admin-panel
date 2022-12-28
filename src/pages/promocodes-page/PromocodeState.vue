<template>
  <div :class="classes">
    <p class="promocode-state__title">
      {{ title }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type SCHEMES = 'available' | 'unavailable'

interface Props {
  scheme?: SCHEMES
  title: string
}

const props = withDefaults(defineProps<Props>(), {
  scheme: 'available',
})

const classes = computed(() => [
  'promocode-state',
  `promocode-state--${props.scheme}`,
])
</script>

<style lang="scss" scoped>
.promocode-state {
  border-radius: toRem(4);
  height: toRem(34);
  width: toRem(100);
  display: grid;
  place-content: center;

  &--available {
    background-color: var(--promocode-available);
  }

  &--unavailable {
    background-color: var(--promocode-unavailable);
  }
}

.promocode-state__title {
  font-size: toRem(16);
  line-height: toRem(19);
  user-select: none;

  .promocode-state--available & {
    color: var(--promocode-available-text);
  }

  .promocode-state--unavailable & {
    color: var(--error-main);
  }
}
</style>
