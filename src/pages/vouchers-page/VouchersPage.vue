<template>
  <div class="vouchers-page">
    <h3>{{ $t('vouchers-page.title') }}</h3>
    <section v-if="voucherList.length" class="voucher-page__items">
      <voucher-card
        v-for="voucher in voucherList"
        :key="voucher.tokenContract"
        :voucher="voucher"
      />
    </section>

    <loader v-if="isLoading" />

    <app-button
      v-if="isLoadMoreBtnShown"
      class="vouchers-page__load-more-btn"
      size="small"
      scheme="flat"
      :text="$t('vouchers-page.load-more-btn')"
      @click="loadNextPage"
    />

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
        <create-voucher-form
          @close="modal.close"
          @reload-page="loadFirstPage"
        />
      </template>
    </modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Modal, AppButton, Loader } from '@/common'
import { useWindowSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { WINDOW_BREAKPOINTS } from '@/enums'
import { CreateVoucherForm } from '@/forms'
import { useVouchers, useContractPagination } from '@/composables'
import { IMarketplace } from '@/types/contracts/MarketPlace'
import { ErrorHandler, redirectByAccessLevel } from '@/helpers'
import { VoucherCard } from '@/pages/vouchers-page'
import { useRolesStore } from '@/store'

const rolesStore = useRolesStore()

const { width } = useWindowSize()
const { t } = useI18n()
const { getVoucherList } = useVouchers()

const voucherList = ref<IMarketplace.BaseTokenDataStruct[]>([])
const isLoadFailed = ref(false)

const loadList = computed(
  () => (limit: number, offset: number) => getVoucherList(limit, offset),
)

function setList(chunk: IMarketplace.BaseTokenDataStruct[]) {
  voucherList.value = chunk ?? []
}

function concatList(chunk: IMarketplace.BaseTokenDataStruct[]) {
  voucherList.value = voucherList.value.concat(chunk ?? [])
}

function onError(e: Error) {
  ErrorHandler.processWithoutFeedback(e)
  isLoadFailed.value = true
}

const { isLoadMoreBtnShown, isLoading, loadNextPage, loadFirstPage } =
  useContractPagination(loadList, setList, concatList, onError)

const isCreateModalShown = ref(false)

const showCreateModal = () => {
  isCreateModalShown.value = true
}
const buttonText = computed(() =>
  width.value >= WINDOW_BREAKPOINTS.tablet ? t('vouchers-page.create-lbl') : '',
)

watch(
  () => rolesStore.hasMarkerplaceManagerRole,
  () => {
    if (rolesStore.hasMarkerplaceManagerRole) return

    redirectByAccessLevel()
  },
  {
    immediate: true,
  },
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

.voucher-page__items {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
  margin-top: toRem(30);
}

.vouchers-page__load-more-btn {
  margin: toRem(20) auto 0;
}
</style>
