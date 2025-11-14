# Get-ChildItem

`Get-ChildItem` 是 **PowerShell** 裡的一個**核心指令（Cmdlet）**，主要用來「列出資料夾或容器裡的項目」。
它的功能有點像 Linux 的 `ls` 或 Windows CMD 的 `dir`。

## 使用範例

### 找 user.txt
```bash
*Evil-WinRM* PS C:\Users\Jareth\Desktop> Get-ChildItem -Path C:\Users\* -Filter user.txt -Recurse -ErrorAction SilentlyContinue -Force | Select-Object -ExpandProperty FullName
 
C:\Users\Jareth\Desktop\user.txt
C:\Users\desktop.ini
```
### 檢視裡面的路徑
```bash
*Evil-WinRM* PS C:\> gci -path 'C:\$Recycle.Bin' -h


    Directory: C:\$Recycle.Bin


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
d--hs-        9/18/2020   7:28 PM                S-1-5-21-1987495829-1628902820-919763334-1001
d--hs-       11/13/2020  10:41 PM                S-1-5-21-1987495829-1628902820-919763334-500


```

### 檢視隱藏資料
```bash
*Evil-WinRM* PS C:\> gci -force '$Recycle.Bin\S-1-5-21-1987495829-1628902820-919763334-1001'


    Directory: C:\$Recycle.Bin\S-1-5-21-1987495829-1628902820-919763334-1001


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a-hs-        9/18/2020   2:14 AM            129 desktop.ini
-a----        9/18/2020   7:28 PM          49152 sam.bak
-a----        9/18/2020   7:28 PM       17457152 system.bak


*Evil-WinRM* PS C:\> 
```

## 說明
### 🧩 基本解釋

#### 🔹 指令名稱

```powershell
Get-ChildItem
```

簡寫（常見）：

```powershell
gci
```

#### 🔹 主要用途

* 列出資料夾內的檔案與子資料夾
* 也能用來列出其他「容器」內容，例如：

  * 檔案系統 (`C:\`)
  * 登錄檔 (`HKLM:\`)
  * 憑證存放區 (`Cert:\`)
  * 甚至網路資源等

---

### 🧾 常見用法

#### 📁 1. 列出目前資料夾內容

```powershell
Get-ChildItem
```

＝ 列出所有檔案與資料夾。

#### 📂 2. 指定路徑

```powershell
Get-ChildItem C:\Users
```

列出 `C:\Users` 底下所有項目。

#### 🔍 3. 篩選副檔名

```powershell
Get-ChildItem *.txt
```

列出目前資料夾中所有 `.txt` 檔案。

#### 🔁 4. 遞迴搜尋（含子資料夾）

```powershell
Get-ChildItem -Recurse
```

列出目前資料夾與所有子資料夾的內容。

#### 🎯 5. 搭配條件

```powershell
Get-ChildItem -Recurse | Where-Object { $_.Length -gt 1MB }
```

→ 找出所有大於 1MB 的檔案。

#### 💾 6. 搭配屬性查看詳細資訊

```powershell
Get-ChildItem | Select-Object Name, Length, LastWriteTime
```

→ 顯示檔名、大小、最後修改時間。

---

### 🧠 名稱含義拆解

| 部分          | 意思                                         |
| ------------- | -------------------------------------------- |
| **Get**       | PowerShell 的動詞，表示「取得」              |
| **ChildItem** | 表示「子項目」，例如資料夾裡的檔案或子資料夾 |

整體意思就是：「取得某個容器的子項目」。

---

### 🧰 類似指令比較

| 指令            | 系統          | 功能                                          |
| --------------- | ------------- | --------------------------------------------- |
| `dir`           | CMD           | 顯示資料夾內容（簡單）                        |
| `ls`            | Linux / macOS | 顯示目錄內容                                  |
| `Get-ChildItem` | PowerShell    | 顯示內容 + 物件化輸出，可搭配其他 Cmdlet 運算 |

PowerShell 的輸出是「物件」，不是純文字，
所以可以很方便地做過濾、排序、格式化、輸出到 CSV 等。

---

### 💡 小技巧

若你覺得 `Get-ChildItem` 太長，可直接用：

```powershell
gci
```

例如：

```powershell
gci C:\Windows -Recurse -Filter *.log
```

→ 尋找 Windows 資料夾中所有 `.log` 檔案。


當然可以 👍
以下是整理好的 **PowerShell「檔案與資料夾常用指令速查表」**，包含說明、常用參數與範例，方便你快速查用：

---
### `-Force`
簡短答覆：`gci -Force` 是 PowerShell 的指令，`gci` 是 `Get-ChildItem` 的縮寫（alias），`-Force` 則是告訴它**也列出隱藏與系統檔／資料夾**。

下面把重點、行為、常用組合與範例一次列清楚（繁體中文）。

---

#### 1. 基本說明

* `gci` = `Get-ChildItem`（列出目錄內容，等同 `dir` 在 PowerShell 的別名）。
* `-Force`：強制顯示平常被隱藏或帶有 System 屬性的檔案/資料夾（例如 `desktop.ini`、隱藏資料夾等）。

範例：

```powershell
gci -Force
# 等同
Get-ChildItem -Force
```

---

####  2. 常見參數與行為

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

#### 3. 模式（Mode）欄位小解

`gci` 輸出會有 `Mode` 欄位，例如 `d--hsl`：

* `d` = directory（資料夾）
* `a` = archive
* `r` = read-only
* `h` = hidden（隱藏）
* `s` = system（系統）
* `l` = reparse point / symbolic link

當看到 `h` 與 `s` 時，表示該項目預設會被 `gci` 隱藏，必須 `-Force` 才會列出。

---

####  4. 進階應用（快速找檔、找到就停、顯示完整路徑）

```powershell
# 找到第一個 user.txt 並輸出完整路徑
Get-ChildItem -Path C:\Users\* -Filter user.txt -Recurse -Force -ErrorAction SilentlyContinue |
  Select-Object -First 1 -ExpandProperty FullName

# 找到所有 user.txt 並顯示完整路徑
Get-ChildItem -Path C:\Users\* -Filter user.txt -Recurse -Force -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty FullName
```

---

#### 5. 與傳統 cmd 的差異

* PowerShell 的 `gci`（Get-ChildItem）語意更強、輸出是物件，可做管線處理。
* cmd 的 `dir` 只是純文字輸出，不能直接在管線上做物件操作。

---

####  6. 在 Evil‑WinRM / CTF 情境的小提醒

* 在被限制權限下，遞迴整個 `C:\` 可能會造成很多「Access denied」訊息，用 `-ErrorAction SilentlyContinue` 能清爽輸出。
* 在目標為 Windows 使用者環境時，很多敏感檔（如 user.txt）常放在 `C:\Users\<user>\Desktop` 或 `Documents`，建議先限制搜尋範圍以加速。

