import { computed, type Ref } from "vue";

interface UseFieldOptions {
  disabled?: boolean;
  readonly?: boolean;
  allowClear?: boolean;
  emptyValue?: string;
}

/**
 *
 */
export const useField = (props: UseFieldOptions) => {
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
