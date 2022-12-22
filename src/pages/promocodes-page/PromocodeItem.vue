<template>
  <section>
    <collapse
      class="promocode-item__wrapper"
      :is-close-by-click-outside="false"
    >
      <template #head="{ collapse }">
        <div class="promocode-item">
          <div class="promocode-item__info">
            <p class="promocode-item__head">
              {{ $t('promocodes-page.promocode-lbl') }}
            </p>
            <p class="promocode-item__value">
              {{ promocode.promocode }}
            </p>
          </div>
          <div class="promocode-item__info">
            <p class="promocode-item__head">
              {{ $t('promocodes-page.discount-lbl') }}
            </p>
            <p class="promocode-item__value">
              {{ `${promocode.discount * 100}%` }}
            </p>
          </div>
          <div class="promocode-item__info">
            <p class="promocode-item__head">
              {{ $t('promocodes-page.uses-lbl') }}
            </p>
            <p class="promocode-item__value">
              {{ promocode.initial_usages }}
            </p>
          </div>
          <div class="promocode-item__info">
            <p class="promocode-item__head">
              {{ $t('promocodes-page.used-lbl') }}
            </p>
            <p class="promocode-item__value">
              {{ promocode.initial_usages - promocode.left_usages }}
            </p>
          </div>
          <promocode-state
            :title="promocodeStatusText"
            :scheme="
              promocode.state !== PROMOCODE_STATUSES.ACTIVE
                ? 'unavailable'
                : 'available'
            "
          />

          <app-button
            class="promocode-item__collapse-button"
            :class="{
              'promocode-item__collapse-button--open': collapse.isOpen,
            }"
            scheme="flat"
            :icon-right="$icons.arrowDown"
            size="small"
            color="secondary"
            @click.stop="collapse.toggle"
          />
        </div>
      </template>
      <div class="promocode-item__collapse-body">
        <div class="promocode-item__collapse-wrapper">
          <p class="promocode-item__head">
            {{ $t('promocodes-page.expire-date') }}
          </p>
          <p class="promocode-item__value">
            {{ $d(promocode.expiration_date, 'short') }}
          </p>
        </div>
        <div class="promocode-item__actions">
          <app-button
            @click="isUpdateModalShown = true"
            size="small"
            :icon-right="$icons.pencil"
          />
          <app-button
            size="small"
            :icon-right="$icons.trash"
            @click="deletePromocodeConfirm.isModalShown = true"
          />
        </div>
      </div>
    </collapse>
    <modal v-model:is-shown="isUpdateModalShown">
      <template #default="{ modal }">
        <promocode-update-form
          :promocode="promocode"
          :close-modal="modal.close"
          :reloader-func="reloaderFunc"
        />
      </template>
    </modal>
    <confirmation-modal
      :is-modal-shown="deletePromocodeConfirm"
      :callback="_deletePromocode"
      :entity="$t('promocodes-page.promocode-lbl')"
      :after-action-message="$t('promocodes-page.delete-success')"
    />
  </section>
</template>

<script setup lang="ts">
import { deletePromocode } from '@/api'
import { Collapse, AppButton, Modal, ConfirmationModal } from '@/common'
import { Promocode } from '@/types'
import { PromocodeState } from '@/pages/promocodes-page'
import { computed, ref, reactive } from 'vue'
import { PROMOCODE_STATUSES } from '@/enums'
import { useContext } from '@/composables'
import { PromocodeUpdateForm } from '@/forms'

const { $t } = useContext()

interface Props {
  promocode: Promocode
  reloaderFunc: () => Promise<void>
}

const props = defineProps<Props>()

const promocodeStatusText = computed(() =>
  props.promocode.state !== PROMOCODE_STATUSES.ACTIVE
    ? $t('promocodes-page.inactive')
    : $t('promocodes-page.active'),
)

const isUpdateModalShown = ref<boolean>(false)
const deletePromocodeConfirm = reactive({ isModalShown: false })

const _deletePromocode = async () => {
  await deletePromocode(props.promocode.id)
  await props.reloaderFunc()
}
</script>

<style lang="scss" scoped>
.promocode-item {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(toRem(120), 1fr));
  column-gap: toRem(15);
  row-gap: toRem(20);
  align-items: center;
  padding: 0 toRem(15) toRem(20) toRem(25);
  background-color: var(--background-tertiary);
  border-radius: toRem(6);

  & > *:last-child {
    justify-self: center;
  }

  &:hover {
    cursor: pointer;
  }
}

.promocode-item__wrapper {
  border: toRem(1) solid var(--border-primary-main);
  border-radius: toRem(6);
}

.promocode-item__info {
  display: flex;
  flex-direction: column;
  gap: toRem(10);
}

.promocode-item__value {
  @include text-ellipsis;

  font-weight: 500;
  font-size: toRem(20);
  line-height: toRem(24);
}

.promocode-item__head {
  @include text-ellipsis;

  font-size: toRem(16);
  line-height: toRem(19);
  color: var(--text-primary-light);
}

/* stylelint-disable selector-pseudo-class-no-unknown */
:deep(.promocode-item__collapse-button) {
  .app-button__icon-right {
    transition: all 0.2s;
  }

  &.promocode-item__collapse-button--open {
    .app-button__icon-right {
      transform: rotate(180deg);
    }
  }
}
/* stylelint-enable selector-pseudo-class-no-unknown */

.promocode-item__collapse-body {
  border-top: toRem(1) solid var(--border-primary-main);
  padding: toRem(15) toRem(50);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.promocode-item__collapse-wrapper {
  display: flex;
  align-items: center;
  width: 45%;
  justify-content: space-between;

  @include respond-to(medium) {
    width: 100%;
  }
}

.promocode-item__actions {
  display: flex;
  align-items: center;
  gap: toRem(20);
}
</style>
