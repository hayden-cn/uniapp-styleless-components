# uniapp-styleless-components

## Usage

推荐使用 uniapp 的 easycom 方式使用组件，如果需要 vue 组件参数提示，推荐使用 `uniapp-easycom-types`

在 `pages.json` 中配置

```json
{
  "easycom": {
    "custom": {
      "^my-(.*)": "uniapp-styleless-components/src/components/$1/$1.vue"
    }
  }
}
```

在 `main.ts` 中引入配置插件

```typescript
import { createConfigProvider } from "uniapp-styleless-components";

export function createApp() {
  const app = createSSRApp(App);

  app.use(createConfigProvider(), {
    listContainerHook: {
      resolvePagination: (pagination) => {
        return {
          current: pagination.page,
          size: pagination.size,
          total: pagination.total,
        }
      },
      resolveResponse: (response) => {
        return {
          records: response.records,
          pagination: {
            current: response.current,
            size: response.size,
            total: response.total,
          },
        }
      },
    },
  });
}
```


