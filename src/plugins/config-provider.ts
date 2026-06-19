import { defaultsDeep } from "lodash-es";
import {
  type App,
  type InjectionKey,
  inject,
  provide,
  type Ref,
  ref,
} from "vue";

export type ConfigProviderOptions = {
  /**
   * 页面容器
   */
  pageContainer?: {
    /**
     * 页面配置项，pages.json 内容
     */
    appPagesConfig: Record<string, any>;
    /**
     * 页面初始化时执行
     */
    init?: () => Promise<void>;
  };
  /**
   * 列表容器
   */
  listContainer?: {};
};

const configKey = Symbol("ConfigProvider") as InjectionKey<
  Required<ConfigProviderOptions>
>;
type TabBarBadge = Record<number, boolean | string>;
const badgeKey = Symbol("Badge") as InjectionKey<Ref<TabBarBadge>>;

class ConfigProvider {
  private static Initialized = false;

  install(app: App, options: ConfigProviderOptions = {}) {
    const badge = ref<TabBarBadge>({});

    if (!ConfigProvider.Initialized) {
      ConfigProvider.Initialized = true;
      uni.addInterceptor("setTabBarBadge", {
        invoke(options) {
          badge.value[options.index] = options.text;
        },
      });
      uni.addInterceptor("removeTabBarBadge", {
        invoke(options) {
          delete badge.value[options.index];
        },
      });
      uni.addInterceptor("showTabBarRedDot", {
        invoke(options) {
          badge.value[options.index] = true;
        },
      });
      uni.addInterceptor("hideTabBarRedDot", {
        invoke(options) {
          delete badge.value[options.index];
        },
      });
    }
    app.provide(badgeKey, badge);

    const defaultOptions: ConfigProviderOptions = {
      pageContainer: {
        appPagesConfig: {},
      },
    };
    app.provide(configKey, defaultsDeep({}, options, defaultOptions));
  }
}

export function createConfigProvider() {
  return new ConfigProvider();
}

export function useConfig(
  cover: ConfigProviderOptions = {},
): Required<ConfigProviderOptions> {
  const injectConfig = inject(configKey);
  const mergedConfig = defaultsDeep({}, cover, injectConfig);
  provide(configKey, mergedConfig);
  return mergedConfig;
}

export function useBadge() {
  const badge = inject(badgeKey, ref<TabBarBadge>({}));
  return badge;
}
