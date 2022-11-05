<script lang="ts" setup>
import { formatDMY } from '@/helpers'
import { formatFiatAsset } from '@/helpers'
import { BookRecord } from '@/records'

defineProps<{
  nft: BookRecord
}>()
</script>

<template>
  <router-link
    class="nft-card"
    :to="{ name: $routes.nftItem, params: { id: nft.id } }"
  >
    <img class="nft-card__img" :src="nft.bannerUrl" alt="Book image" />
    <div class="nft-card__content-wrapper">
      <div class="nft-card__content">
        <span class="nft-card__desc">
          {{ $t('nft-card.name-description') }}
        </span>
        <span class="nft-card__value">
          {{ nft.title }}
        </span>
      </div>
      <div class="nft-card__content">
        <span class="nft-card__desc">
          {{ $t('nft-card.date-description') }}
        </span>
        <span class="nft-card__value">
          {{ formatDMY(nft.createdAt) }}
        </span>
      </div>
      <div class="nft-card__content">
        <span class="nft-card__desc">
          {{ $t('nft-card.price-description') }}
        </span>
        <span class="nft-card__value">
          <!-- FIXME: fix `assetCode` after bekend -->
          {{ formatFiatAsset(nft.price, 'USD') }}
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

  @include respond-to(medium) {
    flex-direction: column;
  }
}

.nft-card__img {
  max-width: toRem(100);
  max-height: toRem(100);
  margin-right: toRem(35);

  @include respond-to(xmedium) {
    max-width: toRem(75);
    max-height: toRem(75);
  }

  @include respond-to(medium) {
    max-width: toRem(200);
    max-height: toRem(200);
    margin: 0 auto;
  }
}

.nft-card__content-wrapper {
  display: flex;
  justify-content: space-between;
  flex: 1;

  @include respond-to(medium) {
    flex-direction: column;
    width: 100%;
    align-items: center;
  }
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

  @include respond-to(medium) {
    width: 100%;
    margin: 0;

    &:first-child {
      width: 100%;
      margin-top: toRem(20);
    }

    &:nth-child(2n) {
      margin: toRem(20) 0;
    }
  }
}

.nft-card__desc {
  color: var(--text-secondary-main);
  font-weight: 400;

  @include respond-to(xmedium) {
    font-size: toRem(14);
  }

  @include respond-to(medium) {
    text-align: center;
  }
}

.nft-card__value {
  color: var(--text-primary-main);
  font-weight: 500;
  font-size: toRem(20);
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
  white-space: nowrap;

  @include respond-to(xmedium) {
    font-size: toRem(14);
  }

  @include respond-to(medium) {
    text-align: center;
  }
}
</style>
