# Photo Paste — 截图粘贴到 Claude Code

一键将剪贴板中的截图粘贴到 Claude Code 聊天框。无需手动保存文件。

## 为什么需要这个？

Claude Code 的 VSCode 扩展不支持直接粘贴图片到聊天框（显示 `[Unsupported Image]`）。这个插件把剪贴板图片转成文件路径，Claude Code 就能读取了。

## 支持平台

| 平台 | 剪贴板读取方式 |
|------|---------------|
| Windows  | PowerShell + .NET |
| macOS    | osascript         |
| Linux    | xclip             |

## 支持任意截图工具

微信截图 (`Alt+A`)、QQ 截图 (`Ctrl+Alt+A`)、Snipaste (`F1`)、Windows 截图 (`Win+Shift+S`)、Greenshot、ShareX 等——只要图片进了系统剪贴板就行。

## 安装

1. 从 [Releases](https://github.com/your/repo/releases) 下载 `photo-paste-1.0.0.vsix`
2. VSCode 中 `Ctrl+Shift+P` → `Extensions: Install from VSIX...`
3. 选择 `.vsix` 文件
4. `Ctrl+Shift+P` → `Developer: Reload Window` 重新加载

## 使用方法

```
截图 → Ctrl+Alt+V → 聊天框 Ctrl+V → 发送
```

1. 用任意工具截图
2. VSCode 中按 `Ctrl+Alt+V`（Mac: `Cmd+Alt+V`）
3. 截图被保存，文件路径已复制到剪贴板
4. 在 Claude Code 聊天框 `Ctrl+V` 粘贴路径
5. Claude Code 自动读取图片

## 配置

| 设置 | 默认值 | 说明 |
|------|-------|------|
| `photoPaste.savePath` | `.claude/screenshots` | 截图保存位置（相对于工作区根目录） |
| `photoPaste.maxAgeDays` | `7` | 自动清理 N 天前的截图，设为 `0` 永不删除 |

## 工作原理

```
剪贴板[图片] → 系统工具读取 → 保存为 .png → 路径写入剪贴板 → 粘贴到聊天框
```

核心代码分两层：

### 1. 剪贴板读取层 (`src/clipboard.ts`)

根据操作系统调用不同工具读取剪贴板图片：

- **Windows**: 写临时的 `.ps1` 脚本，通过 `powershell -STA` 调用 .NET 的 `System.Windows.Forms.Clipboard` 读取图片。
- **macOS**: 用 `osascript` 执行 AppleScript，读取剪贴板中的 PNG 数据。
- **Linux**: 用 `xclip` 读取 `image/png` 目标的剪贴板内容。

### 2. 命令层 (`src/extension.ts`)

注册 VSCode 命令 `photo-paste.paste`，绑定快捷键 `Ctrl+Alt+V`。执行流程：

1. 调用剪贴板读取，拿到图片 Buffer
2. 确定保存目录（优先工作区 `.claude/screenshots`，无工作区则系统临时目录）
3. 清理超过 `maxAgeDays` 的旧文件
4. 生成带时间戳的文件名写入磁盘
5. 将文件绝对路径写入系统剪贴板
6. 弹出通知提示用户粘贴到聊天框

### 3. 配置 (`package.json`)

提供 `photoPaste.savePath` 和 `photoPaste.maxAgeDays` 两个配置项，在 VSCode 设置中可搜到。

## 从源码构建

```bash
npm install
npm run compile
npx @vscode/vsce package --allow-missing-repository
```

## 主要依赖

- TypeScript
- `@types/vscode`（VSCode 扩展 API 类型）
- `@vscode/vsce`（打包工具）

## 许可

MIT
