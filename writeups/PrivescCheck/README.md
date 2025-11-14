# PrivescCheck
https://github.com/itm4n/PrivescCheck/releases/tag/2025.11.09-1


## 說明
`PrivescCheck` 是一個 Windows 平台上的 **本地權限提升（Privilege Escalation）檢測工具**，主要用途是幫助滲透測試人員或紅隊確認目標系統是否存在 **可以讓低權限使用者升級為高權限（例如 Administrator 或 SYSTEM）的方法**。

它的特點和功能大致如下：

---

### 1️⃣ 功能

* **檢查系統配置漏洞**：如服務權限過高、可寫入的執行檔、弱 ACL（存取控制列表）。
* **檢查已安裝軟體漏洞**：部分軟體可能有已知漏洞可被利用提升權限。
* **檢查 Windows 系統漏洞**：例如過時的 Hotfix、可利用的計劃任務、可寫入的註冊表鍵。
* **掃描自動執行項目**：如 Startup、Scheduled Tasks、WMI、服務、驅動程式等。
* **生成詳細報告**：列出所有可能的升權路徑，方便後續利用。

---

### 2️⃣ 使用方式

通常是在 **低權限帳號**下執行：

```powershell
PrivescCheck.ps1
```

* 它是一個 PowerShell 腳本，也可以直接在 Windows 環境下執行。
* 執行後會生成一個 **掃描報告**，列出所有可疑的權限提升途徑。

---

### 3️⃣ 注意事項

* `PrivescCheck` **本身不會自動執行漏洞利用**，只是告訴你「哪些地方可能可被利用」。
* 執行時可能會被 **防毒或 Windows Defender 偵測**，因為它會檢查系統弱點。
* 適合 **紅隊、滲透測試或自我安全評估**，不要在未授權的系統上使用，否則可能違法。

---

如果你想，我可以幫你整理一個 **PrivescCheck 掃描報告中常見可被利用的升權漏洞列表**，方便快速了解它能找到什麼。



---

### ✅ **PrivescCheck – 常見可利用的 Windows 權限提升漏洞清單**

#### 🔥 **A. 弱服務設定（Services）**

這是最常見、也最容易成功的類型。

##### 1. **服務二進位可寫（Writable Service Binary）**

* 服務的執行檔可被一般使用者改寫。
* 改掉 EXE → 重啟服務 → 直接 SYSTEM。

**利用工具**：`sc.exe`, `powershell`, `icacls`, `msfvenom`。

---

##### 2. **服務設定可修改（Service Config Modifiable）**

你可以修改：

* `binPath`
* `StartName`
* `Failure Command`

→ 可改成執行你自己的 payload。

---

##### 3. **未授權服務重啟權限（Service Restart Privilege）**

如果一般使用者可以：

* restart 服務
* stop/start 服務

且該服務執行檔可被替換 → SYSTEM。

---

#### 🔥 **B. 計畫工作（Scheduled Tasks）**

##### 1. **可寫入的 Scheduled Task Action**

任務跑 SYSTEM，如果 task 的：

* `action`
* `exe 路徑`
* `arguments`

可被你改 → SYSTEM。

---

##### 2. **可寫入的 Working Directory**

一些任務會執行沒有完整路徑的程式
→ 可透過 **放置同名惡意 EXE** 來 DLL hijack。

---

#### 🔥 **C. 弱檔案與資料夾 ACL**

##### 1. **Program Files、ProgramData 可寫**

低權限可以寫入 Program Files → 高風險。

##### 2. **可寫的 AutoRuns、Startup**

例如：

```
C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup
```

如果可寫 → 放 EXE 會在登入時執行（可能 SYSTEM）。

---

#### 🔥 **D. 註冊表弱點（Registry）**

##### 1. **可寫入的服務註冊鍵**

修改 ImagePath → SYSTEM。

##### 2. **OpenWithList / Shell\Open\Command 可寫**

修改預設開啟程式行為 → 權限提升。

---

#### 🔥 **E. 系統漏洞（未打補丁）**

PrivescCheck 會偵測已知 CVE，例如：

##### **1. Hot Potato / Rotten Potato 漏洞**

利用 NTLM relay 提升到 SYSTEM。

##### **2. Print Spooler 弱點 (PrintNightmare)**

非常常見，只要 Spooler 開啟就可能利用。

##### **3. SeImpersonatePrivilege 可用**

如果你有 **SeImpersonatePrivilege** 或 **SeAssignPrimaryTokenPrivilege**
→ 80% 可用 Potato 類攻擊提權：

* Juicy Potato
* Rogue Potato
* PrintSpoofer
* EfsPotato

---

#### 🔥 **F. 可寫入可執行檔位置 + PATH Hijacking**

如果某個 SYSTEM 服務執行：

```
myservice.exe
```

但沒有完整路徑，Windows 會從 PATH 找 → 你可放入惡意檔案。

---

#### 🔥 **G. DLL Hijacking（動態連結庫劫持）**

若程式以 SYSTEM 執行，卻會從可寫目錄載入 DLL
→ 放置惡意 DLL 給它讀，就能提 SYSTEM。

---

#### 🔥 **H. Unquoted Service Paths（未加引號的服務路徑）**

例如：

```
C:\Program Files\My App\service.exe
```

無引號 → Windows 會解析路徑中每段：

```
C:\Program.exe
C:\Program Files\My.exe
```

如果你能建立檔案 → 直接 SYSTEM。

---

### 📌 **PrivescCheck 重點：它只找弱點，不幫你利用**

PrivescCheck 很像 Windows 版的 LinPeas，它會列出：

* 可寫檔案
* 可寫資料夾
* 可寫服務
* 弱 ACL
* 可利用系統權限
* 已知 CVE
* 計畫工作弱點

**你要自己決定哪條路線好利用**。

---

### 如果你想，我可以幫你做：

* **PrivescCheck 報告如何閱讀（逐段講解）**
* **把你找到的某一條弱點教你怎麼利用**
* **提供短小易懂的 Windows 提權流程記憶法**
* **跟 winPEAS、Seatbelt、SharpUp 做比較**
