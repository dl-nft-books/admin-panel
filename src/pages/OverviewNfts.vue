<script lang="ts" setup>
import { ref } from 'vue'
import { InputField } from '@/fields'
import {
  Icon,
  Loader,
  NftCard,
  ErrorMessage,
  NoDataMessage,
  AppButton,
} from '@/common'

import { ErrorHandler, getBooks } from '@/helpers'
import { BookRecord } from '@/records'
import { BOOK_DEPLOY_STATUSES } from '@/enums'

const searchByString = ref('')
const booksList = ref<BookRecord[]>([])
const isLoaded = ref(false)
const isErrored = ref(false)
const loadNfts = async () => {
  isLoaded.value = false
  try {
    const data = await getBooks({
      deployStatus: [BOOK_DEPLOY_STATUSES.successful],
    })
    booksList.value = data.map(book => new BookRecord(book))
  } catch (e) {
    ErrorHandler.processWithoutFeedback(e)
    isErrored.value = true
  }
  isLoaded.value = true
}

const search = () => {
  return true
}

loadNfts()
</script>

<template>
  <div class="overview-nfts">
    <template v-if="isLoaded">
      <template v-if="isErrored">
        <error-message
          :message="$t('overview-nfts.error-message')"
          :title="$t('overview-nfts.error-title')"
        />
      </template>
      <template v-else>
        <template v-if="booksList.length">
          <div class="overview-nfts__header">
            <h2 class="overview-nfts__title">
              {{ $t('overview-nfts.title') }}
            </h2>
            <div class="overview-nfts__search-wrapper">
              <app-button
                size="default"
                scheme="default"
                class="overview-nfts__search-button"
                @click="search"
              >
                <icon
                  class="overview-nfts__search-icon"
                  :name="$icons.search"
                />
              </app-button>
              <input-field
                class="overview-nfts__search"
                v-model="searchByString"
                :placeholder="$t('overview-nfts.search-placeholder')"
                iconned
              />
            </div>
          </div>
          <div class="overview-nfts__content">
            <nft-card v-for="(nft, idx) in booksList" :key="idx" :nft="nft" />
          </div>
        </template>
        <template v-else>
          <no-data-message :message="$t('overview-nfts.no-data-message')" />
        </template>
      </template>
    </template>
    <loader v-else />
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
</style>
