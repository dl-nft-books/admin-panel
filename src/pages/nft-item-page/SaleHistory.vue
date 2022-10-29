<script lang="ts" setup>
import { SaleHistoryItem } from '@/pages/nft-item-page'
import { NoDataMessage } from '@/common'
import { BookSaleHistory } from '@/types'

defineProps<{ history: BookSaleHistory[] }>()
</script>

<template>
  <div class="sale-history">
    <h2 class="sale-history__header">
      {{ $t('sale-history.header') }}
    </h2>
    <div class="sale-history__list">
      <template v-if="history.length">
        <sale-history-item
          v-for="item in history"
          :key="item.id"
          :history-item="item"
        />
      </template>
      <template v-else>
        <no-data-message :message="$t('sale-history.no-data-message')" />
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sale-history__header {
  margin-bottom: toRem(20);
}
</style>
