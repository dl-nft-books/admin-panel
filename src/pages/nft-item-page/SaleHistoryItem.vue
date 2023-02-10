<template>
  <collapse class="sale-history-item" :is-close-by-click-outside="false">
    <template #head="{ collapse }">
      <div class="sale-history-item__head">
        <div
          v-for="(item, index) in saleHeader"
          :key="index"
          class="sale-history-item__head-col"
        >
          <p
            :class="[
              'sale-history-item__label',
              'sale-history-item__label--size-x-medium',
            ]"
          >
            {{ item.label }}
          </p>
          <p
            :class="[
              'sale-history-item__value',
              'sale-history-item__value--size-x-large',
            ]"
          >
            {{ item.value }}
          </p>
        </div>
        <div class="sale-history-item__header-action">
          <app-button
            class="sale-history-item__header-button"
            :class="{
              'sale-history-item__header-button--open': collapse.isOpen,
            }"
            scheme="flat"
            :icon-right="$icons.arrowDown"
            size="small"
            color="secondary"
            @click="collapse.toggle"
          />
        </div>
      </div>
    </template>
    <div class="sale-history-item__dropdown">
      <template v-for="(item, index) in saleBody" :key="index">
        <p
          :class="[
            'sale-history-item__label',
            'sale-history-item__label--size-x-medium',
          ]"
        >
          {{ item.label }}
        </p>
        <p
          v-if="!item.isUrl"
          :class="[
            'sale-history-item__value',
            'sale-history-item__value--overflow',
            'sale-history-item__value--size-x-large',
          ]"
        >
          {{ item.value }}
        </p>
        <a
          v-else
          :class="[
            'sale-history-item__value',
            'sale-history-item__value--overflow',
            'sale-history-item__value--size-x-large',
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
import { NftDetails, Payment } from '@/types'
import { Collapse, AppButton } from '@/common'
import {
  formatFiatAssetFromWei,
  formatAssetFromWei,
  cropAddress,
  formatDMY,
} from '@/helpers'
import { useContext } from '@/composables'
import { CURRENCY } from '@/enums'

const props = defineProps<{ historyItem: Payment }>()

const { $t } = useContext()

const saleHeader: NftDetails[] = [
  {
    label: $t('sale-history-item.buyer-address-lbl'),
    value: cropAddress(props.historyItem.payer_address, 10),
  },
  {
    label: $t('sale-history-item.purchase-date-lbl'),
    value: formatDMY(props.historyItem.purchase_timestamp),
  },
  {
    label: $t('sale-history-item.price-lbl'),
    value: formatFiatAssetFromWei(
      props.historyItem.minted_token_price,
      CURRENCY.USD,
    ),
  },
]

const saleBody: NftDetails[] = [
  {
    label: $t('sale-history-item.buyer-address-lbl'),
    value: props.historyItem.payer_address,
  },
  {
    label: $t('sale-history-item.token-lbl'),
    value: props.historyItem.erc20_data.symbol,
  },
  {
    label: $t('sale-history-item.token-amount-lbl'),
    value: formatAssetFromWei(
      props.historyItem.amount,
      props.historyItem.erc20_data.decimals,
    ),
  },
  {
    label: $t('sale-history-item.book-link-lbl'),
    value: props.historyItem.book_url,
    isUrl: true,
  },
]
</script>

<style lang="scss" scoped>
$padding-left: toRem(24);
$padding-right: toRem(36);
$padding-bottom: toRem(26);

.sale-history-item {
  border: toRem(1) solid var(--border-primary-dark);
  border-radius: toRem(6);
}

.sale-history-item__head {
  display: grid;
  grid-template-columns: 0.5fr 0.25fr 0.25fr #{toRem(40)};
  gap: toRem(20);
  padding: 0 $padding-right $padding-bottom $padding-left;

  @include respond-to(small) {
    display: block;
  }
}

.sale-history-item__head-col {
  display: grid;
  gap: toRem(10);
}

.sale-history-item__header-action {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* stylelint-disable selector-pseudo-class-no-unknown */
:deep(.sale-history-item__header-button) {
  .app-button__icon-right {
    transition: all 0.2s;
  }

  &.sale-history-item__header-button--open {
    .app-button__icon-right {
      transform: rotate(180deg);
    }
  }
}
/* stylelint-enable selector-pseudo-class-no-unknown */

.sale-history-item__dropdown {
  display: grid;
  grid-template-columns: 0.3fr 0.7fr;
  gap: toRem(20);
  padding: toRem(26) $padding-right $padding-bottom $padding-left;
  border-top: toRem(1) solid var(--border-primary-dark);
}

.sale-history-item__label {
  @include p-body-2;

  color: var(--text-secondary-main);

  @include respond-to(xmedium) {
    font-size: toRem(14);
  }

  @include respond-to(small) {
    text-align: center;
  }
}

.sale-history-item__value {
  @include p-body-2;

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
