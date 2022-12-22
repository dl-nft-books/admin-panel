<template>
  <form class="promocode-update-form" @submit.prevent="submit">
    <div class="promocode-update-form__header">
      <h1>
        {{ $t('promocode-update-form.title') }}
      </h1>
      <p class="promocode-update-form__subtitle">
        {{ $t('promocode-update-form.subtitle') }}
      </p>
    </div>
    <input-field
      @blur="touchField('numberOfUses')"
      :error-message="getFieldErrorMessage('numberOfUses')"
      v-model="form.numberOfUses"
      type="number"
      :disabled="isFormDisabled"
      :label="$t('promocode-update-form.input-lbl')"
    />
    <section class="promocode-update-form__actions">
      <app-button
        class="promocode-update-form__button"
        scheme="flat"
        size="medium"
        :disabled="isFormDisabled"
        :text="$t('promocode-update-form.cancel-btn-lbl')"
        @click="closeModal"
      />
      <app-button
        class="promocode-update-form__button"
        size="small"
        :disabled="isFormDisabled"
        :text="$t('promocode-update-form.submit-btn-lbl')"
        type="submit"
      />
    </section>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { updatePromocode } from '@/api'
import { AppButton } from '@/common'
import { InputField } from '@/fields'
import { useForm, useFormValidation, useContext } from '@/composables'
import { required, minValue, maxValue } from '@/validators'
import { Bus, ErrorHandler } from '@/helpers'
import { Promocode } from '@/types'

import { MAX_PROMOCODE_USES_VALUE } from '@/consts'

const { $t } = useContext()

const props = defineProps<{
  promocode: Promocode
  closeModal: () => void
  reloaderFunc: () => void
}>()

const form = reactive({
  numberOfUses: props.promocode.initial_usages,
})

const { disableForm, enableForm, isFormDisabled } = useForm()
const { getFieldErrorMessage, touchField, isFormValid } = useFormValidation(
  form,
  {
    numberOfUses: {
      required,
      minValue: minValue(0),
      maxValue: maxValue(MAX_PROMOCODE_USES_VALUE),
    },
  },
)

const submit = async () => {
  if (!isFormValid()) return

  disableForm()
  try {
    await updatePromocode(Number(form.numberOfUses), props.promocode.id)

    Bus.success($t('promocode-update-form.success-msg'))
    props.closeModal()
    props.reloaderFunc()
  } catch (error) {
    ErrorHandler.process(error)
  }
  enableForm()
}
</script>

<style lang="scss" scoped>
.promocode-update-form {
  display: flex;
  flex-direction: column;
  gap: toRem(30);
  max-width: toRem(400);
}

.promocode-update-form__header {
  display: flex;
  flex-direction: column;
  gap: toRem(10);
}

.promocode-update-form__subtitle {
  font-size: toRem(18);
  line-height: 160%;
  opacity: 0.7;
}

.promocode-update-form__actions {
  display: flex;
  justify-content: space-between;
}

.promocode-update-form__button {
  height: toRem(48);
  width: 45%;
  text-transform: uppercase;
}
</style>
