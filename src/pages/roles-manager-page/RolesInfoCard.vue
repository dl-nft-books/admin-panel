<template>
  <div class="roles-info-card">
    <div
      v-for="(item, index) in cardHeader"
      :key="index"
      class="roles-info-card__content"
    >
      <span class="roles-info-card__content-label">
        {{ item.label }}
      </span>
      <span
        class="roles-info-card__content-value"
        :class="{
          'roles-info-card__content-value--hoverable': item.isCopyable,
        }"
        @click="
          () => {
            if (!item.isCopyable) return

            copyAddress(item.value)
          }
        "
      >
        {{ item.value }}
        <icon
          class="roles-info-card__icon"
          v-if="item.isCopyable"
          :name="$icons.copy"
        />
      </span>
    </div>
    <div class="roles-info-card__actions">
      <app-button
        class="roles-info-card__edit-btn"
        :text="$t('roles-info-card.edit-btn')"
        @click="isEditing = true"
      />
      <app-button
        class="roles-info-card__edit-btn"
        size="small"
        :icon-left="$icons.trash"
        @click="isDeleting = true"
      />
    </div>

    <modal v-model:is-shown="isEditing">
      <template #default="{ modal }">
        <role-form
          :role="role"
          @close="modal.close"
          @reload-page="$emit('reload-page')"
        />
      </template>
    </modal>

    <confirmation-modal
      v-model:is-shown="isDeleting"
      :is-deleting="isSubmitting"
      :entity="$t('roles-info-card.delete-lbl')"
      @confirm="deleteRole"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  cropAddress,
  formatDMY,
  copyToClipboard,
  Bus,
  ErrorHandler,
} from '@/helpers'
import { useI18n } from 'vue-i18n'

import { FullUserRoleInfo, useRolesManager } from '@/composables'
import { Icon, AppButton, Modal, ConfirmationModal } from '@/common'
import { RoleForm } from '@/forms'

const props = defineProps<{
  role: FullUserRoleInfo
}>()

const emit = defineEmits<{
  (event: 'reload-page'): void
}>()

const { t } = useI18n()
const { revokeRole } = useRolesManager()

const isEditing = ref(false)
const isDeleting = ref(false)
const isSubmitting = ref(false)

const cardHeader = [
  {
    label: t('roles-info-card.name'),
    value: props.role.name,
  },
  {
    label: t('roles-info-card.address'),
    value: cropAddress(props.role.address),
    isCopyable: true,
  },
  {
    label: t('roles-info-card.date'),
    value: props.role.created_at
      ? formatDMY(props.role.created_at)
      : t('roles-info-card.date-unknown'),
  },
  {
    label: t('roles-info-card.role'),
    value: props.role.roleName,
  },
]

const copyAddress = async (value: string) => {
  try {
    await copyToClipboard(value)
    Bus.info(t('roles-info-card.copy-success'))
  } catch (error) {
    ErrorHandler.process(error)
  }
}

const deleteRole = async () => {
  isSubmitting.value = true
  try {
    await revokeRole(props.role.role, props.role.address)
    Bus.success(t('roles-info-card.delete-success'))
    emit('reload-page')
  } catch (error) {
    ErrorHandler.process(error)
  }
  isDeleting.value = false
  isSubmitting.value = false
}
</script>

<style lang="scss" scoped>
.roles-info-card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(toRem(185), 1fr));
  align-items: center;
  justify-items: center;
  gap: toRem(20);
  border: toRem(1) solid var(--border-primary-main);
  border-radius: toRem(6);
  padding: toRem(10) toRem(15);
  background: var(--background-tertiary);
}

.roles-info-card__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: toRem(10);
  width: 100%;
  margin: toRem(15) 0;
}

.roles-info-card__content-label {
  color: var(--text-secondary-main);
  font-size: toRem(16);
  line-height: 120%;
}

.roles-info-card__content-value {
  font-size: toRem(20);
  line-height: 120%;
  width: 100%;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: toRem(10);

  @include text-ellipsis;

  &--hoverable {
    transition: 0.2s ease-in-out;
    transition-property: color;

    &:hover {
      color: var(--text-secondary-main);
      cursor: pointer;
    }
  }
}

.roles-info-card__icon {
  --size: #{toRem(20)};

  max-width: var(--size);
  max-height: var(--size);
}

.roles-info-card__edit-btn {
  text-transform: uppercase;
  font-weight: 700;
  height: toRem(40);
}

.roles-info-card__actions {
  display: flex;
  gap: toRem(10);
  align-items: center;
}
</style>
