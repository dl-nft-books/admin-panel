<template>
  <div class="withdrawals-page">
    <div class="withdrawals-page__header">
      <h3>
        {{ $t('withdrawals-page.title') }}
      </h3>
    </div>

    <error-message
      v-if="isLoadFailed"
      :message="$t('withdrawals-page.error-message')"
      :title="$t('withdrawals-page.error-title')"
    />

    <template v-else-if="booksList.length || isLoading">
      <div v-if="booksList.length" class="withdrawals-page__content">
        <withdrawal-nft-card
          v-for="nft in booksList"
          :key="nft.tokenContract as string"
          :nft="nft"
        />
      </div>

      <loader v-if="isLoading" />

      <app-button
        v-if="isLoadMoreBtnShown"
        class="withdrawals-page__load-more-btn"
        size="small"
        scheme="flat"
        :text="$t('withdrawals-page.load-more-btn')"
        @click="loadNextPage"
      />
    </template>

    <no-data-message v-else :message="$t('withdrawals-page.no-data-message')" />

    <mounted-teleport to="#app-navbar__right-buttons">
      <app-button
        v-if="rolesStore.hasWithdrawalManagerRole"
        class="withdrawals-page__link-button"
        size="small"
        :icon-right="$icons.withdraw"
        :text="withdrawTitle"
        @click="isWithdrawingFunds = true"
      />
    </mounted-teleport>
    <modal v-model:is-shown="isWithdrawingFunds">
      <template #default="{ modal }">
        <withdraw-form @close="modal.close" />
      </template>
    </modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { Loader, ErrorMessage, NoDataMessage, AppButton, Modal } from '@/common'

import { WithdrawalNftCard } from '@/pages/withdrawals-page'

import { ErrorHandler } from '@/helpers'
import {
  useContractPagination,
  useBooks,
  BaseBookInfo,
  useStatistics,
} from '@/composables'
import { useWeb3ProvidersStore, useRolesStore } from '@/store'
import { WithdrawForm } from '@/forms'
import { useI18n } from 'vue-i18n'
import { useWindowSize } from '@vueuse/core'
import { WINDOW_BREAKPOINTS } from '@/enums'

const { width } = useWindowSize()
const { t } = useI18n()

const webProvidersStore = useWeb3ProvidersStore()
const rolesStore = useRolesStore()

const provider = computed(() => webProvidersStore.provider)

export type BookWithStatistics = BaseBookInfo & { totalMoneySpent: number }

const booksList = ref<BookWithStatistics[]>([])
const isLoadFailed = ref(false)
const isWithdrawingFunds = ref(false)

const { getBooksFromContract } = useBooks()
const { getStatisticByBookId } = useStatistics()

const loadList = computed(() => async (limit: number, offset: number) => {
  const data = await getBooksFromContract(limit, offset, provider.value.chainId)

  for (const [index, { id }] of data.entries()) {
    const { data: statistics } = await getStatisticByBookId(id)

    // console.log(statistics)

    data[index] = Object.assign(data[index], {
      totalMoneySpent: statistics.tokens_histogram.attributes.total,
    })
  }

  return data
})

function setList(chunk: BookWithStatistics[]) {
  booksList.value = chunk ? chunk.filter(book => !book.isDisabled) : []
}

function concatList(chunk: BookWithStatistics[]) {
  booksList.value = booksList.value.concat(
    chunk ? chunk.filter(book => !book.isDisabled) : [],
  )
}

function onError(e: Error) {
  ErrorHandler.processWithoutFeedback(e)
  isLoadFailed.value = true
}

const { isLoadMoreBtnShown, isLoading, loadNextPage } = useContractPagination(
  loadList,
  setList,
  concatList,
  onError,
)

const withdrawTitle = computed(() =>
  width.value >= WINDOW_BREAKPOINTS.medium
    ? t('withdrawals-page.withdraw-lbl')
    : '',
)
</script>

<style lang="scss" scoped>
.withdrawals-page__header {
  display: flex;
  justify-content: space-between;

  @include respond-to(small) {
    flex-direction: column;
    align-items: center;
    gap: toRem(20);
  }
}

.withdrawals-page__filter-wrapper {
  display: flex;
  align-items: center;
  gap: toRem(20);
  min-width: toRem(350);
}

.withdrawals-page__filter {
  max-width: toRem(350);
}

.withdrawals-page__search-wrapper {
  position: relative;
  width: toRem(180);

  @include respond-to(small) {
    width: 50%;
  }
}

.withdrawals-page__search-icon {
  --size: #{toRem(20)};

  max-width: var(--size);
  height: var(--size);
}

.withdrawals-page__content {
  display: flex;
  flex-direction: column;
  margin-top: toRem(20);
  row-gap: toRem(15);
  overflow: hidden;

  @include respond-to(medium) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(toRem(240), 1fr));
    max-width: 100%;
    gap: toRem(20);
  }
}

.withdrawals-page__link-button {
  order: -1;
  font-weight: 700;
  text-transform: uppercase;

  @include respond-to(medium) {
    --mobile-size: #{toRem(60)};

    width: var(--mobile-size);
    height: var(--mobile-size);
    order: 1;
  }
}

.withdrawals-page__load-more-btn {
  margin: toRem(20) auto 0;
}
</style>
