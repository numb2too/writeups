# EOF

## 說明
簡短重點（繁體中文）
那段 `cat > labyrinth.txt << 'EOF' ... EOF` 用到的是 **here-document（heredoc，殘餘文件）** 的語法──一種在 shell 裡用來把一大段文字直接輸入到命令（或檔案）的方法。`EOF` 只是常見的**終止字串（delimiter）**，你可以換成任何字，但開始與結束要一致。

逐步說明（對你這段範例）：

* `cat > labyrinth.txt`：把標準輸出重導向寫入 `labyrinth.txt`（若檔案存在會覆蓋）。
* `<< 'EOF'`：告訴 shell 接下來的多行直到遇到獨立一行的 `EOF` 為止，要當作 `cat` 的標準輸入。
* 內文（`jareth`、`Jareth`、`labyrinth`、`Labyrinth`）就是要寫入檔案的內容。
* 最後那行的 `EOF`（必須**獨立一行**且完全相同）是結束標記，shell 看到它就停止讀取內文並執行命令。

為什麼你的 `EOF` 用單引號 `'EOF'`？差別在於**展開（expansion）行為**：

* `<< EOF`（未加引號）：會發生變數替換、命令替換與 escape 字元解譯。例如 `echo $HOME` 會被替換成家目錄路徑。
* `<< 'EOF'`（用單引號）：**完全當原始文字**，不做變數或命令替換，內容會逐字寫入（像原封不動的字串）。
* `<< "EOF"`（雙引號）行為類似未加引號，但會禁止一些展開（差異較少），通常不常用於 heredoc。

補充小技巧與注意事項：

* 結束標記 `EOF` 必須獨立一行，且前後不能有多餘空白或縮排（否則不會視為結束）。
* 如果你想在腳本裡縮排 heredoc 本文，能用 `<<-EOF`（注意是減號）搭配 **tab** 縮排，shell 會自動刪除每行開頭的 tab。
* `EOF` 只是慣例，你可以改成 `END`、`DATA` 或其他，但要開始與結束一致。
* 這種方式常用於：快速建立檔案、把多行文字傳給指令（例如寫 config、傳給 ssh 的遠端命令等）。

範例（示範變數展開差異）：

```
NAME=Alice

cat << EOF > a.txt
Hello $NAME
EOF

cat << 'EOF' > b.txt
Hello $NAME
EOF
```

* `a.txt` 內容會是 `Hello Alice`（有展開）
* `b.txt` 內容會是 `Hello $NAME`（沒有展開，原樣寫入）

