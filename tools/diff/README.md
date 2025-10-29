### 比較兩個檔案

先看一下檔案的差異

```bash
┌──(kali㉿kali)-[/usr/share/seclists/Discovery/Web-Content]
└─$ grep -n '13yo lolita rape and cryi'  /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt

┌──(kali㉿kali)-[/usr/share/seclists/Discovery/Web-Content]
└─$ grep -n '13yo lolita rape and cryi'  /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
126068:13yo lolita rape and crying with feet bound - bd sm bdsm torture slave bondage
```

逐行比較兩個檔案的內容差異，只顯示有不同的部分。

```bash
└─$ diff /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt  /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt

5,8c5,8
< # This work is licensed under the Creative Commons
< # Attribution-Share Alike 3.0 License. To view a copy of this
< # license, visit http://creativecommons.org/licenses/by-sa/3.0/
< # or send a letter to Creative Commons, 171 Second Street,
---
> # This work is licensed under the Creative Commons
> # Attribution-Share Alike 3.0 License. To view a copy of this
> # license, visit http://creativecommons.org/licenses/by-sa/3.0/
> # or send a letter to Creative Commons, 171 Second Street,
11,12c11,12
< # Priority ordered case-sensitive list, where entries were found
< # on at least 2 different hosts
---
> # Priority ordered case sensative list, where entries were found
> # on atleast 2 different hosts
4238c4238
< versions
---
> versions
68879c68879
< idf
---
> idf
126067a126068
> 13yo lolita rape and crying with feet bound - bd sm bdsm torture slave bondage
212204c212205
< t3838
---
> t3838
219911c219912
< t1446
---
> t1446
```

### `--strip-trailing-cr` 避免 Windows 換行符差異

```bash
└─$ diff --strip-trailing-cr /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt  /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
5,8c5,8
< # This work is licensed under the Creative Commons
< # Attribution-Share Alike 3.0 License. To view a copy of this
< # license, visit http://creativecommons.org/licenses/by-sa/3.0/
< # or send a letter to Creative Commons, 171 Second Street,
---
> # This work is licensed under the Creative Commons
> # Attribution-Share Alike 3.0 License. To view a copy of this
> # license, visit http://creativecommons.org/licenses/by-sa/3.0/
> # or send a letter to Creative Commons, 171 Second Street,
11,12c11,12
< # Priority ordered case-sensitive list, where entries were found
< # on at least 2 different hosts
---
> # Priority ordered case sensative list, where entries were found
> # on atleast 2 different hosts
126067a126068
> 13yo lolita rape and crying with feet bound - bd sm bdsm torture slave bondage

```

> └─$ diff --help | grep -- --strip-trailing-cr
> --strip-trailing-cr strip trailing carriage return > on input
> 輸入時去除尾隨回車符

### `-u` 比較前後三行

```bash
└─$ diff --strip-trailing-cr /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt  /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -u
--- /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt2025-04-25 22:03:33.000000000 +0800
+++ /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt        2009-02-27 18:00:56.000000000 +0800
@@ -2,14 +2,14 @@
 #
 # Copyright 2007 James Fisher
 #
-# This work is licensed under the Creative Commons
-# Attribution-Share Alike 3.0 License. To view a copy of this
-# license, visit http://creativecommons.org/licenses/by-sa/3.0/
-# or send a letter to Creative Commons, 171 Second Street,
+# This work is licensed under the Creative Commons
+# Attribution-Share Alike 3.0 License. To view a copy of this
+# license, visit http://creativecommons.org/licenses/by-sa/3.0/
+# or send a letter to Creative Commons, 171 Second Street,
 # Suite 300, San Francisco, California, 94105, USA.
 #
-# Priority ordered case-sensitive list, where entries were found
-# on at least 2 different hosts
+# Priority ordered case sensative list, where entries were found
+# on atleast 2 different hosts
 #

 index
@@ -126065,6 +126065,7 @@
 148518
 2-nw
 44349
+13yo lolita rape and crying with feet bound - bd sm bdsm torture slave bondage
 44337
 11957
 62143
```

> └─$ diff --help | grep -- -u  
>  -u, -U NUM, --unified[=NUM] output NUM (default 3) lines of unified context
