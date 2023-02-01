<template>
  <drop-down
    v-if="provider.selectedAddress"
    :right="dropDownShift"
    :disabled="isSwitchingChain"
  >
    <template #head="{ menu }">
      <section
        v-if="networksStore.isLoaded"
        class="network-switcher"
        @click="menu.open"
      >
        <network-item
          modification="non-active"
          :name="pickedNetwork?.name"
          :scheme="getNetworkScheme(pickedNetwork?.chain_id)"
        />
      </section>
      <loader v-else />
    </template>
    <template #default="{ menu }">
      <div class="network-switcher__body">
        <network-item
          v-for="network in networksStore.list"
          :key="network.id"
          :scheme="getNetworkScheme(network.chain_id)"
          :name="network.name"
          @click="changeNetwork(network.chain_id), menu.close()"
        />
      </div>
    </template>
  </drop-down>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { DropDown, NetworkItem, Loader } from '@/common'
import { useWeb3ProvidersStore, useNetworksStore } from '@/store'
import { ChainId } from '@/types'
import { getNetworkScheme, switchNetwork } from '@/helpers'
import { useWindowSize } from '@vueuse/core'
import { WINDOW_BREAKPOINTS } from '@/enums'

const { provider } = useWeb3ProvidersStore()

const { width } = useWindowSize()

const dropDownShift = computed(() =>
  width.value >= WINDOW_BREAKPOINTS.small ? 81 : -60,
)

const networksStore = useNetworksStore()

const isSwitchingChain = ref(false)

const pickedNetwork = computed(() =>
  networksStore.getNetworkByID(Number(provider.chainId)),
)

const changeNetwork = async (chainID: ChainId) => {
  isSwitchingChain.value = true
  await switchNetwork(chainID)
  isSwitchingChain.value = false
}

networksStore.loadNetworks()
</script>

<style lang="scss" scoped>
.network-switcher {
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
  min-width: toRem(210);

  @include respond-to(small) {
    min-width: unset;
  }

  &:hover {
    cursor: pointer;
    background-color: var(--background-tertiary);
  }

  .account--dark-mode & {
    background-color: transparent;
    border: toRem(1) solid var(--white);
  }
}

.network-switcher__body {
  width: toRem(206);
  background-color: var(--background-primary);

  .account--dark-mode & {
    background-color: var(--background-quaternary);
  }
}
</style>
