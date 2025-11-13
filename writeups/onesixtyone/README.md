# onesixtyone
SNMP (Simple Network Management Protocol) 掃描工具

## 使用範例

### 
```bash
└─$ onesixtyone 10.10.3.171 -c /usr/share/seclists/Discovery/SNMP/snmp-onesixtyone.txt

Scanning 1 hosts, 3218 communities
10.10.3.171 [openview] Hardware: Intel64 Family 6 Model 79 Stepping 1 AT/AT COMPATIBLE - Software: Windows Version 6.3 (Build 17763 Multiprocessor Free)
```


## 說明

`onesixtyone` 是一個 **SNMP (Simple Network Management Protocol) 掃描工具**，主要用途是快速掃描網路中的設備，以找出 **開放的 SNMP 社群字串（community strings）**，通常用於安全測試與資安評估。它的名稱 `onesixtyone` 其實來自 SNMP 的 **預設端口 161**。

簡單整理功能與特點：

1. **掃描 SNMP 社群字串**

   * SNMP 裝置常有「public」或「private」等預設社群字串。
   * `onesixtyone` 可以快速掃描多個 IP 來檢測是否存在可用的社群字串。

2. **速度快**

   * 相較於其他 SNMP 掃描工具，它非常輕量且高效，適合大量網段掃描。

3. **使用範例**

   * 掃描單一 IP：

     ```bash
     onesixtyone -c public 192.168.1.1
     ```
   * 批量掃描 IP 列表：

     ```bash
     onesixtyone -c community.txt -i targets.txt
     ```

     * `community.txt`：存放要測試的社群字串
     * `targets.txt`：存放要掃描的 IP 或網段

4. **用途**

   * **合法資安測試**：找出弱 SNMP 設定，防止資料外洩
   * **滲透測試**：攻擊者可利用 SNMP 社群字串取得網路設備資訊（如路由器、交換器、伺服器）

⚠️ **注意**：對非自己管理的網路使用 SNMP 掃描屬於入侵行為，可能違法。

如果你需要，我可以幫你畫一張簡單的 **`onesixtyone` 工作流程圖**，讓你一眼就看懂它是怎麼掃描 SNMP 的。你想要我畫嗎？
