# binwalk
用來分析與從二進位檔（尤其是韌體映像）中尋找／提取內嵌檔案與程式碼

## 使用範例

### 尋找隱藏文件
```bash
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ binwalk owl.jpg              

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             JPEG image data, JFIF standard 1.01
61420         0xEFEC          JBOOT STAG header, image id: 0, timestamp 0x3308AA3F, image size: 1020261372 bytes, image JBOOT checksum: 0xD0F0, header JBOOT checksum: 0x8910
```

```bash                                                                         
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ binwalk -e owl.jpg           

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------

WARNING: One or more files failed to extract: either no utility was found or it's unimplemented
```

## 說明 

好 — 我用簡短清楚的方式說明 **`binwalk`**（以及實務上常用的指令與注意事項），方便你在 CTF、韌體逆向或硬體駭客時快速上手。

---

### 🔎 `binwalk` 是什麼？

`binwalk` 是一款 **用來分析與從二進位檔（尤其是韌體映像）中尋找／提取內嵌檔案與程式碼** 的命令列工具。它以 libmagic（跟 `file` 指令相同的簽章機制）進行簽章掃描，並支援自動 carve（切割）與解壓、遞迴解析等功能。([GitHub][1])

---

### ⚙️ 主要功能（重點）

* **簽章掃描**：找出檔案內可辨識的檔案簽章（JPEG、gzip、squashfs、UBI、etc.）。([Kali Linux][2])
* **自動提取 / 檔案切割（carving）**：`-e` 會自動提取已辨識的內嵌檔案。([CSDN][3])
* **遞迴掃描（Matryoshka）**：`-M` 可對提取出的檔案再做二次掃描、再提取（像套娃）。([CSDN][3])
* **自定義提取規則（--dd / -D）**：用 regex 指定要切出的簽章類型（例如全部或只 JPG/PNG…）。([Stack Overflow][4])
* **熵分析（找加密/壓縮區段）**：`-E` 可計算並畫出熵圖，協助判斷哪些區段為壓縮或加密資料。([Kali Linux][2])
* **opcode / 可執行碼掃描**（找 shellcode / 程式碼片段）。([mrking00.github.io][5])

另外，社群最近也有新進展（binwalk v3 / Rust 版），改善速度與準確度。([GitHub][1])

---

### 🧭 常用指令範例

```bash
# 基本掃描（列出發現）
binwalk firmware.bin

# 自動提取已知檔案（會建立 firmware.bin.extracted/ 目錄）
binwalk -e firmware.bin

# 遞迴提取（matryoshka）
binwalk -eM firmware.bin
# 或：binwalk --extract --matryoshka firmware.bin

# 用正則全部提取（較激進，會 carve 所有偵測到的簽章）
binwalk --dd='.*' firmware.bin
# 或：binwalk -D '.*' firmware.bin

# 熵分析（並顯示圖）
binwalk -E firmware.bin
# 快速模式（較快但精細度較低）
binwalk -F firmware.bin

# 尋找常見執行碼／opcode（偵測殘存的 shellcode/executable signatures）
binwalk -A firmware.bin
```

（提取後的檔案預設會放在 `<target>.extracted/` ）([CSDN][3])

---

### ✅ 常見實務流程（解析韌體時）

1. `file firmware.bin`、`binwalk firmware.bin`（先看簽章與結構）。
2. `binwalk -E firmware.bin`（看熵圖，判斷是否有壓縮/加密分區）。([Kali Linux][2])
3. `binwalk -eM firmware.bin`（自動提取並遞迴搜尋）。
4. 檢查提取出的檔案：`strings`、`file`、嘗試 mount（若有 filesystem image 如 squashfs/yaffs），或手動 `dd` 抽取 offset。
5. 若有密碼保護或看起來像加密，改用手動分析（拆分 partition、找 key、分析證書等）。

---

### ⚠️ 注意事項與限制

* **偵測會有誤報或邊界錯誤**：carved 檔案大小／邊界不一定精準，必要時須手動用 `dd` 對 offset 做精確切割。([GitHub][6])
* **不是萬能**：對於高度自訂的容器或非標準格式，binwalk 可能偵測不到或提取失敗，還是要搭配 `strings`、`hexdump`、手動逆向。
* **注意版本**：不同發行版或 binwalk 版本（包含新的 Rust 版 binwalk3）在效能與支援上有所差異，必要時更新或換用新版。([GitHub][1])

---
### 參考
[1]: https://github.com/ReFirmLabs/binwalk?utm_source=chatgpt.com "ReFirmLabs/binwalk: Firmware Analysis Tool"
[2]: https://www.kali.org/tools/binwalk/?utm_source=chatgpt.com "binwalk | Kali Linux Tools"
[3]: https://blog.csdn.net/wxh0000mm/article/details/85683661?utm_source=chatgpt.com "Binwalk工具的详细使用说明转载"
[4]: https://stackoverflow.com/questions/36530643/use-binwalk-to-extract-all-files?utm_source=chatgpt.com "linux - Use binwalk to extract all files"
[5]: https://mrking00.github.io/2020/09/29/binwalk%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95/?utm_source=chatgpt.com "binwalk工具的使用帮助- Mr_king的博客"
[6]: https://github.com/ReFirmLabs/binwalk/issues/153?utm_source=chatgpt.com "Carved files are often equal in size to the original file #153"
