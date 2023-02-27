<template>
  <form class="login-form" @submit.prevent="submit">
    <div class="login-form__actions">
      <app-button
        class="login-form__submit-btn"
        type="submit"
        :icon-left="$icons.metamask"
        :text="$t('login-form.submit-btn')"
      />
    </div>
  </form>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'

import { useWeb3ProvidersStore } from '@/store'
import { ErrorHandler, getAuthNonce, sleep } from '@/helpers'

import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { ROUTE_NAMES } from '@/enums'
import { useAuthStore } from '@/store'

const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)

const router = useRouter()
const authStore = useAuthStore()

const submit = async () => {
  try {
    await provider.value.connect()
    await sleep(1000)
    if (provider.value.selectedAddress) {
      const authNonce = await getAuthNonce(provider.value.selectedAddress)

      const signedMessage = await provider.value.signMessage(authNonce)

      if (!signedMessage) return

      await authStore.login(provider.value.selectedAddress, signedMessage)

      router.push({ name: ROUTE_NAMES.nfts })
    }
  } catch (error) {
    ErrorHandler.process(error)
  }
}
</script>
<style lang="scss" scoped>
.login-form__submit-btn {
  margin: 0 auto;
}
</style>
