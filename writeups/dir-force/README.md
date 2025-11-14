# 📁 解釋 `dir` vs `dir -Force` 的差異

## 🔍 為什麼會這樣?

### **Documents 資料夾的特殊情況**

注意看 `dir -Force` 的輸出:
```powershell
Mode                LastWriteTime         Length Name
----                -------------         ------ ----
d--hsl        9/18/2020   2:14 AM                My Music
d--hsl        9/18/2020   2:14 AM                My Pictures
d--hsl        9/18/2020   2:14 AM                My Videos
-a-hs-        9/18/2020   2:14 AM            402 desktop.ini
```

關鍵在 **Mode** 欄位:
- `d--hsl` - 目錄 + **隱藏 (h)** + **系統 (s)** + **符號連結 (l)**
- `-a-hs-` - 檔案 + **隱藏 (h)** + **系統 (s)**

## 📊 Mode 屬性解釋

| 字元 | 意義                     |
| ---- | ------------------------ |
| `d`  | Directory (目錄)         |
| `a`  | Archive (封存)           |
| `r`  | Read-only (唯讀)         |
| `h`  | **Hidden (隱藏)** ⭐      |
| `s`  | **System (系統)** ⭐      |
| `l`  | Symbolic Link (符號連結) |

## 💡 為什麼 `dir` 看不到?

**預設情況下,`dir` (Get-ChildItem) 會隱藏:**
1. **隱藏檔案/資料夾** (Hidden attribute)
2. **系統檔案/資料夾** (System attribute)

而 `Documents` 裡的所有項目都有 `h` 和 `s` 屬性!

## 🔧 解決方法

### **方法 1: 使用 `-Force` (推薦)**
```powershell
dir -Force
# 或完整寫法
Get-ChildItem -Force
```

`-Force` 參數會顯示:
- 隱藏檔案
- 系統檔案
- 所有其他被隱藏的項目

### **方法 2: 使用 `-Hidden` 和 `-System`**
```powershell
dir -Hidden
dir -System
dir -Hidden -System
```

### **方法 3: 使用屬性過濾**
```powershell
# 顯示所有項目,包括隱藏和系統
Get-ChildItem -Attributes Hidden,System
```

## 🤔 為什麼其他目錄正常?

看你的 `C:\Users\Jareth` 輸出:
```powershell
Mode                LastWriteTime         Length Name
----                -------------         ------ ----
d-r---        9/18/2020   2:14 AM                Desktop
d-r---        9/18/2020   2:14 AM                Documents
```

注意 Mode: `d-r---`
- ✅ 只有 `d` (目錄) 和 `r` (唯讀)
- ❌ **沒有** `h` (隱藏) 或 `s` (系統)

所以 `dir` 可以正常顯示這些資料夾!

## 📝 常見情況

### **1. Desktop 也可能有隱藏檔案**
```powershell
*Evil-WinRM* PS C:\Users\Jareth\Desktop> dir
# 可能看不到 flag!

*Evil-WinRM* PS C:\Users\Jareth\Desktop> dir -Force
# 現在能看到隱藏的 flag 了!
```

### **2. 系統重要檔案通常被隱藏**
```powershell
# C:\ 根目錄
dir C:\ 
# 看不到 pagefile.sys, hiberfil.sys

dir C:\ -Force
# 現在都看到了!
```

### **3. 檢查檔案屬性**
```powershell
# 查看檔案屬性
Get-ItemProperty "C:\Users\Jareth\Documents\desktop.ini" | Select-Object Attributes

# 顯示所有屬性
attrib "C:\Users\Jareth\Documents\desktop.ini"
```

## 🎯 在 CTF 中的重要性

**很多 CTF 會把 flag 藏在隱藏檔案裡!**

```powershell
# 錯誤做法
dir C:\Users\Jareth\Desktop
# 看不到 flag.txt

# 正確做法
dir C:\Users\Jareth\Desktop -Force
# 找到了! user.txt (隱藏屬性)
```

## 🔍 實用技巧

### **快速搜尋所有隱藏檔案**
```powershell
# 搜尋桌面的隱藏檔案
Get-ChildItem C:\Users\Jareth\Desktop -Force -File

# 遞迴搜尋所有隱藏的 txt 檔案
Get-ChildItem C:\Users\Jareth -Recurse -Force -Include *.txt -ErrorAction SilentlyContinue

# 搜尋包含 "flag" 或 "user" 的隱藏檔案
Get-ChildItem C:\Users\Jareth -Recurse -Force | Where-Object {$_.Name -match "flag|user|root"}
```

### **顯示檔案屬性**
```powershell
# 查看某個檔案的詳細屬性
Get-Item "C:\Users\Jareth\Documents\desktop.ini" -Force | Format-List *

# 使用 attrib 命令 (更簡潔)
attrib "C:\Users\Jareth\Documents\*.*"
```

### **修改檔案屬性 (如果需要)**
```powershell
# 移除隱藏和系統屬性
attrib -h -s "C:\Users\Jareth\Documents\My Music"

# 或使用 PowerShell
Set-ItemProperty "C:\Users\Jareth\Documents\My Music" -Name Attributes -Value Normal
```

## 📚 PowerShell 別名

```powershell
dir = Get-ChildItem
ls = Get-ChildItem
gci = Get-ChildItem

# 所以這些都一樣:
dir -Force
ls -Force
Get-ChildItem -Force
gci -Force
```

## 🎯 你現在應該做

```powershell
# 1. 檢查 Desktop (最重要!)
dir C:\Users\Jareth\Desktop -Force

# 2. 搜尋 flag
Get-ChildItem C:\Users\Jareth -Recurse -Force -Include user.txt,flag.txt -ErrorAction SilentlyContinue

# 3. 檢查常見位置
dir C:\Users\Jareth\Desktop -Force
dir C:\Users\Jareth\Documents -Force
dir C:\Users\Jareth\Downloads -Force

# 4. 搜尋所有 txt 檔案
Get-ChildItem C:\Users\Jareth -Recurse -Force -Include *.txt -ErrorAction SilentlyContinue
```

---

## 📝 總結

- **`dir`** = 只顯示正常檔案
- **`dir -Force`** = 顯示**所有**檔案 (包括隱藏和系統)
- **Documents 資料夾特殊** = 裡面的項目有隱藏+系統屬性
- **CTF 常用技巧** = flag 可能被隱藏,永遠用 `-Force`!

**記住: 在 CTF 中,永遠用 `dir -Force`!** 🎯