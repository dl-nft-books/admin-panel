<template>
  <div class="withdraw-form">
    <h4 class="withdraw-form__title">
      {{ $t('withdraw-form.title') }}
    </h4>
    <header class="withdraw-form__header">
      <p class="withdraw-form__header-lbl">
        {{ $t('withdraw-form.balance-lbl') }}
      </p>
      <p class="withdraw-form__header-value">
        {{ balance }}
      </p>
    </header>
    <form class="withdraw-form__form" @submit.prevent="submit">
      <select-field
        v-model="form.chain"
        :error-message="getFieldErrorMessage('chain')"
        :value-options="networkList"
        :label="$t('withdraw-form.mainnet-lbl')"
        :placeholder="$t('withdraw-form.mainnet-placeholder')"
        @blur="touchField('chain')"
      />
      <amount-field
        v-model="form.amount"
        :placeholder="$t('withdraw-form.amount-placeholder')"
        :label="$t('withdraw-form.amount-lbl')"
        :error-message="getFieldErrorMessage('amount')"
        :disabled="isFormDisabled"
        @blur="touchField('amount')"
      />
      <input-field
        v-model="form.recipient"
        :placeholder="$t('withdraw-form.recipient-placeholder')"
        :label="$t('withdraw-form.recipient-lbl')"
        :error-message="getFieldErrorMessage('recipient')"
        :disabled="isFormDisabled"
        @blur="touchField('recipient')"
      />

      <section class="withdraw-form__actions">
        <app-button
          class="withdraw-form__actions-btn"
          scheme="flat"
          size="medium"
          :disabled="isFormDisabled"
          :text="$t('withdraw-form.cancel-btn')"
          @click="emit('close')"
        />
        <app-button
          class="withdraw-form__actions-btn withdraw-form__actions-btn--submit"
          size="medium"
          type="submit"
          :disabled="isFormDisabled"
          :text="$t('withdraw-form.submit-btn')"
        />
      </section>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { AppButton } from '@/common'
import { SelectField, AmountField, InputField } from '@/fields'
import { useNetworksStore } from '@/store'
import { useForm, useFormValidation, useWithdrawalManager } from '@/composables'
import { required, address } from '@/validators'
import { Bus, ErrorHandler, formatFiatAssetFromWei } from '@/helpers'
import { CURRENCIES } from '@/enums'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (event: 'close'): void
}>()

const { t } = useI18n()

const networkStore = useNetworksStore()
const { getBalance, withdrawCurrency } = useWithdrawalManager()

const networkList = computed(() =>
  networkStore.list.map(el => ({
    label: el.name,
    value: el.chain_id,
  })),
)

const balance = ref('')

const form = reactive({
  amount: '',
  recipient: '',
  chain: '',
})

const { disableForm, isFormDisabled, enableForm } = useForm()
const { isFormValid, getFieldErrorMessage, touchField } = useFormValidation(
  form,
  {
    amount: {
      required,
    },
    recipient: {
      required,
      address,
    },
    chain: {
      required,
    },
  },
)

const submit = async () => {
  if (!isFormValid()) return

  disableForm()
  try {
    await withdrawCurrency(Number(form.chain), form.recipient)

    Bus.success(t('withdraw-form.success-msg'))
    emit('close')
  } catch (error) {
    ErrorHandler.process(error)
  }

  enableForm()
}

watch(
  () => form.chain,
  async () => {
    if (!form.chain) return

    const data = await getBalance(Number(form.chain))
    if (!data) return

    balance.value = formatFiatAssetFromWei(data, CURRENCIES.USD)
  },
)
</script>

<style lang="scss" scoped>
.withdraw-form {
  display: flex;
  flex-direction: column;
  gap: toRem(18);
  min-width: toRem(400);

  @include respond-to(small) {
    min-width: 95%;
  }
}

.withdraw-form__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.withdraw-form__header-lbl {
  font-size: toRem(16);
  line-height: 149%;
}

.withdraw-form__header-value {
  font-weight: 800;
  font-size: toRem(18);
  color: var(--primary-main);
}

.withdraw-form__form {
  display: flex;
  flex-direction: column;
  gap: toRem(23);
}

.withdraw-form__actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: toRem(12);
}

.withdraw-form__actions-btn {
  text-transform: uppercase;
  width: 45%;
  height: toRem(48);

  &--submit {
    font-weight: 700;
    font-size: toRem(16);
  }
}
</style>
