<template>
  <div class="overview-nfts">
    <div class="overview-nfts__header">
      <h3>
        {{ $t('overview-nfts.title') }}
      </h3>
    </div>

    <loader v-if="isLoading" />
    <nft-list v-else-if="totalAmount > 0" :total-amount="totalAmount" />
    <no-data-message v-else :message="$t('overview-nfts.no-data-message')" />

    <mounted-teleport to="#app-navbar__right-buttons">
      <app-button
        v-if="rolesStore.hasMarkerplaceManagerRole"
        class="overview-nfts__link-button"
        size="small"
        :icon-left="$icons.plus"
        :text="buttonLinkText"
        :route="{ name: $routes.nftsCreate }"
      />
    </mounted-teleport>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { Loader, NoDataMessage, AppButton } from '@/common'

import { ErrorHandler, redirectByAccessLevel } from '@/helpers'
import { WINDOW_BREAKPOINTS } from '@/enums'
import { useWindowSize } from '@vueuse/core'
import { useBooks } from '@/composables'
import { useI18n } from 'vue-i18n'
import { useWeb3ProvidersStore, useRolesStore } from '@/store'
import { NftList } from '@/pages/overview-nft-page'

const webProvidersStore = useWeb3ProvidersStore()
const rolesStore = useRolesStore()

const provider = computed(() => webProvidersStore.provider)

const buttonLinkText = computed(() =>
  width.value >= WINDOW_BREAKPOINTS.medium
    ? t('overview-nfts.create-button')
    : '',
)

const { width } = useWindowSize()
const { t } = useI18n()

const { getTotalBooksAmount } = useBooks()

const totalAmount = ref(-1)
const isLoading = ref(false)

const init = async () => {
  isLoading.value = true
  totalAmount.value = -1

  try {
    const data = await getTotalBooksAmount(provider.value.chainId)
    if (!data) throw new Error('No books found')

    totalAmount.value = Number(data)
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
  }

  isLoading.value = false
}
watch(() => provider.value.chainId, init, { immediate: true })

watch(
  () => rolesStore.hasMarkerplaceManagerRole,
  () => {
    if (rolesStore.hasMarkerplaceManagerRole) return

    redirectByAccessLevel()
  },
  {
    immediate: true,
  },
)
</script>

<style lang="scss" scoped>
.overview-nfts__header {
  display: flex;
  justify-content: space-between;

  @include respond-to(small) {
    flex-direction: column;
    align-items: center;
    gap: toRem(20);
  }
}

.overview-nfts__filter-wrapper {
  display: flex;
  align-items: center;
  gap: toRem(20);
  min-width: toRem(350);
}

.overview-nfts__content {
  display: flex;
  flex-direction: column;
  margin-top: toRem(20);
  row-gap: toRem(15);
  overflow: hidden;

  @include respond-to(medium) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(toRem(240), 1fr));
    max-width: 100%;
    gap: toRem(20);
  }
}

.overview-nfts__link-button {
  width: toRem(180);
  order: -1;
  font-weight: 700;
  text-transform: uppercase;

  @include respond-to(medium) {
    --mobile-size: #{toRem(60)};

    width: var(--mobile-size);
    height: var(--mobile-size);
    order: 1;
  }
}

.overview-nfts__load-more-btn {
  margin: toRem(20) auto 0;
}
</style>
