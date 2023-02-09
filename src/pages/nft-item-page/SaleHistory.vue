<template>
  <div class="sale-history">
    <h2 class="sale-history__header">
      {{ $t('sale-history.header') }}
    </h2>

    <template v-if="isLoadFailed">
      <error-message :message="$t('sale-history.loading-error-msg')" />
    </template>
    <template v-else-if="history.length || isLoading">
      <template v-if="history.length">
        <div class="sale-history__list">
          <sale-history-item
            v-for="item in history"
            :key="item.id"
            :history-item="item"
          />
        </div>
      </template>
      <template v-if="isLoading">
        <loader />
      </template>

      <app-button
        v-if="isLoadMoreBtnShown"
        class="sale-history__load-more-btn"
        size="small"
        scheme="flat"
        :text="$t('sale-history.load-more-btn')"
        @click="loadNextPage"
      />
    </template>
    <template v-else>
      <no-data-message :message="$t('sale-history.no-data-message')" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { Loader, ErrorMessage, NoDataMessage, AppButton } from '@/common'
import { SaleHistoryItem } from '@/pages/nft-item-page'
import { Payment } from '@/types'

import { ErrorHandler } from '@/helpers'
import { getPayments } from '@/api'
import { ref, computed } from 'vue'
import { usePaginate } from '@/composables'

const props = defineProps<{ bookId: string | number }>()

const isLoadFailed = ref(false)

const history = ref<Payment[]>([])

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

.sale-history__list {
  display: grid;
  grid-gap: toRem(16);
}

.sale-history__load-more-btn {
  margin: toRem(20) auto 0;
}
</style>
