<script lang="ts" setup>
import { AppButton } from '@/common'

import { useWeb3ProvidersStore } from '@/store'
import { ErrorHandler, getAuthNonce, saveAuthAccess } from '@/helpers'

import { useRouter } from 'vue-router'
import { ROUTE_NAMES } from '@/enums'
import { storeToRefs } from 'pinia'
import { api } from '@/api'
import { AuthResponse } from '@/types'

const { provider } = storeToRefs(useWeb3ProvidersStore())

const router = useRouter()

const submit = async () => {
  try {
    await provider.value.connect()

    if (provider.value.selectedAddress) {
      const authNonce = await getAuthNonce(provider.value.selectedAddress)

      const signedMessage = await provider.value.signMessage(authNonce)

      await login(signedMessage)

      router.push({ name: ROUTE_NAMES.nfts })
    }
  } catch (error) {
    ErrorHandler.process(error)
  }
}

const login = async (signedMessage: string) => {
  const { data } = await api.post<AuthResponse>(
    '/integrations/nonce-auth-svc/login/admin',
    {
      data: {
        type: 'admin_login',
        attributes: {
          auth_pair: {
            address: provider.value.selectedAddress,
            signed_message: signedMessage,
          },
        },
      },
    },
  )

  saveAuthAccess(data.access_token, data.refresh_token)
}
</script>

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

<style lang="scss" scoped>
.login-form__submit-btn {
  margin: 0 auto;
}
</style>
