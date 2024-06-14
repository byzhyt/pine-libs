import zhCn from "element-plus/es/locale/lang/zh-cn";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

export const globalJson = {
  pagins: {
    current: "page",
    size: "limit",
    total: "total",
    request: "page"
  },
  configTheme: {
    size: "large",
    adviceLink: "",
    advicelabel: "意见反馈",
    corp: "Copyright © 2023.成都堃升科技有限公司",
    locale: zhCn,
    message: {
      max: 1
    }
  }
};

export const createGlobalJson = (app: any) => {
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }

  for (const [key, values] of Object.entries(globalJson)) {
    app.provide(key, values);
  }

  return app;
};
