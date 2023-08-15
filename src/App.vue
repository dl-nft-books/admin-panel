<template>
  <div v-if="isAppInitialized" class="app__container">
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'" mode="out-in">
        <component class="app__main" :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import { ErrorHandler } from '@/helpers/error-handler'
import { ref } from 'vue'
import { useNotifications } from '@/composables'
import { config } from '@config'
import { useWeb3ProvidersStore, useNetworksStore } from '@/store'

const isAppInitialized = ref(false)

const web3Store = useWeb3ProvidersStore()
const networkStore = useNetworksStore()

const init = async () => {
  try {
    useNotifications()
    document.title = config.APP_NAME

    await web3Store.detectProviders()
    await web3Store.init()
    await networkStore.loadNetworks()
  } catch (error) {
    ErrorHandler.process(error)
  }
  isAppInitialized.value = true
}

init()
</script>

<style lang="scss" scoped>
.app__container {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  height: 100%;
}

.app__main {
  flex: 1;
}

.fade-enter-active {
  animation: fade-in 0.25s;
}

.fade-leave-active {
  animation: fade-in 0.25s reverse;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
