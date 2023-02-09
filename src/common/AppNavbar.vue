<template>
  <div class="app-navbar">
    <app-button
      class="app-navbar__open-sidebar-button"
      aria-label="Open sidebar button"
      size="default"
      scheme="default"
      @click="openSidebar"
    >
      <icon class="app-navbar__open-sidebar-icon" :name="$icons.menu" />
    </app-button>
    <div id="app-navbar__right-buttons" class="app-navbar__right-buttons">
      <account />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon, AppButton, Account } from '@/common'
import { Bus } from '@/helpers'

const openSidebar = () => {
  Bus.emit(Bus.eventList.toggleSidebar)
}
</script>

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

.app-navbar__right-buttons {
  display: flex;
  column-gap: toRem(25);
  margin-left: auto;
}
</style>
