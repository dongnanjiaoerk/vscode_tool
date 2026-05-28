# Photo Paste - Screenshot to Claude Code

Paste screenshots from your clipboard directly into Claude Code chat as file paths. One keyboard shortcut, no manual file saving needed.

## Why?

Claude Code's VSCode extension doesn't support pasting images directly into chat (`[Unsupported Image]`). This extension converts your clipboard image into a file path that Claude Code can read.

## Supported Platforms

| Platform | Clipboard Backend |
|----------|-------------------|
| Windows  | PowerShell + .NET |
| macOS    | osascript         |
| Linux    | xclip             |

## Works With Any Screenshot Tool

WeChat (Alt+A), QQ (Ctrl+Alt+A), Snipaste (F1), Windows Snipping Tool (Win+Shift+S), Greenshot, ShareX — anything that puts an image on your system clipboard.

## Installation

**From VSCode Marketplace** (recommended):

Search **"Photo Paste"** in VSCode Extensions panel, or install from:

[https://marketplace.visualstudio.com/items?itemName=dhj.photo-paste](https://marketplace.visualstudio.com/items?itemName=dhj.photo-paste)

**From VSIX** (manual):

1. Download `photo-paste-1.0.0.vsix` from the [Releases](https://github.com/dongnanjiaoerk/vscode_tool/releases/latest) page
2. In VSCode: `Ctrl+Shift+P` → `Extensions: Install from VSIX...`
3. Select the `.vsix` file
4. `Ctrl+Shift+P` → `Developer: Reload Window`

## Usage

```
Take screenshot → Ctrl+Alt+V → Ctrl+V in chat → Send
```

1. Take a screenshot with any tool
2. In VSCode, press `Ctrl+Alt+V` (`Cmd+Alt+V` on macOS)
3. The screenshot is saved and its file path is copied to your clipboard
4. Press `Ctrl+V` in Claude Code chat to paste the path
5. Claude Code reads the image

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `photoPaste.savePath` | `.claude/screenshots` | Where screenshots are saved (relative to workspace root) |
| `photoPaste.maxAgeDays` | `7` | Auto-delete screenshots older than N days. Set to `0` to disable |

## How It Works

```
[Clipboard image] → Native clipboard tool → Save as .png → Copy path to clipboard → Paste into chat
```

1. Reads the clipboard image using OS-native tools
2. Saves as PNG to `.claude/screenshots/` (or configured path)
3. Copies the absolute file path to the clipboard
4. You paste the path into Claude Code chat
5. Claude Code's Read tool reads the image file

## Building from Source

```bash
npm install
npm run compile
npx @vscode/vsce package --allow-missing-repository
```

## License

MIT
