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
import {
  ErrorHandler,
  getAuthNonce,
  sleep,
  redirectByAccessLevel,
} from '@/helpers'
import { computed } from 'vue'
import { useAuthStore } from '@/store'

const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)

const authStore = useAuthStore()

const submit = async () => {
  try {
    await provider.value.connect()
    await sleep(1000)
    if (provider.value.address) {
      const authNonce = await getAuthNonce(provider.value.address)

      const signedMessage = await provider.value.signMessage(authNonce)

      if (!signedMessage) return

      await authStore.login(provider.value.address, signedMessage)

      redirectByAccessLevel()
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
