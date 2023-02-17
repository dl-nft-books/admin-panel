<template>
  <div class="tabs">
    <button
      v-for="(item, id) in tabs"
      :key="id"
      class="tabs__button"
      type="button"
      :class="{ 'tabs__button--active': modelValue === item.id }"
      @click="changeTab(item.id)"
    >
      {{ item.translation }}
    </button>
  </div>
</template>

<script lang="ts" setup>
type TabsType = {
  translation: string
  id: string
}

defineProps<{
  modelValue: string
  tabs: TabsType[]
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const changeTab = (tab: string) => {
  emit('update:modelValue', tab)
}
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  align-items: center;
  gap: toRem(30);
  padding-bottom: toRem(2);
  border-bottom: toRem(1) solid var(--border-secondary-main);
}

.tabs__button {
  padding-right: toRem(10);

  @include tab-button;
}
</style>
