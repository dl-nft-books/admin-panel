<template>
  <div class="nft-item-page">
    <template v-if="isLoaded">
      <error-message
        v-if="isLoadFailed"
        :message="$t('nft-item-page.loading-error-msg')"
      />

      <template v-else-if="book">
        <div class="nft-item-page__book">
          <div class="nft-item-page__book-cover-wrapper">
            <img
              :src="book.banner.attributes.url"
              :alt="book.tokenName"
              class="nft-item-page__book-cover"
            />
          </div>
          <div class="nft-item-page__book-details">
            <p class="nft-item-page__book-title">
              {{ book.tokenName }}
            </p>
            <nft-details :book="book" />
            <app-button
              class="nft-item-page__deploy-btn"
              :text="$t('nft-item-page.add-networks-btn')"
              @click="isAddingMoreNetworks = true"
            />
          </div>
        </div>

        <sale-history :book-id="book.id" />
      </template>
    </template>

    <loader v-else />

    <mounted-teleport to="#app-navbar__right-buttons">
      <app-button
        class="nft-item-page__link-button"
        size="small"
        :icon-left="$icons.edit"
        :text="buttonLinkText"
        :route="{
          name: $routes.nftItemEdit,
          params: { id: props.id },
        }"
      />
    </mounted-teleport>

    <modal v-model:is-shown="isAddingMoreNetworks">
      <template #default="{ modal }">
        <add-network-form v-if="book" :book="book" @close="modal.close" />
      </template>
    </modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

import { Loader, ErrorMessage, AppButton, Modal } from '@/common'
import { NftDetails, SaleHistory } from '@/pages/nft-item-page'
import { AddNetworkForm } from '@/forms'
import { FullBookInfo, useBooks } from '@/composables'
import { WINDOW_BREAKPOINTS } from '@/enums'
import { ErrorHandler } from '@/helpers'

const props = defineProps<{
  id: string
}>()

const { getBookById } = useBooks()

const isLoaded = ref(false)
const isLoadFailed = ref(false)
const isAddingMoreNetworks = ref(false)

const book = ref<FullBookInfo | undefined>()

const { width } = useWindowSize()
const { t } = useI18n()

const init = async () => {
  try {
    const data = await getBookById(props.id)
    book.value = data
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
    isLoadFailed.value = true
  }
  isLoaded.value = true
}

const buttonLinkText = computed(() =>
  width.value >= WINDOW_BREAKPOINTS.tablet
    ? t('nft-item-page.edit-button')
    : '',
)

init()
</script>

<style lang="scss" scoped>
.nft-item-page {
  width: 100%;
}

.nft-item-page__book {
  display: grid;
  grid-template-columns: minmax(#{toRem(200)}, #{toRem(300)}) minmax(60%, 1fr);
  grid-column-gap: toRem(50);
  justify-content: center;
  margin-bottom: toRem(56);

  @include respond-to(medium) {
    display: block;
  }
}

.nft-item-page__book-cover-wrapper {
  width: 100%;

  @include respond-to(medium) {
    max-width: toRem(300);
    margin: 0 auto;
  }
}

.nft-item-page__book-cover {
  width: 100%;
  height: auto;
  border-radius: toRem(8);
}

.nft-item-page__book-details {
  display: flex;
  flex-direction: column;
  border-bottom: toRem(1) solid var(--border-primary-dark);
  padding-bottom: toRem(30);
}

.nft-item-page__book-title {
  margin-bottom: toRem(30);
  max-width: 45vw;
  font-weight: 600;
  word-wrap: break-word;
  font-size: toRem(30);
  line-height: toRem(40);
  color: var(--text-secondary-dark);

  @include respond-to(xmedium) {
    max-width: 30vw;
    margin-top: toRem(20);
    text-align: center;
    font-size: toRem(20);
    line-height: 1.3;
  }

  @include respond-to(small) {
    max-width: 90vw;
  }
}

.nft-item-page__link-button {
  width: toRem(180);
  order: -1;
  font-weight: 700;

  @include respond-to(tablet) {
    width: toRem(54);
    height: toRem(54);
    order: 1;
  }
}

.nft-item-page__deploy-btn {
  text-transform: uppercase;
  margin-top: toRem(20);
  align-self: center;
  font-weight: 600;
}
</style>
