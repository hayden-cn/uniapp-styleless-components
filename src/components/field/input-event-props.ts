import type { ComponentObjectPropsOptions, PropType } from "vue";

export const inputEventProps = {
  onInput: {
    type: Function as PropType<(event: PointerEvent) => void>,
  },
  onFocus: {
    type: Function as PropType<(event: PointerEvent) => void>,
  },
  onBlur: {
    type: Function as PropType<(event: PointerEvent) => void>,
  },
} satisfies ComponentObjectPropsOptions;
