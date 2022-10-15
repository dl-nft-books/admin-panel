<script lang="ts" setup>
import { AppLogo, Icon } from '@/common'
import { useAuth } from '@/composables'

const { logout } = useAuth()
</script>

<template>
  <aside class="app-sidebar">
    <div class="app-sidebar__logo-wrp">
      <app-logo class="app-sidebar__logo" />
      <span class="app-sidebar__logo-subtitle">
        {{ $t('app-sidebar.logo-subtitle') }}
      </span>
    </div>
    <div class="app-sidebar__links-section">
      <router-link class="app-sidebar__link" :to="{ name: $routes.nfts }">
        <icon class="app-sidebar__link-icon" :name="$icons.photograph" />
        {{ $t('app-sidebar.nfts-link') }}
      </router-link>
      <router-link class="app-sidebar__link" :to="{ name: $routes.uiKit }">
        <icon class="app-sidebar__link-icon" :name="$icons.database" />
        {{ $t('app-sidebar.kyc-requests-link') }}
      </router-link>
      <router-link class="app-sidebar__link" :to="{ name: $routes.web3 }">
        <icon class="app-sidebar__link-icon" :name="$icons.cog" />
        {{ $t('app-sidebar.settings-link') }}
      </router-link>
    </div>
    <button class="app-sidebar__link app-sidebar__logout" @click="logout">
      <icon class="app-sidebar__link-icon" :name="$icons.logout" />
      {{ $t('app-sidebar.logout-btn') }}
    </button>
    <div class="app-sidebar__refs">
      <a class="app-sidebar__refs-item">
        {{ $t('app-sidebar.terms-link') }}
      </a>
      <a class="app-sidebar__refs-item">
        {{ $t('app-sidebar.downloads-link') }}
      </a>
      <a class="app-sidebar__refs-item">
        {{ $t('app-sidebar.support-link') }}
      </a>
    </div>
    <div class="app-sidebar__copyright">
      {{
        $t('app-sidebar.copyright', {
          value: new Date().getFullYear(),
        })
      }}
    </div>
  </aside>
</template>

<style lang="scss" scoped>
$sidebar-padding-horizontal: toRem(16);
$sidebar-padding-vertical: toRem(24);

.app-sidebar {
  display: flex;
  flex-direction: column;
  background: var(--background-secondary);
  border-radius: toRem(6);
  padding: toRem(40) toRem(4) toRem(20);
  max-height: 100vh;
}

.app-sidebar__logo-wrp {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: toRem(1) solid var(--bg-secondary-light);
  margin-bottom: toRem(24);
  padding: 0 toRem(30);
}

.app-sidebar__logo {
  max-width: toRem(211);
  width: 100%;
  height: auto;
}

.app-sidebar__logo-subtitle {
  text-transform: uppercase;
  text-align: center;
  font-size: toRem(14);
  line-height: 1.2;
}

.app-sidebar__links-section {
  display: grid;
  grid-gap: toRem(4);
  margin-top: toRem(90);
}

.app-sidebar__link {
  position: relative;
  display: flex;
  align-items: center;
  color: var(--text-secondary-invert-main);
  padding: toRem(14) toRem(30);
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
  max-width: toRem(16);
  max-height: toRem(16);
  margin-right: toRem(10);
}

.app-sidebar__logout {
  margin-top: auto;
}

.app-sidebar__refs {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: toRem(36);
  margin: toRem(60) 0 toRem(16);
}

.app-sidebar__refs-item {
  font-size: toRem(12);
  line-height: 1.3;
  color: var(--text-primary-invert-main);
}

.app-sidebar__copyright {
  align-self: center;
  font-size: toRem(12);
  line-height: 1.3;
  color: var(--text-primary-invert-main);
}
</style>
