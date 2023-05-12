<template>
  <template
    v-for="(voucher, idx) in form.voucherFields"
    :key="voucher.networkName + idx"
  >
    <h4 class="vouchers-template__voucher-lbl">
      {{ voucher.networkName }}
    </h4>
    <collapse
      class="vouchers-template__collapse"
      :is-close-by-click-outside="false"
      :is-opened-by-default="form.voucherFields[idx].isVoucherBuyable"
    >
      <template #head="{ collapse }">
        <checkbox-field
          v-model="form.voucherFields[idx].isVoucherBuyable"
          class="vouchers-template__checkbox"
          :disabled="isFormDisabled"
          :label="$t('nft-form.voucher-checkbox-lbl')"
          @click="collapse.toggle"
        />
      </template>
      <section class="vouchers-template__inputs">
        <input-field
          v-model="form.voucherFields[idx].voucherTokenAddress"
          :placeholder="$t('nft-form.voucher-token-placeholder')"
          :label="$t('nft-form.voucher-token-lbl')"
          :disabled="isFormDisabled"
          :error-message="
            getFieldErrorMessage(`voucherFields[${idx}].voucherTokenAddress`)
          "
          @blur="touchField(`voucherFields[${idx}].voucherTokenAddress`)"
        />

        <amount-field
          v-model="form.voucherFields[idx].voucherTokenAmount"
          :placeholder="$t('nft-form.voucher-token-amount-placeholder')"
          :label="$t('nft-form.voucher-token-amount-lbl')"
          :disabled="isFormDisabled"
          :error-message="
            getFieldErrorMessage(`voucherFields[${idx}].voucherTokenAmount`)
          "
          @blur="touchField(`voucherFields[${idx}].voucherTokenAmount`)"
        />
      </section>
    </collapse>
  </template>
</template>

<script setup lang="ts">
import { watch, Ref, reactive, toRef, computed } from 'vue'
import { Collapse } from '@/common'
import { InputField, AmountField, CheckboxField } from '@/fields'
import { useNetworksStore } from '@/store'
import { useFormValidation } from '@/composables'
import { minValue, maxValue, address, requiredIf } from '@/validators'

const MIN_VOUCHER_AMOUNT = 1
const MAX_VOUCHER_AMOUNT = 100

export type Vouchers = Array<{
  isVoucherBuyable: boolean
  voucherTokenAddress: string
  voucherTokenAmount: string
}>

type ExposedData = {
  vouchers: Ref<Vouchers>
  isFormValid: () => boolean
}

const props = defineProps<{
  isFormDisabled: boolean
  networksToDeploy: Array<number>
}>()

const networkStore = useNetworksStore()

const getNetworkName = (chainId: number) => {
  const name = networkStore.list.find(
    network => network.chain_id === chainId,
  )?.name
  return name ?? ''
}

const emptyVoucher = {
  networkName: '',
  networkChainId: -1,
  voucherTokenAddress: '',
  voucherTokenAmount: '',
  isVoucherBuyable: false,
}

const form = reactive({
  voucherFields: props.networksToDeploy.map(chainId => ({
    ...emptyVoucher,
    networkName: getNetworkName(chainId),
    networkChainId: chainId,
  })),
})

const validationRules = {
  voucherFields: {
    ...new Array(networkStore.list.length).fill(0).reduce((acc, _, idx) => {
      const isRequired = computed(() =>
        Boolean(form.voucherFields[idx]?.isVoucherBuyable),
      )

      return {
        ...acc,
        [idx]: {
          voucherTokenAddress: {
            address,
          },
          voucherTokenAmount: {
            minValue: minValue(MIN_VOUCHER_AMOUNT),
            maxValue: maxValue(MAX_VOUCHER_AMOUNT),
            requiredIf: requiredIf(isRequired),
          },
        },
      }
    }, {}),
  },
}

const { isFormValid, touchField, getFieldErrorMessage } = useFormValidation(
  form,
  validationRules,
)

defineExpose<ExposedData>({
  vouchers: toRef(form, 'voucherFields'),
  isFormValid,
})

watch(
  () => props.networksToDeploy,
  () => {
    const newVouchers = []

    for (let i = 0; i < props.networksToDeploy.length; i++) {
      const oldVoucher = form.voucherFields.find(
        voucher => voucher.networkChainId === props.networksToDeploy[i],
      )
      if (oldVoucher) {
        newVouchers.push({ ...oldVoucher })
        continue
      }

      newVouchers.push({
        ...emptyVoucher,
        networkChainId: props.networksToDeploy[i],
        networkName: getNetworkName(props.networksToDeploy[i]),
      })
    }

    form.voucherFields = newVouchers
  },
)
</script>

<style lang="scss" scoped>
.vouchers-template__voucher-lbl {
  align-self: flex-start;
  line-height: 100%;
}

.vouchers-template__checkbox {
  align-self: flex-start;
  margin-bottom: toRem(20);
}

.vouchers-template__collapse {
  width: 100%;
}

.vouchers-template__inputs {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
  padding: toRem(20);
}
</style>
