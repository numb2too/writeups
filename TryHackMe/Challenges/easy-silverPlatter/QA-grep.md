### 找相關字串的檔案

- 找此目錄下檔案內容包含 `weblib` 字眼的檔案，子目錄下也搜尋

```bash
└─$ grep -R -I 'weblib' . 2>/dev/null
./directory-list-1.0.txt:weblibs
./directory-list-2.3-big.txt:weblibs
./raft-large-words.txt:weblib
./raft-medium-directories-lowercase.txt:weblib
./raft-medium-words.txt:weblib
./raft-large-words-lowercase.txt:weblib
./directory-list-lowercase-2.3-big.txt:pyweblib
./directory-list-lowercase-2.3-big.txt:weblibs
./raft-medium-words-lowercase.txt:weblib
./raft-large-directories-lowercase.txt:weblib
./combined_directories.txt:weblib
./combined_directories.txt:weblibs
./combined_words.txt:weblib
./raft-large-directories.txt:weblib
```

> `-I`, equivalent to --binary-files=without-match  
> 忽略二進位檔案  
> `-R`, --dereference-recursive likewise, but follow all symlinks  
> 遞迴搜尋 (recursive)。會往下走目錄樹搜尋子目錄

- 只掃描這一層
```bash
grep -I 'robot' ./* 2>/dev/null
```

- 同時包含 robots.txt, weblib, admin     
```bash                    
┌──(kali㉿kali)-[/usr/share/seclists/Discovery/Web-Content]
└─$ grep -l 'robots.txt' ./* 2>/dev/null | xargs grep -l 'weblib' | xargs grep -l 'admin'
./combined_directories.txt
./combined_words.txt
./directory-list-1.0.txt
./directory-list-2.3-big.txt
./directory-list-lowercase-2.3-big.txt
```
 > -w, --word-regexp         match only whole words  
 > 只匹配完整單字  
 > -n, --line-number         print line number with output lines  
 > 顯示行數


### cat | grep 跟 grep -n 差異
```bash
└─$ grep -n t1446 /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt

219901:t14460
219911:t1446
                                                                            
┌──(kali㉿kali)-[/usr/share/seclists/Discovery/Web-Content]
└─$ cat /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt | grep t1446 
t14460
t1446
```