<script lang="ts" setup>
import { Loader, ErrorMessage } from '@/common'
import { NftDetails, SaleHistory } from '@/pages/nft-item-page'

import { ErrorHandler, getBookById } from '@/helpers'
import { BookSaleHistory } from '@/types'
import { ref } from 'vue'
import { BookRecord } from '@/records'

const props = defineProps<{
  id: string
}>()

const isLoaded = ref(false)
const isLoadFailed = ref(false)

const book = ref<BookRecord | undefined>()
const history = ref<BookSaleHistory[]>([])

const init = async () => {
  try {
    const bookData = await getBookById(props.id)
    book.value = new BookRecord(bookData)
    await loadHistory()
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
    isLoadFailed.value = true
  }
  isLoaded.value = true
}

const loadHistory = async () => {
  history.value = [
    {
      id: 1,
      purchaseDate: '2010-04-02T14:12:07',
      price: {
        amount: 109,
        assetCode: 'USD',
      },
      token: {
        amount: '0,0056',
        assetCode: 'BTC',
      },
      bookLink: 'http://gateway.ipfs.io/ipfs/25135613/books',
      buyerAddress: '0x383E0c79540569a0F70d48c6cA31D0aF09B3B626',
    },
  ] as BookSaleHistory[]
}

init()
</script>

<template>
  <div class="nft-item-page">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message :message="$t('nft-item-page.loading-error-msg')" />
      </template>
      <template v-else-if="book">
        <div class="nft-item-page__book">
          <div class="nft-item-page__cover-wrp">
            <img
              :src="`http://dltestbucketdl.s3.eu-west-1.amazonaws.com/${book.fileKey}`"
              :alt="book.title"
              class="nft-item-page__cover"
            />
          </div>
          <div class="nft-item-page__details">
            <h1 class="nft-item-page__title">
              {{ book.title }}
            </h1>
            <nft-details :book="book" />
          </div>
        </div>
        <sale-history :history="history" />
      </template>
    </template>
    <template v-else>
      <loader />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.nft-item-page {
  width: 100%;
}

.nft-item-page__book {
  display: grid;
  grid-template-columns: minmax(#{toRem(200)}, #{toRem(300)}) minmax(60%, 1fr);
  grid-column-gap: toRem(50);
  justify-content: center;
  margin-bottom: toRem(56);

  @include respond-to(medium) {
    display: block;
  }
}

.nft-item-page__cover-wrp {
  width: 100%;

  @include respond-to(medium) {
    max-width: toRem(300);
    margin: 0 auto;
  }
}

.nft-item-page__cover {
  width: 100%;
  height: auto;
}

.nft-item-page__details {
  display: flex;
  flex-direction: column;
  border-bottom: toRem(1) solid var(--border-primary-dark);
  padding-bottom: toRem(30);
}

.nft-item-page__title {
  text-transform: uppercase;
  font-size: toRem(30);
  line-height: 1.2;
  margin-bottom: toRem(30);

  @include respond-to(xmedium) {
    font-size: toRem(20);
  }

  @include respond-to(medium) {
    text-align: center;
    margin-top: toRem(20);
  }
}

.nft-item-page__tabs {
  margin-bottom: toRem(40);
}
</style>
