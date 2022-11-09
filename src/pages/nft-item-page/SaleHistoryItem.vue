<script lang="ts" setup>
import { BookSaleHistory } from '@/types'
import { Collapse, AppButton } from '@/common'
import { cropAddress } from '@/helpers'
import { formatDMY } from '@/helpers'
import { formatFiatAssetFromWei } from '@/helpers'

defineProps<{ historyItem: BookSaleHistory }>()
</script>

<template>
  <collapse class="sale-history-item" :is-close-by-click-outside="false">
    <template #head="{ collapse }">
      <div class="sale-history-item__head">
        <div class="sale-history-item__head-col">
          <p class="sale-history-item__label">
            {{ $t('sale-history-item.buyer-address-lbl') }}
          </p>
          <p class="sale-history-item__value">
            {{ cropAddress(historyItem.payer_address, 10) }}
          </p>
        </div>
        <div class="sale-history-item__head-col">
          <p class="sale-history-item__label">
            {{ $t('sale-history-item.purchase-date-lbl') }}
          </p>
          <p class="sale-history-item__value">
            {{ formatDMY(historyItem.purchase_timestamp) }}
          </p>
        </div>

        <div class="sale-history-item__head-col">
          <p class="sale-history-item__label">
            {{ $t('sale-history-item.price-lbl') }}
          </p>
          <p class="sale-history-item__value">
            {{ formatFiatAssetFromWei(historyItem.price, 'USD') }}
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
      <p class="sale-history-item__label">
        {{ $t('sale-history-item.buyer-address-lbl') }}
      </p>
      <p class="sale-history-item__value sale-history-item__value--overflow">
        {{ historyItem.payer_address }}
      </p>

      <p class="sale-history-item__label">
        {{ $t('sale-history-item.token-lbl') }}
      </p>
      <p class="sale-history-item__value">
        {{ historyItem.erc20_data.symbol }}
      </p>

      <p class="sale-history-item__label">
        {{ $t('sale-history-item.token-amount-lbl') }}
      </p>
      <p class="sale-history-item__value">
        {{ historyItem.amount }}
      </p>
      <p class="sale-history-item__label">
        {{ $t('sale-history-item.book-link-lbl') }}
      </p>
      <a
        class="sale-history-item__value sale-history-item__value--overflow"
        :href="historyItem.book_url"
        target="_blank"
        rel="noopener"
      >
        {{ historyItem.book_url }}
      </a>
    </div>
  </collapse>
</template>

<style lang="scss" scoped>
$padding-left: toRem(24);
$padding-right: toRem(36);
$padding-bottom: toRem(26);
/* stylelint-disable-next-line */
$custom-breakpoint: 655px;

.sale-history-item {
  border: toRem(1) solid var(--border-primary-dark);
  border-radius: toRem(6);
}

.sale-history-item__head {
  display: grid;
  grid-template-columns: 0.5fr 0.25fr 0.25fr #{toRem(40)};
  gap: toRem(20);
  padding: 0 $padding-right $padding-bottom $padding-left;

  @include respond-to($custom-breakpoint) {
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

  @include respond-to($custom-breakpoint) {
    display: block;
  }
}

.sale-history-item__label {
  font-size: toRem(16);
  line-height: 1.1;
  color: var(--text-secondary-main);

  @include respond-to(xmedium) {
    font-size: toRem(14);
  }

  @include respond-to($custom-breakpoint) {
    text-align: center;
  }
}

.sale-history-item__value {
  font-size: toRem(20);
  line-height: 1.1;
  font-weight: 400;

  &--overflow {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  @include respond-to(xmedium) {
    font-size: toRem(16);
  }

  @include respond-to($custom-breakpoint) {
    display: block;
    text-align: center;

    &:nth-child(2n) {
      margin-bottom: toRem(20);
    }
  }
}
</style>
