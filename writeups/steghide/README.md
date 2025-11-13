# steghide
steghide 是一個用來將資料「藏入」圖片或音訊檔中的隱寫工具。


## 使用範例

### info
```bash
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ steghide info owl.jpg  
"owl.jpg":
  format: jpeg
  capacity: 8.2 KB
Try to get information about embedded data ? (y/n) y
Enter passphrase: 
steghide: could not extract any data with that passphrase!
```

### extract
```bash
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ steghide extract -sf owl.jpg  
Enter passphrase: 
steghide: could not extract any data with that passphrase!
```


## 說明
**`steghide`** 是在資訊安全與隱寫術（**steganography**）領域裡非常常見的一個工具。
下面我幫你完整拆解一下它是什麼、做什麼、怎麼用、實戰中要注意什麼。

---

### 🎯 一、`steghide` 是什麼？

> **steghide 是一個用來將資料「藏入」圖片或音訊檔中的隱寫工具。**

簡單講：

* 它不改變圖片外觀（人眼看不出差異），
* 但在圖片內部的像素或音訊樣本裡，**偷偷藏進另一個檔案或文字**。

常見用於：

* CTF（Capture The Flag）挑戰
* 數位鑑識
* 資安研究與滲透測試的資料隱藏題目

---

### 🧩 二、支援的檔案格式

`steghide` 能處理：

| 類型 | 常見格式                |
| ---- | ----------------------- |
| 圖片 | `.jpg`, `.jpeg`, `.bmp` |
| 音訊 | `.wav`, `.au`           |

> ❗ 它 **不支援 PNG** 或 GIF，因為 PNG 是壓縮格式，不利於藏資料。

---

### ⚙️ 三、基本原理簡介

`steghide` 使用一種叫 **least significant bit（LSB）隱寫法**：

* 將要藏的資料（例如文字、壓縮包）分解成二進位資料；
* 再把這些 bit 悄悄藏進圖片像素或音訊取樣的最低有效位；
* 這樣不會明顯改變檔案的視覺或聲音品質。

另外，它還會：

* 自動 **壓縮** 要藏的資料；
* 使用 **AES 加密**（需要密碼）保護內容；
* 可以驗證資料完整性。

---

### 🧠 四、常用指令範例

#### ✅ 1. 將檔案藏進圖片

```bash
steghide embed -cf image.jpg -ef secret.txt
```

參數說明：

* `-cf`：cover file（封面檔）
* `-ef`：embedded file（要藏的檔案）

執行後會要求你輸入密碼。
生成的新圖會直接覆蓋原圖（或提示你另存）。

---

#### ✅ 2. 指定輸出檔名

```bash
steghide embed -cf image.jpg -ef secret.txt -sf new_image.jpg
```

---

#### ✅ 3. 從圖片中取出檔案

```bash
steghide extract -sf image.jpg
```

執行後會要求你輸入密碼（若有設密碼）。

---

#### ✅ 4. 查看隱藏資訊（不取出）

```bash
steghide info image.jpg
```

範例輸出：

```
"image.jpg":
  format: jpeg
  capacity: 12.4 KB
  embedded file: yes
  encryption: aes-128-cbc
```

---

### 🧩 五、CTF 常見用法

在 TryHackMe、HackTheBox、CTF 題目中：
1️⃣ 看到一張「可疑的 JPG」→ 嘗試：

```bash
steghide info suspicious.jpg
steghide extract -sf suspicious.jpg
```

2️⃣ 沒密碼的話 → 嘗試常見字典爆破（例如 `stegseek`）：

```bash
stegseek suspicious.jpg rockyou.txt
```

3️⃣ 成功後會得到隱藏的檔案（例如 `flag.txt`）。

---

### ⚔️ 六、與其他隱寫工具比較

| 工具         | 功能特色                   | 常見用途           |
| ------------ | -------------------------- | ------------------ |
| **steghide** | 支援 JPG/WAV，具加密功能   | 最常見，操作簡單   |
| **stegseek** | steghide 的密碼爆破工具    | 破解 steghide 密碼 |
| **zsteg**    | 專攻 PNG/BMP，支援多層 LSB | 適合分析 PNG 題目  |
| **binwalk**  | 分析檔案結構、提取內嵌資料 | 檔案拆解           |
| **exiftool** | 查看檔案中 EXIF / Metadata | 查線索、藏訊息     |

---

### ✅ 總結

| 項目     | 說明                             |
| -------- | -------------------------------- |
| 工具名稱 | steghide                         |
| 工作用途 | 在圖片或音訊中藏入資料（或取出） |
| 支援格式 | JPEG、BMP、WAV、AU               |
| 常見參數 | `embed`, `extract`, `info`       |
| 密碼保護 | 支援 AES 加密                    |
| 常見對手 | `stegseek`（用於爆破密碼）       |

---

是否想讓我幫你做一個簡易的「steghide + stegseek」CTF 實戰範例？
我可以幫你寫出完整流程（從圖片拿 flag）。

