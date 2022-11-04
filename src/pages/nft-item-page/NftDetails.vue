<script lang="ts" setup>
import { Icon } from '@/common'
import { formatFiatAsset } from '@/helpers'
import { formatMDY } from '@/helpers'
import { BookRecord } from '@/records'

defineProps<{ book: BookRecord }>()
</script>

<template>
  <div class="nft-details">
    <div class="nft-details__row">
      <p class="nft-details__row-label">
        {{ $t('nft-details.creation-date-lbl') }}
      </p>
      <p class="nft-details__row-value">
        {{ formatMDY(book.createdAt) }}
      </p>
    </div>
    <div class="nft-details__row">
      <p class="nft-details__row-label">
        {{ $t('nft-details.price-lbl') }}
      </p>
      <p class="nft-details__row-value">
        <!-- FIXME: fix `assetCode` after bekend -->
        {{ formatFiatAsset(book.price, 'USD') }}
      </p>
    </div>
    <div class="nft-details__row">
      <p class="nft-details__row-label">
        {{ $t('nft-details.document-lbl') }}
      </p>
      <!-- FIXME: fix `href` after bekend -->
      <a
        target="_blank"
        rel="noopener"
        :href="`http://dltestbucketdl.s3.eu-west-1.amazonaws.com/${book.fileKey}`"
        class="nft-details__row-value nft-details__row-value--document"
      >
        {{ book.fileName }}
        <icon class="nft-details__row-icon" :name="$icons.download" />
      </a>
    </div>
    <div class="nft-details__row">
      <p class="nft-details__row-label">
        {{ $t('nft-details.description-lbl') }}
      </p>
      <p class="nft-details__row-value">
        {{ book.description }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nft-details {
  display: flex;
  flex-direction: column;
  gap: toRem(16);
}

.nft-details__row {
  display: grid;
  grid-template-columns: toRem(185) 1fr;
  grid-gap: toRem(20);

  @include respond-to(xmedium) {
    grid-template-columns: toRem(100) 1fr;
  }

  @include respond-to(medium) {
    display: block;
  }
}

.nft-details__row-label {
  font-size: toRem(18);
  line-height: 1.2;
  color: var(--text-secondary-main);

  @include respond-to(xmedium) {
    font-size: toRem(14);
  }
}

.nft-details__row-value {
  font-weight: 400;
  font-size: toRem(20);
  line-height: 1.2;

  @include respond-to(xmedium) {
    font-size: toRem(16);
  }
}

.nft-details__row-value--document {
  display: flex;
  align-items: center;
  cursor: pointer;
  max-width: max-content;
}

.nft-details__row-icon {
  display: block;
  margin-left: toRem(10);
  width: toRem(24);
  height: toRem(24);
  color: var(--primary-main);
}
</style>
