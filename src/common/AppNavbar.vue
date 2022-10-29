<script lang="ts" setup>
import { AccountDropdown, Icon } from '@/common'
import { Bus } from '@/helpers'

const openSidebar = () => {
  Bus.emit(Bus.eventList.toggleSidebar)
}
</script>

<template>
  <div class="app-navbar">
    <button
      class="app-navbar__open-sidebar-button"
      type="button"
      aria-label="Open sidebar button"
      @click="openSidebar"
    >
      <icon class="app-navbar__open-sidebar-icon" :name="$icons.menu" />
    </button>
    <account-dropdown class="app-navbar__account-dropdown" />
  </div>
</template>

<style lang="scss" scoped>
.app-navbar {
  display: flex;
  align-items: center;
  padding: 0 var(--app-padding-right) 0 var(--app-padding-left);
  background: var(--background-primary);
  border-bottom: var(--border-primary-main);

  @include respond-to(tablet) {
    flex-wrap: wrap;
  }
}

.app-navbar__logo {
  @include respond-to(xsmall) {
    width: 100%;
    margin-bottom: toRem(24);
  }
}

.app-navbar__account-dropdown {
  margin-left: auto;
}

.app-navbar__open-sidebar-button {
  display: none;

  @include respond-to(tablet) {
    display: block;
    width: toRem(24);
    height: toRem(24);
  }
}

.app-navbar__open-sidebar-icon {
  width: 100%;
  height: 100%;
}
</style>
