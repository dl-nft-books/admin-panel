<script lang="ts" setup>
import { Icon, AppButton } from '@/common'
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
      <a
        target="_blank"
        rel="noopener"
        :href="book.fileUrl"
        class="nft-details__row-value nft-details__row-value--document"
      >
        {{ book.fileName }}
      </a>
      <app-button
        class="nft-details__row-icon-button"
        aria-label="Open sidebar button"
        size="default"
        scheme="default"
        :href="book.fileUrl"
      >
        <icon class="nft-details__row-icon" :name="$icons.download" />
      </app-button>
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

  @include respond-to(xmedium) {
    font-size: toRem(16);
  }
}

.nft-details__row-value--document {
  display: inline-block;
  position: relative;
  align-items: center;
  cursor: pointer;
  max-width: calc(100% - #{$icon-size});
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.nft-details__row-icon-button {
  display: inline-block;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: $icon-size;
  height: $icon-size;

  @include respond-to(medium) {
    top: 95%;
    transform: translateY(-100%);
  }
}

.nft-details__row-icon {
  width: 100%;
  height: 100%;
  color: var(--primary-main);
}
</style>
