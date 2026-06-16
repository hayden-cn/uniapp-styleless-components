import type { ComponentObjectPropsOptions } from "vue";
import { baseProps } from "../base";
import { inputEventProps } from "../input-event-props";

export const textInputProps = {
  ...baseProps,
  ...inputEventProps,
} satisfies ComponentObjectPropsOptions;
