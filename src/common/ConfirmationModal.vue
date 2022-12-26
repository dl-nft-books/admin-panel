<template>
  <modal v-model:is-shown="isShown">
    <template #default="{ modal }">
      <form @submit.prevent="onConfirm(modal.close)" class="confirmation-modal">
        <div class="confirmation-modal__header">
          <h1 class="confirmation-modal__title">
            {{ $t('confirm-modal.title', { entity: entity.toLowerCase() }) }}
          </h1>
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
            :text="$t('confirm-modal.confirm-btn')"
            type="submit"
          />
        </section>
      </form>
    </template>
  </modal>
</template>

<script setup lang="ts">
import { toRef, Ref, ref } from 'vue'
import { Modal, AppButton } from '@/common'
import { Bus, ErrorHandler } from '@/helpers'

interface Props {
  entity?: string
  callback: () => Promise<void>
  afterActionMessage?: string
  isModalShown: Ref<{ isModalShown: boolean }>
}

const props = withDefaults(defineProps<Props>(), {
  afterActionMessage: '',
  entity: '',
  entityName: '',
})
const isShown = toRef(props.isModalShown, 'isModalShown')
const isLoading = ref<boolean>(false)

const onConfirm = async (closeModal: () => void) => {
  try {
    isLoading.value = true
    await props.callback()

    if (props.afterActionMessage) Bus.success(props.afterActionMessage)
  } catch (error) {
    ErrorHandler.process(error)
  }
  isLoading.value = false
  closeModal()
}
</script>

<style lang="scss" scoped>
.confirmation-modal {
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
