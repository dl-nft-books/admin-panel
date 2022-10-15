<script lang="ts" setup>
import LoginForm from '@/forms/LoginForm.vue'
</script>

<template>
  <div class="login-page">
    <div class="login-page__titles">
      <h1 class="login-page__title">
        {{ $t('login-page.title') }}
      </h1>
      <span class="login-page__subtitle">
        {{ $t('login-page.subtitle') }}
      </span>
    </div>
    <div class="login-page__form-wrp">
      <login-form class="login-page__form" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: toRem(24);
  gap: toRem(24);
}

.login-page__titles {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: toRem(24);
  padding: toRem(24);
  border-radius: toRem(16);
  background: rgb(17, 16, 16);
  background: linear-gradient(
    326deg,
    rgba(17, 16, 16, 1) 0%,
    rgba(245, 245, 245, 1) 100%,
    rgba(76, 190, 207, 1) 100%
  );
}

.login-page__title {
  font-size: toRem(48);
  font-weight: 900;
}

.login-page__subtitle {
  font-size: toRem(36);
}

.login-page__form-wrp {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
