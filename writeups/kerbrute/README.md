# kerbrute
一個用於對 Kerberos 進行暴力破解和枚舉的工具,主要用於 Active Directory 環境的滲透測試。

## 安裝

```bash
# 安裝 Go
sudo apt update
sudo apt install golang-go -y

# 設定 Go 環境變數
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin

# 安裝 Kerbrute
go install github.com/ropnop/kerbrute@latest

# 複製到系統路徑
sudo cp ~/go/bin/kerbrute /usr/local/bin/

# 測試
kerbrute version
```


## 說明

### Kerbrute 簡介

**Kerbrute** 是一個用於對 Kerberos 進行暴力破解和枚舉的工具,主要用於 Active Directory 環境的滲透測試。它的主要優勢是:

- **速度快**:使用 Go 語言編寫,支援多線程
- **隱蔽性好**:透過 Kerberos pre-authentication 進行枚舉,不會觸發帳號鎖定
- **無需密碼**:可以只用用戶名進行枚舉,驗證帳號是否存在

#### 主要功能

1. **userenum** - 枚舉有效的域用戶名
2. **passwordspray** - 密碼噴灑攻擊
3. **bruteuser** - 針對單一用戶的暴力破解
4. **bruteforce** - 完整的用戶名/密碼組合暴力破解
