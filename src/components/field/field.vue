<template>
  <text-input
    v-if="type === 'text'"
    v-model="modelValue"
    v-bind="mergedProps"
  ></text-input>

  <textarea-input
    v-else-if="type === 'textarea'"
    v-model="modelValue"
    v-bind="mergedProps"
  ></textarea-input>

  <password-input
    v-else-if="type === 'password'"
    v-model="modelValue"
    v-bind="mergedProps"
  ></password-input>

  <number-input
    v-else-if="type === 'number'"
    v-model="modelValue"
    v-bind="mergedProps"
  ></number-input>

  <date-picker
    v-else-if="type === 'date'"
    v-model="modelValue"
    v-bind="mergedProps"
  ></date-picker>

  <option-picker
    v-else-if="type === 'option'"
    v-model="modelValue"
    v-bind="mergedProps"
  ></option-picker>

  <logic-input
    v-else-if="type === 'logic'"
    v-model="modelValue"
    v-bind="mergedProps"
  ></logic-input>

  <reference-picker
    v-else-if="type === 'reference'"
    v-model="modelValue"
    v-bind="mergedProps"
  ></reference-picker>

  <empty-content
    v-else
    v-model="modelValue"
    v-bind="mergedProps"
  ></empty-content>
</template>

<script setup lang="ts" generic="Type extends FieldType">
import {
  type ComponentObjectPropsOptions,
  computed,
  type PropType,
  useAttrs,
} from "vue";
import { baseProps } from "./base";
import { type FieldItem, FieldType } from "./common";
import datePicker from "./date-picker/date-picker.vue";
import emptyContent from "./empty-content/empty-content.vue";
import logicInput from "./logic-input/logic-input.vue";
import numberInput from "./number-input/number-input.vue";
import optionPicker from "./option-picker/option-picker.vue";
import passwordInput from "./password-input/password-input.vue";
import referencePicker from "./reference-picker/reference-picker.vue";
import textInput from "./text-input/text-input.vue";
import textareaInput from "./textarea-input/textarea-input.vue";

const fieldPropsOptions = {
  ...baseProps,
  /**
   * 字段类型
   */
  type: {
    type: String as unknown as PropType<Type>,
    required: true,
  },
  /**
   * 字段透传属性，会覆盖 FieldCommonProps 中的字段值
   */
  fieldProps: {
    type: Object as PropType<FieldItem[Type]>,
    default: () => ({}),
  },
  /**
   * 值改变时回调
   */
  onChange: {
    type: Function as PropType<(value: any) => void>,
  },
} satisfies ComponentObjectPropsOptions;

const props = defineProps(fieldPropsOptions);

const modelValue = defineModel<any>();

defineOptions({
  inheritAttrs: false,
  options: {
    styleIsolation: "apply-shared",
    virtualHost: true,
  },
});

const attrs = useAttrs();

const mergedProps = computed<any>(() => {
  return Object.assign(
    {},
    {
      disabled: props.disabled,
      readonly: props.readonly,
      emptyValue: props.emptyValue,
      placeholder: props.placeholder,
      onChange: props.onChange,
      fieldData: props.fieldData,
    },
    attrs,
    props.fieldProps,
  );
});
</script>

<style>
.field {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.5rem;
}

.field-disabled {
  opacity: 0.7;
}

.field-content {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.field-content-empty {
  color: rgba(0, 0, 0, 0.5);
}

.field-clear-icon {
  --un-icon: url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 24 24' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M18 6L6 18M6 6l12 12'/%3E%3C/svg%3E");
  mask: var(--un-icon) no-repeat;
  mask-size: 100% 100%;
  background-color: currentColor;
  color: gray;
  width: 1em;
  height: 1em;
}
</style>
