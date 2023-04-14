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
import { ref, computed } from 'vue'
import {
  Loader,
  NftCard,
  ErrorMessage,
  NoDataMessage,
  AppButton,
} from '@/common'

import { ErrorHandler } from '@/helpers'
import { WINDOW_BREAKPOINTS } from '@/enums'
import { useWindowSize } from '@vueuse/core'
import { useContractPagination, useBooks, BaseBookInfo } from '@/composables'
import { useI18n } from 'vue-i18n'
import { useWeb3ProvidersStore, useRolesStore } from '@/store'

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

function setList(chunk: BaseBookInfo[]) {
  booksList.value = chunk ? chunk.filter(book => !book.isDisabled) : []
}

function concatList(chunk: BaseBookInfo[]) {
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

const buttonLinkText = computed(() =>
  width.value >= WINDOW_BREAKPOINTS.tablet
    ? t('overview-nfts.create-button')
    : '',
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

  @include respond-to(tablet) {
    width: toRem(54);
    height: toRem(54);
    order: 1;
  }
}

.overview-nfts__load-more-btn {
  margin: toRem(20) auto 0;
}
</style>
