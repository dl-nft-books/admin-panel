<script lang="ts" setup>
import { AppButton } from '@/common'

import { useWeb3ProvidersStore } from '@/store'
import { ErrorHandler } from '@/helpers'
import { useRouter } from 'vue-router'
import { ROUTE_NAMES } from '@/enums'

const web3ProviderStore = useWeb3ProvidersStore()
const router = useRouter()

const submit = async () => {
  try {
    await web3ProviderStore.provider.connect()
    await router.push({ name: ROUTE_NAMES.nfts })
  } catch (error) {
    ErrorHandler.process(error)
  }
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
