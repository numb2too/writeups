一個用於與 SMB/CIFS（Windows 網路共享） 服務互動的命令行工具，簡單來說就是可以在 Linux 或其他 Unix 系統上存取 Windows 或 Samba 共享的檔案。

## show Sharename list
```bash
┌──(kali㉿kali)-[~/tryhackme/blueprint]
└─$ smbclient -L \\\\blueprint.thm -N  

        Sharename       Type      Comment
        ---------       ----      -------
        ADMIN$          Disk      Remote Admin
        C$              Disk      Default share
        IPC$            IPC       Remote IPC
        Users           Disk      
        Windows         Disk      
Reconnecting with SMB1 for workgroup listing.
do_connect: Connection to blueprint.thm failed (Error NT_STATUS_RESOURCE_NAME_NOT_FOUND)
Unable to connect with SMB1 -- no workgroup available

```

## login smbclient
```bash
┌──(kali㉿kali)-[~/tryhackme/blueprint]
└─$ smbclient \\\\blueprint.thm\\Users -N         
Try "help" to get a list of possible commands.
smb: \> dir
  .                                  DR        0  Fri Apr 12 06:36:40 2019
  ..                                 DR        0  Fri Apr 12 06:36:40 2019
  Default                           DHR        0  Tue Jul 14 15:17:20 2009

                7863807 blocks of size 4096. 4762008 blocks available
```




## **在 smbclient 裡遞迴地下載整個目錄（含子目錄）且不逐一確認**，最後把所有符合通配符的檔案抓下來。

### 逐行解釋：

* `recurse ON`
  把遞迴模式打開。預設 `smbclient` 在處理 `mget` / `mput` 時 *不會* 進入子目錄，開了 `recurse` 後，`mget *` 會遞迴走訪子目錄並下載裡面的檔案（相當於 `rsync -r` 或 `cp -r`）。
* `prompt OFF`
  關掉每個檔案都詢問是否要下載的互動提示。預設 `mget` 會在每個檔案前問 `Get file <name>? (Y/N)`，把 prompt 關掉後會自動對所有檔案回答「是」，方便批次作業。
* `mget *`
  用 `mget`（multiple get）搭配通配符 `*` 下載所有符合條件的檔案／路徑（在 `recurse ON` 時會包含子目錄裡的檔）。和 `get`（單檔）不同：`get` 只能抓一個檔案，`mget` 能抓多個。

### 實務範例（互動式）：

```
smbclient //10.10.66.36/Users -U root
Password: ********
smb: \> lcd /root/downloads            # 設定本地儲存目錄
smb: \> cd some/remote/path            # 遠端目錄（選擇性）
smb: \> recurse ON
smb: \> prompt OFF
smb: \> mget *
```

非互動（一次執行完）：

```
smbclient //10.10.66.36/Users -U root -c "lcd /root/downloads; cd some/remote/path; recurse ON; prompt OFF; mget *"
```

額外提醒：

* 小心權限與空間：一次拉整個 share 可能會佔很多空間或牽涉到敏感資料。
* 若只想抓單一子目錄或範圍，用 `cd` 到該遠端目錄再 `mget`，或用更精準的通配符（例如 `*.txt`）。
* 可以考慮 `smbget`、`mount -t cifs` 或用 `rsync`（若支援）做更強的同步／保留權限等功能。


## `get` 和 `mget` 在 `smbclient` 裡的主要差異

| 指令   | 功能             | 範例                     | 備註                                                             |
| ------ | ---------------- | ------------------------ | ---------------------------------------------------------------- |
| `get`  | 下載「單一檔案」 | `get secret.txt`         | 一次只能抓一個檔案                                               |
| `mget` | 下載「多個檔案」 | `mget *.txt` 或 `mget *` | 可用萬用字元（`*`, `?`），可搭配 `recurse ON` 遞迴下載整個資料夾 |

---

### 🔍 詳細解釋：

* **`get`**
  用法：`get <遠端檔名> [本地檔名]`
  → 下載指定的單一檔案。
  例：

  ```
  smb: \> get password.txt
  getting file \password.txt of size 2048 as password.txt (2.0 KiloBytes/sec)
  ```

  若你只想抓某個特定檔案，`get` 是最直接的。

---

* **`mget`**
  用法：`mget <檔案清單>`
  → 一次下載多個檔案，可使用萬用字元。
  例：

  ```
  smb: \> mget *.docx
  ```

  預設會每個檔案詢問是否下載（`Get file <name>? (Y/N)`），
  所以通常會先：

  ```
  smb: \> prompt OFF
  ```

  關掉詢問，再搭配：

  ```
  smb: \> recurse ON
  ```

  讓它能遞迴進子目錄，一口氣抓完整個 share。

---

### 🚀 總結對比

| 功能                | get      | mget                        |
| ------------------- | -------- | --------------------------- |
| 下載檔案數          | 單一檔案 | 多個檔案                    |
| 支援萬用字元        | ❌        | ✅                           |
| 可搭配 `recurse ON` | ❌        | ✅（可遞迴整個目錄）         |
| 預設會問是否下載    | ❌        | ✅（可用 `prompt OFF` 關掉） |


