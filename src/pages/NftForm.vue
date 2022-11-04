<script lang="ts" setup>
import { InputField, TextareaField, AmountField, FileField } from '@/fields'
import { computed, reactive } from 'vue'
import { AppButton } from '@/common'
import { FIELD_LENGTH, ROUTE_NAMES } from '@/enums'
import { useRoute, useRouter } from 'vue-router'
import { useTokenFactory, useForm, useFormValidation } from '@/composables'
import { useWeb3ProvidersStore } from '@/store'
import { storeToRefs } from 'pinia'
import { StoreDocument } from '@/api'
import { required, minValue } from '@/validators'
import { ErrorHandler, Bus, createBook } from '@/helpers'
import { BN } from '@/utils/math.util'
import { useI18n } from 'vue-i18n'
import { config } from '@/config'

const MIN_PRICE_VALUE = '0.01'
const MAX_BOOK_SIZE = 500 // mb

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { provider } = storeToRefs(useWeb3ProvidersStore())

const tokenFactory = useTokenFactory(
  provider.value,
  config.TOKEN_FACTORY_CONTRACT_ADDRESS,
)

const pageTitle = computed(() =>
  ROUTE_NAMES.nftItemEdit === route.name ? 'edit' : 'create',
)

const form = reactive<{
  name: string
  price: string
  description: string
  symbol: string
  photo?: File
  book?: File
}>({
  name: '',
  price: '',
  description: '',
  symbol: '',
  photo: undefined,
  book: undefined,
})

const { disableForm, enableForm, isFormDisabled } = useForm()
const { getFieldErrorMessage, touchField, isFormValid } = useFormValidation(
  form,
  {
    name: { required },
    price: { required, minValue: minValue(MIN_PRICE_VALUE) },
    description: { required },
    symbol: { required },
    photo: { required },
    book: { required },
  },
)

const submit = async () => {
  if (!isFormValid() || !provider.value.selectedAddress) return
  disableForm()
  try {
    const weiPrice = new BN(form.price).toWei().toString()
    const newTokenAddress = await tokenFactory.deployTokenContract(
      form.name,
      form.symbol,
      weiPrice,
    )

    const book = new StoreDocument({
      name: form.book?.name || '',
      file: form.book,
      mimeType: form.book?.type || '',
    })
    const banner = new StoreDocument({
      name: form.photo?.name || '',
      file: form.photo,
      mimeType: form.photo?.type || '',
    })
    await Promise.all([book.uploadSelf(), banner.uploadSelf()])

    await createBook({
      name: form.name,
      description: form.description,
      contractAddress: newTokenAddress,
      price: form.price,
      bookKey: book._key || '',
      bannerKey: banner._key || '',
      bookName: book._name || '',
      bannerName: banner._name || '',
      bookType: book._mimeType || '',
      bannerType: banner._mimeType || '',
    })

    Bus.success(t('nft-form.success-msg'))
    router.push({ name: ROUTE_NAMES.nfts })
  } catch (e) {
    ErrorHandler.process(e)
  }
  enableForm()
}
</script>

<template>
  <div class="nft-form">
    <h2 class="nft-form__title">
      {{ $t(`nft-form.${pageTitle}-title`) }}
    </h2>
    <form @submit.prevent="submit">
      <h3 class="nft-form__subtitle">
        {{ $t('nft-form.uploading-subtitle') }}
      </h3>
      <div class="nft-form__uploadings">
        <file-field
          class="nft-form__upload-field"
          v-model="form.photo"
          :file-extensions="['jpg', 'png']"
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
      <h3 class="nft-form__subtitle">
        {{ $t('nft-form.details-subtitle') }}
      </h3>
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
          class="nft-form__textarea"
          v-model="form.description"
          :max-length="FIELD_LENGTH.description"
          :placeholder="$t('nft-form.textarea-description-placeholder')"
          :label="$t('nft-form.textarea-description-label')"
          :error-message="getFieldErrorMessage('description')"
          :disabled="isFormDisabled"
          @blur="touchField('description')"
        />
      </div>
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
          type="submit"
          size="small"
          class="nft-form__button"
          :text="$t('nft-form.create-button')"
          :disabled="isFormDisabled"
        />
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.nft-form__title {
  font-weight: 600;
  font-size: toRem(40);
  margin-bottom: toRem(30);

  @include respond-to(small) {
    font-size: toRem(30);
  }
}

.nft-form__subtitle {
  font-size: toRem(24);
  font-weight: 600;
  margin-bottom: toRem(20);

  @include respond-to(small) {
    font-size: toRem(20);
  }
}

.nft-form__uploadings {
  display: grid;
  grid-template-columns: repeat(2, minmax(toRem(100), toRem(510)));
  grid-column-gap: toRem(20);
  margin-bottom: toRem(35);
  justify-content: space-evenly;

  @include respond-to(medium) {
    display: flex;
    flex-direction: column;
    gap: toRem(20);
  }
}

.nft-form__details {
  display: grid;
  grid-template-columns: repeat(2, minmax(toRem(100), 1fr));
  grid-gap: toRem(15) toRem(20);

  @include respond-to(medium) {
    display: flex;
    flex-direction: column;
    gap: toRem(20);
  }
}

.nft-form__textarea {
  grid-column: 1/2;
}

.nft-form__action-buttons {
  display: flex;
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
}
</style>
