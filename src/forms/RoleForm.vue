<template>
  <div class="role-form">
    <h4 class="role-form__title">
      {{ formTitle }}
    </h4>
    <loader v-if="isLoading" />
    <form v-else class="role-form__form" @submit.prevent="submit">
      <input-field
        v-model="form.name"
        :placeholder="$t('role-form.name-placeholder')"
        :label="$t('role-form.name-lbl')"
        :error-message="getFieldErrorMessage('name')"
        :disabled="isFormDisabled"
        @blur="touchField('name')"
      />

      <read-only-field
        v-if="role"
        :label="$t('role-form.address-lbl')"
        :value="role.address"
      />

      <template v-else>
        <input-field
          v-model="form.address"
          :placeholder="$t('role-form.address-placeholder')"
          :label="$t('role-form.address-lbl')"
          :error-message="getFieldErrorMessage('address')"
          :disabled="isFormDisabled"
          @blur="touchField('address')"
        />

        <select-field
          v-model="form.role"
          :error-message="getFieldErrorMessage('role')"
          :label="$t('role-form.roles-lbl')"
          :value-options="selectOptions"
          :placeholder="$t('role-form.roles-placeholder')"
          @blur="touchField('role')"
        />
      </template>

      <section class="role-form__actions">
        <app-button
          class="role-form__actions-btn"
          scheme="flat"
          size="medium"
          :disabled="isFormDisabled"
          :text="$t('role-form.cancel-btn')"
          @click="emit('close')"
        />
        <app-button
          class="role-form__actions-btn role-form__actions-btn--submit"
          size="medium"
          type="submit"
          :disabled="isFormDisabled"
          :text="$t('role-form.submit-btn')"
        />
      </section>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { AppButton, Loader } from '@/common'
import { SelectField, InputField, ReadOnlyField } from '@/fields'

import {
  useForm,
  useFormValidation,
  useRolesManager,
  FullUserRoleInfo,
} from '@/composables'
import { required, address } from '@/validators'
import { Bus, cropAddress, ErrorHandler } from '@/helpers'

import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'reload-page'): void
}>()

const props = defineProps<{
  role?: FullUserRoleInfo
}>()

const { t } = useI18n()
const { getRolesList, grantRole, editUserName, getUserRoles } =
  useRolesManager()

const rolesList = ref<string[]>([])
const userRoles = ref<string[]>([])
const isLoading = ref(false)

const selectOptions = computed(() =>
  rolesList.value.map(el => ({
    label: cropAddress(el),
    value: el,
  })),
)

const isEditing = computed(() => Boolean(props.role))
const formTitle = computed(() =>
  !isEditing.value ? t('role-form.create-title') : t('role-form.edit-title'),
)

const form = reactive({
  name: props.role?.name || '',
  address: props.role?.address || '',
  role: props.role?.role || '',
})

const { disableForm, isFormDisabled, enableForm } = useForm()
const { isFormValid, getFieldErrorMessage, touchField } = useFormValidation(
  form,
  {
    name: {
      required,
    },
    address: {
      required,
      address,
    },
    role: {
      required,
    },
  },
)

const submit = async () => {
  if (!isFormValid()) return

  disableForm()
  try {
    if (isEditing.value) {
      await editUserName(form.name, props.role?.address)
    } else {
      await grantRole(form.role, form.address, form.name)
    }

    Bus.success(
      !isEditing.value
        ? t('role-form.success-msg')
        : t('role-form.success-edit-msg'),
    )

    emit('close')
    emit('reload-page')
  } catch (error) {
    ErrorHandler.process(error)
  }

  enableForm()
}

onMounted(async () => {
  if (isEditing.value) return

  isLoading.value = true
  try {
    const roles = await getRolesList()

    if (!roles) {
      isLoading.value = false
      return
    }

    rolesList.value = roles

    if (!props.role) {
      isLoading.value = false
      return
    }
    const _userRoles = await getUserRoles(props.role.address)

    if (!_userRoles) {
      isLoading.value = false
      return
    }

    userRoles.value = _userRoles
  } catch (error) {
    ErrorHandler.process(error)
  }
  isLoading.value = false
})
</script>

<style lang="scss" scoped>
.role-form {
  display: flex;
  flex-direction: column;
  gap: toRem(18);
  min-width: toRem(400);

  @include respond-to(small) {
    min-width: 95%;
  }
}

.role-form__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.role-form__header-lbl {
  font-size: toRem(16);
  line-height: 149%;
}

.role-form__header-value {
  font-weight: 800;
  font-size: toRem(18);
  color: var(--primary-main);
}

.role-form__form {
  display: flex;
  flex-direction: column;
  gap: toRem(23);
}

.role-form__actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: toRem(12);
}

.role-form__actions-btn {
  text-transform: uppercase;
  width: 45%;
  height: toRem(48);

  &--submit {
    font-weight: 700;
    font-size: toRem(16);
  }
}

.role-form__update-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
