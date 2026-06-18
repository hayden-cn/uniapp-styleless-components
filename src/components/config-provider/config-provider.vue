<template>
  <slot></slot>
</template>

<script setup lang="ts">
import {
  type ConfigProviderOptions,
  useConfig,
} from "@/plugins/config-provider";

interface ConfigProviderProps {
  config: ConfigProviderOptions;
}
const props = defineProps<ConfigProviderProps>();

defineOptions({
  options: {
    styleIsolation: "apply-shared",
    virtualHost: true,
  },
});

useConfig(props.config);
</script>
