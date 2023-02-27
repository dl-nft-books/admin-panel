<template>
  <teleport to="#modal">
    <transition name="modal">
      <div v-if="isShown" class="modal">
        <div class="modal__pane" ref="modalPane">
          <slot :modal="{ close: closeModal }" />
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const emit = defineEmits<{
  (event: 'update:is-shown', payload: boolean): void
}>()

const props = withDefaults(
  defineProps<{
    isShown?: boolean
    isCloseByClickOutside?: boolean
  }>(),
  {
    isShown: false,
    isCloseByClickOutside: true,
  },
)

const modalPane = ref<HTMLElement | undefined>()

const closeModal = () => {
  emit('update:is-shown', false)
}

onMounted(() => {
  if (!modalPane.value || !props.isCloseByClickOutside) return

  onClickOutside(modalPane, () => {
    closeModal()
  })
})
</script>

<style lang="scss" scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: vh(100);
  background: rgba(var(--black-rgb), 0.5);
  z-index: var(--z-index-layer-2);
}

.modal__pane {
  position: relative;
  background: var(--background-primary);
  padding: toRem(35);
  border-radius: toRem(10);
}

.modal-enter-active,
.modal-leave-active {
  transition: 0.25s ease;
  transition-property: opacity, transform;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>
