# Windows SAM

## 說明
Windows 的 **SAM（Security Account Manager）** 是 Windows 系統中用來存放 **本機帳號密碼資料庫** 的一個核心組件。它的主要功能和特性如下：

---

### 1. 存放的內容

* 本機使用者帳號（Local User Accounts）
* 使用者密碼的 **雜湊值**（hashed password）
* 群組資訊（Group Membership）
* 安全設定（如密碼複雜度、是否過期等）

> 注意：SAM 中存的不是明文密碼，而是經過雜湊（hash）的密碼，例如 **NTLM hash** 或舊版 Windows 的 LM hash。

---

### 2. 存放位置

* 在 Windows 系統上，SAM 資料庫通常位於：

```
C:\Windows\System32\config\SAM
```

* 但這個檔案在系統運行時是鎖定的，**不能直接打開**。系統會透過 Windows 的 API 來讀取。

---

### 3. 保護機制

* SAM 與 **SYSTEM registry hive** 配合加密，以防止未授權存取。
* 權限不足的使用者無法直接讀取或修改 SAM。
* 在 Windows 運行時，SAM 的內容是加密的，只有系統可以解密。

---

### 4. 攻擊面（資安角度）

SAM 經常是 **本機滲透與提權攻擊的目標**，例如：

* 使用工具 **mimikatz** 或 **pwdump** 讀取雜湊值。
* 對 NTLM hash 進行 **離線暴力破解** 或 **Pass-the-Hash 攻擊**。
* 從 **離線系統備份**（例如 Shadow Copy）取得 SAM。

---

### 5. 相關概念

* **NTLM Hash**：Windows 用來驗證使用者密碼的雜湊形式。
* **LSASS**：Windows 的 Local Security Authority Subsystem Service，運行中會將 SAM 的密碼雜湊載入記憶體，成為攻擊目標。

---

簡單說，**SAM 就是 Windows 的本機帳號密碼資料庫**，負責存放使用者帳號和雜湊密碼，保護系統本地登入的安全。

---

## SAM 與 Windows 登入流程（簡易圖示 + 說明）

好，下面給你一個簡單直觀的 ASCII 圖來說明 SAM、SYSTEM、LSASS、NTLM hash 與登入/攻擊流程，之後附上每個步驟的簡短說明與常見攻擊與防護建議。

```
┌──────────┐        ┌──────────────┐        ┌───────────┐
│  登入表單  │ ──(1)──>│ Local Authentication │ ──(2)──>│ LSASS.exe │
└──────────┘         │   (Winlogon)        │         └────┬────┘
                       └──────────────┘              │
                                                      │ (3) 讀取/比對雜湊
                                           ┌──────────▼──────────┐
                                           │  SAM 檔案 (離線: C:\Windows\System32\config\SAM)  │
                                           │  + SYSTEM hive (加密金鑰)                      │
                                           └──────────┬──────────┘
                                                      │
           ┌─────────────────────────────── 攻擊向量 ───────────────────────────────┐
           │  - 離線：從磁碟或備份抽取 SAM 檔並離線破解雜湊                                │
           │  - 記憶體：mimikatz 從 LSASS 記憶體擷取 cleartext 或 NTLM hash (live)      │
           │  - Pass-the-Hash：直接用 NTLM hash 做認證，不需明文密碼                      │
           └──────────────────────────────────────────────────────────────────────────┘
```

### 步驟說明（簡短）

1. 使用者在登入畫面輸入帳號/密碼（或網域/本機登入流程）。
2. Windows 的 logon subsystem（如 Winlogon / LSA）把認證請求交給 LSASS.exe。
3. LSASS 會根據本機帳號查詢 SAM（若系統運行中，系統會用 SYSTEM hive 的金鑰解密並將所需雜湊載入記憶體），比對使用者輸入的密碼所產生的雜湊是否相同（或在域環境下轉交給域控制器驗證）。
4. 驗證成功後，使用者取得存取權與 token；若失敗則拒絕登入。

### 常見攻擊（資安角度）

* **離線取得 SAM 檔並破解雜湊**：攻擊者若能取得磁碟備份或掛載系統磁碟，可取出 `C:\Windows\System32\config\SAM` 與 `SYSTEM`，離線用破解工具暴力或字典破解 NTLM/LM 雜湊。
* **Memory dump / mimikatz**：mimikatz 能從 LSASS 記憶體中擷取明文密碼或 NTLM hash，供後續 lateral movement 或 pass-the-hash 使用。
* **Pass-the-Hash (PtH)**：直接用 NTLM 雜湊作為認證憑證連入其他主機，無需知道明文密碼。
* **Credential dumping**：各種工具或惡意程式嘗試提取儲存在系統或瀏覽器中的認證。

### 防護建議（實務）

* 關閉或禁用 **LM hash**（非常弱，現代 Windows 預設關閉）。
* 使用 **強密碼與定期更換**（配合帳號鎖定策略）。
* 啟用 **LSA Protection / Protected Process Light (PPL)**，減少從 LSASS 擷取的風險。
* 啟用 **Windows Defender Credential Guard**（利用虛擬化隔離憑證）。
* 使用完整盤加密（例如 BitLocker）避免離線直接讀取 SAM 檔案。
* 限制管理員帳號使用範圍、使用多重身份驗證（MFA）與最小權限原則。
* 定期掃描並阻擋惡意程式（尤其針對 credential dumping 工具）。

