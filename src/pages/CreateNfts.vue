<script lang="ts" setup>
import { InputField, TextareaField } from '@/fields'
import { ref } from 'vue'
import { AppButton } from '@/common'
import { FIELD_LENGTH } from '@/enums'

const form = ref({
  name: '',
  price: '',
  description: '',
})

const submit = () => {
  return true
}
</script>

<template>
  <div class="create-nfts">
    <h2 class="create-nfts__title">
      {{ $t('create-nfts.title') }}
    </h2>
    <form @submit.prevent="submit">
      <h3 class="create-nfts__subtitle">
        {{ $t('create-nfts.uploading-subtitle') }}
      </h3>
      <div class="create-nfts__uploadings">
        <input type="file" />
        <input type="file" />
      </div>
      <h3 class="create-nfts__subtitle">
        {{ $t('create-nfts.details-subtitle') }}
      </h3>
      <div class="create-nfts__details">
        <input-field
          v-model="form.name"
          :max-length="FIELD_LENGTH.name"
          :placeholder="$t('create-nfts.input-name-placeholder')"
          :label="$t('create-nfts.input-name-label')"
        />
        <input-field
          v-model="form.price"
          type="price"
          :placeholder="$t('create-nfts.input-price-placeholder')"
          :label="$t('create-nfts.input-price-label')"
        />
        <textarea-field
          class="create-nfts__textarea"
          v-model="form.description"
          :max-length="FIELD_LENGTH.description"
          :placeholder="$t('create-nfts.textarea-description-placeholder')"
          :label="$t('create-nfts.textarea-description-label')"
        />
      </div>
      <div class="create-nfts__action-buttons">
        <app-button
          class="create-nfts__button"
          size="default"
          scheme="flat"
          :text="$t('create-nfts.cancel-button')"
          :route="{ name: $routes.nfts }"
        />
        <app-button
          type="submit"
          class="create-nfts__button"
          size="default"
          :text="$t('create-nfts.create-button')"
        />
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.create-nfts__title {
  font-weight: 600;
  font-size: toRem(40);
  margin-bottom: toRem(30);
}

.create-nfts__subtitle {
  font-size: toRem(24);
  font-weight: 600;
  margin-bottom: toRem(20);
}

.create-nfts__uploadings {
  display: grid;
  grid-template-columns: repeat(2, minmax(toRem(100), 1fr));
  grid-column-gap: toRem(20);
  margin-bottom: toRem(35);
}

.create-nfts__details {
  display: grid;
  grid-template-columns: repeat(2, minmax(toRem(100), 1fr));
  grid-gap: toRem(15) toRem(20);
}

.create-nfts__action-buttons {
  display: flex;
  justify-content: flex-end;
  column-gap: toRem(20);
}

.create-nfts__button {
  text-transform: uppercase;
  width: toRem(182);
  padding: toRem(15);
}
</style>
