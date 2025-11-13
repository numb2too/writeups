# binwalk

## 使用範例

### 尋找隱藏文件
```bash
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ binwalk owl.jpg              

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             JPEG image data, JFIF standard 1.01
61420         0xEFEC          JBOOT STAG header, image id: 0, timestamp 0x3308AA3F, image size: 1020261372 bytes, image JBOOT checksum: 0xD0F0, header JBOOT checksum: 0x8910
```

```bash                                                                         
┌──(kali㉿kali)-[~/tryhackme/yearOfTheOwl]
└─$ binwalk -e owl.jpg           

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------

WARNING: One or more files failed to extract: either no utility was found or it's unimplemented
```