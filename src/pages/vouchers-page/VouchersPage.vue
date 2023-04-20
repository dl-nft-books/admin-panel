<template>
  <div class="vouchers-page">
    <mounted-teleport to="#app-navbar__right-buttons">
      <app-button
        class="vouchers-page__create-btn"
        size="small"
        :icon-left="$icons.plus"
        :text="buttonText"
        @click="showCreateModal"
      />
    </mounted-teleport>
    <modal v-model:is-shown="isCreateModalShown">
      <template #default="{ modal }">
        <create-voucher-form @close="modal.close" />
      </template>
    </modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Modal, AppButton } from '@/common'
import { useWindowSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { WINDOW_BREAKPOINTS } from '@/enums'
import { CreateVoucherForm } from '@/forms'

const { width } = useWindowSize()
const { t } = useI18n()

const isCreateModalShown = ref(false)

const showCreateModal = () => {
  isCreateModalShown.value = true
}
const buttonText = computed(() =>
  width.value >= WINDOW_BREAKPOINTS.tablet ? t('vouchers-page.create-lbl') : '',
)
</script>

<style lang="scss" scoped>
.vouchers-page__create-btn {
  width: toRem(200);
  order: -1;
  text-transform: uppercase;

  @include respond-to(tablet) {
    width: toRem(54);
    height: toRem(54);
    order: 1;
  }
}
</style>
