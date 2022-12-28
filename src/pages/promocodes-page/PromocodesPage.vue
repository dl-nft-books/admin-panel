<template>
  <div class="promocodes-page">
    <loader v-if="isLoading" />
    <template v-else>
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

        <no-data-message
          v-if="!promocodesList.length"
          :message="$t('promocodes-page.no-data-message')"
        />
        <promocode-item
          v-for="promocode in promocodesList"
          v-else
          :key="promocode.id"
          :promocode="promocode"
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
        <promocode-form @on-form-close="modal.close" />
      </template>
    </modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { AppButton, Loader, ErrorMessage, Modal, NoDataMessage } from '@/common'
import { usePaginate, useContext } from '@/composables'
import { SelectField } from '@/fields'
import { getPromocodes } from '@/api'
import { PROMOCODE_STATUSES, WINDOW_BREAKPOINTS } from '@/enums'
import { Promocode } from '@/types'
import { Bus, ErrorHandler } from '@/helpers'
import { PromocodeItem } from '@/pages/promocodes-page'
import { PromocodeForm } from '@/forms'
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
    label: $t('promocodes-page.filter-all'),
    value: PROMOCODES_FILTERS.ALL,
  },
  {
    label: $t('promocodes-page.filter-active'),
    value: PROMOCODES_FILTERS.ACTIVE,
  },
  {
    label: $t('promocodes-page.filter-inactive'),
    value: PROMOCODES_FILTERS.INACTIVE,
  },
])

const promocodesList = ref<Promocode[]>([])
const isLoadFailed = ref(false)
const isCreateModalShown = ref(false)

const getFilter = (filter: PROMOCODES_FILTERS): Array<PROMOCODE_STATUSES> => {
  switch (filter) {
    case PROMOCODES_FILTERS.ACTIVE:
      return [PROMOCODE_STATUSES.ACTIVE]
    case PROMOCODES_FILTERS.INACTIVE:
      return [PROMOCODE_STATUSES.EXPIRED, PROMOCODE_STATUSES.FULLY_USED]
    case PROMOCODES_FILTERS.ALL:
    default:
      return []
  }
}

const loadList = computed(
  () => () => getPromocodes({ status: getFilter(filter.value) }),
)

const setList = (chunk: Promocode[]) => {
  promocodesList.value = chunk ?? []
}

const concatList = (chunk: Promocode[]) => {
  promocodesList.value = promocodesList.value.concat(chunk ?? [])
}

const onError = (e: Error) => {
  ErrorHandler.processWithoutFeedback(e)
  isLoadFailed.value = true
}

const { loadNextPage, loadFirstPage, isLoading, isLoadMoreBtnShown } =
  usePaginate(loadList, setList, concatList, onError)

Bus.on(Bus.eventList.reloadPromocodesList, loadFirstPage)
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
