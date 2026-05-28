# Photo Paste — 截图一键粘贴到 Claude Code

**功能**：截图后自动保存为文件，路径复制到剪贴板，在聊天框粘贴即可让 Claude Code 读取图片。

**解决的问题**：Claude Code 的 VSCode 扩展不支持直接粘贴图片（显示 `[Unsupported Image]`），本插件实现 `截图 → 文件路径 → 聊天框` 的无缝转换。

## 操作步骤

```
截图 → Ctrl+Alt+V → 聊天框 Ctrl+V → 发送
```

| 步骤 | 操作 |
|------|------|
| 1 | 用任意工具截图（微信/QQ/Snipaste/Win+Shift+S 均可） |
| 2 | 在 VSCode 中按 `Ctrl+Alt+V`（Mac: `Cmd+Alt+V`） |
| 3 | 弹出"已保存"提示，文件路径已复制到剪贴板 |
| 4 | 在 Claude Code 聊天框 `Ctrl+V` 粘贴路径 |
| 5 | 发送消息，Claude Code 自动读取截图 |

## 特性

- **一个快捷键搞定** — `Ctrl+Alt+V`（Windows/Linux）或 `Cmd+Alt+V`（macOS）
- **支持所有截图工具** — 微信、QQ、Snipaste、系统截图、Greenshot、ShareX 等
- **跨平台** — Windows（PowerShell）、macOS（osascript）、Linux（xclip）
- **自动清理** — 默认 7 天后自动删除旧截图，可在设置中调整
- **零额外依赖** — 仅使用操作系统自带的剪贴板工具

## 安装

**VSCode 插件市场**（推荐）：  
在 VSCode 扩展面板搜索 "Photo Paste" 安装，或点击 [dhj.photo-paste-cc](https://marketplace.visualstudio.com/items?itemName=dhj.photo-paste-cc)

**手动安装**：  
从 [GitHub Releases](https://github.com/dongnanjiaoerk/vscode_tool/releases/latest) 下载 `.vsix`，然后 `Ctrl+Shift+P` → `Extensions: Install from VSIX...`

**GitHub 仓库**：[github.com/dongnanjiaoerk/vscode_tool](https://github.com/dongnanjiaoerk/vscode_tool)

## 配置

| 设置 | 默认值 | 说明 |
|------|--------|------|
| `photoPaste.savePath` | `.claude/screenshots` | 截图保存位置（相对于工作区根目录） |
| `photoPaste.maxAgeDays` | `7` | 自动清理 N 天前的截图，设为 `0` 不删除 |

## 支持的平台

| 平台 | 剪贴板读取方式 |
|------|---------------|
| Windows | PowerShell + .NET (`System.Windows.Forms.Clipboard`) |
| macOS | `osascript`（AppleScript PNGf） |
| Linux | `xclip`（`image/png` 目标） |

## 从源码构建

```bash
npm install
npm run compile
npx @vscode/vsce package --allow-missing-repository
```

## 许可

MIT
