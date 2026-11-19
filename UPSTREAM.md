# 上游代码与许可证

本项目在构建时从公开的 Pake 仓库检出固定提交，并应用 `scripts/prepare-pake.mjs` 中记录的两个小补丁。

- 上游项目：[tw93/Pake](https://github.com/tw93/Pake)
- 固定提交：[`1382507e007bb4b2e808971aacbe843b9bd220aa`](https://github.com/tw93/Pake/commit/1382507e007bb4b2e808971aacbe843b9bd220aa)
- 上游许可证：GPL-3.0-or-later
- 广告过滤引擎：Brave `adblock-rust`，MPL-2.0
- 过滤列表来源与许可证：上游 `filters/README.md` 和 `filters/sources.json`

## 本项目补丁

1. 在 Pake CLI 的 Rust build features 中增加 `runtime-template`，以启用 Pake 自带的 `content-blocking` feature。
2. 在 CLI 生成的 `pake.json` 中设置 `content_blocking` 为 `ads`、`trackers`、`cookies`、`china` 四组。

上游 Pake 源码、许可证和过滤列表文件均由工作流从固定提交检出；没有复制或修改过滤规则本身。
