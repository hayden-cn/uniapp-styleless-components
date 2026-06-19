import { computed } from "vue";
import { useBadge, useConfig } from "../plugins/config-provider";

interface PageInstance {
  $page: {
    fullPath: string;
  };
}

interface Page {
  path: string;
  needLogin?: boolean;
  style?: {
    navigationBarBackgroundColor?: string;
    navigationBarTextStyle?: string;
    navigationBarTitleText?: string;
    navigationStyle?: "default" | "custom";
    backgroundTextStyle?: "dark" | "light";
    enablePullDownRefresh?: boolean;
    onReachBottomDistance?: number;
  };
}

interface PageRoute extends Page {
  isTabBar: boolean;
  isHomePage: boolean;
  isLoginPage: boolean;
  fullPath: string;
  route: string;
}

export const usePageContainer = () => {
  const windowInfo = computed(() => {
    return uni.getWindowInfo();
  });

  const statusBarHeight = computed(() => {
    const statusBarHeight = windowInfo.value.statusBarHeight;
    return statusBarHeight ?? 0;
  });

  const navigationBarHeight = computed(() => {
    return 44;
  });

  const navigationHeight = computed(() => {
    return statusBarHeight.value + navigationBarHeight.value;
  });

  const safeBottomHeight = computed(() => {
    const safeArea = windowInfo.value.safeAreaInsets;
    return safeArea?.bottom ?? 0;
  });

  const { pageContainer } = useConfig();
  const badge = useBadge();

  /**
   * 获取当前路由
   */
  const currentRoute = computed(() => {
    const currentPages = getCurrentPages<PageInstance>();
    const currentPage = currentPages[currentPages.length - 1];
    const fullPath = currentPage.$page?.fullPath ?? `/${currentPage.route}`;

    const appPagesConfig = pageContainer.appPagesConfig;

    const pages: Page[] = appPagesConfig.pages || [];
    const needLoginPaths = appPagesConfig.uniIdRouter?.needLogin ?? [];
    const globalStyle = appPagesConfig.globalStyle ?? {};

    const homePagePath = pages?.[0]?.path;
    const loginPageRoute = appPagesConfig.uniIdRouter?.loginPage ?? "";

    const tabbarItems: any[] = appPagesConfig.tabBar?.list ?? [];
    const tabBarRoutes: string[] = tabbarItems.map((item) => item.pagePath);

    const path = fullPath.split("?")[0];
    const route =
      path.replace(/^\//, "") ||
      // 路由地址可能为空，这种情况通常在 web 端出现
      // 为空时表示当前为首页
      homePagePath;

    const page = pages.find((item) => item.path === route);
    if (!page) {
      throw new Error(`无法获取页面${fullPath}匹配的路由配置`);
    }

    const needLogin = page?.needLogin ?? needLoginPaths.includes(route);

    const routePage: PageRoute = {
      path: path,
      route: route,
      fullPath: fullPath,
      needLogin: needLogin ?? false,
      style: Object.assign({}, globalStyle, page?.style),
      isTabBar: tabBarRoutes.includes(route),
      isHomePage: route === homePagePath,
      isLoginPage: route === loginPageRoute,
    };
    return routePage;
  });

  const tabBar = computed(() => {
    const appPagesConfig = pageContainer.appPagesConfig;
    const tabbarList: any[] = appPagesConfig.tabBar.list;
    const list = tabbarList.map((item, index) => {
      return Object.assign({}, item, { badge: badge.value[index] });
    });
    return Object.assign({}, appPagesConfig.tabBar, { list });
  });

  const init = async () => {
    return pageContainer.init?.();
  };

  return {
    statusBarHeight,
    navigationBarHeight,
    navigationHeight,
    safeBottomHeight,
    currentRoute,
    tabBar,
    init,
  };
};
