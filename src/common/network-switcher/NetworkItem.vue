<template>
  <div :class="classes" @click="emit('networkChange')">
    <div :class="wrapperClasses">
      <icon class="network-item__icon" :name="getIconName(scheme)" />
    </div>
    <p class="network-item__title">
      {{ title }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@/common'
import { useContext } from '@/composables'
import { computed } from 'vue'

const { $t, $icons } = useContext()

type SCHEMES = 'polygon' | 'ethereum' | 'q' | 'unsupported'

const getIconName = (scheme: SCHEMES) => {
  switch (scheme) {
    case 'polygon':
      return $icons.polygon
    case 'ethereum':
      return $icons.ethereum
    case 'q':
      return $icons.q
    case 'unsupported':
      return $icons.ban
  }
}

type MODIFICATIONS = 'non-active' | 'default'

const props = withDefaults(
  defineProps<{
    scheme?: SCHEMES
    modification?: MODIFICATIONS
  }>(),
  {
    scheme: 'polygon',
    modification: 'default',
  },
)

const emit = defineEmits<{
  (event: 'networkChange'): void
}>()

const classes = computed(() => [
  'network-item',
  `network-item--${props.modification}`,
])

const wrapperClasses = computed(() => [
  'network-item__wrapper',
  `network-item__wrapper--${props.scheme}`,
])

const getTitle = () => {
  switch (props.scheme) {
    case 'polygon':
      return $t('networks.polygon')
    case 'ethereum':
      return $t('networks.ethereum')
    case 'q':
      return $t('networks.q')
    case 'unsupported':
      return $t('networks.unsupported')
    default:
      return ''
  }
}

const title = computed(getTitle)
</script>

<style lang="scss" scoped>
.network-item {
  --background-hover-color: rgba(var(--drop-down-shadow-rgb), 0.2);

  display: flex;
  align-items: center;
  gap: toRem(12);
  padding: toRem(15);
  width: 100%;
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
    background-color: var(--polygon-network);
  }

  &--ethereum {
    background-color: var(--ethereum-network);
  }

  &--q {
    background-color: var(--q-network);
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
    color: var(--q-network-stroke);
  }
}

.network-item__title {
  font-weight: 400;
  font-size: toRem(16);
  line-height: toRem(19);
  color: var(--text-secondary-main);
  user-select: none;

  .account--dark-mode & {
    color: var(--text-secondary-invert-main);
  }

  .network-item--non-active & {
    font-weight: 500;
  }
}
</style>
