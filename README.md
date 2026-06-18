# uniapp-styleless-components

## Usage

推荐使用 uniapp 的 easycom 方式使用组件，如果需要 vue 组件参数提示，推荐使用 `uniapp-easycom-types`

在 `pages.json` 中配置

```json
{
  "easycom": {
    "custom": {
      "^my-(.*)": "uniapp-styleless-components/components/$1/$1.vue"
    }
  }
}
```

在 `main.ts` 中引入配置插件

```typescript
import { createConfigProvider } from "uniapp-styleless-components";
import appPagesConfig from "@/pages.json";

export function createApp() {
  const app = createSSRApp(App);

  app.use(createConfigProvider(), {
    // 页面容器配置
    pageContainer: {
      // 页面配置信息
      appPagesConfig: appPagesConfig,
      // 页面初始化执行
      init: async () => {},
    }
  });
}
```


