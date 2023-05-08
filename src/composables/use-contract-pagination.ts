import { config } from '@/config'
import { ref, computed, ComputedRef, watch, onMounted } from 'vue'

export function useContractPagination<T>(
  firstPageLoader: ComputedRef<(limit: number, offset: number) => Promise<T[]>>,
  onFirstPageLoad: (response: T[]) => void,
  onNextPageLoad: (response: T[]) => void,
  onError?: (e: Error) => void,
  opts?: {
    pageLimit?: number
    isLoadOnMounted?: boolean
  },
) {
  let offset = 0
  let pageNumber = 0
  const pageLimit = opts?.pageLimit || config.DEFAULT_PAGE_LIMIT

  const isLoading = ref(false)
  const isCollectionFetched = ref(false)

  let nextPageLoader: () => Promise<T[]>

  const loadFirstPage = async () => {
    isCollectionFetched.value = false
    isLoading.value = true

    try {
      const data = await firstPageLoader.value(pageLimit, 0)
      onFirstPageLoad(data)

      isCollectionFetched.value = data.length === 0

      pageNumber = 1
      offset = pageNumber * pageLimit

      nextPageLoader = () => {
        return firstPageLoader.value(pageLimit, offset)
      }
    } catch (error) {
      if (onError) onError(error as Error)
    }
    isLoading.value = false
  }

  const loadNextPage = async () => {
    if (!nextPageLoader) return

    isLoading.value = true
    try {
      const data = await nextPageLoader()
      onNextPageLoad(data)

      pageNumber++
      offset = pageNumber * pageLimit

      isCollectionFetched.value = data.length === 0
    } catch (error) {
      if (onError) onError(error as Error)
    }
    isLoading.value = false
  }

  const isLoadMoreBtnShown = computed(
    () => !isCollectionFetched.value && !isLoading.value,
  )

  onMounted(() => {
    watch(firstPageLoader.value, () => loadFirstPage(), {
      immediate: opts?.isLoadOnMounted ?? true,
    })
  })

  return {
    isLoadMoreBtnShown,
    isLoading,
    loadFirstPage,
    loadNextPage,
  }
}
