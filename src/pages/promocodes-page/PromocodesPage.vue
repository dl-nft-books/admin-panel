<template>
  <div class="promocodes-page">
    <loader v-if="isLoading" />
    <error-message
      v-if="isLoadFailed"
      :message="$t('overview-nfts.error-message')"
      :title="$t('overview-nfts.error-title')"
    />
    <template v-else>
      <section class="promocodes-page__header">
        <h1 class="promocodes-page__title">
          {{ $t('promocodes-page.title') }}
        </h1>
        <div class="promocodes-page__filter">
          <select-field v-model="filter" :value-options="filterOptions" />
        </div>
      </section>

      <promocode-item
        v-for="promocode in promocodesList"
        :key="promocode.id"
        :promocode="promocode"
        :reloader-func="loadFirstPage"
      />

      <app-button
        v-if="isLoadMoreBtnShown"
        class="promocodes-page__load-more-btn"
        size="small"
        scheme="flat"
        :text="$t('overview-nfts.load-more-btn')"
        @click="loadNextPage"
      />
    </template>

    <mounted-teleport to="#app-navbar__right-buttons">
      <app-button
        class="promocodes-page__create-btn"
        size="small"
        :icon-left="$icons.plus"
        :text="buttonText"
        @click="isCreateModalShown = true"
      />
    </mounted-teleport>
    <modal v-model:is-shown="isCreateModalShown">
      <template #default="{ modal }">
        <promocode-create-form
          :close-modal="modal.close"
          :reloader-func="loadFirstPage"
        />
      </template>
    </modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { AppButton, Loader, ErrorMessage, Modal } from '@/common'
import { usePaginate, useContext } from '@/composables'
import { SelectField } from '@/fields'
import { getPromocodes } from '@/api'
import { PROMOCODE_STATUSES, WINDOW_BREAKPOINTS } from '@/enums'
import { Promocode } from '@/types'
import { ErrorHandler } from '@/helpers'
import { PromocodeItem } from '@/pages/promocodes-page'
import { PromocodeCreateForm } from '@/forms'
import { useWindowSize } from '@vueuse/core'

enum PROMOCODES_FILTERS {
  ALL = 'all',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

const { width } = useWindowSize()
const { $t } = useContext()

const buttonText = computed(() =>
  width.value >= WINDOW_BREAKPOINTS.small
    ? $t('promocodes-page.create-lbl')
    : '',
)

const filter = ref<PROMOCODES_FILTERS>(PROMOCODES_FILTERS.ALL)
const filterOptions = computed(() => [
  {
    label: 'All tokens',
    value: PROMOCODES_FILTERS.ALL,
  },
  {
    label: 'Available for use',
    value: PROMOCODES_FILTERS.ACTIVE,
  },
  {
    label: 'Unavailable for use',
    value: PROMOCODES_FILTERS.INACTIVE,
  },
])

const promocodesList = ref<Promocode[]>([])
const isLoadFailed = ref<boolean>(false)
const isCreateModalShown = ref<boolean>(false)

const getFilter = (filter: PROMOCODES_FILTERS): Array<PROMOCODE_STATUSES> => {
  switch (filter) {
    case PROMOCODES_FILTERS.ALL:
      return []
    case PROMOCODES_FILTERS.ACTIVE:
      return [PROMOCODE_STATUSES.ACTIVE]
    case PROMOCODES_FILTERS.INACTIVE:
      return [PROMOCODE_STATUSES.EXPIRED, PROMOCODE_STATUSES.FULLY_USED]
    default:
      return []
  }
}

const _loadList = computed(
  () => () => getPromocodes({ status: getFilter(filter.value) }),
)

const { loadNextPage, loadFirstPage, isLoading, isLoadMoreBtnShown } =
  usePaginate(_loadList, setList, concatList, onError)

function setList(chunk: Promocode[]) {
  promocodesList.value = chunk ?? []
}

function concatList(chunk: Promocode[]) {
  promocodesList.value = promocodesList.value.concat(chunk ?? [])
}

function onError(e: Error) {
  ErrorHandler.processWithoutFeedback(e)
  isLoadFailed.value = true
}
</script>

<style lang="scss" scoped>
.promocodes-page {
  display: flex;
  flex-direction: column;
  gap: toRem(15);
}

.promocodes-page__header {
  display: flex;
  justify-content: space-between;

  @include respond-to(small) {
    flex-direction: column;
    align-items: center;
    gap: toRem(20);
  }
}

.promocodes-page__title {
  font-size: toRem(40);
  line-height: toRem(49);
  user-select: none;
}

.promocodes-page__filter {
  width: toRem(200);
}

.promocodes-page__create-btn {
  width: toRem(200);
  order: -1;
  text-transform: uppercase;

  @include respond-to(small) {
    width: toRem(54);
    height: toRem(54);
    order: 1;
  }
}

.promocodes-page__load-more-btn {
  margin: toRem(20) auto 0;
}
</style>
