# nmap

## 使用範例
### 詳細說明可參考
```bash
man nmap 
```

### 顯示版本，腳本，掃描過程
```bash
nmap -sV -sC -v owl.thm 
```

### 不要 ping
```bash
nmap -sV -sC -v -Pn owl.thm 
```

### 掃全部的 port，顯示掃描過程，加速
```bash
nmap -p- -v 10.10.103.215 -T4
```