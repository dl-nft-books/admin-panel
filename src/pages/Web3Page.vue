<script lang="ts" setup>
import { AppButton, Loader, ErrorMessage, Erc20 } from '@/common'

import { computed, ref } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import { useProvider } from '@/composables'
import { ErrorHandler } from '@/helpers'
import { ChainId, TxRequestBody, UseProvider } from '@/types'
import { PROVIDERS, SOLANA_CHAINS } from '@/enums'

const testingData: Record<
  PROVIDERS,
  {
    tx?: TxRequestBody
    chainToSwitch?: {
      first: ChainId
      second: ChainId
    }
    chainToAdd?: {
      id: number
      name: string
      rpcUrl: string
    }
  }
> = {
  [PROVIDERS.metamask]: {
    tx: {
      from: '0x0b216630ec5adfa4ff7423a29b7f8a98f047ddd9',
      to: '0x2f318C334780961FB129D2a6c30D0763d9a5C970',
      value: '0x5',
      maxFeePerGas: '0x9502f916',
      maxPriorityFeePerGas: '0x9502F900',
    },
    chainToSwitch: {
      first: 4,
      second: 42,
    },
    chainToAdd: {
      id: 10,
      name: 'optimism',
      rpcUrl: 'https://mainnet.optimism.io',
    },
  },
  [PROVIDERS.coinbase]: {
    tx: {
      from: '0x4c94f25007931Af6eE059A240FbEF8cb7a944080',
      to: '0x2f318C334780961FB129D2a6c30D0763d9a5C970',
      value: '0x5',
      maxFeePerGas: '0x9502f916',
      maxPriorityFeePerGas: '0x9502F900',
    },
    chainToSwitch: {
      first: 4,
      second: 42,
    },
  },
  [PROVIDERS.phantom]: {
    tx: '4MUn5mQ9ujcRJCLvt7fUVwcDoYtGhoJJNzXaG28Fbwb5W8pGRqLNPFLV5JSuPwjrWMKzdaTiBicBz3c8jJrtHpHnC9xtwzF95LFrazGqAvZBrZ4C84bsxhvEAuuedpQhPKhY9LRGZdeNBWFy6gJx3LWoyRMhvY2KGEtbTCXT5G5ESYzRZN98PR2DcFndvwMaCTMe6SUJGMXR2SFPvvRJdW89EPFrYuf64P5AjF4C4aGCTRrP73YBNUzuS3TBx8U5YSsHdfttSV1iVgkEj2u6sP27vUKXRCAdV2ZkqpxzVu5Bf2MruJEuouUTGa6BEeFrmLtzdQVaUE2uUzNoxYWDghd4UuNn8ntfdsuqhchGYfqGj5tFUmN1MZwHeL91ZT96EbVtMPPPvscLmhkVWGPDmC3RnsuhKw3k13aixEAmM7XB8qjA9GzAQMDcw3sX7yxRW12WBSTatFt8WkiG5LBVPB2HMjSmCdJC1xsUiVRNJ8Wbt73rMLmbwYjwtL4i4gMnXCqvZPNgszqhNhUeKe3WgXCNwTxrV6mx2H7NmyEZeuTbnYBsaZux7sNSTYsaagLtfs5Dx2g27DMb2fEc4DBTLZkVTW4iXMqNNcuwYtW6kHEMrjgKAuUhsEToXwun3PvgwguYJxSDJShSYJ1fc6QDbkJ1Vf6ehCqw4yD6ogn6tJDRfDyi8bKYCp9UkNjKeiFbpr9naLpkBqjLNekhFcpxDSj1zV1kXWEoCw2Fs84S73EYD8Kd2nC9ktAMVsyhEUBxJ1FE9i7b8n3fSyDZVZguw1GfQG36PaX3jTTE7qVcANXxj6ud',
    chainToSwitch: {
      first: SOLANA_CHAINS.devnet,
      second: SOLANA_CHAINS.testnet,
    },
  },
  [PROVIDERS.solflare]: {
    tx: '4MUn5mQ9ujcRJCLvt7fUVwcDoYtGhoJJNzXaG28Fbwb5W8pGRqLNPFLV5JSuPwjrWMKzdaTiBicBz3c8jJrtHpHnC9xtwzF95LFrazGqAvZBrZ4C84bsxhvEAuuedpQhPKhY9LRGZdeNBWFy6gJx3LWoyRMhvY2KGEtbTCXT5G5ESYzRZN98PR2DcFndvwMaCTMe6SUJGMXR2SFPvvRJdW89EPFrYuf64P5AjF4C4aGCTRrP73YBNUzuS3TBx8U5YSsHdfttSV1iVgkEj2u6sP27vUKXRCAdV2ZkqpxzVu5Bf2MruJEuouUTGa6BEeFrmLtzdQVaUE2uUzNoxYWDghd4UuNn8ntfdsuqhchGYfqGj5tFUmN1MZwHeL91ZT96EbVtMPPPvscLmhkVWGPDmC3RnsuhKw3k13aixEAmM7XB8qjA9GzAQMDcw3sX7yxRW12WBSTatFt8WkiG5LBVPB2HMjSmCdJC1xsUiVRNJ8Wbt73rMLmbwYjwtL4i4gMnXCqvZPNgszqhNhUeKe3WgXCNwTxrV6mx2H7NmyEZeuTbnYBsaZux7sNSTYsaagLtfs5Dx2g27DMb2fEc4DBTLZkVTW4iXMqNNcuwYtW6kHEMrjgKAuUhsEToXwun3PvgwguYJxSDJShSYJ1fc6QDbkJ1Vf6ehCqw4yD6ogn6tJDRfDyi8bKYCp9UkNjKeiFbpr9naLpkBqjLNekhFcpxDSj1zV1kXWEoCw2Fs84S73EYD8Kd2nC9ktAMVsyhEUBxJ1FE9i7b8n3fSyDZVZguw1GfQG36PaX3jTTE7qVcANXxj6ud',
    chainToSwitch: {
      first: SOLANA_CHAINS.devnet,
      second: SOLANA_CHAINS.testnet,
    },
  },
  [PROVIDERS.walletConnect]: {},
  [PROVIDERS.brave]: {},
  [PROVIDERS.trust]: {},
  [PROVIDERS.fallback]: {},
  [PROVIDERS.ledger]: {},
}

const isLoaded = ref(false)
const isLoadFailed = ref(false)

const web3Store = useWeb3ProvidersStore()

const providers: UseProvider[] = []

const metamaskProvider = computed(() =>
  providers.find(el => el.selectedProvider.value === PROVIDERS.metamask),
)

const init = async () => {
  try {
    await web3Store.detectProviders()

    for (const designatedProvider of web3Store.providers) {
      const provider = useProvider()

      await provider.init(designatedProvider)
      providers.push(provider)
    }
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
    isLoadFailed.value = true
  }
  isLoaded.value = true
}

const connect = async (provider: UseProvider) => {
  try {
    await provider.connect()
  } catch (error) {
    ErrorHandler.process(error)
  }
}

const switchChain = async (provider: UseProvider) => {
  if (!provider.selectedProvider.value) return
  const providerDataToTest = testingData[provider.selectedProvider.value]

  if (!providerDataToTest?.chainToSwitch) return

  const chainToSwitch =
    provider.chainId.value === providerDataToTest.chainToSwitch.first
      ? providerDataToTest.chainToSwitch.second
      : providerDataToTest.chainToSwitch.first

  try {
    await provider.switchChain(chainToSwitch)
  } catch (error) {
    ErrorHandler.process(error)
  }
}

const addChain = async (provider: UseProvider) => {
  if (!provider.selectedProvider.value) return
  const providerDataToTest = testingData[provider.selectedProvider.value]

  if (!providerDataToTest.chainToAdd) return

  try {
    await provider.addChain(
      providerDataToTest.chainToAdd.id,
      providerDataToTest.chainToAdd.name,
      providerDataToTest.chainToAdd.rpcUrl,
    )
  } catch (error) {
    ErrorHandler.process(error)
  }
}

const sendTx = async (provider: UseProvider) => {
  if (!provider.selectedProvider.value) return
  const providerDataToTest = testingData[provider.selectedProvider.value]

  const tx = providerDataToTest.tx

  try {
    await provider.signAndSendTx(tx)
  } catch (error) {
    ErrorHandler.process(error)
  }
}

init()
</script>

<template>
  <div class="web3-page">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message :message="$t('web3-page.loading-error-msg')" />
      </template>
      <template v-else>
        <div class="web3-page__list">
          <div
            class="web3-page__card"
            v-for="provider in providers"
            :key="provider.selectedProvider.value"
          >
            <div
              class="web3-page__card-indicator"
              :class="{
                'web3-page__card-indicator--active': provider.isConnected.value,
              }"
            />
            <h2 class="web3-page__card-title">
              {{ provider.selectedProvider.value }}
            </h2>
            <span class="web3-page__card-name">
              {{ provider.selectedAddress.value }}
            </span>
            <span class="web3-page__txt">
              {{ `chainId: ${provider.chainId.value}` }}
            </span>
            <app-button
              scheme="flat"
              size="small"
              class="web3-page__card-btn"
              :text="provider.selectedAddress.value || 'Connect'"
              @click="connect(provider)"
              :disabled="provider.isConnected.value"
            />
            <template
              v-if="testingData[provider.selectedProvider.value]?.chainToSwitch"
            >
              <app-button
                scheme="flat"
                size="small"
                class="web3-page__card-btn"
                :text="'switch chain'"
                @click="switchChain(provider)"
              />
            </template>
            <template
              v-if="testingData[provider.selectedProvider.value]?.chainToAdd"
            >
              <app-button
                scheme="flat"
                size="small"
                class="web3-page__card-btn"
                :text="'add chain'"
                @click="addChain(provider)"
              />
            </template>
            <template v-if="testingData[provider.selectedProvider.value]?.tx">
              <app-button
                scheme="flat"
                size="small"
                class="web3-page__card-btn"
                :text="'sendTx'"
                @click="sendTx(provider)"
              />
            </template>
          </div>
        </div>
        <div class="web3-page__erc20">
          <erc20 :provider="metamaskProvider" />
        </div>
      </template>
    </template>
    <template v-else>
      <loader />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.web3-page {
  padding-bottom: toRem(100);
}

.web3-page__list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: toRem(24);
  margin-bottom: toRem(24);
}

.web3-page__card {
  position: relative;
  display: grid;
  gap: toRem(8);
  border: toRem(1) solid var(--border-primary-main);
  border-radius: toRem(8);
  padding: toRem(12);
}

.web3-page__card-indicator {
  position: absolute;
  top: toRem(12);
  right: toRem(12);
  width: toRem(12);
  height: toRem(12);
  border-radius: 50%;
  background: var(--error-main);

  &--active {
    background: var(--success-main);
  }
}

.web3-page__card-btn {
  width: 100%;
}
</style>
