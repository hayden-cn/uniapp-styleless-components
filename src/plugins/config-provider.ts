import { type App, type InjectionKey, inject, provide } from "vue";
import { defaultsDeep } from "../utils";

declare global {
  interface GlobalConfig {
    locale: {
      noData: string;
      loading: string;
      unknownError: string;
      notice: string;
      warning: string;
    };
  }
}

type PartialConfig = DeepOptional<GlobalConfig>;

const configKey = Symbol("ConfigProvider") as InjectionKey<PartialConfig>;

export type ConfigProviderOptions = PartialConfig;

class ConfigProvider {
  install(app: App, options: ConfigProviderOptions = {}) {
    app.provide(configKey, options);
  }
}

export function createConfigProvider() {
  return new ConfigProvider();
}

type ConfigField = keyof GlobalConfig;

// biome-ignore format: keep
type WithDefaults<T, Defaults extends DeepOptional<T>> = T extends (...args: any[]) => any
  ? T
  : Prettify<
      {
        readonly [K in keyof T as K extends keyof Defaults ? K : never]-?: [T[K], Defaults[K]] extends [infer U, infer D]
          ? D extends DeepOptional<U>
            ? WithDefaults<U, D>
            : U
          : never
      } & {
        readonly [K in keyof T as K extends keyof Defaults ? never : K]: T[K]
      }
    >

// biome-ignore format: keep
export function useConfig(): PartialConfig;
// biome-ignore format: keep
export function useConfig<DefaultConfig extends DeepOptional<PartialConfig>>(config: DefaultConfig): WithDefaults<PartialConfig, DefaultConfig>
// biome-ignore format: keep
export function useConfig<Key extends ConfigField>(key: Key): DeepOptional<GlobalConfig[Key]> | undefined
// biome-ignore format: keep
export function useConfig<Key extends ConfigField, DefaultConfig extends DeepOptional<GlobalConfig[Key]>>(key: Key, defaultValue: DefaultConfig): WithDefaults<GlobalConfig[Key], DefaultConfig>
// biome-ignore format: keep
export function useConfig<Key extends ConfigField>(keyOrConfig?: ConfigField | PartialConfig, defaultValue?: GlobalConfig[Key]) {
  const config = inject(configKey, {});

  let defaultConfig: PartialConfig = {};
  let customConfig: PartialConfig = {};

  if (typeof keyOrConfig === "string") {
    defaultConfig = { [keyOrConfig]: defaultValue };
  } else {
    customConfig = keyOrConfig || {};
  }

  const mergedConfig = defaultsDeep({}, customConfig, config);
  const returnConfig = defaultsDeep({}, mergedConfig, defaultConfig);

  provide(configKey, mergedConfig);

  return typeof keyOrConfig === "string"
    ? returnConfig[keyOrConfig]
    : returnConfig;
}
