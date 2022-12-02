<template>
  <div class="create-nft-page">
    <h2 class="create-nft-page__title">
      {{ $t('create-nft-page.title') }}
    </h2>
    <nft-form />
  </div>
</template>

<script lang="ts" setup>
import NftForm from '@/forms/NftForm.vue'
</script>

<style lang="scss" scoped>
.create-nft-page__title {
  font-weight: 600;
  font-size: toRem(40);
  margin-bottom: toRem(30);

  @include respond-to(small) {
    font-size: toRem(30);
  }
}
</style>
