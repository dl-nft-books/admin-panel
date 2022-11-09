<script lang="ts" setup>
import { Loader, ErrorMessage, NoDataMessage } from '@/common'
import { SaleHistoryItem } from '@/pages/nft-item-page'
import { BookSaleHistory } from '@/types'

import { ErrorHandler, getSaleHistory } from '@/helpers'
import { ref } from 'vue'

const props = defineProps<{ bookId: string | number }>()

const isLoaded = ref(false)
const isLoadFailed = ref(false)

const history = ref<BookSaleHistory[]>([])

const init = async () => {
  try {
    history.value = await getSaleHistory({ bookId: props.bookId })
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
    isLoadFailed.value = true
  }
  isLoaded.value = true
}
init()
</script>

<template>
  <div class="sale-history">
    <h2 class="sale-history__header">
      {{ $t('sale-history.header') }}
    </h2>

    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message :message="$t('nft-item-page.loading-error-msg')" />
      </template>
      <template v-else>
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
      </template>
    </template>
    <template v-else>
      <loader />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.sale-history__header {
  margin-bottom: toRem(20);
}
</style>
