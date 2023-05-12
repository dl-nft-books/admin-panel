<template>
  <div class="edit-nft-page">
    <h3 class="edit-nft-page__title">
      {{ $t('edit-nft-page.title') }}
    </h3>
    <loader v-if="isLoading" />

    <template v-else>
      <error-message
        v-if="isLoadFailed"
        :message="$t('edit-nft-page.error-msg')"
      />

      <nft-form v-else :book="book" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { NftForm } from '@/forms'
import { ErrorHandler } from '@/helpers'
import { Loader, ErrorMessage } from '@/common'
import { useBooks, FullBookInfo } from '@/composables'
import { useWeb3ProvidersStore } from '@/store'
import { Bus } from '@/helpers'

const props = defineProps<{
  id: string
}>()

Bus.on(Bus.eventList.toggleFormLoading, payload => {
  isLoading.value = payload as boolean
})

const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)

const { getBookById } = useBooks()

const book = ref<FullBookInfo>()
const isLoading = ref(false)
const isLoadFailed = ref(false)

const loadBook = async () => {
  isLoading.value = true
  isLoadFailed.value = false

  try {
    const data = await getBookById(props.id)
    book.value = data
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.processWithoutFeedback(e)
  }
  isLoading.value = false
}

loadBook()

watch(
  () => provider.value.chainId,
  () => {
    loadBook()
  },
)
</script>

<style lang="scss" scoped>
.edit-nft-page__title {
  margin-bottom: toRem(30);
}
</style>
