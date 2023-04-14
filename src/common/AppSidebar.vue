<template>
  <transition name="app-sidebar__transition">
    <div v-if="isSidebarShown" class="app-sidebar">
      <aside class="app-sidebar__aside" ref="asideElement">
        <div class="app-sidebar__logo-wrp">
          <div class="app-sidebar__logo-container">
            <app-logo class="app-sidebar__logo" @click="hideSidebar" />
            <p class="app-sidebar__logo-subtitle">
              {{ $t('app-sidebar.logo-subtitle') }}
            </p>
          </div>
          <app-button
            scheme="default"
            color="primary-inverted"
            size="default"
            class="app-sidebar__close-button"
            icon-size="large"
            :icon-left="$icons.x"
            @click="hideSidebar"
          />
        </div>
        <loader v-if="rolesStore.isLoadingRoles" />
        <section
          v-else-if="rolesStore.hasNoRoles"
          class="app-sidebar__error-msg"
        >
          <error-message
            :icon-name="$icons.hand"
            :message="$t('app-sidebar.has-no-roles-lbl')"
          />
        </section>

        <div v-else class="app-sidebar__links-section">
          <template v-if="rolesStore.hasAdminRole">
            <app-button
              class="app-sidebar__link"
              scheme="default"
              size="default"
              :icon-left="$icons.photograph"
              :route="{ name: $routes.nfts }"
              :text="$t('app-sidebar.nfts-link')"
              @click="hideSidebar"
            />
            <app-button
              class="app-sidebar__link"
              scheme="default"
              size="default"
              :icon-left="$icons.coupon"
              :route="{ name: $routes.promocodes }"
              :text="$t('app-sidebar.promocodes-link')"
              @click="hideSidebar"
            />
          </template>
          <app-button
            v-if="rolesStore.hasRoleManagerRole"
            class="app-sidebar__link"
            scheme="default"
            size="default"
            :icon-left="$icons.manager"
            :route="{ name: $routes.roles }"
            :text="$t('app-sidebar.roles-link')"
            @click="hideSidebar"
          />
          <app-button
            v-if="rolesStore.hasWithdrawalManagerRole"
            class="app-sidebar__link"
            scheme="default"
            size="default"
            :icon-left="$icons.withdraw"
            :route="{ name: $routes.withdrawals }"
            :text="$t('app-sidebar.withdrawals-link')"
            @click="hideSidebar"
          />
        </div>
        <app-button
          scheme="default"
          color="primary-inverted"
          size="default"
          class="app-sidebar__link app-sidebar__logout"
          :text="$t('app-sidebar.logout-btn')"
          :icon-left="$icons.logout"
          @click="logout"
        />

        <div class="app-sidebar__copyright">
          {{
            $t('app-sidebar.copyright', {
              value: new Date().getFullYear(),
            })
          }}
        </div>
      </aside>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { WINDOW_BREAKPOINTS } from '@/enums'
import { Bus, logout } from '@/helpers'
import { AppLogo, AppButton, Loader, ErrorMessage } from '@/common'
import { useRolesStore } from '@/store'
import {
  onClickOutside,
  SwipeDirection,
  useSwipe,
  useWindowSize,
} from '@vueuse/core'

const asideElement = ref<HTMLElement | null>(null)

const { width: windowWidth } = useWindowSize()
const rolesStore = useRolesStore()

const swipe = useSwipe(document.querySelector('#app'))

const isVisible = ref(false)

const isTabletScreen = computed(
  () => windowWidth.value <= WINDOW_BREAKPOINTS.tablet,
)

const isSidebarShown = computed(() => !isTabletScreen.value || isVisible.value)

watch(swipe.direction, () => {
  if (!isVisible.value) return

  switch (swipe.direction.value) {
    case SwipeDirection.RIGHT:
      isVisible.value = true
      break
    case SwipeDirection.LEFT:
      isVisible.value = false
      break
    default:
      break
  }
})

const toggleSidebar = () => {
  isVisible.value ? hideSidebar() : showSidebar()
}

const showSidebar = () => {
  isVisible.value = true
}

const hideSidebar = () => {
  isVisible.value = false
}

Bus.on(Bus.eventList.toggleSidebar, toggleSidebar)

watch(asideElement, () => {
  if (!asideElement.value || windowWidth.value > WINDOW_BREAKPOINTS.tablet)
    return

  onClickOutside(asideElement, hideSidebar)
})
</script>

<style lang="scss" scoped>
$sidebar-padding-horizontal: toRem(16);
$sidebar-padding-vertical: toRem(24);
$z-local: 5;

.app-sidebar {
  overflow: hidden;

  @include respond-to(tablet) {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: $z-local;
    background: rgba(var(--black-rgb), 0.5);
  }
}

.app-sidebar__transition-enter-active {
  animation: fade-unroll-right 0.5s ease-in-out;
}

.app-sidebar__transition-leave-active {
  animation: fade-unroll-right 0.5s ease-in-out reverse;
}

@keyframes fade-unroll-right {
  from {
    width: 0;
  }

  to {
    width: 100%;
  }
}

.app-sidebar__error-msg {
  width: toRem(300);
  margin: toRem(100) auto;
  text-align: center;
  padding: 0 toRem(20);
}

.app-sidebar__aside {
  display: flex;
  flex-direction: column;
  background: var(--background-secondary);
  border-radius: toRem(6);
  padding: toRem(40) toRem(4) toRem(20);
  height: 100%;
  position: fixed;
  max-height: calc(100vh - #{toRem(40)});

  @include respond-to(tablet) {
    position: unset;
    max-height: 100%;
    max-width: toRem(320);
    border-radius: 0 toRem(6) toRem(6) 0;
  }

  @include respond-to(small) {
    max-width: toRem(280);
  }

  @include respond-to(xsmall) {
    max-width: 100%;
    border-radius: 0;
  }
}

.app-sidebar__logo-wrp {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: toRem(1) solid var(--bg-secondary-light);
  margin-bottom: toRem(24);
  padding: 0 toRem(30);

  @include respond-to(tablet) {
    flex-direction: row;
    justify-content: space-between;
  }
}

.app-sidebar__logo {
  max-width: toRem(211);
  width: 100%;
  height: auto;

  @include respond-to(tablet) {
    max-width: toRem(150);
  }
}

.app-sidebar__logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.app-sidebar__logo-subtitle {
  text-transform: uppercase;
  text-align: center;
  color: var(--text-secondary-invert-main);
  font-size: toRem(14);
  line-height: 120%;

  @include respond-to(tablet) {
    font-size: toRem(10);
  }
}

.app-sidebar__links-section {
  grid-gap: toRem(4);
  margin-top: toRem(90);

  @include respond-to(xsmall) {
    margin-top: toRem(45);
  }
}

.app-sidebar__link {
  color: var(--text-secondary-invert-main);
  font-weight: 700;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: toRem(10);
  padding: toRem(6) toRem(30);
  border-radius: 0;
  width: 100%;
  height: toRem(44);
  transition: 0.3s ease-in-out;
  transition-property: background, color;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 0;
    width: toRem(2);
    background: var(--primary-main);
    transition: 0.3s ease-in-out;
  }

  &.router-link-active {
    background: #{rgba(var(--white-rgb), 0.08)};
    color: var(--primary-main);

    &:before {
      height: 100%;
    }
  }
}

.app-sidebar__link-icon {
  --size: #{toRem(22)};

  max-width: var(--size);
  max-height: var(--size);
}

.app-sidebar__logout {
  margin-top: auto;
  margin-bottom: toRem(100);
}

.app-sidebar__copyright {
  align-self: center;
  color: var(--text-primary-invert-main);
  font-size: toRem(12);
  line-height: 120%;
}

.app-sidebar__close-button {
  display: none;

  @include respond-to(tablet) {
    --size: #{toRem(30)};

    display: block;
    color: var(--white);
    width: var(--size);
    height: var(--size);
  }
}

.app-sidebar__close-button-icon {
  width: 100%;
  height: 100%;
  color: var(--text-primary-invert-main);
}
</style>
