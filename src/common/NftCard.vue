<script lang="ts" setup>
import { NFT_TYPE } from '@/types'
import moment from 'moment'

defineProps<{
  nft: NFT_TYPE
}>()
</script>

<template>
  <router-link class="nft-card" to="/">
    <img class="nft-card__img" :src="nft.img" alt="Book image" />
    <div class="nft-card__content-wrapper">
      <div class="nft-card__content">
        <span class="nft-card__desc">
          {{ $t('nft-card.name-description') }}
        </span>
        <span class="nft-card__value">
          {{ nft.name }}
        </span>
      </div>
      <div class="nft-card__content">
        <span class="nft-card__desc">
          {{ $t('nft-card.date-description') }}
        </span>
        <span class="nft-card__value">
          {{ moment(nft.date).format('LL') }}
        </span>
      </div>
      <div class="nft-card__content">
        <span class="nft-card__desc">
          {{ $t('nft-card.price-description') }}
        </span>
        <span class="nft-card__value">
          {{ `$${nft.price}` }}
        </span>
      </div>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.nft-card {
  display: flex;
  align-items: center;
  width: 100%;
  border: toRem(1) solid var(--border-primary-main);
  border-radius: toRem(6);
  padding: toRem(10) toRem(15);
}

.nft-card__img {
  max-width: toRem(100);
  max-height: toRem(100);
  margin-right: toRem(35);
}

.nft-card__content-wrapper {
  display: flex;
  justify-content: space-between;
  flex: 1;
}

.nft-card__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: toRem(10);
  width: 20%;
  margin: toRem(25) 0;

  &:first-child {
    width: 35%;
  }
}

.nft-card__desc {
  color: var(--text-secondary-main);
  font-weight: 400;
}

.nft-card__value {
  color: var(--text-primary-main);
  font-weight: 500;
  font-size: toRem(20);
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
  white-space: nowrap;
}
</style>
