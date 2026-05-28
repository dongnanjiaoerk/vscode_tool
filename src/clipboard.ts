import { execSync } from "child_process";
import * as os from "os";
import * as path from "path";
import * as fs from "fs";

export interface ClipboardResult {
  buffer: Buffer | null;
  error?: string;
  debug?: string;
}

export function readClipboardImage(): ClipboardResult {
  const platform = os.platform();
  const tempFile = path.join(
    os.tmpdir(),
    `photo-paste-${Date.now()}.png`
  );

  try {
    if (platform === "win32") {
      return readWindows(tempFile);
    } else if (platform === "darwin") {
      return readMacos(tempFile);
    } else if (platform === "linux") {
      return readLinux(tempFile);
    } else {
      return { buffer: null, error: `Unsupported platform: ${platform}` };
    }
  } finally {
    try { fs.unlinkSync(tempFile); } catch { /* ignore */ }
  }
}

function readWindows(tempFile: string): ClipboardResult {
  const escapedPath = tempFile.replace(/\\/g, "\\\\");
  const ps1Content = `
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
if ([System.Windows.Forms.Clipboard]::ContainsImage()) {
    $img = [System.Windows.Forms.Clipboard]::GetImage()
    $img.Save('${escapedPath}', [System.Drawing.Imaging.ImageFormat]::Png)
    $img.Dispose()
    Write-Output 'OK'
} else {
    $formats = [System.Windows.Forms.Clipboard]::GetDataObject().GetFormats() -join ', '
    Write-Output "NO_IMAGE:$formats"
}
`;
  const ps1File = tempFile.replace(/\.png$/, ".ps1");
  fs.writeFileSync(ps1File, ps1Content, "utf-8");

  try {
    const output = execSync(
      `powershell -STA -NoProfile -ExecutionPolicy Bypass -File "${ps1File}"`,
      { encoding: "utf-8", timeout: 15000 }
    ).trim();

    if (output.startsWith("NO_IMAGE")) {
      return { buffer: null, debug: `Clipboard formats: ${output.replace("NO_IMAGE:", "")}` };
    }
    if (output.includes("OK") && fs.existsSync(tempFile) && fs.statSync(tempFile).size > 0) {
      return { buffer: fs.readFileSync(tempFile) };
    }
    return { buffer: null, debug: `Unexpected output: ${output}` };
  } catch (e: any) {
    return { buffer: null, error: e?.message || String(e) };
  } finally {
    try { fs.unlinkSync(ps1File); } catch { /* ignore */ }
  }
}

function readMacos(tempFile: string): ClipboardResult {
  try {
    execSync(
      `osascript -e 'set pngData to the clipboard as "PNGf"' -e 'set fileRef to open for access POSIX file "${tempFile}" with write permission' -e 'write pngData to fileRef' -e 'close access fileRef'`,
      { timeout: 10000 }
    );
    if (fs.existsSync(tempFile) && fs.statSync(tempFile).size > 0) {
      return { buffer: fs.readFileSync(tempFile) };
    }
    return { buffer: null };
  } catch (e: any) {
    return { buffer: null, error: e?.message || String(e) };
  }
}

function readLinux(tempFile: string): ClipboardResult {
  try {
    execSync(`xclip -selection clipboard -t image/png -o > "${tempFile}"`, {
      shell: "/bin/bash",
      timeout: 10000,
    });
    if (fs.existsSync(tempFile) && fs.statSync(tempFile).size > 0) {
      return { buffer: fs.readFileSync(tempFile) };
    }
    return { buffer: null };
  } catch (e: any) {
    return { buffer: null, error: e?.message || String(e) };
  }
}
