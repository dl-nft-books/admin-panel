<template>
  <div class="funds-info">
    <loader v-if="isLoading" class="funds-info__loader" />
    <template v-else>
      <icon class="funds-info__icon" :name="$icons.wallet" />

      <div class="funds-info__content">
        <p v-if="balanceTitle" class="funds-info__content-lbl">
          {{ balanceTitle }}
        </p>
        <p class="funds-info__content-value">
          {{ balance }}
        </p>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'

import { Icon, Loader } from '@/common'
import { useWeb3ProvidersStore } from '@/store'
import { ErrorHandler, formatFiatAssetFromWei } from '@/helpers'

import { useWithdrawalManager } from '@/composables'
import { CURRENCIES, WINDOW_BREAKPOINTS } from '@/enums'
import { useI18n } from 'vue-i18n'
import { useWindowSize } from '@vueuse/core'

const { t } = useI18n()
const { width } = useWindowSize()

const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)

const { getBalance } = useWithdrawalManager()

const isLoading = ref(false)
const currentChainFunds = ref('')

const balance = computed(() =>
  currentChainFunds.value
    ? formatFiatAssetFromWei(currentChainFunds.value, CURRENCIES.USD)
    : t('funds-info.not-available'),
)

const balanceTitle = computed(() =>
  width.value > WINDOW_BREAKPOINTS.medium ? t('funds-info.label') : '',
)

const loadBalance = async () => {
  isLoading.value = true
  currentChainFunds.value = ''
  try {
    const funds = await getBalance(Number(provider.value.chainId))
    if (!funds) return

    currentChainFunds.value = funds
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
  }
  isLoading.value = false
}

onMounted(() => {
  if (!provider.value.selectedAddress) return

  loadBalance()
})

watch(
  () => provider.value.chainId,
  () => {
    loadBalance()
  },
)
</script>

<style lang="scss" scoped>
.funds-info {
  display: flex;
  justify-content: center;
  align-items: center;
  height: toRem(60);
  gap: toRem(15);
  padding: toRem(10) toRem(16);
  border: toRem(1) solid var(--text-secondary-main);
  border-radius: toRem(8);
}

.funds-info__icon {
  --size: #{toRem(25)};

  min-width: var(--size);
  min-height: var(--size);
  max-width: var(--size);
  max-height: var(--size);
}

.funds-info__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: toRem(5);
}

.funds-info__content-lbl {
  color: var(--text-secondary-main);
  line-height: 120%;
}

.funds-info__content-value {
  font-weight: 700;
  line-height: toRem(18);
}

.funds-info__loader {
  scale: 0.6;
}
</style>
