# 依赖与运行时

此扩展没有任何第三方运行时依赖，不分发 node_modules，不加载远程代码。

| 项目 | 版本 | 说明 |
| --- | --- | --- |
| Firefox | 140+ | `strict_min_version`，因 `data_collection_permissions` 字段 |
| Manifest | V3 | Chrome / Edge / Firefox 通用格式 |

## 图片处理依赖（不在本仓库）

转换逻辑运行在网站端，扩展不打包任何处理库。网站使用：

| 库 | 用途 | 许可 |
| --- | --- | --- |
| libheif-js (WASM) | HEIC/HEIF 解码 | LGPL-3.0 |
| gifenc | GIF 编码（纯 JS） | MIT |

网站源码含混淆产物，不在此仓库分发。
