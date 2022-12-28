<template>
  <form class="promocode-form" @submit.prevent="submit">
    <div class="promocode-form__header">
      <h1>
        {{ formTitle }}
      </h1>
      <p v-if="isUpdate" class="promocode-form__subtitle">
        {{ $t('promocode-form.update-subtitle') }}
      </p>
    </div>
    <date-field
      v-model="form.dueDate"
      :min-date="minDate"
      :disabled="isFormDisabled"
      :label="$t('promocode-form.date-lbl')"
      :error-message="getFieldErrorMessage('dueDate')"
      @blur="touchField('dueDate')"
    />
    <input-field
      v-if="!isUpdate"
      v-model="form.discount"
      type="number"
      :error-message="getFieldErrorMessage('discount')"
      :disabled="isFormDisabled"
      :label="$t('promocode-form.discount-lbl')"
      @blur="touchField('discount')"
    />
    <input-field
      v-model="form.numberOfUses"
      type="number"
      :error-message="getFieldErrorMessage('numberOfUses')"
      :disabled="isFormDisabled"
      :label="$t('promocode-form.input-lbl')"
      @blur="touchField('numberOfUses')"
    />
    <section class="promocode-form__actions">
      <app-button
        class="promocode-form__button"
        scheme="flat"
        size="medium"
        :disabled="isFormDisabled"
        :text="$t('promocode-form.cancel-btn-lbl')"
        @click="emit('close')"
      />
      <app-button
        class="promocode-form__button"
        size="small"
        type="submit"
        :disabled="isFormDisabled"
        :text="submitText"
      />
    </section>
  </form>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { updatePromocode, createPromocode } from '@/api'
import { AppButton } from '@/common'
import { InputField, DateField } from '@/fields'
import { useForm, useFormValidation, useContext } from '@/composables'
import { required, minValue, maxValue, requiredIf } from '@/validators'
import { Bus, ErrorHandler } from '@/helpers'
import { Promocode } from '@/types'
import { DateUtil } from '@/utils/date.util'

import { MAX_DISCOUNT, MAX_PROMOCODE_USES_VALUE } from '@/consts'

const { $t } = useContext()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const props = defineProps<{
  promocode?: Promocode
}>()

const isUpdate = computed(() => Boolean(props.promocode))
const formTitle = computed(() =>
  isUpdate.value
    ? $t('promocode-form.update-title')
    : $t('promocode-form.create-title'),
)
const submitText = computed(() =>
  isUpdate.value
    ? $t('promocode-form.submit-update-btn-lbl')
    : $t('promocode-form.submit-create-btn-lbl'),
)

const form = reactive({
  numberOfUses: props.promocode?.initial_usages || '',
  dueDate: isUpdate.value
    ? DateUtil.format(props.promocode?.expiration_date, 'YYYY-MM-DD')
    : '',
  discount: '',
})

const minDate = computed(() =>
  isUpdate.value
    ? DateUtil.format(props.promocode?.expiration_date, 'YYYY-MM-DD')
    : DateUtil.format(Date.now(), 'YYYY-MM-DD'),
)

const { disableForm, enableForm, isFormDisabled } = useForm()
const { getFieldErrorMessage, touchField, isFormValid } = useFormValidation(
  form,
  {
    numberOfUses: {
      required,
      minValue: minValue(props.promocode?.initial_usages ?? 1),
      maxValue: maxValue(MAX_PROMOCODE_USES_VALUE),
    },
    dueDate: {
      required,
    },
    discount: {
      requiredIf: requiredIf(!isUpdate.value),
      minValue: minValue(1),
      maxValue: maxValue(MAX_DISCOUNT),
    },
  },
)

const submit = async () => {
  if (!isFormValid()) return

  disableForm()
  try {
    if (isUpdate.value) {
      await updatePromocode({
        id: props.promocode?.id as string,
        initial_usages: Number(form.numberOfUses),
        expiration_date: DateUtil.toISO(form.dueDate),
      })

      Bus.success($t('promocode-form.success-update-msg'))
    } else {
      await createPromocode({
        discount: Number(form.discount) / 100,
        expiration_date: DateUtil.toISO(form.dueDate),
        initial_usages: Number(form.numberOfUses),
      })

      Bus.success($t('promocode-form.success-create-msg'))
    }

    emit('close')
    Bus.emit(Bus.eventList.reloadPromocodesList)
  } catch (error) {
    ErrorHandler.process(error)
  }
  enableForm()
}
</script>

<style lang="scss" scoped>
.promocode-form {
  display: flex;
  flex-direction: column;
  gap: toRem(30);
  width: toRem(350);

  @include respond-to(small) {
    width: 100%;
  }
}

.promocode-form__header {
  display: flex;
  flex-direction: column;
  gap: toRem(10);
}

.promocode-form__subtitle {
  font-size: toRem(18);
  line-height: 160%;
  opacity: 0.7;
}

.promocode-form__actions {
  display: flex;
  justify-content: space-between;
}

.promocode-form__button {
  height: toRem(48);
  width: 45%;
  text-transform: uppercase;
}
</style>
