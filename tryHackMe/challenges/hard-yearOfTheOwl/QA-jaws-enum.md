# 🔍 為什麼 JAWS 會檢查 `$Recycle.Bin`?

## 🎯 JAWS-Enum.ps1 是什麼?

**JAWS (Just Another Windows (Enum) Script)** 是一個 **Windows 提權枚舉腳本**,用來自動化收集系統資訊,尋找提權向量。

## 🗑️ 為什麼檢查資源回收桶?

### **原因 1: 敏感資訊洩露**

管理員或用戶可能會:
- 刪除包含**密碼**的文件
- 刪除**配置檔案**
- 刪除**備份腳本**
- 刪除**私鑰**或**憑證**

但檔案還在資源回收桶裡!

### **真實案例:**
```powershell
# 管理員刪除了這些檔案,但還能恢復:
C:\$Recycle.Bin\...\$Rpasswords.txt      ← 密碼清單
C:\$Recycle.Bin\...\$Rconfig.xml         ← 含明文密碼的配置
C:\$Recycle.Bin\...\$Radmin_backup.ps1   ← 管理腳本
C:\$Recycle.Bin\...\$Rid_rsa             ← SSH 私鑰
```

### **原因 2: 常被忽略的寶庫**

大多數人以為:
- ✅ 刪除檔案 = 檔案消失了
- ❌ 實際上 = 還在資源回收桶裡

攻擊者會檢查,但防守方常常忘記!

## 📊 JAWS 檢查的內容

JAWS 會自動檢查:

```powershell
# 1. 系統資訊
- OS 版本
- 補丁等級
- 已安裝軟體

# 2. 用戶和群組
- 本地用戶
- 管理員成員
- 權限配置

# 3. 網路資訊
- 網路連線
- 防火牆規則
- 共享資料夾

# 4. 敏感檔案位置 ⭐
- 配置檔案
- 密碼檔案
- 備份檔案
- **資源回收桶** ← 這個!

# 5. 服務和計劃任務
- 可利用的服務
- 弱權限任務

# 6. 可寫目錄
- DLL 劫持機會
- 服務配置錯誤
```

## 🔍 JAWS 對資源回收桶做什麼?

```powershell
# JAWS 內部會執行類似這樣的命令:
Get-ChildItem 'C:\$Recycle.Bin' -Recurse -Force -ErrorAction SilentlyContinue

# 然後尋找:
- 文字檔 (*.txt, *.log, *.conf)
- 腳本 (*.ps1, *.bat, *.cmd)
- 配置 (*.xml, *.ini, *.config)
- 密鑰 (*.key, *.pem, id_rsa)
- 資料庫 (*.db, *.sqlite)
```

## 🎯 實際 CTF/滲透測試案例

### **案例 1: 管理員刪除舊密碼檔案**
```powershell
# 管理員的操作:
PS> del C:\passwords.txt
# 以為安全了

# 攻擊者的發現:
PS> gci 'C:\$Recycle.Bin' -Recurse -Hidden -Force
# 找到 $Rxxxxxx.txt (就是 passwords.txt!)

PS> cat 'C:\$Recycle.Bin\...\$Rxxxxxx.txt'
Administrator:SuperSecretPass123!
```

### **案例 2: 開發者刪除包含憑證的腳本**
```powershell
# 開發者刪除了測試腳本
del deploy_script.ps1

# 腳本內容:
$password = "P@ssw0rd123"
Invoke-Command -ComputerName DC01 -Credential (New-Object PSCredential "Administrator", $password)

# 攻擊者恢復並獲得 Domain Admin 密碼!
```

### **案例 3: 備份檔案**
```powershell
# IT 刪除了舊的配置備份
del web.config.backup

# 備份裡有資料庫連線字串:
<connectionString>
  Server=DB01;Database=prod;User=sa;Password=SqlAdm1n2023!
</connectionString>

# 攻擊者獲得資料庫存取權限!
```

## 🛠️ JAWS 的其他檢查點

### **1. 常見密碼位置**
```powershell
# JAWS 會檢查:
C:\unattend.xml                    # Windows 安裝設定 (可能含密碼)
C:\Windows\Panther\Unattend.xml    # 同上
C:\Windows\system32\config\SAM     # 本地帳戶雜湊
C:\Users\*\AppData\Roaming\...     # 應用程式設定
```

### **2. PowerShell 歷史**
```powershell
# 查看命令歷史 (可能有密碼!)
cat C:\Users\*\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt
```

### **3. 可寫的服務路徑**
```powershell
# 尋找可以替換執行檔的服務
Get-WmiObject Win32_Service | Where-Object {$_.PathName -match "^[^\""]"}
```

### **4. 弱權限檔案/資料夾**
```powershell
# 尋找普通用戶可寫的系統檔案
icacls "C:\Program Files\*" | findstr "(F) (M) (W)"
```

## 📝 手動執行 JAWS

```powershell
# 1. 下載 JAWS (在 Kali)
wget https://raw.githubusercontent.com/411Hall/JAWS/master/jaws-enum.ps1

# 2. 上傳到目標 (在 Evil-WinRM)
upload jaws-enum.ps1

# 3. 執行
.\jaws-enum.ps1 -OutputFilename JAWS-Enum.txt

# 4. 查看結果
cat JAWS-Enum.txt

# 5. 或直接輸出到螢幕
.\jaws-enum.ps1
```

## 🔍 JAWS 輸出範例

```
[+] Checking $Recycle.Bin for interesting files...
    C:\$Recycle.Bin\S-1-5-21-xxx\$Rpasswords.txt
    C:\$Recycle.Bin\S-1-5-21-xxx\$Rbackup.xml
    
[!] Found potentially sensitive files in Recycle Bin!

[+] Checking PowerShell History...
    Found: net user Administrator NewPass123!
    
[!] Credentials found in PowerShell history!

[+] Checking for unquoted service paths...
    Service: VulnService
    Path: C:\Program Files\Vuln App\service.exe
    
[!] Unquoted service path found - potential privilege escalation!
```

## 🎯 為什麼自動化工具很重要?

### **手動檢查 vs 自動化工具**

**手動檢查:**
```powershell
# 你需要記得檢查:
gci C:\$Recycle.Bin -Recurse -Hidden
cat C:\Users\*\AppData\Roaming\...\ConsoleHost_history.txt
Get-WmiObject Win32_Service
icacls "C:\Program Files"
# ... 還有 100+ 個其他位置
```

**JAWS 自動化:**
```powershell
# 一個命令搞定
.\jaws-enum.ps1
# 自動檢查所有已知的提權向量
```

## 📚 類似的枚舉工具

```powershell
# Windows 提權枚舉工具:

1. JAWS             ← PowerShell 腳本
2. WinPEAS          ← 最全面,強烈推薦
3. PowerUp          ← PowerSploit 的一部分
4. Sherlock         ← 檢查已知漏洞
5. Watson           ← .NET 版本的 Sherlock
6. PrivescCheck     ← 另一個 PowerShell 腳本
```

### **推薦使用順序:**
```powershell
# 1. WinPEAS (最全面)
.\winPEASx64.exe

# 2. JAWS (如果 WinPEAS 被阻擋)
.\jaws-enum.ps1

# 3. PowerUp (針對服務和權限)
Import-Module .\PowerUp.ps1
Invoke-AllChecks
```

## 🛡️ 防禦角度

**為什麼管理員應該注意資源回收桶:**

```powershell
# 1. 定期清空資源回收桶
Clear-RecycleBin -Force

# 2. 或直接永久刪除敏感檔案
Remove-Item -Path "C:\sensitive.txt" -Force
# 而不是用 del (只是移到回收桶)

# 3. 檢查資源回收桶
Get-ChildItem 'C:\$Recycle.Bin' -Recurse -Force

# 4. 使用 Cipher 安全刪除
cipher /w:C:\temp
```

## 🎯 在你的情況

```powershell
# JAWS 發現了資源回收桶,你應該:

# 1. 檢查裡面有什麼
gci 'C:\$Recycle.Bin' -Recurse -Hidden -Force

# 2. 找文字檔和腳本
gci 'C:\$Recycle.Bin' -Recurse -Hidden -Force -Include *.txt,*.ps1,*.bat,*.xml,*.ini

# 3. 讀取可疑檔案
gci 'C:\$Recycle.Bin' -Recurse -Hidden -Force -File | ForEach-Object {
    Write-Host "`n=== $($_.Name) ===" -ForegroundColor Cyan
    cat $_.FullName -ErrorAction SilentlyContinue
}

# 4. 搜尋關鍵字
gci 'C:\$Recycle.Bin' -Recurse -Hidden -Force -File | Select-String -Pattern "password|pass|admin|flag" -ErrorAction SilentlyContinue
```

---

## 📝 總結

**JAWS 檢查 `$Recycle.Bin` 的原因:**
1. ✅ 可能有敏感資訊 (密碼、金鑰、配置)
2. ✅ 管理員常忘記清空
3. ✅ 是常被忽略的提權向量
4. ✅ 檔案還能恢復和讀取

**這是滲透測試的標準檢查項目!** 🎯

在你的 CTF 中,檢查看看資源回收桶有沒有被刪除的 flag 或密碼! 🗑️