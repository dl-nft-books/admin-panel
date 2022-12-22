import { JsonApiResponse } from '@/api/json-api/response'
import { JsonApiLinkFields } from '@/api/json-api/types'
import { config } from '@config'
import { onMounted, Ref, ref, watch, computed, ComputedRef } from 'vue'
import { ErrorHandler } from '@/helpers'

export const usePaginate = <T>(
  firstPageLoader: ComputedRef<() => Promise<JsonApiResponse<T>>>,
  onFirstPageLoad: (response: T) => void,
  onNextPageLoad: (response: T) => void,
  onError?: (e: Error) => void,
  opts?: {
    pageLimit?: number
    isLoadOnMounted?: boolean
  },
): {
  loadFirstPage(): Promise<void>
  loadNextPage(): Promise<void>
  isLoading: Ref<boolean>
  isCollectionFetched: Ref<boolean>
  isLoadMoreBtnShown: ComputedRef<boolean>
} => {
  const isLoading = ref(false)
  const isCollectionFetched = ref(false)

  const isLoadMoreBtnShown = computed(
    () => !isCollectionFetched.value && !isLoading.value,
  )

  let nextPageLoader: () => Promise<JsonApiResponse<T>>

  const loadFirstPage = async () => {
    isCollectionFetched.value = false
    return loadPage(firstPageLoader.value, onFirstPageLoad)
  }

  const loadNextPage = async () => {
    return loadPage(nextPageLoader, onNextPageLoad)
  }

  const loadPage = async (
    loaderFn: () => Promise<JsonApiResponse<T>>,
    onLoad: (response: T) => void,
  ) => {
    if (isCollectionFetched.value) return

    /**
     * loaderFn will be undefined in case where loadNextPage
     * fn get executes before we assign value to nextPageLoader on line 48.
     * This is the reason to add this check.
     **/
    if (!loaderFn) return

    isLoading.value = true
    try {
      const response = await loaderFn()

      onLoad(response.data)
      nextPageLoader = () => response.fetchPage(JsonApiLinkFields.next)

      const limit =
        opts?.pageLimit || response.pageLimit || config.DEFAULT_PAGE_LIMIT

      isCollectionFetched.value =
        ((response.data as unknown as Array<unknown>)?.length || 0) < limit
    } catch (e) {
      isCollectionFetched.value = false
      if (onError) onError(e as Error)
      ErrorHandler.processWithoutFeedback(e)
    }
    isLoading.value = false
  }

  onMounted(() => {
    watch(firstPageLoader.value, () => loadFirstPage(), {
      immediate: opts?.isLoadOnMounted ?? true,
    })
  })

  return {
    loadFirstPage,
    loadNextPage,
    isLoading,
    isCollectionFetched,
    isLoadMoreBtnShown,
  }
}
