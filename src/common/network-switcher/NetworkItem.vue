<template>
  <button :class="classes">
    <span :class="wrapperClasses">
      <icon class="network-item__icon" :name="getIconByScheme(scheme)" />
    </span>
    <p v-if="!isTitleHidden" class="network-item__title">
      {{ title }}
    </p>
  </button>
</template>

<script setup lang="ts">
import { Icon } from '@/common'
import { computed } from 'vue'
import { NETWORKS } from '@/enums'
import { getIconByScheme } from '@/helpers'
import { useI18n } from 'vue-i18n'

type MODIFICATIONS = 'non-active' | 'dark-mode' | 'default'

const { t } = useI18n()

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

const title = computed(() =>
  props.scheme !== NETWORKS.UNSUPPORTED
    ? props.name
    : t('networks.unsupported'),
)

const isTitleHidden = computed(() => props.modification.includes('non-active'))

const classes = computed(() => [
  'network-item',
  ...props.modification.split(' ').map(mod => `network-item--${mod}`),
])

const wrapperClasses = computed(() => [
  'network-item__wrapper',
  `network-item__wrapper--${props.scheme}`,
])
</script>

<style lang="scss" scoped>
.network-item {
  --background-hover-color: rgba(var(--drop-down-shadow-rgb), 0.2);
  --item-color: var(--text-secondary-main);

  display: flex;
  align-items: center;
  gap: toRem(12);
  padding: toRem(15);
  width: 100%;
  line-height: toRem(19);
  color: var(--item-color);
  user-select: none;
  transition: 0.2s ease-in-out;
  transition-property: background-color;

  &:hover {
    cursor: pointer;
    background-color: var(--background-hover-color);
  }

  &--dark-mode {
    --item-color: var(--text-secondary-invert-main);
  }

  &--non-active {
    padding: 0;
    font-weight: 500;

    &:hover {
      --background-hover-color: transparent;
    }
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

.network-item__title {
  font-weight: 400;
  font-size: toRem(16);
  color: var(--item-color);
  user-select: none;

  .network-item--non-active & {
    font-weight: 500;
  }
}
</style>
