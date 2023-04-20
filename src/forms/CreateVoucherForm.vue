<template>
  <div class="create-voucher-form__wrapper">
    <h4>{{ $t('create-voucher-form.title') }}</h4>
    <form class="create-voucher-form" @submit.prevent="submit">
      <input-field
        v-model="form.name"
        :disabled="isFormDisabled"
        :label="$t('create-voucher-form.name-lbl')"
        :placeholder="$t('create-voucher-form.name-placeholder')"
        :error-message="getFieldErrorMessage('name')"
        @blur="touchField('name')"
      />
      <input-field
        v-model="form.symbol"
        :disabled="isFormDisabled"
        :label="$t('create-voucher-form.symbol-lbl')"
        :placeholder="$t('create-voucher-form.symbol-placeholder')"
        :error-message="getFieldErrorMessage('symbol')"
        @blur="touchField('symbol')"
      />

      <div class="create-voucher-form__actions">
        <app-button
          class="create-voucher-form__btn"
          scheme="flat"
          size="small"
          :disabled="isFormDisabled"
          :text="$t('create-voucher-form.cancel-btn')"
          @click="emit('close')"
        />
        <app-button
          class="create-voucher-form__btn"
          type="submit"
          size="small"
          :disabled="isFormDisabled"
          :text="$t('create-voucher-form.submit-btn')"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { AppButton } from '@/common'
import { InputField } from '@/fields'
import { useVouchers, useForm, useFormValidation } from '@/composables'
import { useI18n } from 'vue-i18n'
import {
  required,
  minLength,
  maxLength,
  alphaNumWithSpecialChars,
} from '@/validators'
import { FIELD_LENGTH } from '@/enums'
import { Bus, ErrorHandler } from '@/helpers'

const MIN_NAME_LENGTH = 3
const MAX_NAME_LENGTH = 20

const emit = defineEmits<{
  (event: 'close'): void
}>()

const { t } = useI18n()
const { createVoucher } = useVouchers()

const form = reactive({
  name: '',
  symbol: '',
})

const { isFormDisabled, disableForm, enableForm } = useForm()
const { isFormValid, touchField, getFieldErrorMessage } = useFormValidation(
  form,
  {
    name: {
      required,
      alphaNumWithSpecialChars,
      minLength: minLength(MIN_NAME_LENGTH),
      maxLength: maxLength(MAX_NAME_LENGTH),
    },
    symbol: {
      required,
      alphaNumWithSpecialChars,
      maxLength: maxLength(FIELD_LENGTH.tokenSymbol),
    },
  },
)

const submit = async () => {
  if (!isFormValid()) return

  disableForm()
  try {
    await createVoucher(form.name, form.symbol)

    Bus.success(t('create-voucher-form.success-msg'))
    emit('close')
  } catch (error) {
    ErrorHandler.process(error)
  }
  enableForm()
}
</script>

<style lang="scss" scoped>
.create-voucher-form__wrapper {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
  min-width: toRem(300);
}

.create-voucher-form {
  display: flex;
  flex-direction: column;
  gap: toRem(15);
}

.create-voucher-form__actions {
  display: flex;
  justify-content: space-between;
  margin-top: toRem(20);
}

.create-voucher-form__btn {
  height: toRem(48);
  width: 45%;
  text-transform: uppercase;
}
</style>
