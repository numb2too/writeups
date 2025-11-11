好的!你想破解 Lab 用戶的 NTLM hash。

Lab 用戶的 hash 是: `30...50`

## 破解方法:

### 方法 1: 使用 Hashcat

```bash
# 創建 hash 文件
echo "30...50" > lab_hash.txt

# 使用 rockyou.txt 字典破解
hashcat -m 1000 -a 0 lab_hash.txt /usr/share/wordlists/rockyou.txt

# 或直接在命令行
hashcat -m 1000 30...50 /usr/share/wordlists/rockyou.txt
```

### 方法 2: 使用 John the Ripper

```bash
# 創建文件格式: username:hash
echo "Lab:30...50" > lab_hash.txt

# 使用 john 破解
john --format=NT lab_hash.txt --wordlist=/usr/share/wordlists/rockyou.txt

# 查看結果
john --show --format=NT lab_hash.txt
```

### 方法 3: 線上破解

訪問這些網站:
- https://crackstation.net/
- https://hashes.com/en/decrypt/hash

直接貼上 hash: `30...50`

### 方法 4: 快速嘗試常見密碼

```bash
# 使用小字典快速測試
hashcat -m 1000 30...50 /usr/share/wordlists/fasttrack.txt
```

---

**提示**: 在 TryHackMe 的 Blueprint 房間中,這個密碼通常是一個常見且容易破解的密碼,應該在 rockyou.txt 字典中能很快找到。

破解後,密碼可能用於:
- SSH/RDP 登入
- 回答 TryHackMe 的問題
- 橫向移動到其他服務

你成功破解了嗎?需要其他幫助嗎?