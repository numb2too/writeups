# Questioin
gubuster ffuf 哪個比較快 combined_directories.txt這個字典太大了 跑很久

# Ans

## 速度比較:

**ffuf 通常比 gobuster 快 2-3 倍**,因為它是用 Go 寫的且並發處理更高效。

## 快速掃描策略:

### 1. **使用小字典先快速掃描**
```bash
# 最快 - common.txt (約 4700 個條目)
ffuf -u http://10.10.103.215/FUZZ -w /usr/share/wordlists/dirb/common.txt

# 或
gobuster dir -u http://10.10.103.215 -w /usr/share/wordlists/dirb/common.txt

# SecLists 的小字典
ffuf -u http://10.10.103.215/FUZZ -w /usr/share/seclists/Discovery/Web-Content/raft-small-words.txt
```

### 2. **ffuf 優化參數** (推薦)
```bash
ffuf -u http://10.10.103.215/FUZZ \
     -w /usr/share/wordlists/dirbuster/directory-list-2.3-small.txt \
     -t 100 \          # 增加線程數 (預設 40)
     -mc 200,301,302 \ # 只顯示這些狀態碼
     -fs 0 \           # 過濾掉 0 字節的響應
     -ac               # 自動校準過濾器

# 超快速掃描
ffuf -u http://10.10.103.215/FUZZ \
     -w /usr/share/wordlists/dirb/common.txt \
     -t 200 \
     -mc all \
     -fc 404
```

### 3. **gobuster 優化參數**
```bash
gobuster dir -u http://10.10.103.215 \
     -w /usr/share/wordlists/dirb/common.txt \
     -t 50 \           # 增加線程數 (預設 10)
     -q \              # 安靜模式
     -n \              # 不解析 DNS
     -x php,html,txt   # 只測試特定擴展名
```

### 4. **分階段掃描策略**
```bash
# 階段 1: 超快速 (1-2 分鐘)
ffuf -u http://10.10.103.215/FUZZ -w /usr/share/wordlists/dirb/common.txt -t 150

# 階段 2: 如果沒找到,用中等字典 (5-10 分鐘)
ffuf -u http://10.10.103.215/FUZZ -w /usr/share/wordlists/dirbuster/directory-list-2.3-small.txt -t 100

# 階段 3: 只在必要時用大字典
# (通常 TryHackMe 不需要這步)
```

## 推薦字典大小:

| 字典 | 條目數 | 掃描時間 (估計) |
|------|--------|-----------------|
| dirb/common.txt | ~4.7K | 30秒-2分鐘 |
| raft-small-words.txt | ~43K | 2-5分鐘 |
| directory-list-2.3-small.txt | ~87K | 5-10分鐘 |
| directory-list-2.3-medium.txt | ~220K | 15-30分鐘 |
| combined_directories.txt | 可能 >1M | 很久... |

## 我的推薦命令:

```bash
# 最佳平衡 - 快速且有效
ffuf -u http://10.10.103.215/FUZZ \
     -w /usr/share/wordlists/dirb/common.txt \
     -t 150 \
     -mc 200,204,301,302,307,401,403 \
     -fc 404 \
     -c \
     -v

# 如果上面沒結果,試這個
ffuf -u http://10.10.103.215/FUZZ \
     -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt \
     -t 100 \
     -ac
```

## 其他快速替代方案:

```bash
# feroxbuster - 自動遞迴掃描
feroxbuster -u http://10.10.103.215 -w /usr/share/wordlists/dirb/common.txt -t 100

# dirsearch - 內建智能過濾
dirsearch -u http://10.10.103.215 -w /usr/share/wordlists/dirb/common.txt -t 50
```

**總結**: 用 **ffuf** + **common.txt** 先快速掃一遍,大多數 CTF 題目的目錄都在常見字典裡。只有在完全沒結果時才考慮更大的字典。