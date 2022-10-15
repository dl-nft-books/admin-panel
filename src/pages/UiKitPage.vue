<script lang="ts" setup>
import {
  AppButton,
  Modal,
  ErrorMessage,
  NoDataMessage,
  Loader,
  Icon,
  Collapse,
} from '@/common'
import { CheckboxField, InputField } from '@/fields'
import LoginForm from '@/forms/LoginForm.vue'

import { reactive, ref } from 'vue'
import { Bus } from '@/helpers'

const isModalShown = ref<boolean>(false)
const form = reactive({
  chbValue: false,
  inputValue: '',
})

const handleClick = () => {
  alert('some string')
}

const throwBusSuccess = () => {
  Bus.success('Success')
}

const throwBusError = () => {
  Bus.error('Error')
}

const throwBusWarning = () => {
  Bus.warning('Warning')
}

const throwBusInfo = () => {
  Bus.info('Info')
}
</script>

<template>
  <div class="ui-kit-page">
    <section class="ui-kit-page__buttons">
      <app-button
        :icon-right="$icons.gift"
        :text="'router, border-rounded, icon'"
        :route="{ name: $routes.uiKit }"
      />
      <app-button
        modification="border-circle"
        :text="'href, border-circle'"
        href="https://www.youtube.com/"
        target="_blank"
      />
      <app-button
        :text="'Alert, icon-first'"
        :icon-left="$icons.exclamationCircle"
        @click="handleClick"
      />
      <app-button size="large" :text="'large'" />
      <app-button size="small" :text="'small'" />
      <app-button
        color="success"
        :text="'Bus.success, success'"
        @click="throwBusSuccess"
      />
      <app-button
        color="error"
        :text="'Bus.error, error'"
        @click="throwBusError"
      />
      <app-button
        color="warning"
        :text="'Bus.warning, warning'"
        @click="throwBusWarning"
      />
      <app-button color="info" :text="'Bus.info, info'" @click="throwBusInfo" />
      <app-button
        modification="border-circle"
        color="success"
        :text="'border-circle, success'"
      />
      <app-button
        modification="border-rounded"
        color="error"
        :text="'border-rounded, error'"
      />
      <app-button color="warning" size="large" :text="'large, warning'" />
      <app-button color="info" size="small" :text="'small, info'" />
      <app-button scheme="flat" :text="'flat'" />
      <app-button
        scheme="flat"
        modification="border-circle"
        :text="'flat, border-circle'"
      />
      <app-button
        scheme="flat"
        :icon-left="$icons.switchHorizontal"
        :text="'flat'"
      />
      <app-button
        scheme="flat"
        size="large"
        :text="'flat, large'"
        :icon-right="$icons.phone"
      />
      <app-button scheme="flat" size="small" :text="'flat, small'" />
      <app-button scheme="flat" color="success" :text="'flat, success'" />
      <app-button scheme="flat" color="error" :text="'flat, error'" />
      <app-button scheme="flat" color="warning" :text="'flat, warning'" />
      <app-button scheme="flat" color="info" :text="'flat, info'" />
      <app-button
        scheme="flat"
        modification="border-circle"
        color="success"
        :text="'flat, border-circle, success'"
      />
      <app-button
        scheme="flat"
        modification="border-circle"
        color="error"
        :text="'flat, border-circle, error'"
      />
      <app-button
        scheme="flat"
        modification="border-circle"
        :icon-left="$icons.gift"
        :text="'flat'"
      />
      <app-button
        scheme="flat"
        modification="border-circle"
        color="warning"
        size="large"
        :text="'flat, border-circle, large, warning'"
      />
      <app-button
        scheme="flat"
        modification="border-circle"
        size="small"
        color="info"
        :text="'flat, border-circle, small, info'"
      />
      <app-button
        scheme="default"
        modification="default"
        size="default"
        color="default"
        :text="'default'"
      />
      <app-button :icon-right="$icons.switchHorizontal" />
      <app-button
        :icon-right="$icons.switchHorizontal"
        modification="border-circle"
      />
      <app-button :icon-right="$icons.switchHorizontal" size="large" />
      <app-button :icon-right="$icons.switchHorizontal" size="small" />
      <app-button :icon-right="$icons.switchHorizontal" color="success" />
      <app-button :icon-right="$icons.switchHorizontal" color="error" />
      <app-button :icon-right="$icons.switchHorizontal" color="warning" />
      <app-button :icon-right="$icons.switchHorizontal" color="info" />
      <app-button scheme="flat" :icon-right="$icons.switchHorizontal" />
      <app-button
        scheme="flat"
        :icon-right="$icons.switchHorizontal"
        modification="border-circle"
      />
      <app-button
        scheme="flat"
        :icon-right="$icons.switchHorizontal"
        size="large"
      />
      <app-button
        scheme="flat"
        :icon-right="$icons.switchHorizontal"
        size="small"
      />
      <app-button
        scheme="flat"
        :icon-right="$icons.switchHorizontal"
        color="success"
      />
      <app-button
        scheme="flat"
        :icon-right="$icons.switchHorizontal"
        color="error"
      />
      <app-button
        scheme="flat"
        :icon-right="$icons.switchHorizontal"
        color="warning"
      />
      <app-button
        scheme="flat"
        :icon-right="$icons.switchHorizontal"
        color="info"
      />
      <app-button
        scheme="default"
        :icon-right="$icons.switchHorizontal"
        color="default"
      />
      <app-button
        scheme="default"
        :icon-right="$icons.switchHorizontal"
        color="default"
        size="default"
      />
    </section>
    <section class="ui-kit-page__inputs">
      <input-field
        v-model="form.inputValue"
        :label="'label'"
        :placeholder="$t('ui-kit-page.some-placeholder')"
      />
      <input-field
        v-model="form.inputValue"
        :label="'label'"
        :placeholder="$t('ui-kit-page.some-placeholder')"
      >
        <template #nodeRight>
          <icon class="ui-kit-page__input-icon" :name="$icons.dotsVertical" />
        </template>
      </input-field>
      <input-field
        v-model="form.inputValue"
        :label="'label'"
        :placeholder="$t('ui-kit-page.some-placeholder')"
      >
        <template #nodeLeft>
          <icon class="ui-kit-page__input-icon" :name="$icons.dotsVertical" />
        </template>
      </input-field>
      <input-field
        v-model="form.inputValue"
        type="password"
        :label="'label'"
        :placeholder="$t('ui-kit-page.some-placeholder')"
      />
      <input-field
        v-model="form.inputValue"
        :label="$t('ui-kit-page.some-label')"
        :error-message="$t('ui-kit-page.some-error-message')"
        :placeholder="$t('ui-kit-page.some-placeholder')"
      >
        <template #nodeLeft>
          <icon class="ui-kit-page__input-icon" :name="$icons.dotsVertical" />
        </template>
        <template #nodeRight>
          <icon class="ui-kit-page__input-icon" :name="$icons.dotsVertical" />
        </template>
      </input-field>
      <input-field
        v-model="form.inputValue"
        :label="$t('ui-kit-page.some-label')"
        :placeholder="$t('ui-kit-page.some-placeholder')"
        disabled
      />
      <input-field
        v-model="form.inputValue"
        :label="$t('ui-kit-page.some-label')"
        :error-message="$t('ui-kit-page.some-error-message')"
        :placeholder="$t('ui-kit-page.some-placeholder')"
        disabled
      />
      <checkbox-field
        v-model="form.chbValue"
        :label="$t('ui-kit-page.some-label')"
      />
      <checkbox-field
        v-model="form.chbValue"
        :label="$t('ui-kit-page.some-label')"
        disabled
      />
    </section>
    <section class="ui-kit-page__form">
      <login-form />
    </section>
    <section class="ui-kit-page__common">
      <error-message :message="$t('ui-kit-page.loading-error-msg')" />
      <no-data-message :message="$t('ui-kit-page.no-data-msg')" />
      <loader />
      <collapse class="ui-kit-page__collapse">
        <template #head="{ collapse }">
          <app-button
            class="ui-kit-page__collapse-btn"
            scheme="flat"
            :text="$t('ui-kit-page.collapse-btn')"
            @click="collapse.toggle"
          >
          </app-button>
        </template>
        <div class="ui-kit-page__collapse-body">
          {{ $t('ui-kit-page.collapse-text') }}
        </div>
      </collapse>
      <app-button
        :text="$t('ui-kit-page.modal-btn')"
        @click="isModalShown = true"
      />
      <modal v-model:is-shown="isModalShown">
        <template #default="{ modal }">
          <app-button
            @click="modal.close"
            :icon-right="$icons.xCircle"
            scheme="default"
            modification="default"
            size="default"
            color="default"
          />
        </template>
      </modal>
      <div class="ui-kit-page__icons">
        <icon :name="$icons.academicCap" />
        <icon :name="$icons.adjustments" />
        <icon :name="$icons.annotation" />
        <icon :name="$icons.archive" />
        <icon :name="$icons.arrowCircleDown" />
        <icon :name="$icons.arrowCircleLeft" />
        <icon :name="$icons.arrowCircleRight" />
        <icon :name="$icons.arrowCircleUp" />
        <icon :name="$icons.arrowDown" />
        <icon :name="$icons.arrowLeft" />
        <icon :name="$icons.arrowNarrowDown" />
        <icon :name="$icons.arrowNarrowLeft" />
        <icon :name="$icons.arrowNarrowRight" />
        <icon :name="$icons.arrowNarrowUp" />
        <icon :name="$icons.arrowRight" />
        <icon :name="$icons.arrowSmDown" />
        <icon :name="$icons.arrowSmLeft" />
        <icon :name="$icons.arrowSmRight" />
        <icon :name="$icons.arrowSmUp" />
        <icon :name="$icons.arrowUp" />
        <icon :name="$icons.arrowsExpand" />
        <icon :name="$icons.atSymbol" />
        <icon :name="$icons.backspace" />
        <icon :name="$icons.badgeCheck" />
        <icon :name="$icons.ban" />
        <icon :name="$icons.beaker" />
        <icon :name="$icons.bell" />
        <icon :name="$icons.bookOpen" />
        <icon :name="$icons.bookmarkAlt" />
        <icon :name="$icons.bookmark" />
        <icon :name="$icons.briefcase" />
        <icon :name="$icons.cake" />
        <icon :name="$icons.calculator" />
        <icon :name="$icons.calendar" />
        <icon :name="$icons.camera" />
        <icon :name="$icons.cash" />
        <icon :name="$icons.chartBar" />
        <icon :name="$icons.chartPie" />
        <icon :name="$icons.chartSquareBar" />
        <icon :name="$icons.chatAlt2" />
        <icon :name="$icons.chatAlt" />
        <icon :name="$icons.chat" />
        <icon :name="$icons.checkCircle" />
        <icon :name="$icons.check" />
        <icon :name="$icons.chevronDoubleDown" />
        <icon :name="$icons.chevronDoubleLeft" />
        <icon :name="$icons.chevronDoubleRight" />
        <icon :name="$icons.chevronDoubleUp" />
        <icon :name="$icons.chevronDown" />
        <icon :name="$icons.chevronLeft" />
        <icon :name="$icons.chevronRight" />
        <icon :name="$icons.chevronUp" />
        <icon :name="$icons.chip" />
        <icon :name="$icons.clipboardCheck" />
        <icon :name="$icons.clipboardCopy" />
        <icon :name="$icons.clipboardList" />
        <icon :name="$icons.clipboard" />
        <icon :name="$icons.clock" />
        <icon :name="$icons.cloudDownload" />
        <icon :name="$icons.cloudUpload" />
        <icon :name="$icons.cloud" />
        <icon :name="$icons.code" />
        <icon :name="$icons.cog" />
        <icon :name="$icons.collection" />
        <icon :name="$icons.colorSwatch" />
        <icon :name="$icons.creditCard" />
        <icon :name="$icons.cubeTransparent" />
        <icon :name="$icons.cube" />
        <icon :name="$icons.currencyBangladeshi" />
        <icon :name="$icons.currencyDollar" />
        <icon :name="$icons.currencyEuro" />
        <icon :name="$icons.currencyPound" />
        <icon :name="$icons.currencyRupee" />
        <icon :name="$icons.currencyYen" />
        <icon :name="$icons.cursorClick" />
        <icon :name="$icons.database" />
        <icon :name="$icons.desktopComputer" />
        <icon :name="$icons.deviceMobile" />
        <icon :name="$icons.deviceTablet" />
        <icon :name="$icons.documentAdd" />
        <icon :name="$icons.documentDownload" />
        <icon :name="$icons.documentDuplicate" />
        <icon :name="$icons.documentRemove" />
        <icon :name="$icons.documentReport" />
        <icon :name="$icons.documentSearch" />
        <icon :name="$icons.documentText" />
        <icon :name="$icons.document" />
        <icon :name="$icons.dotsCircleHorizontal" />
        <icon :name="$icons.dotsHorizontal" />
        <icon :name="$icons.dotsVertical" />
        <icon :name="$icons.download" />
        <icon :name="$icons.duplicate" />
        <icon :name="$icons.emojiHappy" />
        <icon :name="$icons.emojiSad" />
        <icon :name="$icons.exclamationCircle" />
        <icon :name="$icons.exclamation" />
        <icon :name="$icons.externalLink" />
        <icon :name="$icons.eyeOff" />
        <icon :name="$icons.eye" />
        <icon :name="$icons.fastForward" />
        <icon :name="$icons.film" />
        <icon :name="$icons.filter" />
        <icon :name="$icons.fingerPrint" />
        <icon :name="$icons.fire" />
        <icon :name="$icons.flag" />
        <icon :name="$icons.folderAdd" />
        <icon :name="$icons.folderDownload" />
        <icon :name="$icons.folderOpen" />
        <icon :name="$icons.folderRemove" />
        <icon :name="$icons.folder" />
        <icon :name="$icons.gift" />
        <icon :name="$icons.globeAlt" />
        <icon :name="$icons.globe" />
        <icon :name="$icons.hand" />
        <icon :name="$icons.hashtag" />
        <icon :name="$icons.heart" />
        <icon :name="$icons.home" />
        <icon :name="$icons.identification" />
        <icon :name="$icons.inboxIn" />
        <icon :name="$icons.inbox" />
        <icon :name="$icons.informationCircle" />
        <icon :name="$icons.key" />
        <icon :name="$icons.library" />
        <icon :name="$icons.lightBulb" />
        <icon :name="$icons.lightningBolt" />
        <icon :name="$icons.link" />
        <icon :name="$icons.locationMarker" />
        <icon :name="$icons.lockClosed" />
        <icon :name="$icons.lockOpen" />
        <icon :name="$icons.login" />
        <icon :name="$icons.logout" />
        <icon :name="$icons.mailOpen" />
        <icon :name="$icons.mail" />
        <icon :name="$icons.map" />
        <icon :name="$icons.menuAlt1" />
        <icon :name="$icons.menuAlt2" />
        <icon :name="$icons.menuAlt3" />
        <icon :name="$icons.menuAlt4" />
        <icon :name="$icons.menu" />
        <icon :name="$icons.microphone" />
        <icon :name="$icons.minusCircle" />
        <icon :name="$icons.minusSm" />
        <icon :name="$icons.minus" />
        <icon :name="$icons.moon" />
        <icon :name="$icons.musicNote" />
        <icon :name="$icons.newspaper" />
        <icon :name="$icons.officeBuilding" />
        <icon :name="$icons.paperAirplane" />
        <icon :name="$icons.paperClip" />
        <icon :name="$icons.pause" />
        <icon :name="$icons.pencilAlt" />
        <icon :name="$icons.pencil" />
        <icon :name="$icons.phoneIncoming" />
        <icon :name="$icons.phoneMissedCall" />
        <icon :name="$icons.phoneOutgoing" />
        <icon :name="$icons.phone" />
        <icon :name="$icons.photograph" />
        <icon :name="$icons.play" />
        <icon :name="$icons.plusCircle" />
        <icon :name="$icons.plusSm" />
        <icon :name="$icons.plus" />
        <icon :name="$icons.presentationChartBar" />
        <icon :name="$icons.presentationChartLine" />
        <icon :name="$icons.printer" />
        <icon :name="$icons.puzzle" />
        <icon :name="$icons.qrcode" />
        <icon :name="$icons.questionMarkCircle" />
        <icon :name="$icons.receiptRefund" />
        <icon :name="$icons.receiptTax" />
        <icon :name="$icons.refresh" />
        <icon :name="$icons.reply" />
        <icon :name="$icons.rewind" />
        <icon :name="$icons.rss" />
        <icon :name="$icons.saveAs" />
        <icon :name="$icons.save" />
        <icon :name="$icons.scale" />
        <icon :name="$icons.scissors" />
        <icon :name="$icons.searchCircle" />
        <icon :name="$icons.search" />
        <icon :name="$icons.selector" />
        <icon :name="$icons.server" />
        <icon :name="$icons.share" />
        <icon :name="$icons.shieldCheck" />
        <icon :name="$icons.shieldExclamation" />
        <icon :name="$icons.shoppingBag" />
        <icon :name="$icons.shoppingCart" />
        <icon :name="$icons.sortAscending" />
        <icon :name="$icons.sortDescending" />
        <icon :name="$icons.sparkles" />
        <icon :name="$icons.speakerphone" />
        <icon :name="$icons.star" />
        <icon :name="$icons.statusOffline" />
        <icon :name="$icons.statusOnline" />
        <icon :name="$icons.stop" />
        <icon :name="$icons.sun" />
        <icon :name="$icons.support" />
        <icon :name="$icons.switchHorizontal" />
        <icon :name="$icons.switchVertical" />
        <icon :name="$icons.table" />
        <icon :name="$icons.tag" />
        <icon :name="$icons.template" />
        <icon :name="$icons.terminal" />
        <icon :name="$icons.thumbDown" />
        <icon :name="$icons.thumbUp" />
        <icon :name="$icons.ticket" />
        <icon :name="$icons.translate" />
        <icon :name="$icons.trash" />
        <icon :name="$icons.trendingDown" />
        <icon :name="$icons.trendingUp" />
        <icon :name="$icons.truck" />
        <icon :name="$icons.upload" />
        <icon :name="$icons.userAdd" />
        <icon :name="$icons.userCircle" />
        <icon :name="$icons.userGroup" />
        <icon :name="$icons.userRemove" />
        <icon :name="$icons.user" />
        <icon :name="$icons.users" />
        <icon :name="$icons.variable" />
        <icon :name="$icons.videoCamera" />
        <icon :name="$icons.viewBoards" />
        <icon :name="$icons.viewGridAdd" />
        <icon :name="$icons.viewGrid" />
        <icon :name="$icons.viewList" />
        <icon :name="$icons.volumeOff" />
        <icon :name="$icons.volumeUp" />
        <icon :name="$icons.wifi" />
        <icon :name="$icons.xCircle" />
        <icon :name="$icons.x" />
        <icon :name="$icons.zoomIn" />
        <icon :name="$icons.zoomOut" />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.ui-kit-page {
  display: grid;
  grid-gap: toRem(50);
  padding-bottom: toRem(200);
}

.ui-kit-page__buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: toRem(32);
}

.ui-kit-page__inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: toRem(32);
}

.ui-kit-page__common {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: toRem(56);
}

.ui-kit-page__collapse {
  width: 100%;
}

.ui-kit-page__collapse-btn {
  width: 100%;
}

.ui-kit-page__collapse-body {
  font-size: toRem(24);
}

.ui-kit-page__icons {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, toRem(24));
  grid-gap: toRem(24);

  & > * {
    width: toRem(24);
    height: toRem(24);
  }
}

.ui-kit-page__input-icon {
  max-width: toRem(24);
  max-height: toRem(24);
}
</style>
