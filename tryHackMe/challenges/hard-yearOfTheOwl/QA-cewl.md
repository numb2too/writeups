# 🔧 建立電影相關字典檔的方法

## 方法 1: 使用 CeWL (推薦!)

**CeWL** 是專門從網頁爬取字詞建立字典的工具:

```bash
# 基本用法
cewl http://example.com -w wordlist.txt

# 針對 Labyrinth 電影的 IMDb 頁面
cewl https://www.imdb.com/title/tt0091369/ -d 2 -m 5 -w labyrinth_imdb.txt

# 從 Wikipedia 爬取
cewl https://en.wikipedia.org/wiki/Labyrinth_(1986_film) -d 2 -m 4 -w labyrinth_wiki.txt

# 進階選項
cewl https://www.imdb.com/title/tt0091369/ \
  -d 3 \              # 爬取深度 3 層
  -m 4 \              # 最小字長 4
  -w labyrinth.txt \  # 輸出檔案
  --lowercase \       # 全部小寫
  --with-numbers      # 包含數字
```

### **CeWL 參數說明:**
- `-d` : 爬取深度 (預設 2)
- `-m` : 最小字長 (預設 3)
- `-w` : 輸出檔案
- `--lowercase` : 轉小寫
- `--uppercase` : 轉大寫
- `--with-numbers` : 包含數字

## 方法 2: 手動建立電影相關字典

```bash
# 建立基礎字典
cat > labyrinth_base.txt << 'EOF'
jareth
labyrinth
goblin
sarah
hoggle
ludo
didymus
bowie
davidbowie
owl
king
goblinKing
maze
crystal
ball
ballroom
dance
magic
wish
baby
toby
bog
stench
EOF

# 加入年份和變體
cat >> labyrinth_base.txt << 'EOF'
1986
86
yearoftheowl
YearOfTheOwl
astheworldfallsdown
youremindme
EOF
```

## 方法 3: 使用 Python 爬蟲

```python
#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
import re

def scrape_labyrinth_words(url):
    """從網頁爬取 Labyrinth 相關字詞"""
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # 提取所有文字
        text = soup.get_text()
        
        # 提取單字 (至少 4 個字母)
        words = re.findall(r'\b[a-zA-Z]{4,}\b', text)
        
        # 去重並排序
        unique_words = sorted(set(words), key=str.lower)
        
        return unique_words
    
    except Exception as e:
        print(f"錯誤: {e}")
        return []

# 使用範例
urls = [
    'https://en.wikipedia.org/wiki/Labyrinth_(1986_film)',
    'https://labyrinth.fandom.com/wiki/Labyrinth_Wiki',
]

all_words = []
for url in urls:
    print(f"爬取: {url}")
    words = scrape_labyrinth_words(url)
    all_words.extend(words)

# 儲存到檔案
with open('labyrinth_scraped.txt', 'w') as f:
    for word in sorted(set(all_words), key=str.lower):
        f.write(word + '\n')

print(f"已儲存 {len(set(all_words))} 個字詞")
```

儲存為 `scraper.py` 然後執行:
```bash
python3 scraper.py
```

## 方法 4: 使用現有工具組合

```bash
# 1. 用 CeWL 爬取多個來源
cewl https://en.wikipedia.org/wiki/Labyrinth_(1986_film) -d 2 -m 4 -w wiki.txt
cewl https://www.imdb.com/title/tt0091369/ -d 2 -m 4 -w imdb.txt
cewl https://labyrinth.fandom.com/wiki/Labyrinth_Wiki -d 2 -m 4 -w fandom.txt

# 2. 合併去重
cat wiki.txt imdb.txt fandom.txt | sort -u > labyrinth_combined.txt

# 3. 使用 John the Ripper 的規則產生變體
john --wordlist=labyrinth_combined.txt --rules --stdout > labyrinth_mutated.txt

# 4. 或使用 hashcat 規則
hashcat --stdout labyrinth_combined.txt -r /usr/share/hashcat/rules/best64.rule > labyrinth_hashcat.txt
```

## 方法 5: 快速建立完整字典 (一鍵腳本)

```bash
#!/bin/bash
# 儲存為 build_labyrinth_wordlist.sh

echo "[+] 建立 Labyrinth 字典檔..."

# 基礎字詞
cat > labyrinth_full.txt << 'EOF'
jareth
Jareth
JARETH
labyrinth
Labyrinth
LABYRINTH
goblin
Goblin
sarah
Sarah
owl
Owl
king
King
bowie
Bowie
david
David
1986
EOF

# 使用 CeWL 爬取 (如果有安裝)
if command -v cewl &> /dev/null; then
    echo "[+] 使用 CeWL 爬取網頁..."
    cewl https://en.wikipedia.org/wiki/Labyrinth_(1986_film) -d 2 -m 4 -w temp_wiki.txt 2>/dev/null
    cat temp_wiki.txt >> labyrinth_full.txt
    rm temp_wiki.txt
fi

# 加入常見變體
cat >> labyrinth_full.txt << 'EOF'
jareth123
Jareth123
labyrinth123
Labyrinth123
jareth1986
Jareth1986
goblinKing
GoblinKing
yearoftheowl
YearOfTheOwl
owl2021
Owl2021
EOF

# 去重排序
sort -u labyrinth_full.txt -o labyrinth_full.txt

echo "[+] 完成! 字典檔: labyrinth_full.txt"
wc -l labyrinth_full.txt
```

執行:
```bash
chmod +x build_labyrinth_wordlist.sh
./build_labyrinth_wordlist.sh
```

## 方法 6: 使用 Mentalist (GUI 工具)

```bash
# 安裝 Mentalist
sudo apt install mentalist

# 或從 GitHub
git clone https://github.com/sc0tfree/mentalist.git
cd mentalist
python3 mentalist.py
```

Mentalist 可以用 GUI 介面建立複雜的字典規則。

## 🎯 實戰組合技

```bash
# 1. 快速建立基礎字典
cat > quick.txt << 'EOF'
jareth
labyrinth
owl
goblin
1986
EOF

# 2. 加入大小寫變體
cat quick.txt | awk '{print tolower($0); print toupper(substr($0,1,1)) tolower(substr($0,2))}' > quick_mutated.txt

# 3. 加入常見後綴
for word in $(cat quick.txt); do
    echo "${word}"
    echo "${word}123"
    echo "${word}1986"
    echo "${word}!"
    echo "${word}@"
done >> quick_mutated.txt

# 4. 去重
sort -u quick_mutated.txt -o labyrinth_quick.txt

# 5. 測試
hydra -l Jareth -P labyrinth_quick.txt rdp://owl.thm -t 4
```

## 📚 推薦的字典來源

```bash
# 電影相關網站
- https://en.wikipedia.org/wiki/Labyrinth_(1986_film)
- https://www.imdb.com/title/tt0091369/
- https://labyrinth.fandom.com/wiki/Labyrinth_Wiki
- https://muppet.fandom.com/wiki/Labyrinth

# 使用 CeWL 一次爬取
for url in \
  "https://en.wikipedia.org/wiki/Labyrinth_(1986_film)" \
  "https://labyrinth.fandom.com/wiki/Labyrinth_Wiki"; do
  echo "Scraping $url"
  cewl "$url" -d 2 -m 4 >> labyrinth_scraped.txt
done

sort -u labyrinth_scraped.txt -o labyrinth_final.txt
```

## ⚡ 最快速方法 (立即可用)

```bash
# 直接建立測試用字典
cat > test.txt << 'EOF'
jareth
Jareth
labyrinth
Labyrinth
owl
Owl
goblin
Goblin
1986
GoblinKing
yearoftheowl
YearOfTheOwl
EOF

# 立即測試
evil-winrm -i owl.thm -u Jareth -P test.txt
```

---

**推薦順序:**
1. **CeWL** - 最簡單快速
2. **手動建立** - 針對性強
3. **Python 爬蟲** - 最靈活

先用 **CeWL** 試試看,通常就夠用了! 🎯