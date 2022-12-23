<template>
  <form class="promocode-create-form" @submit.prevent="submit">
    <h1>
      {{ $t('promocode-create-form.title') }}
    </h1>
    <date-field
      :min-date="minDate"
      v-model="form.expirationDate"
      :disabled="isFormDisabled"
      :label="$t('promocode-create-form.date-lbl')"
      @blur="touchField('expirationDate')"
      :error-message="getFieldErrorMessage('expirationDate')"
    />
    <input-field
      @blur="touchField('discount')"
      :error-message="getFieldErrorMessage('discount')"
      v-model="form.discount"
      type="number"
      :disabled="isFormDisabled"
      :label="$t('promocode-create-form.discount-lbl')"
    />
    <input-field
      @blur="touchField('numberOfUses')"
      :error-message="getFieldErrorMessage('numberOfUses')"
      v-model="form.numberOfUses"
      type="number"
      :disabled="isFormDisabled"
      :label="$t('promocode-create-form.uses-lbl')"
    />
    <section class="promocode-create-form__actions">
      <app-button
        class="promocode-create-form__button"
        scheme="flat"
        size="medium"
        :disabled="isFormDisabled"
        :text="$t('promocode-create-form.cancel-btn-lbl')"
        @click="closeModal"
      />
      <app-button
        class="promocode-create-form__button"
        size="small"
        :disabled="isFormDisabled"
        :text="$t('promocode-create-form.submit-btn-lbl')"
        type="submit"
      />
    </section>
  </form>
</template>

<script setup lang="ts">
import { createPromocode } from '@/api'
import { reactive, computed } from 'vue'
import { AppButton } from '@/common'
import { InputField, DateField } from '@/fields'
import { useForm, useFormValidation, useContext } from '@/composables'
import { required, minValue, maxValue } from '@/validators'
import { ErrorHandler, Bus } from '@/helpers'
import { MAX_PROMOCODE_USES_VALUE, MAX_DISCOUNT } from '@/consts'
import { DateUtil } from '@/utils/date.util'

const props = defineProps<{
  closeModal: () => void
  reloaderFunc: () => void
}>()

const minDate = computed(() => DateUtil.format(Date.now(), 'YYYY-MM-DD'))

const { $t } = useContext()

const form = reactive({
  numberOfUses: '',
  expirationDate: '',
  discount: '',
})

const { disableForm, enableForm, isFormDisabled } = useForm()
const { getFieldErrorMessage, touchField, isFormValid } = useFormValidation(
  form,
  {
    numberOfUses: {
      required,
      minValue: minValue(1),
      maxValue: maxValue(MAX_PROMOCODE_USES_VALUE),
    },
    expirationDate: {
      required,
    },
    discount: {
      required,
      minValue: minValue(1),
      maxValue: maxValue(MAX_DISCOUNT),
    },
  },
)

const submit = async () => {
  if (!isFormValid()) return

  disableForm()
  try {
    await createPromocode({
      discount: Number(form.discount) / 100,
      expiration_date: DateUtil.toISO(form.expirationDate),
      initial_usages: Number(form.numberOfUses),
    })

    Bus.success($t('promocode-create-form.success-msg'))
    props.closeModal()
    props.reloaderFunc()
  } catch (error) {
    ErrorHandler.process(error)
  }
  enableForm()
}
</script>

<style lang="scss" scoped>
.promocode-create-form {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
  width: toRem(400);
}

.promocode-create-form__actions {
  display: flex;
  justify-content: space-between;
}

.promocode-create-form__button {
  height: toRem(48);
  width: 45%;
  text-transform: uppercase;
}
</style>
