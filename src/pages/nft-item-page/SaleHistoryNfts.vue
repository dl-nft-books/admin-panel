<template>
  <error-message
    v-if="isLoadFailed"
    :message="$t('sale-history.loading-error-msg')"
  />

  <template v-else-if="history.length || isLoading">
    <div v-if="history.length" class="sale-history-nfts">
      <sale-history-item
        v-for="item in history"
        :key="item.id"
        :history-item="item"
      />
    </div>

    <loader v-if="isLoading" />

    <app-button
      v-if="isLoadMoreBtnShown"
      class="sale-history-nfts__load-more-btn"
      size="small"
      scheme="flat"
      :text="$t('sale-history.load-more-btn')"
      @click="loadNextPage"
    />
  </template>

  <no-data-message v-else :message="$t('sale-history.no-data-message')" />
</template>

<script setup lang="ts">
import { Loader, ErrorMessage, NoDataMessage, AppButton } from '@/common'
import { SaleHistoryItem } from '@/pages/nft-item-page'
import { NftPayment } from '@/types'

import { ErrorHandler } from '@/helpers'
import { getNftPayments } from '@/api'
import { ref, computed } from 'vue'
import { usePaginate } from '@/composables'

const props = defineProps<{ bookId: string | number }>()

const isLoadFailed = ref(false)

const history = ref<NftPayment[]>([])

const loadList = computed(
  () => () =>
    getNftPayments({
      bookIds: [props.bookId],
    }),
)

const { loadNextPage, isLoading, isLoadMoreBtnShown } = usePaginate(
  loadList,
  setList,
  concatList,
  onError,
)

function setList(chunk: NftPayment[]) {
  history.value = chunk ?? []
}

function concatList(chunk: NftPayment[]) {
  history.value = history.value.concat(chunk ?? [])
}

function onError(e: Error) {
  ErrorHandler.processWithoutFeedback(e)
  isLoadFailed.value = true
}
</script>
<style scoped lang="scss">
.sale-history-nfts {
  display: grid;
  grid-gap: toRem(16);
}

.sale-history-nfts__load-more-btn {
  margin: toRem(20) auto 0;
}
</style>
