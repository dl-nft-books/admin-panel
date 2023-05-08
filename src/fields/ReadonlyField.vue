<template>
  <div class="readonly-field">
    <p v-if="label" class="readonly-field__label">
      {{ label }}
    </p>
    <div class="readonly-field__value-wrap">
      <p class="readonly-field__value">
        {{ value }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    value?: string
    label?: string
  }>(),
  {
    value: '',
    label: '',
  },
)
</script>

<style lang="scss" scoped>
.readonly-field {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  flex: 1;

  &--disabled,
  &--readonly {
    opacity: 0.5;
  }
}

.readonly-field__label {
  @include text-ellipsis;

  @include field-label;
}

.readonly-field__value-wrap {
  display: flex;
  flex-direction: column;
  position: relative;
}

.readonly-field__value {
  padding: var(--field-padding);
  transition-property: box-shadow;
  border-bottom: toRem(1) solid var(--field-border);

  @include text-ellipsis;

  @include field-text;
}
</style>
