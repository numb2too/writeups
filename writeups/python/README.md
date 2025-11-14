# python
## 使用範例
### 開啟 http.server 
```bash
python3 -m http.server 1234
```

### 升級 shell
```bash
python3 -c 'import pty; pty.spawn("/bin/bash")'

# CTRL+Z

stty raw -echo; fg

export TERM=xter
```

### 創建 venv
```bash
# 創建虛擬環境
python3 -m venv venv

# 啟動虛擬環境
source venv/bin/activate

# 現在安裝 軟體
pip install tensorflow

# 運行你的腳本
python3 r_shell.py 

# 完成後，退出虛擬環境
deactivate
```