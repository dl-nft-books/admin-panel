<script lang="ts" setup>
import { Icon } from '@/common'
import { formatFiatAssetFromWei } from '@/helpers'
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
        {{ formatFiatAssetFromWei(book.price, 'USD') }}
      </p>
    </div>
    <div class="nft-details__row">
      <p class="nft-details__row-label">
        {{ $t('nft-details.document-lbl') }}
      </p>
      <a
        target="_blank"
        rel="noopener"
        :href="book.fileUrl"
        class="nft-details__row-value nft-details__row-value--document"
      >
        <span class="nft-details__row-value--document-text">
          {{ book.fileName }}
        </span>
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
$icon-size: toRem(20);

.nft-details {
  display: flex;
  flex-direction: column;
  gap: toRem(16);
}

.nft-details__row {
  display: grid;
  grid-template-columns: toRem(185) 1fr;
  grid-gap: toRem(20);
  position: relative;

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
  max-width: 25vw;
  word-wrap: break-word;

  @include respond-to(medium) {
    font-size: toRem(16);
    max-width: 40vw;
  }

  @include respond-to(small) {
    max-width: 90vw;
  }
}

.nft-details__row-value--document {
  display: flex;
  align-items: center;
  cursor: pointer;
  max-width: 100%;
  overflow: hidden;
}

.nft-details__row-value--document-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.nft-details__row-icon {
  display: inline-block;
  width: $icon-size;
  height: $icon-size;
  min-width: $icon-size;
  color: var(--primary-main);
  margin-left: toRem(10);
}
</style>
