# crackmapexec
針對 Windows/Active Directory 網域環境的滲透測試/紅隊工具箱

## doit

### 確認 winrm 密碼是否有效
```bash
└─$ crackmapexec winrm owl.thm -u 'Jareth' -p '[REDACTED]'
[*] First time use detected
[*] Creating home directory structure
[*] Creating default workspace
[*] Initializing SMB protocol database
[*] Initializing WINRM protocol database
[*] Initializing LDAP protocol database
[*] Initializing FTP protocol database
[*] Initializing MSSQL protocol database
[*] Initializing RDP protocol database
[*] Initializing SSH protocol database
[*] Copying default configuration file
[*] Generating SSL certificate
SMB         owl.thm         5985   YEAR-OF-THE-OWL  [*] Windows 10 / Server 2019 Build 17763 (name:YEAR-OF-THE-OWL) (domain:year-of-the-owl)
HTTP        owl.thm         5985   YEAR-OF-THE-OWL  [*] http://owl.thm:5985/wsman
/usr/lib/python3/dist-packages/spnego/_ntlm_raw/crypto.py:46: CryptographyDeprecationWarning: ARC4 has been moved to cryptography.hazmat.decrepit.ciphers.algorithms.ARC4 and will be removed from this module in 48.0.0.
  arc4 = algorithms.ARC4(self._key)
WINRM       owl.thm         5985   YEAR-OF-THE-OWL  [+] year-of-the-owl\Jareth:[REDACTED] (Pwn3d!)

```

## 說明
簡短重點（繁體中文）
**CrackMapExec（常簡寫為 CME）** 是一個針對 Windows/Active Directory 網域環境的滲透測試/紅隊工具箱 —— 它把多種協定（SMB、WinRM、WMI、LDAP、RDP、SSH 等）和常用攻擊/橫向移動手法包成一個方便的介面，讓資安測試人員可以快速掃描、驗證帳密、搜尋可被利用的服務與收集目標資訊。

### 核心定位（一句話）

CME 就像是「網域滲透測試的瑞士刀」，用於在合法授權的情境下快速評估 Windows 網路的弱點與能否進行橫向移動。

### 主要功能（概念性）

* 批量掃描並列出目標主機與可用服務（例如 SMB、WinRM）。
* 檢查與驗證憑證（帳號/密碼、NTLM hash、Kerberos ticket）。
* 在已授權的情況下執行命令或腳本以收集資訊（例如列出分享、查看使用者、取得系統資訊）。
* 整合或啟動其他工具/技術來做後續動作（例如用來協助橫向移動、提權、或撈取憑證）。
* 支援模組化擴充，方便新增特定掃描或攻擊模組。

### 使用場景（合法、常見）

* 企業內部滲透測試（在事前授權下評估 AD 環境弱點）。
* 紅隊演練（模擬真實攻擊鏈以驗證防護、偵測與回應能力）。
* 資安研究與練習（在受控 lab、CTF、或平台如 TryHackMe、Hack The Box 上）。

### 與其它工具的關係

* 常與像 Impacket、Mimikatz、Responder 等工具一起配合使用以完成特定任務。
* 與你先前提到的 Hydra（暴力破解工具）屬於不同類但會在相同滲透測試流程中被搭配使用：Hydra 用於密碼猜測，CME 更側重在掃描、橫向移動與自動化作業。

### 安全與法律提醒（非常重要）

* CME 是強力的攻擊/測試工具。**只有在你擁有明確書面授權（例如測試合約或練習平台）時才可使用。**
* 未經授權在公開或他人系統上使用會觸法並造成嚴重後果。
* 若你是防守方，了解 CME 的能力能幫助設計檢測規則（偵測大量認證嘗試、異常 SMB/WinRM 流量、或橫向移動行為）。


