<script lang="ts" setup>
import { useWeb3ProvidersStore } from '@/store'
import { cropAddress } from '@/helpers'

import { onMounted, ref, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { logout } from '@/helpers'

const accountDropdown = ref<HTMLElement | undefined>()
const isDropdownOpen = ref(false)

const route = useRoute()
const web3ProviderStore = useWeb3ProvidersStore()

onMounted(() => {
  if (accountDropdown.value) {
    onClickOutside(accountDropdown, closeDropdown)
  }
})

watch(route, () => {
  closeDropdown()
})

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}
</script>

<template>
  <div class="account-dropdown" ref="accountDropdown">
    <button
      class="account-dropdown__trigger"
      :title="web3ProviderStore.provider.selectedAddress"
      @click="toggleDropdown"
    >
      <img src="" alt="" class="account-dropdown__avatar" />
      <span class="account-dropdown__address">
        {{ cropAddress(web3ProviderStore.provider.selectedAddress) }}
      </span>
    </button>
    <transition name="account-dropdown__body">
      <div v-if="isDropdownOpen" class="account-dropdown__body">
        <button class="account-dropdown__item" @click="logout">
          {{ $t('account-dropdown.logout-btn') }}
        </button>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
$z-index-overlap: 1;

.account-dropdown {
  position: relative;
}

.account-dropdown__trigger {
  display: flex;
  align-items: center;
  gap: toRem(10);
  padding: toRem(10) toRem(14);
  color: var(--text-primary-main);
  border: toRem(2) solid var(--border-primary-main);
  box-shadow: 0 toRem(6) toRem(58) rgba(196, 203, 214, 0.103611);
  border-radius: toRem(6);
}

.account-dropdown__avatar {
  object-fit: cover;
  object-position: center;
  width: toRem(30);
  height: toRem(30);
  border-radius: 50%;
}

.account-dropdown__body {
  display: grid;
  grid-gap: toRem(4);
  position: absolute;
  top: 110%;
  right: 0;
  padding: toRem(8);
  z-index: $z-index-overlap;
  border: toRem(2) solid var(--border-primary-main);
  box-shadow: 0 toRem(6) toRem(58) rgba(196, 203, 214, 0.103611);
  border-radius: toRem(6);
  width: 100%;
}

.account-dropdown__body-enter-active,
.account-dropdown__body-leave-active {
  transition: 0.25s ease;
  transition-property: opacity, transform;
}

.account-dropdown__body-enter-from,
.account-dropdown__body-leave-to {
  opacity: 0;
  transform: scale(1.1) translateY(10%);
}

.account-dropdown__item {
  border-radius: toRem(8);
  padding: toRem(6);

  &:not([disabled]):hover {
    background: rgba(var(--black-rgb), 0.04);
  }
}
</style>
