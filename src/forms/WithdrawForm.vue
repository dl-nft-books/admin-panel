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
        {{ formattedBalance }}
      </p>
    </header>
    <form class="withdraw-form__form" @submit.prevent="submit">
      <select-field
        v-model="form.chain"
        :error-message="getFieldErrorMessage('chain')"
        :value-options="networkList"
        :disabled="isFormDisabled || isLoading"
        :label="$t('withdraw-form.mainnet-lbl')"
        :placeholder="$t('withdraw-form.mainnet-placeholder')"
        @blur="touchField('chain')"
      />
      <read-only-field
        v-if="weiBalance"
        :value="weiBalance"
        :label="$t('withdraw-form.token-amount-lbl')"
      />
      <amount-field
        v-show="!form.isMax"
        v-model="form.amount"
        :placeholder="$t('withdraw-form.amount-placeholder')"
        :label="$t('withdraw-form.amount-lbl')"
        :error-message="getFieldErrorMessage('amount')"
        :disabled="isFieldDisabled"
        @blur="touchField('amount')"
      />
      <checkbox-field
        v-model="form.isMax"
        :disabled="isFieldDisabled"
        :label="$t('withdraw-form.max-amount-lbl')"
      />
      <input-field
        v-model="form.recipient"
        :placeholder="$t('withdraw-form.recipient-placeholder')"
        :label="$t('withdraw-form.recipient-lbl')"
        :error-message="getFieldErrorMessage('recipient')"
        :disabled="isFieldDisabled"
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
          :disabled="isFieldDisabled"
          :text="$t('withdraw-form.submit-btn')"
        />
      </section>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted } from 'vue'
import { AppButton } from '@/common'
import {
  SelectField,
  AmountField,
  InputField,
  CheckboxField,
  ReadOnlyField,
} from '@/fields'
import { useNetworksStore, useWeb3ProvidersStore } from '@/store'
import {
  useForm,
  useFormValidation,
  useWithdrawalManager,
  usePricer,
  Platform,
} from '@/composables'
import { required, address, maxValue, minValue, requiredIf } from '@/validators'
import {
  Bus,
  ErrorHandler,
  formatAssetFromWei,
  formatFiatAsset,
} from '@/helpers'
import { CURRENCIES } from '@/enums'
import { useI18n } from 'vue-i18n'
import { BN } from '@/utils/math.util'

const MIN_WITHDRAW_AMOUNT = 0.01

const emit = defineEmits<{
  (event: 'close'): void
}>()

const { t } = useI18n()

const networkStore = useNetworksStore()
const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)

const { getBalance, withdrawCurrency } = useWithdrawalManager()
const { getPlatformsList, getPriceByPlatform, formatChain } = usePricer()

const networkList = computed(() =>
  networkStore.list.map(el => ({
    label: el.name,
    value: el.chain_id,
  })),
)

const balance = ref('')
const weiBalance = ref('')

const formattedBalance = computed(
  () => balance.value && formatFiatAsset(balance.value, CURRENCIES.USD),
)
const isLoading = ref(false)
const platformList = ref<Platform[]>()

const form = reactive({
  amount: '',
  recipient: '',
  chain: '',
  isMax: false,
})

const currentPlatform = computed(() =>
  platformList.value?.find(
    platform => platform.chain_identifier === Number(formatChain(form.chain)),
  ),
)

const isCertainAmount = computed(() => !form.isMax)

const { disableForm, isFormDisabled, enableForm } = useForm()
const { isFormValid, getFieldErrorMessage, touchField } = useFormValidation(
  form,
  {
    amount: {
      requiredIf: requiredIf(isCertainAmount),
      maxValue: maxValue(weiBalance),
      minValue: minValue(MIN_WITHDRAW_AMOUNT),
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

const isFieldDisabled = computed(
  () => isFormDisabled.value || isLoading.value || !form.chain,
)

const submit = async () => {
  if (!isFormValid()) return

  disableForm()
  try {
    await withdrawCurrency(
      Number(form.chain),
      form.recipient,
      form.amount,
      form.isMax,
    )

    Bus.success(t('withdraw-form.success-msg'))
    emit('close')
  } catch (error) {
    ErrorHandler.process(error)
  }

  enableForm()
}

onMounted(async () => {
  const { data } = await getPlatformsList()
  platformList.value = data
})

watch(
  () => form.chain,
  async () => {
    if (!form.chain || !currentPlatform.value) return

    isLoading.value = true
    try {
      const data = await getBalance(Number(form.chain))
      if (!data) return

      const { data: tokenPrice } = await getPriceByPlatform(
        currentPlatform.value.id,
        undefined,
        Number(provider.value.chainId),
      )

      const formattedBalance = new BN(data, {
        decimals: tokenPrice.token.decimals,
      })
        .fromFraction(tokenPrice.token.decimals)
        .mul(tokenPrice.price)
        .toString()

      weiBalance.value = formatAssetFromWei(data, tokenPrice.token.decimals)

      balance.value = formattedBalance
    } catch (error) {
      ErrorHandler.process(error)
    }

    isLoading.value = false
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
