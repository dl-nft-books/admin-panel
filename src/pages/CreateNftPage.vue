<template>
  <div class="create-nft-page">
    <h3 class="create-nft-page__title">
      {{ $t('create-nft-page.title') }}
    </h3>
    <nft-form />
  </div>
</template>

<script lang="ts" setup>
import { NftForm } from '@/forms'
</script>

<style lang="scss" scoped>
.create-nft-page__title {
  margin-bottom: toRem(30);
}
</style>
