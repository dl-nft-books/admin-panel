<template>
  <router-link
    class="nft-card"
    :to="{ name: $routes.nftItem, params: { id: nft.id } }"
  >
    <img class="nft-card__img" :src="nft.bannerUrl" alt="Book image" />
    <div class="nft-card__content-wrapper">
      <div
        v-for="(item, index) in cardHeader"
        :key="index"
        class="nft-card__content"
      >
        <span class="nft-card__content-label">
          {{ item.label }}
        </span>
        <p class="nft-card__content-value">
          {{ item.value }}
        </p>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts" setup>
import { formatFiatAssetFromWei, formatDMY } from '@/helpers'
import { BookRecord } from '@/records'
import { CURRENCIES } from '@/enums'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  nft: BookRecord
}>()

const { t } = useI18n()

const cardHeader = [
  {
    label: t('nft-card.name-description'),
    value: props.nft.title,
  },
  {
    label: t('nft-card.date-description'),
    value: formatDMY(props.nft.createdAt),
  },
  {
    label: t('nft-card.price-description'),
    value: formatFiatAssetFromWei(props.nft.price, CURRENCIES.USD),
  },
]
</script>

<style lang="scss" scoped>
.nft-card {
  display: flex;
  align-items: center;
  width: 100%;
  border: toRem(1) solid var(--border-primary-main);
  border-radius: toRem(6);
  padding: toRem(10) toRem(15);
  background: var(--background-tertiary);

  @include respond-to(medium) {
    flex-direction: column;
  }
}

.nft-card__img {
  max-width: toRem(100);
  max-height: toRem(100);
  margin-right: toRem(35);
  border-radius: toRem(8);

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

.nft-card__content-label {
  color: var(--text-secondary-main);
  font-size: toRem(16);
  line-height: 120%;

  @include respond-to(medium) {
    font-size: toRem(14);
    text-align: center;
  }
}

.nft-card__content-value {
  font-size: toRem(20);
  line-height: 120%;
  width: 100%;
  max-width: 40vw;
  font-weight: 500;

  @include text-ellipsis;

  @include respond-to(medium) {
    text-align: center;
    font-size: toRem(14);
    max-width: 100%;
  }
}
</style>
