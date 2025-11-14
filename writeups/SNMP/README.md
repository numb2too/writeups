# SNMP

## 說明
SNMP（**Simple Network Management Protocol，簡單網路管理協定**）是一種用來**管理與監控網路設備**的標準協定。它主要用於網路管理系統（NMS, Network Management System）與各種網路設備（路由器、交換器、防火牆、伺服器、打印機等）之間的資訊交換。

我整理成幾個重點：

---

### 1️⃣ 基本概念

* SNMP 用於 **監控網路設備狀態**、**收集性能資料**、**配置設備參數**。
* 它屬於應用層協定，通常使用 **UDP 協定**，預設埠：

  * **161**：SNMP agent 接收請求
  * **162**：SNMP manager 接收 trap（異常通知）

---

### 2️⃣ 組成

1. **SNMP Manager（管理端）**

   * 控制端，發送請求給設備，收集資訊，像網管系統（Nagios、Zabbix）就屬於 Manager。
2. **SNMP Agent（代理端）**

   * 設備端（路由器、伺服器）運行 Agent，回應 Manager 的請求。
3. **MIB（Management Information Base，管理資訊庫）**

   * 設備資訊的「資料庫」，定義了可以被監控的變數（例如 CPU 使用率、記憶體使用量、接口狀態）。
4. **Community String（社群字串）**

   * SNMPv1/v2c 用來簡單認證的密碼，例如 `public`（只讀）或 `private`（可寫）。

---

### 3️⃣ 功能

* **監控**：查詢設備狀態（CPU、記憶體、網路流量）
* **管理**：修改設備設定（例如修改接口參數）
* **通知**：設備異常時向 Manager 發送 Trap

---

### 4️⃣ 安全性

* SNMPv1/v2c 只靠 **community string** 認證，容易被猜測或濫用
* SNMPv3 提供 **加密與認證**，安全性大幅提升

---

簡單比喻：

> SNMP 就像網路設備的「遙控器」和「感測器」，Manager 是遙控器，Agent 是設備內建的感測器，Manager 可以問「你的 CPU 用了多少？」或下達指令，而 Agent 就回應或執行。


## 1️⃣ 網路層檢測（從外部確認）
要確認一台機器是否開啟 SNMP，可以從 **網路層檢測**和 **設備本身檢查**兩個方向來做。我整理幾種常用方法給你：

### 方法 A：使用 `nmap` 掃描 SNMP 預設端口 161/162

```bash
nmap -sU -p 161,162 192.168.1.100
```

* `-sU`：掃描 UDP 端口（SNMP 使用 UDP）
* `-p 161,162`：檢查 SNMP 預設埠
* 若結果顯示 `open` 或 `open|filtered`，代表 SNMP 可能在運行

---

### 方法 B：使用 `snmpwalk` 或 `snmpget` 嘗試抓取資訊

```bash
snmpwalk -v2c -c public 192.168.1.100
```

* `-v2c`：使用 SNMP v2c 協定
* `-c public`：使用社群字串 `public`（只讀）
* 如果能拿到回應，表示 SNMP 已啟用且社群字串可用

> 注意：如果社群字串不是預設的 `public`，可能需要查管理員或試用常見字串。

---

### 方法 C：使用 `onesixtyone` 掃描

```bash
onesixtyone -c community.txt -i targets.txt
```

* `community.txt`：放可能的社群字串列表
* `targets.txt`：放 IP 或網段
* 扫描到回應代表 SNMP 開啟且社群字串有效

---

## 2️⃣ 設備本身檢查（從內部確認）

* **Windows**

  1. 打開「服務」(services.msc)
  2. 找 `SNMP Service` 是否啟用

* **Linux**

  ```bash
  sudo systemctl status snmpd
  ```

  * `snmpd` 是 SNMP daemon，如果在運行就表示 SNMP 已啟動

* **網路設備（路由器/交換器）**

  * 登入設備 CLI，查詢 SNMP 設定，例如：

    ```bash
    show running-config | include snmp
    ```

    * 若有 SNMP 社群字串或啟用 SNMP 功能，就表示已開啟

---

💡 **總結判斷方法**：

1. 外部掃描：`nmap`、`snmpwalk`、`onesixtyone`
2. 本地檢查：查看服務或 SNMP daemon 是否運行
3. 網路設備查設定檔：確認 SNMP 社群字串與啟用狀態

