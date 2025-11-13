# cewl 
密碼字典生成工具

## 使用範例

### 自製字典
```bash
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ cewl https://championvalley.angelfire.com/1Lab_JOwl.html -w wordlist.txt
CeWL 6.2.1 (More Fixes) Robin Wood (robin@digi.ninja) (https://digi.ninja/)
                                                                            
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ wc wordlist.txt            
 6680  6680 51877 wordlist.txt
                                                                            
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ sort -u wordlist.txt -o wordlist.txt 
                                                                            
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ wc wordlist.txt 
 6680  6680 51877 wordlist.txt
 ```


## 說明

 `cewl` 是一個 **密碼字典生成工具（Custom Word List generator）**，常用於 **滲透測試與社會工程學測試**。它可以根據網站內容自動抓取文字，生成針對目標的專屬密碼列表，用於後續的密碼破解攻擊（如 `hydra`、`john the ripper` 等）。

---

### 1️⃣ 功能

1. **抓取網站內容**

   * 掃描指定的 URL，把網頁上的文字抽取出來。
2. **生成密碼字典**

   * 把抽取的文字整理成單詞列表（wordlist），可直接作為破解密碼的字典。
3. **自訂參數**

   * 可以設定最小字元長度、輸出檔案、包含標題、meta 標籤等。

---

### 2️⃣ 使用範例

#### 基本用法

```bash
cewl http://example.com
```

* 抓取 `example.com` 網站內容，生成單詞列表。

#### 指定最小字元長度

```bash
cewl -m 5 http://example.com
```

* 只收錄長度 ≥ 5 的單詞。

#### 輸出成檔案

```bash
cewl -w wordlist.txt http://example.com
```

* 生成的單詞列表存成 `wordlist.txt`

#### 深入抓取（多層連結）

```bash
cewl -d 2 -m 5 -w wordlist.txt http://example.com
```

* `-d 2` 表示抓取深度為 2 層
* 可抓取網站內的其他頁面連結內容

---

### 3️⃣ 用途

* **滲透測試**：生成針對特定組織的密碼字典，提高密碼破解成功率。
* **社會工程學測試**：從公開網站抓取員工名字、部門名稱等生成密碼候選。
* **紅隊演練**：針對企業網站生成自訂字典進行測試。

---

💡 **注意事項**：

* 只應對 **自己管理或合法授權的網站** 使用，否則屬於未授權攻擊行為。
* 生成的字典可以結合 `hydra`、`john the ripper` 或 `medusa` 等工具進行暴力或字典攻擊。

