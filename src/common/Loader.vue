<template>
  <div class="loader">
    <component :is="loader" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Spinner } from '@/common/loader'
import { LOADERS_SCHEMES } from '@/enums'

const props = withDefaults(
  defineProps<{
    scheme?: LOADERS_SCHEMES
  }>(),
  {
    scheme: LOADERS_SCHEMES.spinner,
  },
)

const loader = computed(() => {
  switch (props.scheme) {
    case LOADERS_SCHEMES.spinner:
    default:
      return Spinner
  }
})
</script>

<style lang="scss" scoped>
.loader {
  display: grid;
  place-items: center;
}
</style>
