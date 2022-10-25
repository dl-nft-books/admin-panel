<script lang="ts" setup>
import { ref } from 'vue'
import { InputField } from '@/fields'
import { Icon, NftListSection } from '@/common'

const searchByString = ref('')

const search = () => {
  return true
}
</script>

<template>
  <div class="overview-nfts">
    <div class="overview-nfts__header">
      <h2 class="overview-nfts__title">
        {{ $t('overview-nfts.title') }}
      </h2>
      <div class="overview-nfts__search-wrapper">
        <button
          class="overview-nfts__search-button"
          type="button"
          @click="search"
        >
          <icon class="overview-nfts__search-icon" :name="$icons.search" />
        </button>
        <input-field
          class="overview-nfts__search"
          v-model="searchByString"
          :placeholder="$t('overview-nfts.search-placeholder')"
          iconned
        />
      </div>
    </div>
    <div class="overview-nfts__content">
      <nft-list-section />
    </div>
  </div>
</template>

<style lang="scss" scoped>
$z-icon: 2;

.overview-nfts__header {
  display: flex;
  justify-content: space-between;
}

.overview-nfts__title {
  font-weight: 600;
  font-size: toRem(40);
}

.overview-nfts__search-wrapper {
  position: relative;
  width: toRem(180);
}

.overview-nfts__search-button {
  z-index: $z-icon;
  width: toRem(20);
  height: toRem(20);
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: toRem(20);
}

.overview-nfts__search-icon {
  width: 100%;
  height: 100%;
}

.overview-nfts__content {
  margin-top: toRem(20);
}
</style>
