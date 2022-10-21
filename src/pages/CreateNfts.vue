<script lang="ts" setup>
import { InputField, TextareaField } from '@/fields'
import { ref } from 'vue'

const form = ref({
  name: '',
  price: '',
  description: '',
})

const submit = () => { return true }
</script>

<template>
  <div class="create-nfts">
    <h2 class="create-nfts__title">
      {{ $t('create-nfts.title') }}
    </h2>
    <form @submit="submit"></form>
    <h3 class="create-nfts__subtitle"></h3>
    <div class="create-nfts__uploadings">
      <input type="file" />
      <input type="file" />
    </div>
    <h3 class="create-nfts__subtitle"></h3>
    <div class="create-nfts__details">
      <input-field
        v-model="form.name"
        :placeholder="'to'"
        :label="'zxcgvhjkl'"
      />
      <input-field
        v-model="form.price"
        :placeholder="'to'"
        :label="'zxcgvhjkl'"
      />
      <textarea-field
        class="create-nfts__textarea"
        v-model="form.description"
        :label="$t('purchasing-modal.signature-lbl')"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.create-nfts__title {
  font-weight: 600;
  font-size: toRem(40);
}
</style>
