# Invoke-WebRequest
 `Invoke-WebRequest`（簡寫常見為 `iwr`）是 PowerShell 的內建 cmdlet

## 使用範例

### 下載檔案
```bash
iwr "https://example.com/sample.zip" -OutFile sample.zip
```

## 說明
功能比 `WebClient` 類別更現代也更方便，所以應該被放進速查表。抱歉剛剛漏掉了，我把它補上並順便加上常見參數、範例與與 `Invoke-RestMethod` 的差異說明，還有安全提醒：

---

### `Invoke-WebRequest`（簡寫：`iwr`）— 快速說明

* 功能：發出 HTTP/HTTPS 請求並取得回應（可以下載檔案、抓取 HTML、上傳資料等）。
* 常見用途：下載檔案、抓取網頁內容、送表單或 API 請求（但對於純 API 回傳 JSON，`Invoke-RestMethod` 更方便會直接解析 JSON）。

#### 常用參數

* `-Uri`：目標 URL（也可用 `-Url`）
* `-OutFile`：下載並儲存到本地檔案（若有此參數，回傳不會在主控台直接列印）
* `-Method`：HTTP 方法（`GET`、`POST`、`PUT`...）
* `-Headers`：自訂標頭（Hashtable）
* `-Body`：POST/PUT 的主體（字串或物件）
* `-Credential`：使用者認證（`Get-Credential` 回傳）
* `-TimeoutSec`：逾時秒數
* `-UseBasicParsing`：舊版 PowerShell 的參數，**在 PowerShell Core / 現代版本中已不必要或不存在**
* `-Proxy` / `-ProxyCredential`：設定 proxy 與其認證

---

#### 範例：下載檔案（最常見）

```powershell
# 下載並儲存到本地檔案
Invoke-WebRequest -Uri "https://example.com/sample.zip" -OutFile "sample.zip"

# 簡寫
iwr "https://example.com/sample.zip" -OutFile sample.zip
```

> **安全提醒**：不要下載或執行不明或可疑的執行檔（例如 mimikatz 等會被濫用的工具）。下載執行檔前請確認來源可信、比對雜湊值，並在隔離環境或已授權的測試環境內操作。

#### 範例：帶自訂標頭或 POST JSON

```powershell
# GET 並顯示回應內容（Body）
$response = Invoke-WebRequest -Uri "https://api.example.com/info"
$response.Content

# POST JSON（若要直接取得解析後的物件，請用 Invoke-RestMethod）
Invoke-WebRequest -Uri "https://api.example.com/submit" `
  -Method Post `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body (ConvertTo-Json @{ name = "numb2" ; value = 1 })
```

#### `Invoke-WebRequest` vs `Invoke-RestMethod`

* `Invoke-WebRequest`：回傳的是包含更多 HTTP 資訊的物件（Headers、StatusCode、Content、RawContent 等），適合抓取 HTML 或需要完整回應細節的情境。
* `Invoke-RestMethod`：會自動把 JSON / XML 解析成 PowerShell 物件，更適合做 API 呼叫並立即操作回傳資料。

範例（`Invoke-RestMethod` 取得 JSON 並直接當物件用）：

```powershell
$data = Invoke-RestMethod -Uri "https://api.example.com/data"
$data.items | ForEach-Object { $_.name }
```


