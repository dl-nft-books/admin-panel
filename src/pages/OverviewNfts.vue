<script lang="ts" setup>
import { ref, computed } from 'vue'
import { InputField } from '@/fields'
import {
  Icon,
  Loader,
  NftCard,
  ErrorMessage,
  NoDataMessage,
  AppButton,
} from '@/common'

import { ErrorHandler } from '@/helpers'
import { BookRecord } from '@/records'
import { BOOK_DEPLOY_STATUSES, WINDOW_BREAKPOINTS } from '@/enums'
import { useWindowSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { getBooks } from '@/api'
import { usePaginate } from '@/composables'
import { Book } from '@/types'

const searchByString = ref('')
const booksList = ref<BookRecord[]>([])
const isLoadFailed = ref(false)

const { width } = useWindowSize()
const { t } = useI18n()

const { loadNextPage, isLoading, isLoadMoreBtnShown } = usePaginate(
  loadList,
  setList,
  concatList,
  onError,
)

function loadList() {
  return getBooks({
    deployStatus: [BOOK_DEPLOY_STATUSES.successful],
  })
}

function setList(chunk: Book[]) {
  booksList.value = chunk.map(book => new BookRecord(book)) ?? []
}

function concatList(chunk: Book[]) {
  booksList.value = booksList.value.concat(
    chunk.map(book => new BookRecord(book)) ?? [],
  )
}

function onError(e: Error) {
  ErrorHandler.processWithoutFeedback(e)
  isLoadFailed.value = true
}

const search = async () => {
  try {
    const { data } = await getBooks({
      deployStatus: [BOOK_DEPLOY_STATUSES.successful],
      title: searchByString.value,
    })

    booksList.value = data.map(book => new BookRecord(book)) ?? []
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.processWithoutFeedback(e)
  }
  return true
}

const buttonLinkText = computed(() =>
  width.value >= WINDOW_BREAKPOINTS.small
    ? t('overview-nfts.create-button')
    : '',
)
</script>

<template>
  <div class="overview-nfts">
    <div class="overview-nfts__header">
      <h2 class="overview-nfts__title">
        {{ $t('overview-nfts.title') }}
      </h2>
      <div class="overview-nfts__search-wrapper" @v-on:keyup.enter="search">
        <app-button
          size="default"
          scheme="default"
          class="overview-nfts__search-button"
          @click="search"
        >
          <icon class="overview-nfts__search-icon" :name="$icons.search" />
        </app-button>
        <input-field
          class="overview-nfts__search"
          v-model="searchByString"
          :placeholder="$t('overview-nfts.search-placeholder')"
          iconned
        />
      </div>
    </div>

    <template v-if="isLoadFailed">
      <error-message
        :message="$t('overview-nfts.error-message')"
        :title="$t('overview-nfts.error-title')"
      />
    </template>
    <template v-else-if="booksList.length || isLoading">
      <template v-if="booksList.length">
        <div class="overview-nfts__content">
          <nft-card v-for="(nft, idx) in booksList" :key="idx" :nft="nft" />
        </div>
      </template>
      <template v-if="isLoading">
        <loader />
      </template>

      <app-button
        v-if="isLoadMoreBtnShown"
        class="overview-nfts__load-more-btn"
        size="small"
        scheme="flat"
        :text="$t('overview-nfts.load-more-btn')"
        @click="loadNextPage"
      />
    </template>
    <template v-else>
      <no-data-message :message="$t('overview-nfts.no-data-message')" />
    </template>

    <mounted-teleport to="#app-navbar__right-buttons">
      <app-button
        class="overview-nfts__link-button"
        size="small"
        :icon-left="$icons.plus"
        :text="buttonLinkText"
        :route="{ name: $routes.nftsCreate }"
      />
    </mounted-teleport>
  </div>
</template>

<style lang="scss" scoped>
$z-icon: 2;

.overview-nfts__header {
  display: flex;
  justify-content: space-between;

  @include respond-to(small) {
    flex-direction: column;
    align-items: center;
    gap: toRem(20);
  }
}

.overview-nfts__title {
  font-weight: 600;
  font-size: toRem(40);

  @include respond-to(small) {
    font-size: toRem(30);
  }
}

.overview-nfts__search-wrapper {
  position: relative;
  width: toRem(180);

  @include respond-to(small) {
    width: 100%;
  }
}

.overview-nfts__search-button {
  z-index: $z-icon;
  width: toRem(20);
  height: toRem(20);
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: toRem(20);
}

.overview-nfts__search-icon {
  width: 100%;
  height: 100%;
}

.overview-nfts__content {
  margin-top: toRem(20);
  display: flex;
  flex-direction: column;
  row-gap: toRem(15);

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

  @include respond-to(small) {
    width: toRem(54);
    height: toRem(54);
    order: 1;
  }
}

.overview-nfts__load-more-btn {
  margin: toRem(20) auto 0;
}
</style>
