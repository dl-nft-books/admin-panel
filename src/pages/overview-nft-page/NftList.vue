<template>
  <error-message
    v-if="isLoadFailed"
    :message="$t('overview-nfts.error-message')"
    :title="$t('overview-nfts.error-title')"
  />

  <template v-else-if="booksList.length || isLoading">
    <div v-if="booksList.length" class="nft-list__item">
      <nft-card
        v-for="nft in booksList"
        :key="nft.tokenContract as string"
        :nft="nft"
      />
    </div>

    <loader v-if="isLoading" />

    <app-button
      v-if="isLoadMoreBtnShown"
      class="nft-list__load-more-btn"
      size="small"
      scheme="flat"
      :text="$t('overview-nfts.load-more-btn')"
      @click="loadNextPage"
    />
  </template>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Loader, NftCard, ErrorMessage, AppButton } from '@/common'

import { ErrorHandler } from '@/helpers'
import { useContractPagination, useBooks } from '@/composables'
import { BaseBookInfo } from '@/types'
import { useWeb3ProvidersStore } from '@/store'
import { DateUtil } from '@/utils/date.util'

const props = defineProps<{
  totalAmount: number
}>()

const webProvidersStore = useWeb3ProvidersStore()

const provider = computed(() => webProvidersStore.provider)

const booksList = ref<BaseBookInfo[]>([])
const isLoadFailed = ref(false)

const { getBooksFromContract } = useBooks()

const loadList = computed(
  () => (limit: number, offset: number) =>
    getBooksFromContract(limit, offset, provider.value.chainId),
)

// filtering disabled books and sorting to show user the newest books first
const processBookList = (bookList: BaseBookInfo[]) => {
  return bookList.sort((oneBook, anotherBook) =>
    DateUtil._instance(oneBook.created_at).isBefore(anotherBook.created_at)
      ? 1
      : -1,
  )
}

function setList(chunk: BaseBookInfo[]) {
  booksList.value = chunk.length ? processBookList(chunk) : []
}

function concatList(chunk: BaseBookInfo[]) {
  booksList.value = processBookList(
    booksList.value.concat(chunk.length ? chunk : []),
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
  {
    isReverted: true,
    totalAmount: props.totalAmount,
  },
)
</script>

<style lang="scss" scoped>
.nft-list__item {
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

.nft-list__load-more-btn {
  margin: toRem(20) auto 0;
}
</style>
