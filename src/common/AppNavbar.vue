<script lang="ts" setup>
import { computed } from 'vue'
import { Icon, AppButton, AccountDropdown } from '@/common'
import { ROUTE_NAMES } from '@/enums'
import { useRoute } from 'vue-router'
import { Bus } from '@/helpers'

const route = useRoute()

const isCreateButton = computed(() => route.name === ROUTE_NAMES.nftsOverview)

const isButtonLinkShown = computed(() => {
  return (
    route.name === ROUTE_NAMES.nftsOverview ||
    route.name === ROUTE_NAMES.nftItem
  )
})

const buttonLink = computed(() => {
  return route.name === ROUTE_NAMES.nftItem
    ? { name: ROUTE_NAMES.nftItemEdit, params: { id: route.params.id } }
    : { name: ROUTE_NAMES.nftsCreate }
})

const openSidebar = () => {
  Bus.emit(Bus.eventList.toggleSidebar)
}
</script>

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
    <div class="app-navbar__right-buttons">
      <app-button
        v-if="isButtonLinkShown"
        class="app-navbar__link-button"
        size="small"
        :text="
          $t(`app-navbar.${isCreateButton ? 'create-button' : 'edit-button'}`)
        "
        :route="buttonLink"
      />
      <account-dropdown class="app-navbar__account-dropdown" />
    </div>
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

.app-navbar__right-buttons {
  display: flex;
  column-gap: toRem(25);
  margin-left: auto;
}

.app-navbar__link-button {
  width: toRem(180);

  @include respond-to(tablet) {
    display: none;
  }
}
</style>
