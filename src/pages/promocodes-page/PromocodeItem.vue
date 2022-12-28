<template>
  <section>
    <collapse class="promocode-item" :is-close-by-click-outside="false">
      <template #head="{ collapse }">
        <div class="promocode-item__wrapper">
          <div class="promocode-item__info">
            <p class="promocode-item__head">
              {{ $t('promocodes-page.promocode-lbl') }}
            </p>
            <app-button
              class="promocode-item__copy-promocode"
              scheme="default"
              size="default"
              icon-size="large"
              :text="promocode.promocode"
              :icon-right="$icons.duplicate"
              @click="copyPromocode(promocode.promocode)"
            />
          </div>
          <div class="promocode-item__info">
            <p class="promocode-item__head">
              {{ $t('promocodes-page.discount-lbl') }}
            </p>
            <p class="promocode-item__value">
              {{
                $t('promocodes-page.discount-value', {
                  amount: (promocode.discount * 100).toFixed(),
                })
              }}
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
              {{ promocode.usages }}
            </p>
          </div>
          <promocode-state
            :title="promocodeStatusText"
            :scheme="promocodeStatusScheme"
          />

          <app-button
            class="promocode-item__collapse-button"
            :class="{
              'promocode-item__collapse-button--open': collapse.isOpen,
            }"
            scheme="flat"
            size="small"
            color="secondary"
            :icon-right="$icons.arrowDown"
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
            size="small"
            :icon-right="$icons.pencil"
            @click="showUpdateModal"
          />
          <app-button
            size="small"
            :icon-right="$icons.trash"
            @click="showDeleteModal"
          />
        </div>
      </div>
    </collapse>
    <modal v-model:is-shown="isUpdateModalShown">
      <template #default="{ modal }">
        <promocode-form :promocode="promocode" @close="modal.close" />
      </template>
    </modal>
    <confirmation-modal
      v-model:is-shown="isDeleteModalShown"
      :entity="$t('promocodes-page.promocode-lbl')"
      @confirm="deletePromocode"
    />
  </section>
</template>

<script setup lang="ts">
import { deletePromocode as _deletePromocode } from '@/api'
import { Collapse, AppButton, Modal, ConfirmationModal } from '@/common'
import { Promocode } from '@/types'
import { PromocodeState } from '@/pages/promocodes-page'
import { computed, ref } from 'vue'
import { PROMOCODE_STATUSES } from '@/enums'
import { useContext } from '@/composables'
import { PromocodeForm } from '@/forms'
import { Bus, copyToClipboard, ErrorHandler } from '@/helpers'

const { $t } = useContext()

const props = defineProps<{
  promocode: Promocode
}>()

const promocodeStatusText = computed(() =>
  props.promocode.state !== PROMOCODE_STATUSES.ACTIVE
    ? $t('promocodes-page.inactive')
    : $t('promocodes-page.active'),
)
const promocodeStatusScheme = computed(() =>
  props.promocode.state !== PROMOCODE_STATUSES.ACTIVE
    ? 'unavailable'
    : 'available',
)

const isUpdateModalShown = ref(false)
const isDeleteModalShown = ref(false)

const showUpdateModal = () => {
  isUpdateModalShown.value = true
}

const showDeleteModal = () => {
  isDeleteModalShown.value = true
}

const deletePromocode = async () => {
  try {
    await _deletePromocode(props.promocode.id)
    Bus.emit(Bus.eventList.reloadPromocodesList)

    Bus.success($t('promocodes-page.delete-success'))
  } catch (error) {
    ErrorHandler.process(error)
  }
}

const copyPromocode = async (promocode: string) => {
  try {
    await copyToClipboard(promocode)
    Bus.info($t('promocodes-page.copy-success'))
  } catch (error) {
    ErrorHandler.process(error)
  }
}
</script>

<style lang="scss" scoped>
.promocode-item__copy-promocode {
  display: flex;
  max-width: 100%;
  max-height: toRem(30);
  font-weight: 500;
  font-size: toRem(20);
  line-height: toRem(24);
}

.promocode-item {
  border: toRem(1) solid var(--border-primary-main);
  border-radius: toRem(6);
}

.promocode-item__wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(toRem(120), 1fr));
  gap: toRem(20);
  align-items: center;
  padding: 0 toRem(15) toRem(20) toRem(25);
  background-color: var(--background-tertiary);
  border-radius: toRem(6);
}

.promocode-item__collapse-button {
  justify-self: center;
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

  @include respond-to(small) {
    flex-direction: column;
    gap: toRem(15);
  }
}

.promocode-item__collapse-wrapper {
  display: flex;
  align-items: center;
  width: 45%;
  justify-content: space-between;

  @include respond-to(medium) {
    width: 60%;
  }

  @include respond-to(small) {
    width: 100%;
    flex-direction: column;
    gap: toRem(10);
  }
}

.promocode-item__actions {
  display: flex;
  align-items: center;
  gap: toRem(20);

  @include respond-to(small) {
    width: 100%;
    justify-content: center;
  }
}

.promocode-item__icon {
  --size: #{toRem(25)};

  max-width: var(--size);
  max-height: var(--size);
}
</style>
