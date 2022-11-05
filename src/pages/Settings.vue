<script lang="ts" setup>
import { NoDataMessage } from '@/common'
</script>

<template>
  <div class="settings">
    <no-data-message :message="$t('settings.no-data-message')" />
  </div>
</template>
