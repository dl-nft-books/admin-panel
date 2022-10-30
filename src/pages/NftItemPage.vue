<script lang="ts" setup>
import { Loader, ErrorMessage } from '@/common'
import { NftDetails, SaleHistory } from '@/pages/nft-item-page'

import { ErrorHandler } from '@/helpers'
import { Book, BookSaleHistory } from '@/types'
import { useRoute } from 'vue-router'
import { ref } from 'vue'

const isLoaded = ref(false)
const isLoadFailed = ref(false)

const book = ref<Book | undefined>()
const history = ref<BookSaleHistory[]>([])

const route = useRoute()

const init = async () => {
  try {
    await loadBook()
    await loadHistory()
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
    isLoadFailed.value = true
  }
  isLoaded.value = true
}

const loadBook = async () => {
  book.value = {
    id: route.params.id,
    title: 'Blockchain and decentralized systems, Volume 1',
    price: {
      amount: 109,
      assetCode: 'USD',
    },
    coverUrl:
      'https://images.unsplash.com/photo-1629992101753-56d196c8aabb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=990&q=80',
    description:
      'Lörem ipsum semiskop plaktig. Bent abvalens trera vipysamma. Rerade prer derade. Digisk nebelt fask. sdscqae \n' +
      'Mack nitevis. Mikropp antelånas londe. Tism svenna sitt liv i preliga. Sögisk euroråse belig. \n' +
      'Pögt ont puhet och supravinade. Dis vil gesåbelt och vaheten. Aning elektrogram eftersom miligen. Renyde korat. \n',
    meta: {
      volume: 'Volume 2',
    },
    token: {
      amount: '0,0056',
      assetCode: 'BTC',
    },
    document: {
      name: 'BDS_volume1.pdf',
    },
    signature:
      'Lörem ipsum semiskop plaktig. Bent abvalens trera vipysamma. Rerade prer derade. Digisk nebelt fask. sdscqae',
    purchaseDate: '2010-04-02T14:12:07',
  } as Book
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
              :src="book.coverUrl"
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
