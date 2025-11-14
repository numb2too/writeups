啊哈！問題找到了！關鍵在這裡：

```
WARNING! 336 bare linefeeds received in ASCII mode.
File may not have transferred correctly.
```

## 問題根源

你用 **ASCII 模式**下載了二進制文件（PNG），導致文件被破壞了！

ASCII 模式會轉換換行符：
- Windows: `\r\n` (0D 0A)
- Unix: `\n` (0A)

這就是為什麼你的 PNG 文件頭從 `0D 0A` 變成了 `0A`！

## 解決方法

**在 FTP 中切換到 binary 模式：**

```bash
ftp> binary    # 或 bin
200 Type set to I.

ftp> get stolen-passport.png
```

## 完整操作流程

```bash
# 重新連接 FTP
ftp [target]
# 登入...

# 切換到 binary 模式
ftp> binary
200 Type set to I.

# 刪除舊的損壞文件
ftp> !rm stolen-passport.png

# 重新下載
ftp> get stolen-passport.png
local: stolen-passport.png remote: stolen-passport.png
229 Entering Extended Passive Mode (|||xxxxx|)
150 Opening BINARY mode data connection.
226 Transfer complete.
1022126 bytes received in x.xx secs

# 確認下載成功
ftp> !file stolen-passport.png
stolen-passport.png: PNG image data, 807 x 557, 8-bit/color RGBA, non-interlaced

ftp> bye
```

## 驗證

下載後檢查：
```bash
file stolen-passport.png        # 應該顯示 PNG image data
md5sum stolen-passport.png      # 記錄 hash 值
exiftool stolen-passport.png    # 應該能正常讀取
```

**重點：FTP 傳輸二進制文件時一定要用 `binary` 模式！** 📦

重新下載後應該就正常了！

有幾種方法可以確認當前的傳輸模式：

## 方法 1：使用 status 命令（最可靠）

```bash
ftp> status
Connected to [IP address].
Type: binary; Verbose: on; Bell: off; Prompting: on; Globbing: on
...
```

看 `Type:` 那一行：
- `Type: binary` 或 `Type: I` = Binary 模式 ✅
- `Type: ascii` 或 `Type: A` = ASCII 模式 ⚠️

## 方法 2：切換模式時看回應

```bash
ftp> ascii
200 Type set to A.    # A = ASCII

ftp> binary
200 Type set to I.    # I = Image (Binary)
```

## 方法 3：使用 type 命令（某些 FTP 客戶端）

```bash
ftp> type
Using binary mode to transfer files.
```

## 快速參考

```bash
# 查看當前狀態
ftp> status

# 切換到 binary 模式
ftp> binary
ftp> bin        # 簡寫

# 切換到 ASCII 模式  
ftp> ascii
ftp> asc        # 簡寫
```

## 最佳實踐

在下載任何非文字檔案前，養成習慣：
```bash
ftp> binary     # 先切換
ftp> status     # 確認
ftp> get file   # 下載
```

你現在應該已經在 binary 模式了（因為看到 `Type set to I`），可以安全下載 PNG 了！🎯