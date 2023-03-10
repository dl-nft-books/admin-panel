<template>
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
      <amount-field
        v-model="form.floorPrice"
        :placeholder="$t('nft-form.input-floor-price-placeholder')"
        :label="$t('nft-form.input-floor-price-label')"
        :error-message="getFieldErrorMessage('floorPrice')"
        :disabled="isFormDisabled"
        @blur="touchField('floorPrice')"
      />
      <input-field
        v-model="form.symbol"
        :max-length="FIELD_LENGTH.tokenSymbol"
        :placeholder="$t('nft-form.input-symbol-placeholder')"
        :label="$t('nft-form.input-symbol-label')"
        :error-message="getFieldErrorMessage('symbol')"
        :disabled="isFormDisabled"
        @blur="touchField('symbol')"
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
        :is-opened-by-default="form.isVoucherAllowed"
      >
        <template #head="{ collapse }">
          <checkbox-field
            v-model="form.isVoucherAllowed"
            class="nft-form__collapse-trigger"
            :label="$t('nft-form.voucher-checkbox-lbl')"
            @click="collapse.toggle"
          />
        </template>
        <section class="nft-form__additional-inputs">
          <input-field
            v-model="form.voucherTokenAddress"
            :placeholder="$t('nft-form.voucher-token-placeholder')"
            :label="$t('nft-form.voucher-token-lbl')"
            :error-message="getFieldErrorMessage('voucherTokenAddress')"
            :disabled="isFormDisabled"
            @blur="touchField('voucherTokenAddress')"
          />
          <amount-field
            v-model="form.voucherTokenAmount"
            :placeholder="$t('nft-form.voucher-token-amount-placeholder')"
            :label="$t('nft-form.voucher-token-amount-lbl')"
            :error-message="getFieldErrorMessage('voucherTokenAmount')"
            :disabled="isFormDisabled"
            @blur="touchField('voucherTokenAmount')"
          />
        </section>
      </collapse>

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
} from '@/fields'
import { computed, reactive } from 'vue'
import { AppButton, Collapse } from '@/common'
import { FIELD_LENGTH, ROUTE_NAMES } from '@/enums'
import { useRouter } from 'vue-router'
import {
  useTokenFactory,
  useForm,
  useFormValidation,
  useNftBookToken,
} from '@/composables'
import { useWeb3ProvidersStore, useNetworksStore } from '@/store'
import { Document, createBook, updateBook } from '@/api'
import {
  required,
  minValue,
  maxValue,
  nonEmptyDocument,
  requiredIf,
  alphaNumWithSpecialChars,
} from '@/validators'
import { ErrorHandler, Bus, formatAssetFromWei, switchNetwork } from '@/helpers'
import { BN } from '@/utils/math.util'
import { BookRecord } from '@/records'
import { ethers } from 'ethers'
import {
  MIN_PRICE_VALUE,
  MIN_VOUCHER_AMOUNT,
  MAX_VOUCHER_AMOUNT,
  MAX_PRICE_VALUE,
  MAX_BOOK_SIZE,
} from '@/consts'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  book?: BookRecord
}>()

const { t } = useI18n()
const router = useRouter()
const web3ProvidersStore = useWeb3ProvidersStore()
const provider = computed(() => web3ProvidersStore.provider)

const networkStore = useNetworksStore()

const bookNft = useNftBookToken()

/* 
  if we CREATING nft - any chain from network list is valid for us
  if we EDITING nft - only valid chain is the original book chain
*/
const isValidChain = computed(() =>
  isUpdateNft.value
    ? Number(provider.value.chainId) === props.book.chainID
    : networkStore.list.find(
        network => network.chain_id === Number(provider.value.chainId),
      ),
)

const isUpdateNft = computed(() => Boolean(props.book))

const submitButtonText = computed(() =>
  isUpdateNft.value ? t('nft-form.edit-button') : t('nft-form.create-button'),
)

const secondSubtitleText = computed(() =>
  isUpdateNft.value
    ? t('nft-form.update-details-subtitle')
    : t('nft-form.details-subtitle'),
)

const nftPrice = new BN(props.book?.price || 0).fromWei().toString()
const nftFloorPrice = new BN(props.book?.floorPrice || 0).fromWei().toString()

const formatedVoucherTokenAmount = props.book?.voucherTokenAmount
  ? formatAssetFromWei(props.book?.voucherTokenAmount, 0)
  : '1'

const isContractValuesUpdated = computed(
  () =>
    form.symbol !== props.book?.contractSymbol ||
    form.price !== nftPrice ||
    form.name !== props.book?.contractName ||
    form.floorPrice !== nftFloorPrice,
)

const isVoucherParamsUpdated = computed(
  () =>
    form.voucherTokenAddress !== props.book?.voucherToken ||
    form.voucherTokenAmount !== formatedVoucherTokenAmount,
)

const isApiValuesUpdated = computed(
  () =>
    isDescriptionUpdated.value ||
    isTitleUpdated.value ||
    form.book.key !== props.book?.fileKey ||
    form.photo.key !== props.book?.bannerKey,
)

const isDescriptionUpdated = computed(
  () => form.description !== props.book?.description,
)

const isTitleUpdated = computed(() => form.name !== props.book?.title)

const isSubmitBtnDisabled = computed(
  () =>
    (!isApiValuesUpdated.value &&
      !isContractValuesUpdated.value &&
      !isVoucherParamsUpdated.value) ||
    isFormDisabled.value,
)

const form = reactive<{
  name: string
  price: string
  floorPrice: string
  description: string
  symbol: string
  photo: Document
  book: Document
  isVoucherAllowed: boolean
  voucherTokenAddress: string
  voucherTokenAmount: string
}>({
  name: props.book?.contractName || '',
  price: isUpdateNft.value ? nftPrice : '',
  floorPrice: isUpdateNft.value ? nftFloorPrice : '',
  description: props.book?.description || '',
  symbol: props.book?.contractSymbol || '',
  photo: props.book?.banner || new Document(),
  book: props.book?.file || new Document(),
  isVoucherAllowed:
    Boolean(props.book?.voucherToken) &&
    props.book?.voucherToken !== ethers.constants.AddressZero,
  voucherTokenAddress: props.book?.voucherToken || '',
  voucherTokenAmount: formatedVoucherTokenAmount,
})

/* 
  Reactive value from the form is being converted to plain object, 
  that why we need to use ref value
*/
const isVoucherAllowed = computed(() => form.isVoucherAllowed)
const minVoucherAmount = computed(() =>
  form.isVoucherAllowed ? MIN_VOUCHER_AMOUNT : 0,
)

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
      required,
      minValue: minValue(MIN_PRICE_VALUE),
      maxValue: maxValue(MAX_PRICE_VALUE),
    },
    description: { required },
    symbol: { required, alphaNumWithSpecialChars },
    photo: { nonEmptyDocument },
    book: { nonEmptyDocument },
    voucherTokenAddress: {
      requiredIf: requiredIf(isVoucherAllowed),
    },
    voucherTokenAmount: {
      requiredIf: requiredIf(isVoucherAllowed),
      minValue: minValue(minVoucherAmount),
      maxValue: maxValue(MAX_VOUCHER_AMOUNT),
    },
  },
)

const submit = async () => {
  if (!isFormValid() || !provider.value.selectedAddress) return
  disableForm()
  try {
    await Document.uploadDocuments([form.book, form.photo])

    if (isUpdateNft.value) {
      await updateNftBook(form.book, form.photo)
    } else {
      await createNftBook(form.book, form.photo)
    }
    router.push({ name: ROUTE_NAMES.nfts })
  } catch (e) {
    ErrorHandler.process(e)
  }
  enableForm()
}

const handleSwitchNetworkClick = () => {
  if (!props.book?.chainID) return

  switchNetwork(
    isUpdateNft.value ? props.book.chainID : networkStore.list[0].chain_id,
  )
}

const updateNftBook = async (book: Document, banner: Document) => {
  if (isContractValuesUpdated.value) {
    bookNft.init(props.book?.contractAddress!)
    await bookNft.updateTokenContractParams(
      form.price,
      form.floorPrice,
      form.name,
      form.symbol,
    )
  }

  if (isVoucherParamsUpdated.value) {
    bookNft.init(props.book?.contractAddress)
    await bookNft.updateVoucherParams(
      form.voucherTokenAddress,
      form.voucherTokenAmount,
    )
  }

  if (isApiValuesUpdated.value) {
    await updateBook({
      bookId: props.book?.id!,
      book,
      banner,
      ...(isDescriptionUpdated.value ? { description: form.description } : {}),
      ...(isTitleUpdated.value ? { title: form.name } : {}),
    })
  }
  Bus.success(t('nft-form.edit-success-msg'))
}

const createNftBook = async (book: Document, banner: Document) => {
  const weiPrice = new BN(form.price).toWei().toString()
  const weiFloorPrice = new BN(form.floorPrice).toWei().toString()
  const weiTokenAmount = new BN(form.voucherTokenAmount).toWei().toString()

  const currentNetwork = networkStore.list.find(
    network => network.chain_id === Number(provider.value.chainId),
  )

  if (!currentNetwork) return

  const tokenFactory = useTokenFactory(currentNetwork.factory_address)

  const { data: bookSignature } = await createBook({
    tokenName: form.name,
    tokenSymbol: form.symbol,
    description: form.description,
    price: weiPrice,
    book,
    banner,
    voucherToken: form.isVoucherAllowed ? form.voucherTokenAddress : undefined,
    voucherTokenAmount: form.isVoucherAllowed ? weiTokenAmount : undefined,
    chainID: Number(provider.value.chainId),
    floorPrice: weiFloorPrice,
  })

  await tokenFactory.deployTokenContract(
    bookSignature.token_id,
    form.name,
    form.symbol,
    weiPrice,
    form.isVoucherAllowed
      ? form.voucherTokenAddress
      : ethers.constants.AddressZero,
    form.isVoucherAllowed ? weiTokenAmount : '0',
    weiFloorPrice,
    bookSignature.signature.r,
    bookSignature.signature.s,
    bookSignature.signature.v,
  )

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

.nft-form__collapse-trigger {
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
