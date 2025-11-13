# feroxbuster
可遞迴掃描

## 使用範例
掃描 dir，Threads 100次掃描，過濾404
```bash
feroxbuster -u http://owl.thm -w ~/wordlists/directories.txt -t 100 -C 404 
```