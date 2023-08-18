<template>
  <div class="add-network-form__wrapper">
    <h4 class="add-network-form__title">
      {{ $t('add-network-form.title') }}
    </h4>

    <form class="add-network-form" @submit.prevent="submit">
      <p v-if="!networkList.length">
        {{ $t('add-network-form.nothing-to-deploy') }}
      </p>
      <template v-else>
        <select-field
          v-if="networkList.length"
          v-model="form.chainId"
          :value-options="networkList"
          :label="$t('add-network-form.select-lbl')"
          :placeholder="$t('add-network-form.select-placeholder')"
        />

        <collapse
          :is-close-by-click-outside="false"
          :is-opened-by-default="form.isVoucherBuyable"
        >
          <template #head="{ collapse }">
            <checkbox-field
              v-model="form.isVoucherBuyable"
              class="add-network-form__checkbox"
              :label="$t('nft-form.voucher-checkbox-lbl')"
              @click="collapse.toggle"
            />
          </template>
          <section class="add-network-form__additional-inputs">
            <input-field
              v-model="form.voucherTokenContract"
              :placeholder="$t('nft-form.voucher-token-placeholder')"
              :label="$t('nft-form.voucher-token-lbl')"
              :error-message="getFieldErrorMessage('voucherTokenContract')"
              :disabled="isFormDisabled"
              @blur="touchField('voucherTokenContract')"
            />

            <amount-field
              v-model="form.voucherTokensAmount"
              :placeholder="$t('nft-form.voucher-token-amount-placeholder')"
              :label="$t('nft-form.voucher-token-amount-lbl')"
              :error-message="getFieldErrorMessage('voucherTokensAmount')"
              :disabled="isFormDisabled"
              @blur="touchField('voucherTokensAmount')"
            />
          </section>
        </collapse>
      </template>
      <div class="add-network-form__actions">
        <app-button
          class="add-network-form__btn"
          scheme="flat"
          size="small"
          :disabled="isFormDisabled"
          :text="$t('add-network-form.cancel-btn')"
          @click="emit('close')"
        />
        <app-button
          class="add-network-form__btn"
          type="submit"
          size="small"
          :disabled="isFormDisabled || !networkList.length"
          :text="$t('add-network-form.submit-btn')"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { AppButton, Collapse } from '@/common'
import { InputField, AmountField, SelectField, CheckboxField } from '@/fields'
import { useBooks, useForm, useFormValidation } from '@/composables'
import { useI18n } from 'vue-i18n'
import { address, requiredIf, minValue, maxValue, required } from '@/validators'
import { Bus, ErrorHandler } from '@/helpers'
import { MAX_PRICE_VALUE } from '@/consts'
import { useNetworksStore } from '@/store'
import { router } from '@/router'
import { ROUTE_NAMES } from '@/enums'
import { FullBookInfo } from '@/types'

const props = defineProps<{
  book: FullBookInfo
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const { t } = useI18n()
const { addNetworks } = useBooks()

const networkStore = useNetworksStore()

// if book already deployed on some chain - filter this chain from list
const networkList = computed(() =>
  networkStore.list
    .map(el => ({
      label: el.name,
      value: el.chain_id,
    }))
    .filter(
      el =>
        !props.book?.networks.some(
          network => network.attributes.chain_id === el.value,
        ),
    ),
)

const form = reactive({
  voucherTokenContract: '',
  voucherTokensAmount: '',
  chainId: '',
  isVoucherBuyable: false,
})

const isVoucherBuyable = computed(() => form.isVoucherBuyable)
const voucherMinValue = computed(() => (form.isVoucherBuyable ? 1 : 0))

const { isFormDisabled, disableForm, enableForm } = useForm()
const { isFormValid, touchField, getFieldErrorMessage } = useFormValidation(
  form,
  {
    voucherTokenContract: {
      address,
    },
    voucherTokensAmount: {
      requiredIf: requiredIf(isVoucherBuyable),
      minValue: minValue(voucherMinValue),
      maxValue: maxValue(MAX_PRICE_VALUE),
    },
    chainId: {
      required,
    },
  },
)

const submit = async () => {
  if (!isFormValid()) return

  disableForm()
  try {
    await addNetworks({
      id: props.book.id,
      tokenName: props.book.tokenName,
      tokenSymbol: props.book.tokenSymbol,
      price: props.book.pricePerOneToken,
      floorPrice: props.book.minNFTFloorPrice,
      isNftBuyable: props.book.isNFTBuyable,
      fundsRecipient: props.book.fundsRecipient,
      chainIds: [Number(form.chainId)],
      vouchers: [
        {
          isVoucherBuyable: form.isVoucherBuyable,
          voucherTokenAddress: form.voucherTokenContract,
          voucherTokenAmount: form.voucherTokensAmount,
        },
      ],
    })
    Bus.success(t('add-network-form.success-msg'))
    emit('close')
    router.push({ name: ROUTE_NAMES.nftsOverview })
  } catch (error) {
    ErrorHandler.process(error)
  }
  enableForm()
}
</script>

<style lang="scss" scoped>
.add-network-form__wrapper {
  display: flex;
  flex-direction: column;
  min-width: toRem(330);
}

.add-network-form__title {
  margin-bottom: toRem(15);
}

.add-network-form {
  display: flex;
  flex-direction: column;
  gap: toRem(15);
  padding: toRem(10) 0;
}

.add-network-form__actions {
  display: flex;
  justify-content: space-between;
  margin-top: toRem(20);
}

.add-network-form__btn {
  height: toRem(48);
  width: 45%;
  text-transform: uppercase;
}

.add-network-form__additional-inputs {
  display: flex;
  flex-direction: column;
  gap: toRem(15);
  margin-top: toRem(20);
  padding: toRem(5);
}
</style>
