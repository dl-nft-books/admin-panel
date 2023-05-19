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
    isReverted?: boolean
    totalAmount?: number
  },
) {
  let offset = 0
  let pageNumber = 0

  const pageLimit = opts?.pageLimit || config.DEFAULT_PAGE_LIMIT

  const isLoading = ref(false)
  const isCollectionFetched = ref(false)

  let nextPageLoader: () => Promise<T[]>

  const _calcOffset = () => {
    if (!opts?.isReverted) {
      return pageNumber * pageLimit
    }

    return offset - pageLimit
  }

  const _calcRevertedParams = () => {
    if (offset < 0) return [pageLimit + offset, 0]

    return [pageLimit, offset]
  }

  const loadFirstPage = async () => {
    if (opts?.isReverted && !opts.totalAmount) return

    isCollectionFetched.value = false
    isLoading.value = true

    try {
      offset =
        opts?.totalAmount! - pageLimit < 0 ? 0 : opts?.totalAmount! - pageLimit

      const data = await firstPageLoader.value(
        pageLimit,
        !opts?.isReverted ? 0 : offset,
      )
      onFirstPageLoad(data)

      if (!opts?.isReverted) pageNumber = 1

      // offset for next page
      offset = _calcOffset()

      isCollectionFetched.value = data.length === 0 || -offset >= pageLimit

      nextPageLoader = () => {
        const [revertedLimit, revertedOffset] = _calcRevertedParams()

        return firstPageLoader.value(
          !opts?.isReverted ? pageLimit : revertedLimit,
          !opts?.isReverted ? offset : revertedOffset,
        )
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
      offset = _calcOffset()

      isCollectionFetched.value = data.length === 0 || -offset >= pageLimit
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
