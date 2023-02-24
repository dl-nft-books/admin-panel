<template>
  <div class="authorized-layout">
    <app-sidebar class="authorized-layout__sidebar" />
    <div class="authorized-layout__main-wrp">
      <app-navbar class="authorized-layout__navbar" />
      <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transition || 'fade'" mode="out-in">
          <component class="authorized-layout__main" :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppNavbar, AppSidebar } from '@/common'
</script>

<style lang="scss" scoped>
.authorized-layout {
  display: grid;
  grid-template-columns: toRem(302) minmax(0, 1fr);
  padding: toRem(20);

  @include respond-to(tablet) {
    display: block;
  }
}

.authorized-layout__main-wrp {
  display: flex;
  flex-direction: column;
}

.authorized-layout__main {
  flex: 1;
  padding: toRem(54) var(--app-padding-right) toRem(54) var(--app-padding-left);
}
</style>
