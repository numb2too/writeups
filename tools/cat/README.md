### 合併兩個字典檔 且不重複

```bash
# 創建你自己的優化字典
cat /usr/share/wordlists/dirb/common.txt \
    /usr/share/seclists/Discovery/Web-Content/raft-medium-words.txt \
    | sort -u > ~/wordlists/my-web-medium.txt

# 這樣結合了:
# - common.txt 的常見目錄
# - raft 的滲透測試覆蓋
```

```bash
┌──(kali㉿kali)-[/usr/share/seclists/Discovery/Web-Content]
└─$ mkdir ~/wordlists                         
                                                                            
┌──(kali㉿kali)-[/usr/share/seclists/Discovery/Web-Content]
└─$ cat /usr/share/wordlists/dirb/common.txt \
    /usr/share/seclists/Discovery/Web-Content/raft-medium-words.txt \
    | sort -u > ~/wordlists/my-web-medium.txt
                                                                            
┌──(kali㉿kali)-[/usr/share/seclists/Discovery/Web-Content]
└─$ wc ~/wordlists/my-web-medium.txt 
 63745  63748 530811 /home/kali/wordlists/my-web-medium.txt
                                                                            
┌──(kali㉿kali)-[/usr/share/seclists/Discovery/Web-Content]
└─$ wc /usr/share/wordlists/dirb/common.txt
 4614  4617 35849 /usr/share/wordlists/dirb/common.txt
                                                             
┌──(kali㉿kali)-[/usr/share/seclists/Discovery/Web-Content]
└─$ wc /usr/share/seclists/Discovery/Web-Content/raft-medium-words.txt
 63088  63088 524649 /usr/share/seclists/Discovery/Web-Content/raft-medium-words.txt

```
> └─$ sort --help | grep -- -u                    
  -u, --unique              output only the first of lines with equal keys;
> 去除重複的單字