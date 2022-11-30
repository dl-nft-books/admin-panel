<template>
  <teleport :to="to" v-if="isMounted">
    <slot />
  </teleport>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

defineProps<{ to: string }>()

const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})
</script>
