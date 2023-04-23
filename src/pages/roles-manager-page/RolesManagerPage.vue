<template>
  <div>
    <header class="roles-manager-page__header">
      <h3>
        {{ $t('roles-manager-page.title') }}
      </h3>
    </header>

    <main v-if="rolesList.length" class="roles-manager-page__content">
      <roles-info-card
        v-for="(role, idx) in rolesList"
        :key="idx + role.name + role.address"
        :role="role"
        @reload-page="loadFirstPage"
      />
    </main>

    <app-button
      v-if="isLoadMoreBtnShown"
      class="roles-manager-page__load-more-btn"
      size="small"
      scheme="flat"
      :text="$t('roles-manager-page.load-more-btn')"
      @click="loadNextPage"
    />

    <loader v-if="isLoading" />

    <mounted-teleport to="#app-navbar__right-buttons">
      <app-button
        class="roles-manager-page__button"
        size="small"
        :icon-left="$icons.plus"
        :text="buttonText"
        @click="isCreatingNewRole = true"
      />
    </mounted-teleport>

    <modal v-model:is-shown="isCreatingNewRole">
      <template #default="{ modal }">
        <role-form @close="modal.close" @reload-page="loadFirstPage" />
      </template>
    </modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { AppButton, Modal, Loader } from '@/common'
import { RoleForm } from '@/forms'
import {
  useContractPagination,
  useRolesManager,
  FullUserRoleInfo,
} from '@/composables'
import { ErrorHandler, redirectByAccessLevel } from '@/helpers'
import { RolesInfoCard } from '@/pages/roles-manager-page'
import { useWindowSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { WINDOW_BREAKPOINTS } from '@/enums'
import { useWeb3ProvidersStore, useRolesStore } from '@/store'

const rolesStore = useRolesStore()
const web3Store = useWeb3ProvidersStore()
const provider = computed(() => web3Store.provider)

const { width } = useWindowSize()
const { t } = useI18n()

const rolesList = ref<FullUserRoleInfo[]>([])
const isLoadFailed = ref(false)
const isCreatingNewRole = ref(false)

const buttonText = computed(() =>
  width.value >= WINDOW_BREAKPOINTS.medium
    ? t('roles-manager-page.new-role')
    : '',
)

const { getDetailedRolesList } = useRolesManager()

const loadList = computed(
  () => (limit: number, offset: number) => getDetailedRolesList(limit, offset),
)

function setList(chunk: FullUserRoleInfo[]) {
  rolesList.value = chunk ?? []
}

function concatList(chunk: FullUserRoleInfo[]) {
  rolesList.value = rolesList.value.concat(chunk ?? [])
}

function onError(e: Error) {
  ErrorHandler.processWithoutFeedback(e)
  isLoadFailed.value = true
}

const { isLoadMoreBtnShown, isLoading, loadNextPage, loadFirstPage } =
  useContractPagination(loadList, setList, concatList, onError)

watch(
  () => provider.value.chainId,
  () => {
    loadFirstPage()
  },
)

watch(
  () => rolesStore.hasRoleManagerRole,
  () => {
    if (rolesStore.hasRoleManagerRole) return

    redirectByAccessLevel()
  },
  {
    immediate: true,
  },
)
</script>

<style lang="scss" scoped>
.roles-manager-page__header {
  display: flex;
  justify-content: space-between;

  @include respond-to(small) {
    flex-direction: column;
    align-items: center;
    gap: toRem(20);
  }
}

.roles-manager-page__content {
  display: flex;
  flex-direction: column;
  gap: toRem(16);
  margin-top: toRem(20);
}

.roles-manager-page__button {
  order: -1;
  font-weight: 700;
  text-transform: uppercase;

  @include respond-to(medium) {
    --mobile-size: #{toRem(54)};

    width: var(--mobile-size);
    height: var(--mobile-size);
    order: 1;
  }
}

.roles-manager-page__load-more-btn {
  margin: toRem(30) auto 0;
}
</style>
