import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import { readClipboardImage } from "./clipboard";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "photo-paste.paste",
    async () => {
      try {
        const result = readClipboardImage();

        if (result.error) {
          vscode.window.showErrorMessage(`Photo Paste: ${result.error}`);
          return;
        }

        if (!result.buffer) {
          const detail = result.debug || "No image detected in clipboard";
          vscode.window.showWarningMessage(
            `Photo Paste: ${detail}`
          );
          return;
        }

        const config = vscode.workspace.getConfiguration("photoPaste");
        const savePath = config.get<string>("savePath", ".claude/screenshots");
        const workspaceFolders = vscode.workspace.workspaceFolders;
        let saveDir: string;

        if (workspaceFolders && workspaceFolders.length > 0) {
          saveDir = path.join(workspaceFolders[0].uri.fsPath, savePath);
        } else {
          saveDir = path.join(os.tmpdir(), "photo-paste");
        }

        fs.mkdirSync(saveDir, { recursive: true });

        const maxAgeDays = config.get<number>("maxAgeDays", 7);
        if (maxAgeDays > 0) {
          cleanupOldFiles(saveDir, maxAgeDays);
        }

        const now = new Date();
        const dateStr = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
        const randSuffix = Math.random().toString(16).slice(2, 6);
        const fileName = `screenshot-${dateStr}-${randSuffix}.png`;
        const filePath = path.join(saveDir, fileName);

        fs.writeFileSync(filePath, result.buffer);

        await vscode.env.clipboard.writeText(filePath);

        vscode.window.showInformationMessage(
          `Saved: ${fileName}. Path copied. Paste (Ctrl+V) into chat.`,
          "Open File"
        ).then(action => {
          if (action === "Open File") {
            vscode.commands.executeCommand("vscode.open", vscode.Uri.file(filePath));
          }
        });
      } catch (error) {
        vscode.window.showErrorMessage(
          `Photo Paste error: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

function cleanupOldFiles(dir: string, maxAgeDays: number): void {
  try {
    const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      try {
        const stat = fs.statSync(filePath);
        if (stat.mtimeMs < cutoff) {
          fs.unlinkSync(filePath);
        }
      } catch { /* skip */ }
    }
  } catch { /* skip */ }
}

export function deactivate() {}
