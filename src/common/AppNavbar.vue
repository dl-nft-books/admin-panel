<script lang="ts" setup>
import { AccountDropdown } from '@/common'
</script>

<template>
  <div class="app-navbar">
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
</style>
