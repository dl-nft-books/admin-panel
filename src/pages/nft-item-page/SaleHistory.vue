<template>
  <div class="sale-history">
    <div class="sale-history__header-wrapper">
      <h4 class="sale-history__header">
        {{ $t('sale-history.header') }}
      </h4>
      <tabs
        v-model="currentTab"
        :tabs="Object.values(TABS)"
        class="sale-history__tabs"
      />
    </div>

    <sale-history-tokens
      v-if="currentTab === TABS.tokens.id"
      :book-id="bookId"
    />
    <sale-history-nfts v-else :book-id="bookId" />
  </div>
</template>

<script lang="ts" setup>
import { Tabs } from '@/common'
import { SaleHistoryTokens, SaleHistoryNfts } from '@/pages/nft-item-page'
import { ref } from 'vue'
import { useContext } from '@/composables'

defineProps<{ bookId: string | number }>()

const { $t } = useContext()

const TABS = {
  tokens: {
    translation: $t('sale-history.tokens-tab'),
    id: 'tokens-tab',
  },
  nfts: {
    translation: $t('sale-history.nfts-tab'),
    id: 'nfts-tab',
  },
}

const currentTab = ref(TABS.tokens.id)
</script>

<style lang="scss" scoped>
.sale-history__header {
  margin-bottom: toRem(20);
}

.sale-history__header-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: toRem(20);
}

.sale-history__tabs {
  margin-bottom: toRem(24);
}
</style>
