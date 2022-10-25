<script lang="ts" setup>
import { NftCard } from '@/common'
import { NFT_TYPE } from '@/types'
import moment from 'moment'

const NFT_MOCK_DATA: Array<NFT_TYPE> = [
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
</script>

<template>
  <!--  TODO: ADD COLLECTION LOADER WITH INTERSECTION OBSERVER  -->
  <div class="nft-list-section">
    <nft-card v-for="(nft, idx) in NFT_MOCK_DATA" :key="idx" :nft="nft" />
  </div>
</template>

<style lang="scss" scoped>
.nft-list-section {
  display: flex;
  flex-direction: column;
  row-gap: toRem(15);
}
</style>
