<template>
  <collapse class="sale-history-item" :is-close-by-click-outside="false">
    <template #head="{ collapse }">
      <header class="sale-history-item__header">
        <div
          v-for="(item, index) in saleHeader"
          :key="index"
          class="sale-history-item__header-col"
        >
          <p
            :class="[
              'sale-history-item__header-col-label',
              'sale-history-item__header-col-label--size-x-medium',
            ]"
          >
            {{ item.label }}
          </p>
          <p
            :class="[
              'sale-history-item__header-col-value',
              'sale-history-item__header-col-value--size-x-large',
            ]"
          >
            {{ item.value }}
          </p>
        </div>
        <div class="sale-history-item__header-action">
          <app-button
            class="sale-history-item__header-action-btn"
            :class="{
              'sale-history-item__header-action-btn--open': collapse.isOpen,
            }"
            scheme="flat"
            :icon-right="$icons.arrowDown"
            size="small"
            color="secondary"
            @click="collapse.toggle"
          />
        </div>
      </header>
    </template>
    <div class="sale-history-item__body">
      <template v-for="(item, index) in saleBody" :key="index">
        <p class="sale-history-item__header-col-label">
          {{ item.label }}
        </p>
        <p
          v-if="!item.isUrl"
          :class="[
            'sale-history-item__header-col-value',
            'sale-history-item__header-col-value--overflow',
          ]"
        >
          {{ item.value }}
        </p>
        <a
          v-else
          :class="[
            'sale-history-item__header-col-value',
            'sale-history-item__header-col-value--overflow',
          ]"
          :href="item.value"
          target="_blank"
          rel="noopener"
        >
          {{ item.value }}
        </a>
      </template>
    </div>
  </collapse>
</template>

<script lang="ts" setup>
import { NftPayment, Payment } from '@/types'
import { Collapse, AppButton } from '@/common'
import {
  formatFiatAssetFromWei,
  formatAssetFromWei,
  cropAddress,
  formatDMY,
} from '@/helpers'
import { CURRENCIES } from '@/enums'
import { NftDetails } from '@/pages/nft-item-page/NftDetails.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ historyItem: Payment | NftPayment }>()

const { t } = useI18n()

const getSaleBody = () => {
  if (props.historyItem.erc20_data) {
    const historyItem = props.historyItem as Payment

    return [
      {
        label: t('sale-history-item.buyer-address-lbl'),
        value: historyItem.payer_address,
      },
      {
        label: t('sale-history-item.token-lbl'),
        value: historyItem.erc20_data.symbol,
      },
      {
        label: t('sale-history-item.token-amount-lbl'),
        value: formatAssetFromWei(
          historyItem.amount,
          historyItem.erc20_data.decimals,
        ),
      },
      {
        label: t('sale-history-item.book-link-lbl'),
        value: historyItem.book_url,
        isUrl: true,
      },
    ] as NftDetails[]
  } else {
    const historyItem = props.historyItem as NftPayment

    return [
      {
        label: t('sale-history-item.buyer-address-lbl'),
        value: historyItem.payer_address,
      },
      {
        label: t('sale-history-item.nft-address'),
        value: historyItem.nft_address,
      },
      {
        label: t('sale-history-item.nft-id'),
        value: historyItem.nft_id,
      },
      {
        label: t('sale-history-item.floor-price'),
        value: formatFiatAssetFromWei(historyItem.floor_price, CURRENCIES.USD),
      },
      {
        label: t('sale-history-item.book-link-lbl'),
        value: historyItem.book_url,
        isUrl: true,
      },
    ] as NftDetails[]
  }
}

const saleHeader: NftDetails[] = [
  {
    label: t('sale-history-item.buyer-address-lbl'),
    value: cropAddress(props.historyItem.payer_address, 10),
  },
  {
    label: t('sale-history-item.purchase-date-lbl'),
    value: formatDMY(props.historyItem.purchase_timestamp),
  },
  {
    label: t('sale-history-item.price-lbl'),
    value: formatFiatAssetFromWei(
      props.historyItem.minted_token_price,
      CURRENCIES.USD,
    ),
  },
]

const saleBody: NftDetails[] = getSaleBody()
</script>

<style lang="scss" scoped>
$padding-left: toRem(24);
$padding-right: toRem(36);
$padding-bottom: toRem(26);

.sale-history-item {
  border: toRem(1) solid var(--border-primary-dark);
  border-radius: toRem(6);
}

.sale-history-item__header {
  display: grid;
  grid-template-columns: 0.5fr 0.25fr 0.25fr #{toRem(40)};
  gap: toRem(20);
  padding: 0 $padding-right $padding-bottom $padding-left;

  @include respond-to(small) {
    display: block;
  }
}

.sale-history-item__header-col {
  display: grid;
  gap: toRem(10);
}

.sale-history-item__header-action {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* stylelint-disable selector-pseudo-class-no-unknown */
:deep(.sale-history-item__header-action-btn) {
  .app-button__icon-right {
    transition: all 0.2s;
  }

  &.sale-history-item__header-action-btn--open {
    .app-button__icon-right {
      transform: rotate(180deg);
    }
  }
}
/* stylelint-enable selector-pseudo-class-no-unknown */

.sale-history-item__body {
  display: grid;
  grid-template-columns: 0.3fr 0.7fr;
  gap: toRem(20);
  padding: toRem(26) $padding-right $padding-bottom $padding-left;
  border-top: toRem(1) solid var(--border-primary-dark);
}

.sale-history-item__header-col-label {
  color: var(--text-secondary-main);
  line-height: 120%;

  @include respond-to(xmedium) {
    font-size: toRem(14);
  }

  @include respond-to(small) {
    text-align: center;
  }
}

.sale-history-item__header-col-value {
  font-size: toRem(20);
  line-height: 120%;

  &--overflow {
    @include text-ellipsis;
  }

  @include respond-to(xmedium) {
    font-size: toRem(16);
  }

  @include respond-to(small) {
    display: block;
    text-align: center;

    &:nth-child(2n) {
      margin-bottom: toRem(20);
    }
  }
}
</style>
