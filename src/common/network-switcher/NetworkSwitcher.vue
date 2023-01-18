<template>
  <!-- TODO: mobile version -->
  <drop-down
    v-if="provider.selectedAddress"
    :right="81"
    :disabled="isSwitchingChain"
  >
    <template #head="{ menu }">
      <section
        v-if="isLoaded"
        class="header-network-switcher"
        @click="menu.open"
      >
        <network-item modification="non-active" :scheme="pickedNetwork" />
      </section>
      <loader v-else />
    </template>
    <template #default="{ menu }">
      <div class="header-network-switcher__body">
        <network-item
          v-for="network in networkList"
          :key="network.id"
          :scheme="getNetworkName(network.chain_id.toString())"
          @network-change="
            changeNetwork(network.chain_id.toString(), menu.close)
          "
        />
      </div>
    </template>
  </drop-down>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { getNetworks } from '@/api'
import { DropDown, NetworkItem, Loader } from '@/common'
import {
  NETWORKS,
  POLYGON_CHAINS,
  ETHEREUM_CHAINS,
  Q_CHAINS,
  EIP1193,
} from '@/enums'
import { useWeb3ProvidersStore } from '@/store'
import { storeToRefs } from 'pinia'
import { ErrorHandler } from '@/helpers'
import { Network, EthProviderRpcError, ChainID } from '@/types'
import { POLYGON_MUMBAI_CHAIN, Q_TESTNET_CHAIN } from '@/consts'

const { provider } = storeToRefs(useWeb3ProvidersStore())

const isLoaded = ref(false)
const isSwitchingChain = ref(false)
const networkList = ref<Network[]>([])

const pickedNetwork = ref<NETWORKS>(
  getNetworkName(provider.value.chainId?.toString()),
)

function getNetworkName(chaindID: ChainID) {
  switch (chaindID) {
    case ETHEREUM_CHAINS.ethereum:
    case ETHEREUM_CHAINS.goerli:
      return NETWORKS.ETHEREUM
    case POLYGON_CHAINS.mainnet:
    case POLYGON_CHAINS.mumbai:
      return NETWORKS.POLYGON
    case Q_CHAINS.mainet:
    case Q_CHAINS.testnet:
      return NETWORKS.Q
    default:
      return NETWORKS.UNSUPPORTED
  }
}

// For non-default chains
function getNetworkInfo(chainID: ChainID) {
  switch (chainID) {
    case POLYGON_CHAINS.mumbai:
      return POLYGON_MUMBAI_CHAIN
    case Q_CHAINS.testnet:
      return Q_TESTNET_CHAIN
    default:
      return null
  }
}

const changeNetwork = async (chainID: ChainID, closeDropDown: () => void) => {
  isSwitchingChain.value = true
  try {
    await provider.value.switchChain(chainID)
  } catch (error) {
    const ethError = error as EthProviderRpcError

    // if wallet has no chain added we need to add it and switch to it
    if (ethError?.code === EIP1193.walletMissingChain) {
      await addNetwork(chainID)
    }

    ErrorHandler.processWithoutFeedback(error)
  }
  isSwitchingChain.value = false

  closeDropDown()
}

const addNetwork = async (chainID: ChainID) => {
  try {
    const networkToAdd = getNetworkInfo(chainID)

    if (!networkToAdd) return

    await provider.value.addChain(
      chainID,
      networkToAdd.name,
      networkToAdd.rpcUrl,
      {
        name: networkToAdd.nativeCurrency.name,
        symbol: networkToAdd.nativeCurrency.symbol,
        decimals: networkToAdd.nativeCurrency.decimals,
      },
      networkToAdd.blockExplorerUrl,
    )
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
  }
}

const init = async () => {
  try {
    const { data: networks } = await getNetworks()

    networkList.value = networks
  } catch (error) {
    ErrorHandler.process(error)
  }
  isLoaded.value = true
}
init()

watch(
  () => provider.value.chainId,
  () => {
    pickedNetwork.value = getNetworkName(provider.value.chainId?.toString())
  },
)
</script>

<style lang="scss" scoped>
.header-network-switcher {
  display: flex;
  align-items: center;
  height: toRem(52);
  padding: toRem(12) toRem(16);
  gap: toRem(12);
  background-color: var(--background-primary);
  border-radius: toRem(8);
  border: toRem(1) solid var(--text-secondary-main);
  transition: 0.2s ease-in-out;
  transition-property: background-color;
  width: toRem(210);

  &:hover {
    cursor: pointer;
    background-color: var(--background-tertiary);
  }

  .account--dark-mode & {
    background-color: transparent;
    border: toRem(1) solid var(--white);
  }
}

.header-network-switcher__body {
  width: toRem(206);
  background-color: var(--background-primary);

  .account--dark-mode & {
    background-color: var(--background-quaternary);
  }
}
</style>
