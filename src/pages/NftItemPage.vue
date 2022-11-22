<script lang="ts" setup>
import { Loader, ErrorMessage, AppButton } from '@/common'
import { NftDetails, SaleHistory } from '@/pages/nft-item-page'

import { ErrorHandler, getBookById } from '@/helpers'
import { ref, computed } from 'vue'
import { BookRecord } from '@/records'
import { WINDOW_BREAKPOINTS } from '@/enums'
import { useWindowSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  id: string
}>()

const isLoaded = ref(false)
const isLoadFailed = ref(false)

const book = ref<BookRecord | undefined>()

const { width } = useWindowSize()
const { t } = useI18n()

const init = async () => {
  try {
    const bookData = await getBookById(props.id)
    book.value = new BookRecord(bookData)
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
    isLoadFailed.value = true
  }
  isLoaded.value = true
}

const buttonLinkText = computed(() =>
  width.value >= WINDOW_BREAKPOINTS.small ? t('nft-item-page.edit-button') : '',
)

init()
</script>

<template>
  <div class="nft-item-page">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message :message="$t('nft-item-page.loading-error-msg')" />
      </template>
      <template v-else-if="book">
        <div class="nft-item-page__book">
          <div class="nft-item-page__cover-wrp">
            <img
              :src="book.bannerUrl"
              :alt="book.title"
              class="nft-item-page__cover"
            />
          </div>
          <div class="nft-item-page__details">
            <h1 class="nft-item-page__title">
              {{ book.title }}
            </h1>
            <nft-details :book="book" />
          </div>
        </div>
        <sale-history :book-id="book.id" />
      </template>
    </template>
    <template v-else>
      <loader />
    </template>

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
  </div>
</template>

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

.nft-item-page__cover-wrp {
  width: 100%;

  @include respond-to(medium) {
    max-width: toRem(300);
    margin: 0 auto;
  }
}

.nft-item-page__cover {
  width: 100%;
  height: auto;
}

.nft-item-page__details {
  display: flex;
  flex-direction: column;
  border-bottom: toRem(1) solid var(--border-primary-dark);
  padding-bottom: toRem(30);
}

.nft-item-page__title {
  text-transform: uppercase;
  font-size: toRem(30);
  line-height: 1.2;
  margin-bottom: toRem(30);

  @include respond-to(xmedium) {
    font-size: toRem(20);
  }

  @include respond-to(medium) {
    text-align: center;
    margin-top: toRem(20);
  }
}

.nft-item-page__tabs {
  margin-bottom: toRem(40);
}

.nft-item-page__link-button {
  width: toRem(180);
  order: -1;

  @include respond-to(small) {
    width: toRem(54);
    height: toRem(54);
    order: 1;
  }
}
</style>
