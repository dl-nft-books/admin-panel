<template>
  <div class="overview-nfts">
    <div class="overview-nfts__header">
      <h3>
        {{ $t('overview-nfts.title') }}
      </h3>
    </div>

    <error-message
      v-if="isLoadFailed"
      :message="$t('overview-nfts.error-message')"
      :title="$t('overview-nfts.error-title')"
    />

    <template v-else-if="booksList.length || isLoading">
      <div v-if="booksList.length" class="overview-nfts__content">
        <nft-card
          v-for="nft in booksList"
          :key="nft.tokenContract as string"
          :nft="nft"
        />
      </div>

      <loader v-if="isLoading" />

      <app-button
        v-if="isLoadMoreBtnShown"
        class="overview-nfts__load-more-btn"
        size="small"
        scheme="flat"
        :text="$t('overview-nfts.load-more-btn')"
        @click="loadNextPage"
      />
    </template>

    <no-data-message v-else :message="$t('overview-nfts.no-data-message')" />

    <mounted-teleport to="#app-navbar__right-buttons">
      <app-button
        v-if="rolesStore.hasMarkerplaceManagerRole"
        class="overview-nfts__link-button"
        size="small"
        :icon-left="$icons.plus"
        :text="buttonLinkText"
        :route="{ name: $routes.nftsCreate }"
      />
    </mounted-teleport>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import {
  Loader,
  NftCard,
  ErrorMessage,
  NoDataMessage,
  AppButton,
} from '@/common'

import { ErrorHandler, redirectByAccessLevel } from '@/helpers'
import { WINDOW_BREAKPOINTS } from '@/enums'
import { useWindowSize } from '@vueuse/core'
import { useContractPagination, useBooks, BaseBookInfo } from '@/composables'
import { useI18n } from 'vue-i18n'
import { useWeb3ProvidersStore, useRolesStore } from '@/store'
import { DateUtil } from '@/utils/date.util'

const webProvidersStore = useWeb3ProvidersStore()
const rolesStore = useRolesStore()

const provider = computed(() => webProvidersStore.provider)

const booksList = ref<BaseBookInfo[]>([])
const isLoadFailed = ref(false)

const { width } = useWindowSize()
const { t } = useI18n()

const { getBooksFromContract } = useBooks()

const loadList = computed(
  () => (limit: number, offset: number) =>
    getBooksFromContract(limit, offset, provider.value.chainId),
)

// filtering disabled books and sorting to show user the newest books first
const processBookList = (bookList: BaseBookInfo[]) => {
  return bookList
    .filter(book => !book.isDisabled)
    .sort((oneBook, anotherBook) =>
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
)

const buttonLinkText = computed(() =>
  width.value >= WINDOW_BREAKPOINTS.medium
    ? t('overview-nfts.create-button')
    : '',
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
.overview-nfts__header {
  display: flex;
  justify-content: space-between;

  @include respond-to(small) {
    flex-direction: column;
    align-items: center;
    gap: toRem(20);
  }
}

.overview-nfts__filter-wrapper {
  display: flex;
  align-items: center;
  gap: toRem(20);
  min-width: toRem(350);
}

.overview-nfts__content {
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

.overview-nfts__link-button {
  width: toRem(180);
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

.overview-nfts__load-more-btn {
  margin: toRem(20) auto 0;
}
</style>
