簡短答覆：`gci -Force` 是 PowerShell 的指令，`gci` 是 `Get-ChildItem` 的縮寫（alias），`-Force` 則是告訴它**也列出隱藏與系統檔／資料夾**。

下面把重點、行為、常用組合與範例一次列清楚（繁體中文）。

---

## 1. 基本說明

* `gci` = `Get-ChildItem`（列出目錄內容，等同 `dir` 在 PowerShell 的別名）。
* `-Force`：強制顯示平常被隱藏或帶有 System 屬性的檔案/資料夾（例如 `desktop.ini`、隱藏資料夾等）。

範例：

```powershell
gci -Force
# 等同
Get-ChildItem -Force
```

---

## 2. 常見參數與行為

* `-Path <path>`：指定路徑（預設是目前工作目錄）。
* `-Recurse`：遞迴子目錄。
* `-Filter <pattern>`：在檔案系統層面過濾（效能較好）。
* `-Include` / `-Exclude`：在 PowerShell 層過濾（較慢）。
* `-File` / `-Directory`：只列檔或只列資料夾（PowerShell 3.0+）。
* `-ErrorAction SilentlyContinue`：忽略存取被拒等錯誤訊息。

範例：

```powershell
# 在 C:\Users 下找 user.txt（包含隱藏檔）
Get-ChildItem -Path C:\Users\* -Filter user.txt -Recurse -Force -ErrorAction SilentlyContinue

# 只列出資料夾（含隱藏）
gci -Directory -Force

# 只列出檔案（含隱藏）
gci -File -Force
```

---

## 3. 模式（Mode）欄位小解

`gci` 輸出會有 `Mode` 欄位，例如 `d--hsl`：

* `d` = directory（資料夾）
* `a` = archive
* `r` = read-only
* `h` = hidden（隱藏）
* `s` = system（系統）
* `l` = reparse point / symbolic link

當看到 `h` 與 `s` 時，表示該項目預設會被 `gci` 隱藏，必須 `-Force` 才會列出。

---

## 4. 進階應用（快速找檔、找到就停、顯示完整路徑）

```powershell
# 找到第一個 user.txt 並輸出完整路徑
Get-ChildItem -Path C:\Users\* -Filter user.txt -Recurse -Force -ErrorAction SilentlyContinue |
  Select-Object -First 1 -ExpandProperty FullName

# 找到所有 user.txt 並顯示完整路徑
Get-ChildItem -Path C:\Users\* -Filter user.txt -Recurse -Force -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty FullName
```

---

## 5. 與傳統 cmd 的差異

* PowerShell 的 `gci`（Get-ChildItem）語意更強、輸出是物件，可做管線處理。
* cmd 的 `dir` 只是純文字輸出，不能直接在管線上做物件操作。

---

## 6. 在 Evil‑WinRM / CTF 情境的小提醒

* 在被限制權限下，遞迴整個 `C:\` 可能會造成很多「Access denied」訊息，用 `-ErrorAction SilentlyContinue` 能清爽輸出。
* 在目標為 Windows 使用者環境時，很多敏感檔（如 user.txt）常放在 `C:\Users\<user>\Desktop` 或 `Documents`，建議先限制搜尋範圍以加速。

