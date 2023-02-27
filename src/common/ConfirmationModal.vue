<template>
  <modal v-model:is-shown="isModalShown">
    <template #default="{ modal }">
      <form
        class="confirmation-modal__form"
        @submit.prevent="onConfirm(modal.close)"
      >
        <div class="confirmation-modal__header">
          <h4 class="confirmation-modal__title">
            {{ $t('confirm-modal.title', { entity: entity.toLowerCase() }) }}
          </h4>
          <p class="confirmation-modal__subtitle">
            {{ $t('confirm-modal.subtitle') }}
          </p>
        </div>

        <section class="confirmation-modal__actions">
          <app-button
            class="confirmation-modal__button"
            scheme="flat"
            size="medium"
            :text="$t('confirm-modal.decline-btn')"
            @click="modal.close"
          />
          <app-button
            class="confirmation-modal__button"
            size="small"
            type="submit"
            :text="$t('confirm-modal.confirm-btn')"
          />
        </section>
      </form>
    </template>
  </modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Modal, AppButton } from '@/common'

const emit = defineEmits<{
  (event: 'confirm'): void
  (event: 'update:is-shown', value: boolean): void
}>()

const props = withDefaults(
  defineProps<{
    entity?: string
    isShown: boolean
  }>(),
  {
    entity: '',
  },
)

const isModalShown = ref(false)

watch(
  () => props.isShown,
  value => {
    isModalShown.value = value
  },
)

watch(isModalShown, value => {
  emit('update:is-shown', value)
})

const onConfirm = async (closeModal: () => void) => {
  emit('confirm')
  closeModal()
}
</script>

<style lang="scss" scoped>
.confirmation-modal__form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: toRem(32);
  width: toRem(400);
  padding: 0;

  @include respond-to(small) {
    width: 100%;
  }
}

.confirmation-modal__header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: toRem(4);
}

.confirmation-modal__title {
  font-size: toRem(32);
  line-height: 150%;
}

.confirmation-modal__subtitle {
  font-weight: 400;
  font-size: toRem(18);
  line-height: 150%;
  color: var(--text-primary-main);
  opacity: 0.6;
}

.confirmation-modal__actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.confirmation-modal__button {
  height: toRem(48);
  width: 45%;
  text-transform: uppercase;
}
</style>
