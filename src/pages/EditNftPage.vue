<template>
  <div class="edit-nft-page">
    <h2 class="edit-nft-page__title">
      {{ $t('edit-nft-page.title') }}
    </h2>
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message :message="$t('edit-nft-page.error-msg')" />
      </template>
      <template v-else>
        <nft-form :book="book" />
      </template>
    </template>
    <template v-else>
      <loader />
    </template>
  </div>
</template>

<script lang="ts" setup>
import NftForm from '@/forms/NftForm.vue'
import { getBookById } from '@/api'
import { ref } from 'vue'
import { ErrorHandler } from '@/helpers'
import { BookRecord } from '@/records'
import { Loader, ErrorMessage } from '@/common'

const props = defineProps<{
  id: string
}>()

const book = ref<BookRecord>()
const isLoaded = ref(false)
const isLoadFailed = ref(false)

const loadBook = async () => {
  try {
    const { data } = await getBookById(props.id)
    book.value = new BookRecord(data)
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.processWithoutFeedback(e)
  }
  isLoaded.value = true
}

loadBook()
</script>

<style lang="scss" scoped>
.edit-nft-page__title {
  font-weight: 600;
  font-size: toRem(40);
  margin-bottom: toRem(30);

  @include respond-to(small) {
    font-size: toRem(30);
  }
}
</style>
