# snmp-check
自動化蒐集與列舉 SNMP 資訊

## 使用範例

### SNMP enumerator 
```bash
└─$ snmp-check -c openview 10.10.3.171 > snmpcheck_openview.txt

└─$ cat snmpcheck_openview.txt                         
snmp-check v1.9 - SNMP enumerator
Copyright (c) 2005-2015 by Matteo Cantoni (www.nothink.org)

[+] Try to connect to 10.10.3.171:161 using SNMPv1 and community 'openview'

[*] System information:

  Host IP address               : 10.10.3.171
  Hostname                      : year-of-the-owl
  Description                   : Hardware: Intel64 Family 6 Model 79 Stepping 1 AT/AT COMPATIBLE - Software: Windows Version 6.3 (Build 17763 Multiprocessor Free)
  Contact                       : -
  Location                      : -
  Uptime snmp                   : 01:18:57.53
  Uptime system                 : 01:18:06.65
  System date                   : 2025-10-31 04:46:26.3
  Domain                        : WORKGROUP

[*] User accounts:

  Guest               
  Jareth              
  Administrator       
  DefaultAccount      
  WDAGUtilityAccount  
...
```

## 說明
`snmp-check`（常寫成 **snmpcheck / snmp-check**）是一個用來 **自動化蒐集與列舉 SNMP 資訊** 的工具，主要用途是滲透測試與網管偵測。它會像 `snmpwalk` 那樣向目標的 SNMP agent 要資料，但把結果整理成較易讀、具可用性的輸出（例如系統資訊、介面、ARP 表、路由表、IIS/服務資訊、可能的帳號/密碼或可寫 OID 等）。它通常包含在安全/滲透測試發行版（例如 Kali）中。([nothink.org][1])

重點整理（簡短版）

* 作用：自動化 SNMP 枚舉（像 `snmpwalk`，但更友善、人類可讀）。([Linux Documentation][2])
* 作者 / 來源：以 Matteo Cantoni / nothink.org 所維護的 snmpcheck 為常見版本（版本範例：v1.9）。也有社群 fork 與相近名稱的其他專案。([nothink.org][1])
* 支援：常見為 SNMP v1 / v2c（利用 community string），可以嘗試預設或常見 community（如 `public`）。([Kali Linux][3])
* 能列舉的資訊（實務上常見項目）：

  * 主機／系統基本資訊（hostname、OS 版本等）
  * 網路介面、流量統計、ARP 表、路由表
  * 裝置硬體 / 儲存資訊、服務統計（例如 IIS）
  * 有時會在 SNMP 資料中找到的使用者名稱、明文或可寫 OID（若裝置回傳）
  * 將輸出整理成可讀報告，方便人員分析。([packages.fedoraproject.org][4])

簡單使用範例

* 指定 community 並掃描單一主機：

  ```bash
  snmp-check 192.168.1.2 -c public
  ```

  或某些版本的選項寫法：

  ```bash
  snmp-check -t 192.168.1.2 -c public
  ```

  成功回應就會列出系統資訊與可讀的枚舉結果。([Kali Linux][3])

注意與建議

* **合法性**：未經授權對第三方網路執行 SNMP 枚舉或掃描可能違法或違反公司政策。只能在你管理的設備或已取得明確授權的情況下使用。([FireCompass][5])
* **安全性**：很多裝置仍使用 SNMP v1/v2c（只靠 community string），若發現弱設定（例如 `public`），應回報並建議改用 SNMPv3（含認證與加密）或限制來源 IP、關閉不必要的 SNMP 服務。([Medium][6])

### 簡單比較
- onesixtyone：快速大量掃描 SNMP community（用來找出哪台有可用的 community string）。
- snmpwalk：低階查詢工具，用已知 community 去遍歷 MIB（拿到原始 OID 資料）。
- snmp-check：高階枚舉器，把 snmpwalk 類的結果整理成易讀報告，並嘗試挑出可用且有價值的資訊（如介面、ARP、路由、可能的使用者資訊等）。

### 參考資料

[1]: https://www.nothink.org/codes/snmpcheck/?utm_source=chatgpt.com "Snmpcheck"
[2]: https://linux.die.net/man/1/snmpcheck?utm_source=chatgpt.com "snmpcheck(1): enumerate info via SNMP protocol"
[3]: https://www.kali.org/tools/snmpcheck/?utm_source=chatgpt.com "snmpcheck | Kali Linux Tools"
[4]: https://packages.fedoraproject.org/pkgs/snmpcheck/snmpcheck/index.html?utm_source=chatgpt.com "snmpcheck"
[5]: https://firecompass.com/understanding-snmp-enumeration/?utm_source=chatgpt.com "Understanding SNMP Enumeration"
[6]: https://medium.com/%40rajkumarkumawat/%EF%B8%8F-snmp-enumeration-the-complete-guide-for-ethical-hackers-red-teamers-ec0b393b503a?utm_source=chatgpt.com "The Complete Guide for Ethical Hackers & Red Teamers"
