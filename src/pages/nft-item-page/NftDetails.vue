<template>
  <div class="nft-details">
    <div
      v-for="(item, index) in nftDetails"
      :key="index"
      class="nft-details__row"
    >
      <p class="nft-details__row-label nft-details__row-label--size-medium">
        {{ item.label }}
      </p>
      <p
        v-if="!item.isUrl"
        class="nft-details__row-value nft-details__row-value--size-x-large"
      >
        {{ item.value }}
      </p>
      <a
        v-else
        target="_blank"
        rel="noopener"
        :href="item.value"
        class="nft-details__row-value nft-details__row-value--document"
      >
        <span
          :class="[
            'nft-details__row-value',
            'nft-details__row-value--size-x-large',
            'nft-details__row-value--shortened',
          ]"
        >
          {{ item.value }}
        </span>
        <icon class="nft-details__row-icon" :name="$icons.download" />
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ethers } from 'ethers'
import { Icon } from '@/common'
import {
  formatAssetFromWei,
  formatFiatAssetFromWei,
  formatMDY,
} from '@/helpers'
import { BookRecord } from '@/records'
import { useContext } from '@/composables'
import { NftDetails } from '@/types'
import { CURRENCY } from '@/enums'

const props = defineProps<{ book: BookRecord }>()

const { $t } = useContext()

const details: NftDetails[] = [
  {
    label: $t('nft-details.creation-date-lbl'),
    value: formatMDY(props.book.createdAt),
  },
  {
    label: $t('nft-details.price-lbl'),
    value: formatFiatAssetFromWei(props.book.price, CURRENCY.USD),
  },
  {
    label: $t('nft-details.floor-price-lbl'),
    value: formatFiatAssetFromWei(props.book.floorPrice, CURRENCY.USD),
  },
  {
    label: $t('nft-details.voucher-lbl'),
    value:
      props.book.voucherToken !== ethers.constants.AddressZero
        ? props.book.voucherToken
        : '',
  },
  {
    label: $t('nft-details.voucher-amount-lbl'),
    value:
      props.book.voucherToken !== ethers.constants.AddressZero
        ? formatAssetFromWei(props.book.voucherTokenAmount, 2)
        : '',
  },
  {
    label: $t('nft-details.document-lbl'),
    value: props.book.fileUrl,
    isUrl: true,
  },
  {
    label: $t('nft-details.description-lbl'),
    value: props.book.description,
  },
]

const nftDetails = computed(() => details.filter(item => Boolean(item.value)))
</script>

<style lang="scss" scoped>
$icon-size: toRem(20);

.nft-details {
  @include flex-container;

  gap: toRem(10);
}

.nft-details__row {
  display: grid;
  grid-template-columns: toRem(200) 1fr;
  grid-gap: toRem(20);

  @include respond-to(xmedium) {
    grid-template-columns: toRem(100) 1fr;
  }

  @include respond-to(medium) {
    display: block;
  }
}

.nft-details__row-label {
  @include p-body-2;

  color: var(--text-secondary-main);

  @include respond-to(xmedium) {
    font-size: toRem(14);
  }
}

.nft-details__row-value {
  @include p-body-2;

  max-width: 100%;
  word-break: break-word;
  white-space: pre-wrap;

  &--document {
    display: flex;
    align-items: center;
    cursor: pointer;
    max-width: 100%;
    overflow: hidden;
    font-weight: inherit;
  }

  &--shortened {
    @include text-ellipsis;
  }

  @include respond-to(medium) {
    font-size: toRem(16);
    max-width: 40vw;
  }

  @include respond-to(small) {
    max-width: 90vw;
  }
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
