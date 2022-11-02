<script lang="ts" setup>
import { InputField, TextareaField, AmountField, FileField } from '@/fields'
import { computed, ref } from 'vue'
import { AppButton } from '@/common'
import { FIELD_LENGTH, ROUTE_NAMES } from '@/enums'
import { useRoute } from 'vue-router'

const route = useRoute()

const pageTitle = computed(() =>
  ROUTE_NAMES.nftItemEdit === route.name ? 'edit' : 'create',
)

const form = ref({
  name: '',
  price: '',
  description: '',
  photo: undefined,
  book: undefined,
})

const submit = () => {
  return true
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
        />
        <file-field
          class="nft-form__upload-field"
          v-model="form.book"
          :file-extensions="['pdf']"
          :label="$t('nft-form.file-field-pdf-title')"
          :note="$t('nft-form.file-field-pdf-description')"
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
        />
        <amount-field
          v-model="form.price"
          :placeholder="$t('nft-form.input-price-placeholder')"
          :label="$t('nft-form.input-price-label')"
        />
        <textarea-field
          class="nft-form__textarea"
          v-model="form.description"
          :max-length="FIELD_LENGTH.description"
          :placeholder="$t('nft-form.textarea-description-placeholder')"
          :label="$t('nft-form.textarea-description-label')"
        />
      </div>
      <div class="nft-form__action-buttons">
        <app-button
          class="nft-form__button"
          scheme="flat"
          size="small"
          :text="$t('nft-form.cancel-button')"
          :route="{ name: $routes.nfts }"
        />
        <app-button
          type="submit"
          size="small"
          class="nft-form__button"
          :text="$t('nft-form.create-button')"
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
