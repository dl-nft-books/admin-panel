<script lang="ts" setup>
import { Icon } from '@/common'

type SCHEMES = 'dark' | 'light'

const props = withDefaults(
  defineProps<{
    scheme?: SCHEMES
  }>(),
  {
    scheme: 'light',
  },
)
</script>

<template>
  <router-link
    :class="`app-logo app-logo--${props.scheme}`"
    :to="{ name: $routes.nfts }"
  >
    <icon class="app-logo__book-icon" :name="$icons.appLogo" />
  </router-link>
</template>

<style lang="scss" scoped>
.app-logo {
  display: flex;
  align-items: center;
  color: var(--text-primary-main);

  &--light {
    color: var(--text-primary-invert-main);
  }
}

.app-logo__book-icon {
  max-width: toRem(255);
  max-height: toRem(45);
}
</style>
