<script lang="ts" setup>
import LoginForm from '@/forms/LoginForm.vue'
import { AppLogo } from '@/common'
</script>

<template>
  <div class="login-page">
    <div class="login-page__header">
      <app-logo
        scheme="dark"
        class="login-page__logo"
      />
    </div>
    <div class="login-page__content">
      <div class="login-page__titles">
        <h1 class="login-page__title">
          {{ $t('login-page.title') }}
        </h1>
        <h2 class="login-page__subtitle">
          {{ $t('login-page.subtitle') }}
        </h2>
      </div>
      <div class="login-page__form-wrp">
        <login-form class="login-page__form" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: url('/images/login-page-bg.png') no-repeat bottom /
    cover;
}

.login-page__header {
  position: absolute;
  padding: toRem(40) toRem(30);
}

.login-page__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-page__logo {
  max-width: toRem(255);
}

.login-page__title {
  font-weight: 1000;
  font-size: toRem(58);
  text-align: center;
  text-transform: uppercase;
  color: var(--text-tertiary-main);

  @include respond-to(medium) {
    font-size: toRem(40);
  }
}

.login-page__subtitle {
  white-space: pre-line;
  font-weight: 400;
  font-size: toRem(30);
  line-height: toRem(40);
  text-align: center;
  margin: toRem(50) 0;

  @include respond-to(medium) {
    font-size: toRem(24);
  }
}
</style>
