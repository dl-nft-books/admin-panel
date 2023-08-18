<template>
  <div class="sale-history">
    <div class="sale-history__header-wrapper">
      <h4 class="sale-history__header">
        {{ $t('sale-history.header') }}
      </h4>
    </div>

    <error-message
      v-if="isLoadFailed"
      :message="$t('sale-history.loading-error-msg')"
    />

    <template v-else-if="history.length || isLoading">
      <div v-if="history.length" class="sale-history__list">
        <sale-history-item
          v-for="item in history"
          :key="item.id"
          :history-item="item"
        />
      </div>

      <loader v-if="isLoading" />

      <app-button
        v-if="isLoadMoreBtnShown"
        class="sale-history__load-more-btn"
        size="small"
        scheme="flat"
        :text="$t('sale-history.load-more-btn')"
        @click="loadNextPage"
      />
    </template>

    <no-data-message v-else :message="$t('sale-history.no-data-message')" />
  </div>
</template>

<script lang="ts" setup>
import { Loader, ErrorMessage, NoDataMessage, AppButton } from '@/common'
import { SaleHistoryItem } from '@/pages/nft-item-page'
import { Payment } from '@/types'

import { ErrorHandler } from '@/helpers'
import { ref, computed } from 'vue'
import { usePaginate, useStatistics } from '@/composables'

const props = defineProps<{ bookId: string | number }>()

const isLoadFailed = ref(false)

const history = ref<Payment[]>([])

const { getPayments } = useStatistics()

const loadList = computed(
  () => () =>
    getPayments({
      bookIds: [props.bookId],
    }),
)

const { loadNextPage, isLoading, isLoadMoreBtnShown } = usePaginate(
  loadList,
  setList,
  concatList,
  onError,
)

function setList(chunk: Payment[]) {
  history.value = chunk ?? []
}

function concatList(chunk: Payment[]) {
  history.value = history.value.concat(chunk ?? [])
}

function onError(e: Error) {
  ErrorHandler.processWithoutFeedback(e)
  isLoadFailed.value = true
}
</script>

<style lang="scss" scoped>
.sale-history__header {
  margin-bottom: toRem(20);
}

.sale-history__header-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: toRem(20);
}

.sale-history__list {
  display: grid;
  grid-gap: toRem(16);
}

.sale-history__load-more-btn {
  margin: toRem(20) auto 0;
}
</style>
