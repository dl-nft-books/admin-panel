<template>
  <div class="login-page">
    <div class="login-page__header">
      <app-logo scheme="dark" class="login-page__logo" />
    </div>
    <div class="login-page__content">
      <div class="login-page__titles">
        <h1 class="login-page__title">
          {{ $t('login-page.title') }}
        </h1>
        <p class="login-page__subtitle">
          {{ $t('login-page.subtitle') }}
        </p>
      </div>
      <div class="login-page__form-wrp">
        <login-form class="login-page__form" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { LoginForm } from '@/forms'
import { AppLogo } from '@/common'
</script>

<style lang="scss" scoped>
.login-page {
  @include flex-container;

  flex: 1;
  background: url('/images/login-page-bg.png') no-repeat bottom / cover;
}

.login-page__header {
  position: fixed;
  top: 0;
  padding: toRem(40) toRem(30);
}

.login-page__content {
  @include flex-container;

  flex: 1;
  justify-content: center;
}

.login-page__logo {
  max-width: toRem(255);
}

.login-page__title {
  text-align: center;
  color: var(--text-tertiary-main);

  @include respond-to(medium) {
    font-size: toRem(40);
  }
}

.login-page__subtitle {
  @include info-headline;

  white-space: pre-line;
  text-align: center;
  margin: toRem(50) 0;
}
</style>
