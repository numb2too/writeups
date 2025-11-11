一個用於與 SMB/CIFS（Windows 網路共享） 服務互動的命令行工具，簡單來說就是可以在 Linux 或其他 Unix 系統上存取 Windows 或 Samba 共享的檔案。

```bash
┌──(kali㉿kali)-[~/tryhackme/blueprint]
└─$ smbclient -L \\\\blueprint.thm -N  

        Sharename       Type      Comment
        ---------       ----      -------
        ADMIN$          Disk      Remote Admin
        C$              Disk      Default share
        IPC$            IPC       Remote IPC
        Users           Disk      
        Windows         Disk      
Reconnecting with SMB1 for workgroup listing.
do_connect: Connection to blueprint.thm failed (Error NT_STATUS_RESOURCE_NAME_NOT_FOUND)
Unable to connect with SMB1 -- no workgroup available

```

```bash
```bash
┌──(kali㉿kali)-[~/tryhackme/blueprint]
└─$ smbclient \\\\blueprint.thm\\Users -N         
Try "help" to get a list of possible commands.
smb: \> dir
  .                                  DR        0  Fri Apr 12 06:36:40 2019
  ..                                 DR        0  Fri Apr 12 06:36:40 2019
  Default                           DHR        0  Tue Jul 14 15:17:20 2009

                7863807 blocks of size 4096. 4762008 blocks available
```