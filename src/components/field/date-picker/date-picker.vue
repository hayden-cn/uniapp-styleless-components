<template>
  <view :class="wrapperClassNames">
    <view v-if="icon" :class="[icon]"></view>
    <view v-if="readonly" :class="contentClassNames">
      {{ modelValue || emptyValue }}
    </view>
    <picker
      v-else
      mode="date"
      class="field-picker"
      :value="modelValue"
      @change="handleChange"
      :disabled="disabled"
      :start="start"
      :end="end"
      :fields="fields"
    >
      <view :class="contentClassNames">
        {{ content }}
      </view>
    </picker>
    <view
      v-if="showClearBtn"
      v-show="modelValue"
      :class="allowClearClassNames"
      @click="onClear"
    ></view>
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useField } from "../../../hooks/useField";
import { datePickerProps } from "./date-picker";

const props = defineProps(datePickerProps);

const modelValue = defineModel<string>();

defineOptions({
  inheritAttrs: false,
  options: {
    styleIsolation: "apply-shared",
    virtualHost: true,
  },
});

const { wrapperClassNames, showClearBtn, allowClearClassNames, handleClear } =
  useField(props);

const contentClassNames = computed(() => {
  const classNames: ClassNameValue = ["field-content field-content-full"];

  if (!modelValue.value) {
    classNames.push("field-content-empty");
  }

  if (props.disabled) {
    classNames.push("field-disabled");
  }

  return classNames;
});

const content = computed(() => {
  if (modelValue.value) {
    return modelValue.value;
  }
  return props.placeholder;
});

const handleChange = (e: any) => {
  const value = e.detail.value;
  modelValue.value = value;
  props.onChange?.(value);
};

const onClear = () => {
  handleClear(modelValue, props.onChange);
};
</script>

<style>
.field-content-full {
  width: 100%;
}

.field-picker {
  width: 100%;
}
</style>
