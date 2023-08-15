<template>
  <div :class="accountClasses">
    <funds-info v-if="rolesStore.hasWithdrawalManagerRole" />
    <network-switcher />
    <drop-down :top="60" :right="0">
      <template #head="{ menu }">
        <app-button
          :icon-left="$icons.account"
          class="account-info__avatar"
          scheme="flat"
          icon-size="x-medium"
          @click="menu.open"
        />
      </template>
      <template #default="{ menu }">
        <div class="account-info__body">
          <div class="account-info__info">
            <icon class="account-info__avatar-icon" :name="$icons.account" />
            <h5 class="account-info__address">
              {{ cropAddress(provider.address) }}
            </h5>
          </div>
          <app-button
            :icon-left="$icons.copy"
            :text="$t('account-dropdown.copy-address')"
            class="account-info__action"
            scheme="default"
            modification="default"
            @click="copyAddress(), menu.close()"
          />
          <app-button
            :icon-left="$icons.logout"
            :text="$t('account-dropdown.logout-btn')"
            class="account-info__action"
            scheme="default"
            modification="default"
            @click="logout"
          />
        </div>
      </template>
    </drop-down>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cropAddress, copyToClipboard, ErrorHandler, logout } from '@/helpers'
import { useWeb3ProvidersStore, useRolesStore } from '@/store'
import { AppButton, Icon, DropDown, NetworkSwitcher, FundsInfo } from '@/common'

type MODIFICATIONS = 'dark-mode' | 'default'

const props = withDefaults(
  defineProps<{
    modification?: MODIFICATIONS
  }>(),
  { modification: 'default' },
)

const accountClasses = computed(() => [
  'account-info',
  `account-info--${props.modification}`,
])

const rolesStore = useRolesStore()
const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)

const copyAddress = async () => {
  if (!provider.value.address) return

  try {
    await copyToClipboard(provider.value.address)
  } catch (error) {
    ErrorHandler.process(error)
  }
}
</script>

<style lang="scss" scoped>
.account-info {
  display: flex;
  align-items: center;
  position: relative;
  gap: toRem(20);
}

.account-info__body {
  background-color: var(--background-primary);

  .account-info--dark-mode & {
    background-color: var(--background-quaternary);
  }
}

.account-info__info {
  display: flex;
  align-items: center;
  padding: toRem(15) toRem(20);
  position: relative;
  gap: toRem(10);

  &:after {
    content: '';
    position: absolute;
    height: toRem(1);
    left: toRem(15);
    width: 85%;
    background-color: var(--background-tertiary);
    bottom: 0;
  }
}

.account-info__address {
  font-size: toRem(16);
  line-height: 160%;
  font-weight: 500;
  color: var(--text-secondary-main);
  user-select: none;

  .account-info--dark-mode & {
    color: var(--text-secondary-invert-main);
  }
}

.account-info__avatar {
  display: grid;
  place-content: center;
  background-color: var(--background-primary);
  border-radius: toRem(8);
  border: toRem(1) solid var(--text-secondary-main);
  height: toRem(60);
  width: toRem(60);
  transition: 0.2s ease-in-out;
  transition-property: background-color;

  &:hover {
    cursor: pointer;
    background-color: var(--background-tertiary);
  }

  .account-info--dark-mode & {
    background-color: transparent;
    border: toRem(1) solid var(--white);
  }
}

.account-info__avatar-icon {
  --size: #{toRem(28)};

  max-width: var(--size);
  max-height: var(--size);
}

.account-info__action {
  --background-hover-color: rgba(var(--drop-down-shadow-rgb), 0.2);
  --app-button-bg-hover: rgba(var(--drop-down-shadow-rgb), 0.2);

  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: toRem(10) toRem(30);
  gap: toRem(15);
  width: 100%;
  user-select: none;
}
</style>
