<template>
  <div class="voucher-card">
    <div
      v-for="(item, index) in cardHeader"
      :key="index"
      class="voucher-card__content"
    >
      <span class="voucher-card__content-label">
        {{ item.label }}
      </span>
      <span
        class="voucher-card__content-value"
        :class="{
          'voucher-card__content-value--hoverable': item.isCopyable,
        }"
        @click="
          () => {
            if (!item.isCopyable) return

            copyAddress(item.value)
          }
        "
      >
        {{ item.isCropped ? cropAddress(item.value) : item.value }}
        <icon
          class="voucher-card__icon"
          v-if="item.isCopyable"
          :name="$icons.copy"
        />
      </span>
    </div>
    <div class="voucher-card__actions">
      <app-button
        class="voucher-card__edit-btn"
        :text="$t('voucher-card.mint-btn')"
        @click="isMinting = true"
      />
    </div>

    <modal v-model:is-shown="isMinting">
      <template #default="{ modal }">
        <mint-voucher-form
          :voucher-address="voucher.tokenContract"
          @close="modal.close"
        />
      </template>
    </modal>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { cropAddress, copyToClipboard, Bus, ErrorHandler } from '@/helpers'
import { useI18n } from 'vue-i18n'

import { Icon, AppButton, Modal } from '@/common'
import { MintVoucherForm } from '@/forms'
import { IMarketplace } from '@/types/contracts/MarketPlace'

const props = defineProps<{
  voucher: IMarketplace.BaseTokenDataStruct
}>()

const { t } = useI18n()

const isMinting = ref(false)
const cardHeader = [
  {
    label: t('voucher-card.name'),
    value: props.voucher.tokenName,
  },
  {
    label: t('voucher-card.symbol'),
    value: props.voucher.tokenSymbol,
  },

  {
    label: t('voucher-card.address'),
    value: props.voucher.tokenContract,
    isCopyable: true,
    isCropped: true,
  },
]

const copyAddress = async (value: string) => {
  try {
    await copyToClipboard(value)
    Bus.info(t('voucher-card.copy-success'))
  } catch (error) {
    ErrorHandler.process(error)
  }
}
</script>

<style lang="scss" scoped>
.voucher-card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(toRem(185), 1fr));
  align-items: center;
  justify-items: center;
  gap: toRem(20);
  border: toRem(1) solid var(--border-primary-main);
  border-radius: toRem(6);
  padding: toRem(10) toRem(15);
  background: var(--background-tertiary);
}

.voucher-card__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: toRem(10);
  width: 100%;
  margin: toRem(15) 0;
}

.voucher-card__content-label {
  color: var(--text-secondary-main);
  font-size: toRem(16);
  line-height: 120%;
}

.voucher-card__content-value {
  font-size: toRem(20);
  line-height: 120%;
  width: 100%;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: toRem(10);

  @include text-ellipsis;

  &--hoverable {
    transition: 0.2s ease-in-out;
    transition-property: color;

    &:hover {
      color: var(--text-secondary-main);
      cursor: pointer;
    }
  }
}

.voucher-card__icon {
  --size: #{toRem(20)};

  max-width: var(--size);
  max-height: var(--size);
}

.voucher-card__edit-btn {
  text-transform: uppercase;
  font-weight: 700;
  height: toRem(40);
}

.voucher-card__actions {
  display: flex;
  gap: toRem(10);
  align-items: center;
}
</style>
