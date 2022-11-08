<script lang="ts" setup>
import { NoDataMessage } from '@/common'
</script>

<template>
  <div class="kyc-requests">
    <no-data-message :message="$t('kyc-requests.no-data-message')" />
  </div>
</template>
