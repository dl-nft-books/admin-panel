<template>
  <div class="edit-nft-page">
    <h3 class="edit-nft-page__title">
      {{ $t('edit-nft-page.title') }}
    </h3>
    <template v-if="isLoaded">
      <error-message
        v-if="isLoadFailed"
        :message="$t('edit-nft-page.error-msg')"
      />

      <nft-form v-else :book="book" />
    </template>

    <loader v-else />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { NftForm } from '@/forms'
import { getBookById } from '@/api'
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
  margin-bottom: toRem(30);
}
</style>
