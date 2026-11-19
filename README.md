# SupJav Pake AdBlock（Windows x64）

这是一个用于构建 **SupJav Windows 桌面程序** 的 GitHub Actions 项目。它使用上游 [Pake](https://github.com/tw93/Pake) 打包 `https://supjav.com/zh/`，并启用 Pake 内置的 Brave `adblock-rust` 过滤引擎。

## 功能

- Windows x64 原生 WebView2 桌面窗口。
- 默认使用持久化浏览器配置目录，网站 Cookie 和登录状态可以保留。
- 内置广告、跟踪器、Cookie 提示和中文站点过滤规则：EasyList、EasyPrivacy、AdGuard Cookie Notices、EasyList China，以及 uBlock Unbreak 例外规则。
- 每次推送到 `main`，或在 Actions 中手动运行，自动生成 `SupJav.exe`（便携版）和 `SupJav.msi`（安装包）。

## 将项目上传到 GitHub

当前 ChatGPT 的 GitHub 写入接口仍返回 `403 Resource not accessible by integration`，所以我先把完整的构建配置打包给你；没有声称已经把文件提交到仓库。

1. 解压这个 ZIP 文件。
2. 确认电脑已安装 Git for Windows，并且 GitHub 凭据已登录。
3. 在解压目录中右键打开 PowerShell，运行：

   ```powershell
   .\push-to-github.ps1
   ```

   脚本会克隆 `AsahiShan/SupJav-Pake-AdBlock`，把项目文件复制进去并推送到 `main`。如果 Git 尚未设置提交者姓名或邮箱，脚本会提示输入。

也可以使用 GitHub Desktop：克隆仓库，将解压后的所有文件（包括 `.github` 文件夹）复制到仓库根目录，提交并 Push。

## 获取 EXE / MSI

上传成功后：

1. 打开仓库的 **Actions**。
2. 选择 **Build SupJav Windows x64**。
3. 等待工作流完成（首次构建需要下载 Rust / Pake 依赖，时间会较长）。
4. 在成功的运行页面底部下载 **SupJav-Windows-x64** Artifact。

## 应用设置

- 应用名称：SupJav
- 首页：`https://supjav.com/zh/`
- 窗口：1280 × 820
- 架构：Windows x64
- 安装包语言：简体中文
- 隐私模式：关闭（保留网站 Cookie / 登录会话）
- 广告过滤：ads、trackers、cookies、china

## 注意

- 需要 Microsoft Edge WebView2 Runtime。大多数 Windows 10/11 设备已安装；若启动时提示缺少 WebView2，请安装 Microsoft Evergreen WebView2 Runtime。
- 过滤规则不能保证拦截所有广告；网站自有广告、动态广告和新出现的广告域名可能仍会显示。
- Pake 上游及过滤规则的许可证信息见 [`UPSTREAM.md`](UPSTREAM.md)。
