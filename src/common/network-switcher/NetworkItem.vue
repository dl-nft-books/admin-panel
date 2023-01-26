<template>
  <span :class="classes">
    <div :class="wrapperClasses">
      <icon class="network-item__icon" :name="getIconByScheme(scheme)" />
    </div>
    {{ title }}
  </span>
</template>

<script setup lang="ts">
import { Icon } from '@/common'
import { computed } from 'vue'
import { NETWORKS, WINDOW_BREAKPOINTS } from '@/enums'
import { getIconByScheme } from '@/helpers'
import { useContext } from '@/composables'
import { useWindowSize } from '@vueuse/core'

const { $t } = useContext()

type MODIFICATIONS = 'non-active' | 'default'

const props = withDefaults(
  defineProps<{
    scheme?: NETWORKS
    modification?: MODIFICATIONS
    name?: string
  }>(),
  {
    scheme: NETWORKS.POLYGON,
    modification: 'default',
    name: '',
  },
)

const { width } = useWindowSize()

const networkTitle = computed(() =>
  props.scheme !== NETWORKS.UNSUPPORTED
    ? $t('networks.title', { network: props.name })
    : $t('networks.unsupported'),
)

const title = computed(() =>
  width.value <= WINDOW_BREAKPOINTS.small ? '' : networkTitle.value,
)

const classes = computed(() => [
  'network-item',
  `network-item--${props.modification}`,
])

const wrapperClasses = computed(() => [
  'network-item__wrapper',
  `network-item__wrapper--${props.scheme}`,
])
</script>

<style lang="scss" scoped>
.network-item {
  --background-hover-color: rgba(var(--drop-down-shadow-rgb), 0.2);

  display: flex;
  align-items: center;
  gap: toRem(12);
  padding: toRem(15);
  width: 100%;
  line-height: toRem(19);
  color: var(--text-secondary-main);
  user-select: none;
  transition: 0.2s ease-in-out;
  transition-property: background-color;

  &--default {
    &:hover {
      cursor: pointer;
      background-color: var(--background-hover-color);
    }
  }

  &--non-active {
    padding: 0;
    font-weight: 500;
  }
}

.network-item__wrapper {
  --size: #{toRem(30)};

  width: var(--size);
  height: var(--size);
  border-radius: 100%;
  display: grid;
  place-content: center;
  aspect-ratio: 1 / 1;

  &--polygon {
    background-color: var(--network-purple-dark);
  }

  &--ethereum {
    background-color: var(--network-purple-light);
  }

  &--q {
    background-color: var(--network-black);
  }

  &--unsupported {
    background-color: var(--primary-main);
  }
}

.network-item__icon {
  max-width: toRem(18);
  max-height: toRem(16);
  color: var(--white);

  .network-item__wrapper--q & {
    max-width: toRem(14);
    max-height: toRem(13);
    color: var(--network-green);
  }
}
</style>
