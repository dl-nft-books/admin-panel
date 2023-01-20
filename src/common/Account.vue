<template>
  <div :class="accountClasses">
    <network-switcher />
    <drop-down :top="60" :right="0">
      <template #head="{ menu }">
        <button class="account__avatar" @click="menu.open">
          <icon class="account__avatar-icon" :name="$icons.account" />
        </button>
      </template>
      <template #default="{ menu }">
        <div class="account__body">
          <div class="account__info">
            <icon class="account__avatar-icon" :name="$icons.account" />
            <p class="account__address">
              {{ cropAddress(provider.selectedAddress) }}
            </p>
          </div>
          <button class="account__action" @click="copyAddress(), menu.close()">
            <icon class="account__action-icon" :name="$icons.copy" />
            <p class="account__action-info">
              {{ $t('account-dropdown.copy-address') }}
            </p>
          </button>
          <button class="account__action" @click="logout">
            <icon class="account__action-icon" :name="$icons.logout" />
            <p class="account__action-info">
              {{ $t('account-dropdown.logout-btn') }}
            </p>
          </button>
        </div>
      </template>
    </drop-down>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cropAddress, copyToClipboard, ErrorHandler, logout } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { Icon, DropDown, NetworkSwitcher } from '@/common'

type MODIFICATIONS = 'dark-mode' | 'default'

const props = withDefaults(
  defineProps<{
    modification?: MODIFICATIONS
  }>(),
  { modification: 'default' },
)

const accountClasses = computed(() => [
  'account',
  `account--${props.modification}`,
])

const { provider } = useWeb3ProvidersStore()

const copyAddress = async () => {
  if (!provider.selectedAddress) return

  try {
    await copyToClipboard(provider.selectedAddress)
  } catch (error) {
    ErrorHandler.process(error)
  }
}
</script>

<style lang="scss" scoped>
.account {
  display: flex;
  align-items: center;
  position: relative;
  gap: toRem(20);
}

.account__body {
  background-color: var(--background-primary);

  .account--dark-mode & {
    background-color: var(--background-quaternary);
  }
}

.account__info {
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

.account__action-info {
  font-weight: 500;
  font-size: toRem(16);
  color: var(--text-secondary-main);

  .account--dark-mode & {
    color: var(--text-secondary-invert-main);
  }
}

.account__address {
  font-weight: 600;
  font-size: toRem(16);
  color: var(--text-secondary-main);
  user-select: none;

  .account--dark-mode & {
    color: var(--text-secondary-invert-main);
  }
}

.account__avatar {
  background-color: var(--background-primary);
  display: flex;
  align-items: center;
  padding: toRem(12) toRem(16);
  border-radius: toRem(8);
  border: toRem(1) solid var(--text-secondary-main);
  height: toRem(52);
  width: toRem(60);
  transition: 0.2s ease-in-out;
  transition-property: background-color;

  &:hover {
    cursor: pointer;
    background-color: var(--background-tertiary);
  }

  .account--dark-mode & {
    background-color: transparent;
    border: toRem(1) solid var(--white);
  }
}

.account__avatar-icon {
  --size: #{toRem(28)};

  max-width: var(--size);
  max-height: var(--size);
}

.account__action {
  --background-hover-color: rgba(var(--drop-down-shadow-rgb), 0.2);

  display: flex;
  align-items: center;
  padding: toRem(10) toRem(20);
  gap: toRem(15);
  width: 100%;
  user-select: none;
  transition: 0.2s ease-in-out;
  transition-property: background-color;

  &:hover {
    cursor: pointer;
    background-color: var(--background-hover-color);
  }
}

.account__action-icon {
  --size: #{toRem(24)};

  max-width: var(--size);
  max-height: var(--size);
}
</style>
