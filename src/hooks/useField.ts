import { computed, type Ref } from "vue";
import type { ClassNameValue } from "../../type";

interface UseFieldOptions {
  disabled?: boolean;
  readonly?: boolean;
  allowClear?: boolean;
  emptyValue?: string;
}

interface UseFieldReturn {
  wrapperClassNames: ReturnType<typeof computed>;
  showClearBtn: ReturnType<typeof computed>;
  allowClearClassNames: ReturnType<typeof computed>;
  handleClear: (modelValue: Ref<any>, onChange?: (value: any) => void) => void;
}

export const useField = (props: UseFieldOptions): UseFieldReturn => {
  const wrapperClassNames = computed(() => {
    const classNames: ClassNameValue = ["field"];
    if (props.disabled) {
      classNames.push("field-disabled");
    }
    return classNames;
  });

  const showClearBtn = computed(() => {
    return !props.readonly && props.allowClear;
  });

  const allowClearClassNames = computed(() => {
    const classNames: ClassNameValue = ["field-clear-icon"];
    return classNames;
  });

  const handleClear = (
    modelValue: Ref<any>,
    onChange?: (value: any) => void,
  ) => {
    if (props.disabled) {
      return;
    }
    modelValue.value = undefined;
    onChange?.(undefined);
  };

  return {
    wrapperClassNames,
    showClearBtn,
    allowClearClassNames,
    handleClear,
  };
};
