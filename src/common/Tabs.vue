<template>
  <div class="tabs">
    <button
      v-for="(item, idx) in tabs"
      :key="idx"
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
  position: relative;
  font-size: toRem(24);
  font-weight: 400;
  color: var(--text-secondary-main);
  transition: color 0.2s linear;

  &--active {
    color: var(--text-primary-main);
    font-weight: 500;

    &:after {
      content: '';
      position: absolute;
      left: toRem(-3);
      bottom: toRem(-3);
      width: 100%;
      height: toRem(2);
      background: var(--primary-main);
      transition: all 0.2s ease;
    }
  }

  @include respond-to(small) {
    font-size: toRem(20);
  }
}
</style>
