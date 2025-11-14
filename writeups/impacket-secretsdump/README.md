# impacket-secretsdump
用來 從 Windows 系統中匯出帳號密碼相關的機敏資料

## 使用範例
### 取得 admin
```bash
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ impacket-secretsdump -ts local -sam sam.bak -system system.bak
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[2025-10-31 15:50:48] [*] Target system bootKey: 0xd676472afd9cc13ac271e26890b87a8c
[2025-10-31 15:50:48] [*] Dumping local SAM hashes (uid:rid:lmhash:nthash)
Administrator:500:aa...7a:::
Guest:501:aad...c0:::
DefaultAccount:50...9c0:::
WDAGUtilityAccount:504...11b:::
Jareth:1001:aad...5a:::
[2025-10-31 15:50:48] [*] Cleaning up... 
```

## 說明

### 🔐 **impacket-secretsdump 是什麼？**

**impacket-secretsdump** 是 Impacket 套件中的一個工具，用來 **從 Windows 系統中匯出帳號密碼相關的機敏資料**。
它可以在 **不用取得完整系統登入** 的情況下，從遠端主機或離線檔案中 **dump 出帳號 hash**。

簡單來說：

> **用來取得 Windows 本機或網域使用者的密碼雜湊（NTLM Hash）、Kerberos 金鑰等機敏資料。**

也就是俗稱的：

✔️ **Dump SAM**
✔️ **Dump NTDS.dit（網域控制站帳號）**
✔️ **Dump LSASS secrets**
✔️ **Dump DPAPI 資料**

---

### 🧩 它能取得哪些資料？

#### 1. **本機 SAM 帳號密碼哈希**

（只要取得 SYSTEM 與 SAM 資料即可）
例：Administrator 的 NTLM hash

#### 2. **網域帳號 NTLM Hash**（通常從 DC）

從 **NTDS.dit** 裡 dump 整個網域的使用者帳號與 NTLM 哈希。

這是 AD 滲透中最強大的東西之一。

#### 3. **LSA Secrets**

可以取得：

* 本機系統帳號密碼
* 服務帳號密碼
* Cached domain credentials（快取憑證）

#### 4. **Kerberos 金鑰（AES128/256）**

可用來進行 **Pass-the-Key**、**Overpass-the-Hash**。

---

### 🛠 它能從哪些來源 Dump？

#### ✔️ **1. 從遠端 Windows 主機 Dump**

用字典帳密或 hash 反向連線並 dump：

```
impacket-secretsdump administrator:Passw0rd@10.0.0.5
```

也可以使用 NTLM hash（Pass-the-Hash）：

```
impacket-secretsdump -hashes :aad3b435b51404eeaad3b435b51404ee 10.0.0.5
```

#### ✔️ **2. 從離線檔案分析 Dump**

如果你拿到：

* **SAM**
* **SYSTEM**
* **SECURITY**
* **NTDS.dit**

就可以離線跑：

```
impacket-secretsdump -sam SAM -system SYSTEM -security SECURITY LOCAL
```

或 NTDS：

```
impacket-secretsdump -ntds ntds.dit -system SYSTEM
```

完全不需要在目標機器「執行任何東西」，只需要拿到檔案。

---

### 🚨 在滲透測試／紅隊中的典型用途

#### 1. **橫向移動（Lateral Movement）**

Dump 到 hash 後：

* Pass-the-Hash
* Crack NTLM hash
* 使用帳密登入其他機器

#### 2. **取得網域管理員（Domain Admin）**

從 DC dump NTDS.dit = 拿到所有帳號密碼。

#### 3. **提權分析**

從 LSA secrets 找到：

* 服務帳號密碼（常常是純文字）
* SQL Server 密碼
* Scheduled task 密碼

#### 4. **密碼策略分析**

看到公司員工密碼是否太簡單、是否重複。

---

### 🎯 總結一句話

> **impacket-secretsdump 是一個專門用來從 Windows 系統（本機或網域）匯出帳號密碼 hash 的工具，是紅隊必備武器之一。**

如果你願意，我也可以提供：

✅ 常用指令全集
✅ THM / HTB 實例示範
✅ 使用 secretsdump 時的權限要求
✅ 如何防禦 secretsdump

