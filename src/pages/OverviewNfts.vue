<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import {
  Loader,
  NftCard,
  ErrorMessage,
  NoDataMessage,
  AppButton,
  Icon,
} from '@/common'

import { ErrorHandler } from '@/helpers'
import { BookRecord } from '@/records'
import {
  BOOK_DEPLOY_STATUSES,
  ETHEREUM_CHAINS,
  POLYGON_CHAINS,
  Q_CHAINS,
  WINDOW_BREAKPOINTS,
} from '@/enums'
import { useWindowSize } from '@vueuse/core'
import { InputField, SelectField } from '@/fields'
import { getBooks } from '@/api'
import { usePaginate, useContext } from '@/composables'
import { Book } from '@/types'
import { debounce } from 'lodash'
import { config } from '@/config'

const searchByString = ref('')
const searchModel = ref('')
const booksList = ref<BookRecord[]>([])
const isLoadFailed = ref(false)

const { width } = useWindowSize()
const { $t } = useContext()

watch(
  searchModel,
  debounce(() => {
    searchByString.value = searchModel.value
  }, 400),
)

const currentChainId = ref('0')

const prodOptions = [
  {
    label: $t('overview-nfts.all-networks-filter'),
    value: '0',
  },
  {
    label: $t('overview-nfts.ethereum-filter'),
    value: ETHEREUM_CHAINS.ethereum,
  },
  {
    label: $t('overview-nfts.polygon-filter'),
    value: POLYGON_CHAINS.mainnet,
  },
  {
    label: $t('overview-nfts.q-filter'),
    value: Q_CHAINS.mainet,
  },
]

const devOptions = [
  {
    label: $t('overview-nfts.all-networks-filter'),
    value: '0',
  },
  {
    label: $t('overview-nfts.ethereum-filter'),
    value: ETHEREUM_CHAINS.goerli,
  },
  {
    label: $t('overview-nfts.polygon-filter'),
    value: POLYGON_CHAINS.mumbai,
  },
  {
    label: $t('overview-nfts.q-filter'),
    value: Q_CHAINS.testnet,
  },
]

const filterOptions =
  config.DEPLOY_ENVIRONMENT === 'production' ? prodOptions : devOptions

const loadList = computed(
  () => () =>
    getBooks({
      deployStatus: [BOOK_DEPLOY_STATUSES.successful],
      title: searchByString.value,
      chainId: Number(currentChainId.value),
    }),
)

const { loadNextPage, isLoading, isLoadMoreBtnShown } = usePaginate(
  loadList,
  setList,
  concatList,
  onError,
)

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

const buttonLinkText = computed(() =>
  width.value >= WINDOW_BREAKPOINTS.small
    ? $t('overview-nfts.create-button')
    : '',
)
</script>

<template>
  <div class="overview-nfts">
    <div class="overview-nfts__header">
      <h2 class="overview-nfts__title">
        {{ $t('overview-nfts.title') }}
      </h2>
      <section class="overview-nfts__filter-wrapper">
        <select-field
          v-model="currentChainId"
          class="overview-nfts__filter"
          :value-options="filterOptions"
        />
        <div class="overview-nfts__search-wrapper">
          <input-field
            v-model="searchModel"
            :placeholder="$t('overview-nfts.search-placeholder')"
            iconned
          >
            <template #nodeLeft>
              <icon class="overview-nfts__search-icon" :name="$icons.search" />
            </template>
          </input-field>
        </div>
      </section>
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
  width: 40%;
  min-width: toRem(350);
}

.overview-nfts__filter {
  max-width: toRem(350);
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
    width: 50%;
  }
}

.overview-nfts__search-icon {
  --size: #{toRem(20)};

  max-width: var(--size);
  height: var(--size);
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
