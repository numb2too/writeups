# AS-REP
**AS-REP Roasting** 是一種針對 Active Directory 的攻擊技術,用來獲取並破解特定用戶的密碼。


## 簡介

### 什麼是 AS-REP?

**AS-REP** = **Authentication Service Response** (認證服務回應)

這是 Kerberos 認證協定中的一個步驟。

---

### 正常的 Kerberos 認證流程

```
1. 用戶輸入帳號密碼
   ↓
2. 客戶端用密碼加密時間戳 → 發送給 KDC (AS-REQ)
   ↓
3. KDC 驗證加密的時間戳(Pre-Authentication)
   ↓
4. 如果正確,KDC 發放 TGT 票證 (AS-REP)
   ↓
5. 用戶拿著 TGT 去存取資源
```

**關鍵點**: 步驟 2-3 的 **Pre-Authentication(預先驗證)** 要求客戶端先證明自己知道密碼。

---

### AS-REP Roasting 攻擊原理

#### 問題出在哪?

某些帳號可能被設定成 **"Do not require Kerberos preauthentication"**(不需要 Kerberos 預先驗證)

```
正常帳號:
用戶 → [需要密碼加密的時間戳] → KDC驗證 → 發放TGT

有漏洞的帳號:
攻擊者 → [只要帳號名稱] → KDC直接發放TGT → 獲得加密的密碼hash!
```

#### 攻擊流程

```
1. 攻擊者發送 AS-REQ 請求(只有用戶名,沒有密碼)
   ↓
2. KDC 檢查: 這個用戶不需要預先驗證!
   ↓
3. KDC 發送 AS-REP,裡面包含用「用戶密碼」加密的數據
   ↓
4. 攻擊者獲得這個加密數據(hash)
   ↓
5. 離線暴力破解這個 hash → 得到明文密碼!
```

---

### 實際例子

#### 你剛才做的事情:

```bash
# 1. 檢查哪些帳號有漏洞
impacket-GetNPUsers spookysec.local/ -usersfile users.txt -dc-ip 10.10.129.69

# 輸出:
[-] james - 需要預先驗證 ✗
[+] svc-admin - 不需要預先驗證! ✓ (有漏洞!)
    → 獲得 hash: $krb5asrep$23$svc-admin@...
[-] robin - 需要預先驗證 ✗
```

```bash
# 2. 破解獲得的 hash
hashcat -m 18200 hash.txt rockyou.txt

# 結果: svc-admin 的密碼是 "management2005"
```

---

### 為什麼這是個漏洞?

#### 對比:

| 正常帳號                         | 有漏洞的帳號 (AS-REP Roastable)   |
| -------------------------------- | --------------------------------- |
| 攻擊者需要先知道密碼才能進行攻擊 | 攻擊者不需要任何密碼就能獲得 hash |
| 每次嘗試密碼都會被記錄           | 獲得 hash 後可以離線破解,不留痕跡 |
| 多次失敗會觸發帳號鎖定           | 不會觸發任何警報                  |

---

### 哪些帳號容易有這個漏洞?

1. **服務帳號** (Service Accounts)
   - 例如: `svc-admin`, `svc-backup`, `svc-sql`
   - 管理員為了方便自動化腳本,會關閉預先驗證

2. **舊系統遺留帳號**
   - 從舊版本遷移過來的帳號

3. **第三方應用帳號**
   - 某些老舊應用不支援 Kerberos 預先驗證

---

### 在 Active Directory 中如何設定

#### 查看設定 (PowerShell):
```powershell
Get-ADUser -Filter {DoesNotRequirePreAuth -eq $true}
```

#### 設定不需要預先驗證:
```powershell
Set-ADAccountControl -Identity svc-admin -DoesNotRequirePreAuth $true
```

#### 在圖形界面中:
```
Active Directory Users and Computers 
→ 用戶屬性 
→ Account 標籤 
→ ☑ "Do not require Kerberos preauthentication"
```

---

### 防禦方法

#### 1. 定期檢查有漏洞的帳號
```powershell
# 列出所有不需要預先驗證的帳號
Get-ADUser -Filter {DoesNotRequirePreAuth -eq $true} | Select Name, SamAccountName
```

#### 2. 移除此設定
```powershell
Set-ADAccountControl -Identity svc-admin -DoesNotRequirePreAuth $false
```

#### 3. 使用強密碼
即使有漏洞,強密碼也難以破解

#### 4. 監控異常請求
監控大量的 AS-REQ 請求 (Event ID 4768)

#### 5. 使用服務帳號最佳實踐
- 使用 Group Managed Service Accounts (gMSA)
- 定期輪換密碼
- 使用長且複雜的密碼

---

### 相關攻擊技術對比

| 攻擊                | 需要的權限           | 目標                 |
| ------------------- | -------------------- | -------------------- |
| **AS-REP Roasting** | 無需權限             | 不需要預先驗證的帳號 |
| **Kerberoasting**   | 需要有效域帳號       | 有 SPN 的服務帳號    |
| **Pass-the-Hash**   | 需要已有的 NTLM hash | 任何帳號             |
| **Golden Ticket**   | 需要 krbtgt hash     | 整個域               |

---

### 總結

**AS-REP Roasting 的本質:**
- 利用錯誤的 AD 配置
- 在不需要密碼的情況下獲得密碼 hash
- 離線破解 hash 得到明文密碼
- 這是為什麼你能破解 `svc-admin` 密碼的原因!

```
你的攻擊路徑:
列舉用戶 → 發現 svc-admin 有漏洞 → 獲得 hash → 破解密碼 → 成功! 🎯
```

還有其他問題嗎?例如 Kerberoasting 或其他 AD 攻擊技術? 😊