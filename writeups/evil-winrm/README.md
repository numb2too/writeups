# evil-winrm

## 使用範例
### 登入
```bash
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ evil-winrm -i owl.thm -u Jareth
Enter Password: 
                                        
Evil-WinRM shell v3.7
                                        
Warning: Remote path completions is disabled due to ruby limitation: undefined method `quoting_detection_proc' for module Reline                        
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion                                   
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\Jareth\Documents>
```
     
### 衍伸工具
可用 jaws-enum.ps1 找 $Recycle.Bin 找 sam
