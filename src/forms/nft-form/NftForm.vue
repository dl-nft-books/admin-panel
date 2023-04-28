<template>
  <!-- TODO: divide this component somehow - its too large -->
  <form class="nft-form" @submit.prevent="submit">
    <h4 class="nft-form__subtitle">
      {{ $t('nft-form.uploading-subtitle') }}
    </h4>
    <div class="nft-form__uploadings">
      <file-field
        class="nft-form__upload-field"
        v-model="form.photo"
        :file-extensions="['jpg', 'png', 'jpeg']"
        :label="$t('nft-form.file-field-image-title')"
        :note="$t('nft-form.file-field-image-description')"
        :error-message="getFieldErrorMessage('photo')"
        :disabled="isFormDisabled"
      />
      <file-field
        class="nft-form__upload-field"
        v-model="form.book"
        :file-extensions="['pdf']"
        :label="$t('nft-form.file-field-pdf-title')"
        :note="$t('nft-form.file-field-pdf-description')"
        :error-message="getFieldErrorMessage('book')"
        :disabled="isFormDisabled"
        :max-size="MAX_BOOK_SIZE"
      />
    </div>
    <h4 class="nft-form__subtitle">
      {{ secondSubtitleText }}
    </h4>
    <div class="nft-form__details">
      <input-field
        v-if="!isUpdateNft"
        v-model="form.name"
        :max-length="FIELD_LENGTH.name"
        :placeholder="$t('nft-form.input-name-placeholder')"
        :label="$t('nft-form.input-name-label')"
        :error-message="getFieldErrorMessage('name')"
        :disabled="isFormDisabled"
        @blur="touchField('name')"
      />
      <amount-field
        v-model="form.price"
        :placeholder="$t('nft-form.input-price-placeholder')"
        :label="$t('nft-form.input-price-label')"
        :error-message="getFieldErrorMessage('price')"
        :disabled="isFormDisabled"
        @blur="touchField('price')"
      />
      <input-field
        v-if="!isUpdateNft"
        v-model="form.symbol"
        :max-length="FIELD_LENGTH.tokenSymbol"
        :placeholder="$t('nft-form.input-symbol-placeholder')"
        :label="$t('nft-form.input-symbol-label')"
        :error-message="getFieldErrorMessage('symbol')"
        :disabled="isFormDisabled"
        @blur="touchField('symbol')"
      />
      <input-field
        v-model="form.fundsRecipient"
        :placeholder="$t('nft-form.input-funds-placeholder')"
        :label="$t('nft-form.input-funds-lbl')"
        :error-message="getFieldErrorMessage('fundsRecipient')"
        :disabled="isFormDisabled"
        @blur="touchField('fundsRecipient')"
      />

      <multiple-select-field
        v-if="!isUpdateNft"
        v-model="form.networksToDeploy"
        :value-options="networkList"
        :disabled="isFormDisabled"
        :label="$t('nft-form.mainnet-lbl')"
        :placeholder="$t('nft-form.mainnet-placeholder')"
        :error-message="getFieldErrorMessage('networksToDeploy')"
        @blur="touchField('networksToDeploy')"
      />

      <textarea-field
        v-model="form.description"
        :max-length="FIELD_LENGTH.description"
        :placeholder="$t('nft-form.textarea-description-placeholder')"
        :label="$t('nft-form.textarea-description-label')"
        :error-message="getFieldErrorMessage('description')"
        :disabled="isFormDisabled"
        @blur="touchField('description')"
      />

      <collapse
        class="nft-form__collapse"
        :is-close-by-click-outside="false"
        :is-opened-by-default="form.isNftBuyable"
      >
        <template #head="{ collapse }">
          <checkbox-field
            v-model="form.isNftBuyable"
            class="nft-form__checkbox"
            :disabled="isFormDisabled"
            :label="$t('nft-form.nft-buyable-checkbox-lbl')"
            @click="collapse.toggle"
          />
        </template>
        <section class="nft-form__additional-inputs">
          <amount-field
            v-model="form.floorPrice"
            :placeholder="$t('nft-form.input-floor-price-placeholder')"
            :label="$t('nft-form.input-floor-price-label')"
            :error-message="getFieldErrorMessage('floorPrice')"
            :disabled="isFormDisabled"
            @blur="touchField('floorPrice')"
          />
        </section>
      </collapse>

      <vouchers-template
        v-if="!isUpdateNft"
        ref="vouchersRef"
        :is-form-disabled="isFormDisabled"
        :networks-to-deploy="form.networksToDeploy"
      />

      <collapse
        v-else
        class="nft-form__collapse"
        :is-close-by-click-outside="false"
        :is-opened-by-default="form.isVoucherBuyable"
      >
        <template #head="{ collapse }">
          <checkbox-field
            v-model="form.isVoucherBuyable"
            class="nft-form__checkbox"
            :disabled="isFormDisabled"
            :label="$t('nft-form.voucher-checkbox-lbl')"
            @click="collapse.toggle"
          />
        </template>
        <section class="nft-form__additional-inputs">
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
            :placeholder="$t('nft-form.voucher-token-placeholder')"
            :label="$t('nft-form.voucher-token-amount-lbl')"
            :error-message="getFieldErrorMessage('voucherTokensAmount')"
            :disabled="isFormDisabled"
            @blur="touchField('voucherTokensAmount')"
          />
        </section>
      </collapse>

      <checkbox-field
        v-if="isUpdateNft"
        v-model="form.isDisabled"
        class="nft-form__checkbox"
        :disabled="isFormDisabled"
        :label="$t('nft-form.disabled-checkbox-lbl')"
      />
      <div class="nft-form__action-buttons">
        <app-button
          class="nft-form__button"
          scheme="flat"
          size="small"
          :text="$t('nft-form.cancel-button')"
          :route="{ name: $routes.nfts }"
          :disabled="isFormDisabled"
        />

        <app-button
          v-if="isValidChain"
          type="submit"
          size="small"
          class="nft-form__button"
          :text="submitButtonText"
          :disabled="isSubmitBtnDisabled"
        />

        <app-button
          v-else
          type="button"
          class="nft-form__button"
          size="small"
          :disabled="isFormDisabled"
          :text="$t('nft-form.switch-chain-button')"
          @click="handleSwitchNetworkClick"
        />
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
import {
  InputField,
  TextareaField,
  AmountField,
  FileField,
  CheckboxField,
  MultipleSelectField,
} from '@/fields'
import { computed, reactive, ref } from 'vue'
import { AppButton, Collapse } from '@/common'
import { FIELD_LENGTH, ROUTE_NAMES } from '@/enums'
import { useRouter } from 'vue-router'
import {
  useForm,
  useFormValidation,
  useBooks,
  FullBookInfo,
} from '@/composables'
import { useWeb3ProvidersStore, useNetworksStore } from '@/store'
import { Document } from '@/api'
import {
  required,
  minValue,
  maxValue,
  nonEmptyDocument,
  requiredIf,
  alphaNumWithSpecialChars,
  address,
} from '@/validators'
import { ErrorHandler, Bus, switchNetwork } from '@/helpers'
import { BN } from '@/utils/math.util'
import { MIN_PRICE_VALUE, MAX_PRICE_VALUE, MAX_BOOK_SIZE } from '@/consts'
import { useI18n } from 'vue-i18n'
import { BookFile } from '@/types'

import { VouchersTemplate } from '@/forms'
import { Vouchers } from '@/forms/nft-form/VouchersTemplate.vue'

const props = defineProps<{
  book?: FullBookInfo
}>()

const vouchersRef = ref<{
  vouchers: Vouchers
  isFormValid: () => boolean
} | null>()

const { t } = useI18n()
const router = useRouter()
const { createBook, updateBook } = useBooks()
const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)

const isUpdateNft = computed(() => Boolean(props.book))

const networkStore = useNetworksStore()

const networkList = computed(() =>
  networkStore.list.map(el => ({
    label: el.name,
    value: el.chain_id,
  })),
)

/* 
  if we CREATING nft - any chain from network list is valid for us
  if we EDITING nft - only valid chain is the original book chain
*/
const isValidChain = computed(() =>
  !isUpdateNft.value
    ? form.networksToDeploy[0] === Number(provider.value.chainId) ||
      !form.networksToDeploy.length
    : props.book?.networks.some(
        network =>
          network.attributes.chain_id === Number(provider.value.chainId),
      ),
)

const submitButtonText = computed(() =>
  isUpdateNft.value ? t('nft-form.edit-button') : t('nft-form.create-button'),
)

const secondSubtitleText = computed(() =>
  isUpdateNft.value
    ? t('nft-form.update-details-subtitle')
    : t('nft-form.details-subtitle'),
)

const nftPrice = new BN(props.book?.pricePerOneToken || 0).fromWei().toString()
const nftFloorPrice = new BN(props.book?.minNFTFloorPrice || 0)
  .fromWei()
  .toString()

const isContractValuesUpdated = computed(
  () =>
    form.symbol !== props.book?.tokenSymbol ||
    form.price !== nftPrice ||
    form.name !== props.book?.tokenName ||
    form.floorPrice !== nftFloorPrice ||
    form.fundsRecipient !== props.book?.fundsRecipient ||
    form.isNftBuyable !== props.book.isNFTBuyable ||
    form.isDisabled !== props.book?.isDisabled ||
    form.isVoucherBuyable !== props.book?.isVoucherBuyable ||
    form.voucherTokenContract !== props.book?.voucherTokenContract ||
    new BN(form.voucherTokensAmount).toWei().toString() !==
      props.book.voucherTokensAmount,
)

const isApiValuesUpdated = computed(
  () =>
    form.description !== props.book?.description ||
    form.book.key !== props.book?.file.attributes.key ||
    form.photo.key !== props.book?.banner.attributes.key,
)

const isFilesUpdated = computed(
  () =>
    form.book.key !== props.book?.file.attributes.key ||
    form.photo.key !== props.book?.banner.attributes.key,
)

const isSubmitBtnDisabled = computed(
  () =>
    (!isApiValuesUpdated.value &&
      !isContractValuesUpdated.value &&
      !isFilesUpdated.value) ||
    isFormDisabled.value,
)

const toDocument = (file: BookFile) => {
  return new Document({
    name: file.attributes.name,
    mimeType: file.attributes.mime_type,
    key: file.attributes.key,
  })
}

const form = reactive<{
  name: string
  price: string
  floorPrice: string
  description: string
  symbol: string
  fundsRecipient: string
  photo: Document
  book: Document
  isNftBuyable: boolean
  isVoucherBuyable: boolean
  voucherTokenContract: string
  voucherTokensAmount: string
  isDisabled: boolean
  networksToDeploy: Array<number>
}>({
  name: props.book?.tokenName || '',
  price: isUpdateNft.value ? nftPrice : '',
  floorPrice: isUpdateNft.value ? nftFloorPrice : '',
  description: props.book?.description || '',
  symbol: props.book?.tokenSymbol || '',
  photo: props.book?.banner ? toDocument(props.book.banner) : new Document(),
  book: props.book?.file ? toDocument(props.book?.file) : new Document(),
  isNftBuyable: props.book?.isNFTBuyable ?? true,
  isVoucherBuyable: props.book?.isVoucherBuyable ?? false,
  fundsRecipient: props.book?.fundsRecipient || '',
  isDisabled: props.book?.isDisabled || false,
  voucherTokenContract: props.book?.voucherTokenContract ?? '',
  voucherTokensAmount: props.book?.voucherTokensAmount
    ? new BN(props.book.voucherTokensAmount).fromWei().toString()
    : '0',
  networksToDeploy: networkList.value[0]?.value
    ? [networkList.value[0].value]
    : [],
})
/* 
  Reactive value from the form is being converted to plain object, 
  that why we need to use ref value
*/
const isNftBuyable = computed(() => form.isNftBuyable)
const isVoucherBuyable = computed(() => form.isVoucherBuyable)
const voucherMinValue = computed(() => (form.isVoucherBuyable ? 1 : 0))

const { disableForm, enableForm, isFormDisabled } = useForm()
const { getFieldErrorMessage, touchField, isFormValid } = useFormValidation(
  form,
  {
    name: { required, alphaNumWithSpecialChars },
    price: {
      required,
      minValue: minValue(MIN_PRICE_VALUE),
      maxValue: maxValue(MAX_PRICE_VALUE),
    },
    floorPrice: {
      requiredIf: requiredIf(isNftBuyable),
      minValue: minValue(isNftBuyable.value ? MIN_PRICE_VALUE : 0),
      maxValue: maxValue(MAX_PRICE_VALUE),
    },
    description: { required },
    symbol: { required, alphaNumWithSpecialChars },
    photo: { nonEmptyDocument },
    book: { nonEmptyDocument },
    fundsRecipient: {
      address,
    },
    voucherTokenContract: {
      address,
    },
    voucherTokensAmount: {
      requiredIf: requiredIf(isVoucherBuyable),
      minValue: minValue(voucherMinValue),
      maxValue: maxValue(MAX_PRICE_VALUE),
    },
    networksToDeploy: {
      required,
    },
  },
)

const submit = async () => {
  if (!isFormValid() || !provider.value.selectedAddress) return

  disableForm()

  Bus.emit(Bus.eventList.toggleFormLoading, true)

  try {
    if (isUpdateNft.value) {
      await updateNftBook()
      router.push({ name: ROUTE_NAMES.nftItem, params: { id: props.book!.id } })
    } else {
      await createNftBook()
      router.push({ name: ROUTE_NAMES.nfts })
    }
  } catch (e) {
    ErrorHandler.processWithoutFeedback(e)
  }

  Bus.emit(Bus.eventList.toggleFormLoading, false)
  enableForm()
}

const handleSwitchNetworkClick = () => {
  if (isUpdateNft.value && !props.book?.networks[0].attributes.chain_id) return

  switchNetwork(
    isUpdateNft.value
      ? props.book?.networks[0].attributes.chain_id!
      : form.networksToDeploy[0],
  )
}

const updateNftBook = async () => {
  if (!props.book) return

  await updateBook(
    {
      name: form.name,
      symbol: form.symbol,
      contractParams: {
        pricePerOneToken: form.price,
        minNFTFloorPrice: form.floorPrice,
        fundsRecipient: form.fundsRecipient,
        isDisabled: form.isDisabled,
        isNFTBuyable: form.isNftBuyable,
        voucherTokenContract: form.voucherTokenContract,
        voucherTokensAmount: form.voucherTokensAmount,
        isVoucherBuyable: form.isVoucherBuyable,
      },
      apiParams: {
        id: props.book.id,
        description: form.description,
        file: form.book,
        banner: form.photo,
        networks: [
          {
            attributes: {
              chain_id: Number(provider.value.chainId),
              contract_address: props.book.tokenContract,
            },
          },
        ],
      },
    },
    {
      apiValuesUpdated: isApiValuesUpdated.value,
      filesUpdated: isFilesUpdated.value,
      contractValuesUpdate: isContractValuesUpdated.value,
    },
  )
  Bus.success(t('nft-form.edit-success-msg'))
}

const createNftBook = async () => {
  if (!vouchersRef.value || !vouchersRef.value?.isFormValid()) return

  await createBook({
    tokenName: form.name,
    tokenSymbol: form.symbol,
    description: form.description,
    price: form.price,
    floorPrice: form.floorPrice,
    banner: form.photo,
    bookFile: form.book,
    isNftBuyable: form.isNftBuyable,
    vouchers: vouchersRef.value.vouchers,
    fundsRecipient: form.fundsRecipient,
    chainIds: form.networksToDeploy,
  })

  Bus.success(t('nft-form.create-success-msg'))
}
</script>

<style lang="scss" scoped>
.nft-form {
  max-width: toRem(700);
  margin: 0 auto;
  padding: 0 toRem(20);
}

.nft-form__subtitle {
  margin-bottom: toRem(20);
}

.nft-form__uploadings {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
  margin-bottom: toRem(35);
}

.nft-form__collapse {
  width: 100%;
}

.nft-form__checkbox {
  align-self: flex-start;
  margin-bottom: toRem(20);
}

.nft-form__details {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: toRem(20);
}

.nft-form__additional-inputs {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
  padding: toRem(20);
}

.nft-form__action-buttons {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  column-gap: toRem(20);

  @include respond-to(xmedium) {
    margin-top: toRem(20);
  }

  @include respond-to(medium) {
    justify-content: space-evenly;
  }

  @include respond-to(small) {
    flex-direction: column;
    align-items: center;
    gap: toRem(20);
  }
}

.nft-form__button {
  text-transform: uppercase;
  width: toRem(182);
  padding: toRem(15);
  max-height: toRem(50);

  &:first-child {
    font-weight: 500;
  }
}
</style>
