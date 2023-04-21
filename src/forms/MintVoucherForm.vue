<template>
  <div class="mint-voucher-form__wrapper">
    <h4>{{ $t('mint-voucher-form.title') }}</h4>
    <form class="mint-voucher-form" @submit.prevent="submit">
      <input-field
        v-model="form.address"
        :disabled="isFormDisabled"
        :label="$t('mint-voucher-form.address-lbl')"
        :placeholder="$t('mint-voucher-form.address-placeholder')"
        :error-message="getFieldErrorMessage('address')"
        @blur="touchField('address')"
      />
      <amount-field
        v-model="form.amount"
        :disabled="isFormDisabled"
        :label="$t('mint-voucher-form.amount-lbl')"
        :placeholder="$t('mint-voucher-form.amount-placeholder')"
        :error-message="getFieldErrorMessage('amount')"
        @blur="touchField('amount')"
      />

      <div class="mint-voucher-form__actions">
        <app-button
          class="mint-voucher-form__btn"
          scheme="flat"
          size="small"
          :disabled="isFormDisabled"
          :text="$t('mint-voucher-form.cancel-btn')"
          @click="emit('close')"
        />
        <app-button
          class="mint-voucher-form__btn"
          type="submit"
          size="small"
          :disabled="isFormDisabled"
          :text="$t('mint-voucher-form.submit-btn')"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { AppButton } from '@/common'
import { InputField, AmountField } from '@/fields'
import { useVouchers, useForm, useFormValidation } from '@/composables'
import { useI18n } from 'vue-i18n'
import { required, address, minValue, maxValue } from '@/validators'

import { Bus, ErrorHandler } from '@/helpers'

const VOUCHER_MAX_AMOUNT = 1000
const emit = defineEmits<{
  (event: 'close'): void
}>()

const props = defineProps<{
  voucherAddress: string
}>()

const { t } = useI18n()
const { mintVoucher } = useVouchers()

const form = reactive({
  address: '',
  amount: '',
})

const { isFormDisabled, disableForm, enableForm } = useForm()
const { isFormValid, touchField, getFieldErrorMessage } = useFormValidation(
  form,
  {
    address: {
      required,
      address,
    },
    amount: {
      required,
      minValue: minValue(1),
      maxValue: maxValue(VOUCHER_MAX_AMOUNT),
    },
  },
)

const submit = async () => {
  if (!isFormValid()) return

  disableForm()
  try {
    await mintVoucher(props.voucherAddress, form.address, form.amount)

    Bus.success(t('mint-voucher-form.success-msg'))
    emit('close')
  } catch (error) {
    ErrorHandler.process(error)
  }
  enableForm()
}
</script>

<style lang="scss" scoped>
.mint-voucher-form__wrapper {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
  min-width: toRem(300);
}

.mint-voucher-form {
  display: flex;
  flex-direction: column;
  gap: toRem(15);
}

.mint-voucher-form__actions {
  display: flex;
  justify-content: space-between;
  margin-top: toRem(20);
}

.mint-voucher-form__btn {
  height: toRem(48);
  width: 45%;
  text-transform: uppercase;
}
</style>
