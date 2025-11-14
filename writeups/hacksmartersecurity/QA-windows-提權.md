
我來幫你整理 Windows 提權的手動確認步驟。這對滲透測試和安全審計很重要。

## Windows 提權手動確認步驟

### 1. **系統信息收集**
```cmd
systeminfo
systeminfo | findstr /B /C:"OS Name" /C:"OS Version" /C:"System Type"
hostname
echo %username%
```

### 2. **用戶權限檢查**
```cmd
whoami
whoami /priv
whoami /groups
net user %username%
net localgroup administrators
```

### 3. **網絡配置**
```cmd
ipconfig /all
route print
arp -a
netstat -ano
```

### 4. **尋找敏感文件**
```cmd
# 搜尋包含密碼的文件
dir /s *pass* == *cred* == *vnc* == *.config*
findstr /si password *.xml *.ini *.txt *.config

# 查看歷史命令
doskey /history
type %userprofile%\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadline\ConsoleHost_history.txt
```

### 5. **檢查計劃任務**
```cmd
schtasks /query /fo LIST /v
schtasks /query /fo LIST /v | findstr /B "Task To Run:"
```

### 6. **服務配置錯誤**
```cmd
# 列出所有服務
sc query
sc qc [服務名稱]

# 檢查服務權限
accesschk.exe -uwcqv "Authenticated Users" * /accepteula
```

### 7. **註冊表自動運行**
```cmd
reg query HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
reg query HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
reg query HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce
```

### 8. **可寫入的目錄和文件**
```cmd
# 檢查 PATH 環境變數中的可寫目錄
echo %PATH%

# 使用 icacls 檢查權限
icacls "C:\Program Files"
icacls "C:\Program Files (x86)"
```

### 9. **未打補丁的漏洞**
```cmd
wmic qfe list
systeminfo > systeminfo.txt
# 使用 Windows-Exploit-Suggester 離線分析
```

### 10. **AlwaysInstallElevated 檢查**
```cmd
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
```

### 11. **密碼和憑證**
```cmd
# 查找存儲的憑證
cmdkey /list
runas /savecred /user:admin cmd.exe

# SAM 和 SYSTEM 文件
reg save HKLM\SAM sam.save
reg save HKLM\SYSTEM system.save
```

### 12. **程序和進程**
```cmd
tasklist /v
wmic product get name,version
wmic process list brief
```

## 常見提權向量檢查清單

- [ ] 弱服務權限
- [ ] 未加引號的服務路徑
- [ ] DLL 劫持
- [ ] 計劃任務配置錯誤
- [ ] AlwaysInstallElevated
- [ ] 令牌模擬
- [ ] 內核漏洞
- [ ] 明文密碼
- [ ] 可寫入服務二進制文件

## 注意事項

⚠️ **重要提醒**:
- 這些步驟僅用於**授權的安全測試**
- 未經授權的系統訪問是違法的
- 在生產環境測試前務必獲得書面許可
- 建議在隔離的測試環境中練習

