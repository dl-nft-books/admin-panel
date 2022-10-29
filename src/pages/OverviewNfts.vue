<script lang="ts" setup>
import { ref } from 'vue'
import { InputField } from '@/fields'
import { Icon, Loader, NftCard, ErrorMessage } from '@/common'
import { nftType } from '@/types'
import moment from 'moment'

const searchByString = ref('')

const isLoaded = ref(false)
const isErrored = ref(false)

const NFT_MOCK_DATA: Array<nftType> = [
  {
    id: 1,
    img: 'https://i.ibb.co/VmKdS97/book-image.png',
    name: 'Blockchain and Decentralized Sistems Vol. 1',
    date: moment(new Date()).format(),
    price: 199.99,
  },
  {
    id: 2,
    img: 'https://i.ibb.co/VmKdS97/book-image.png',
    name: 'Blockchain and Decentralized Sistems Vol. 1',
    date: moment(new Date()).format(),
    price: 199.99,
  },
  {
    id: 3,
    img: 'https://i.ibb.co/VmKdS97/book-image.png',
    name: 'Blockchain and Decentralized Sistems Vol. 1',
    date: moment(new Date()).format(),
    price: 199.99,
  },
]

const loadNfts = () => {
  isLoaded.value = false
  try {
    setTimeout(() => true)
  } catch (e) {
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
      <template v-if="!isErrored">
        <div class="overview-nfts__header">
          <h2 class="overview-nfts__title">
            {{ $t('overview-nfts.title') }}
          </h2>
          <div class="overview-nfts__search-wrapper">
            <button
              class="overview-nfts__search-button"
              type="button"
              @click="search"
            >
              <icon class="overview-nfts__search-icon" :name="$icons.search" />
            </button>
            <input-field
              class="overview-nfts__search"
              v-model="searchByString"
              :placeholder="$t('overview-nfts.search-placeholder')"
              iconned
            />
          </div>
        </div>
        <div class="overview-nfts__content">
          <nft-card v-for="(nft, idx) in NFT_MOCK_DATA" :key="idx" :nft="nft" />
        </div>
      </template>
      <error-message
        v-else
        :message="$t('overview-nfts.error-message')"
        :title="$t('overview-nfts.error-title')"
      />
    </template>
    <loader v-else />
  </div>
</template>

<style lang="scss" scoped>
$z-icon: 2;

.overview-nfts__header {
  display: flex;
  justify-content: space-between;
}

.overview-nfts__title {
  font-weight: 600;
  font-size: toRem(40);
}

.overview-nfts__search-wrapper {
  position: relative;
  width: toRem(180);
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
}
</style>
