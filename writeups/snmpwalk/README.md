# snmpwalk
`snmpwalk` 是一個常見的 **SNMP（Simple Network Management Protocol）查詢工具**，屬於 **net‑snmp** 套件的一部分。它的作用是利用已知的 SNMP 認證（community string 或 SNMPv3 認證）連續遍歷（walk）某個 MIB 樹狀結構，拿回大量與設備狀態相關的資料，適合做深度資訊收集與故障排查。

## 使用範例
### 也可以透過 snmpwalk 取得 users
```bash
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ snmpwalk -v2c -c openview 10.10.3.171 1.3.6.1.4.1.77.1.2.25 
iso.3.6.1.4.1.77.1.2.25.1.1.5.71.117.101.115.116 = STRING: "Guest"
iso.3.6.1.4.1.77.1.2.25.1.1.6.74.97.114.101.116.104 = STRING: "Jareth"
iso.3.6.1.4.1.77.1.2.25.1.1.13.65.100.109.105.110.105.115.116.114.97.116.111.114 = STRING: "Administrator"
iso.3.6.1.4.1.77.1.2.25.1.1.14.68.101.102.97.117.108.116.65.99.99.111.117.110.116 = STRING: "DefaultAccount"
iso.3.6.1.4.1.77.1.2.25.1.1.18.87.68.65.71.85.116.105.108.105.116.121.65.99.99.111.117.110.116 = STRING: "WDAGUtilityAccount"
                                                                            
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ snmpwalk -v2c -c openview -On 10.10.3.171 1.3.6.1.2.1.1

.1.3.6.1.2.1.1.1.0 = STRING: "Hardware: Intel64 Family 6 Model 79 Stepping 1 AT/AT COMPATIBLE - Software: Windows Version 6.3 (Build 17763 Multiprocessor Free)"
.1.3.6.1.2.1.1.2.0 = OID: .1.3.6.1.4.1.311.1.1.3.1.2
.1.3.6.1.2.1.1.3.0 = Timeticks: (611640) 1:41:56.40
.1.3.6.1.2.1.1.4.0 = ""
.1.3.6.1.2.1.1.5.0 = STRING: "year-of-the-owl"
.1.3.6.1.2.1.1.6.0 = ""
.1.3.6.1.2.1.1.7.0 = INTEGER: 76
```

## 說明
### 核心概念（一句話）

`snmpwalk` 透過不斷發出 `GETNEXT`/`GETBULK` 請求，從指定的 OID 開始「走」整個 MIB 子樹，回傳該子樹下的所有 OID 與其值。

---

### 常見用途

* 收集設備資訊（系統描述、主機名稱、介面清單、流量、路由、ARP、儲存使用狀況等）。
* 偵錯或驗證 SNMP 是否能取到期望的資料。
* 滲透測試時用來找出可被公開的敏感資訊（在合法授權下）。

---

### 常用指令範例

* 使用 SNMP v2c（最常見測試方式）：

```bash
snmpwalk -v2c -c public 192.168.1.10
```

* 指定起始 OID（只抓 sys 相關）：

```bash
snmpwalk -v2c -c public 192.168.1.10 SNMPv2-MIB::sysDescr
```

* 用數字 OID 表示（避免 MIB 名稱解析問題）：

```bash
snmpwalk -v2c -c public -On 192.168.1.10 .1.3.6.1.2.1.1
```

* 使用 SNMPv3（含認證/加密）：

```bash
snmpwalk -v3 -u myuser -l authPriv -a MD5 -A authpass -x AES -X privpass 192.168.1.10
```

* 只顯示簡潔值（`-Oqv`）：

```bash
snmpwalk -v2c -c public -Oqv 192.168.1.10 SNMPv2-MIB::sysName.0
```

---

### 常用選項（實務上會用到的）

* `-v1|2c|3`：SNMP 版本
* `-c <community>`：v1/v2c 的 community string
* `-u <user>`、`-l <level>`、`-a <auth>`、`-A <authpass>`、`-x <priv>`、`-X <privpass>`：SNMPv3 認證/加密參數
* `-On`：用數字 OID 輸出（避免 MIB 名稱解析失敗）
* `-Os`：只顯示 OID 最後部分
* `-Oqv`：只輸出值（便於 pipe 給其他工具）
* `-m` / `-M`：手動載入或指定 MIB 路徑

---

### 範例輸出與解釋

範例（簡化）：

```
SNMPv2-MIB::sysDescr.0 = STRING: Linux host1 4.19.0-...
SNMPv2-MIB::sysName.0 = STRING: host1
IF-MIB::ifDescr.1 = STRING: eth0
IF-MIB::ifInOctets.1 = Counter32: 12345678
```

解釋：

* `SNMPv2-MIB::sysDescr.0`：系統描述（OS、版本等）。
* `IF-MIB::ifDescr.1`：介面名稱（eth0）。
* `IF-MIB::ifInOctets.1`：該介面收到的位元組數（流量統計）。

---

### 與其他工具的差異（簡短）

* **vs snmpget**：`snmpget` 用於取得單一 OID 的值（精確查詢）；`snmpwalk` 用於遍歷一個 OID 子樹（批量抓取）。
* **vs snmpwalk + parser**：`snmpwalk` 給你原始 OID/值，若想要更易讀或自動化分析，可把輸出丟給 `snmp-check` 或自製解析腳本。

---

### 常見問題與注意事項

* **UDP / 過濾**：SNMP 多用 UDP（port 161/162），網路上常被防火牆或 IPS 過濾，掃描時可能看到 `open|filtered` 或沒回應。
* **回應速度**：對大 MIB tree 執行 `snmpwalk` 可能很慢，可用 `-Cc`、`-Cr` 等 net-snmp 參數調整重試/timeout（視版本）。
* **權限/認證**：若 community 錯誤或 SNMP 被關閉，會無回應或顯示 `Timeout`/`No Such Object`。
* **安全性**：v1/v2c 只靠明文 community，容易被猜測；生產環境應用 SNMPv3（認證與加密）或限制來源 IP。
* **合法性**：請只在你管轄或取得授權的設備上使用 `snmpwalk`。

