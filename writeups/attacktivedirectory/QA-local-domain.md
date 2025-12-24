在 Active Directory（AD）環境中，最常被使用、但其實 **屬於無效（non-routable）或不建議使用的 TLD** 就是：

## ✅ **`.local`**（最常見）

許多企業或教學環境早期都會把 AD Domain 取為：

* `company.local`
* `office.local`
* `domain.local`

但現在 **微軟已不建議使用 `.local`**，原因：

* `.local` 與 **mDNS（Bonjour、Apple 裝置）** 保留域名衝突。
* 無法在公網使用，後續整合雲端（Azure AD、O365）容易出問題。
* 需要 UPN 變更，造成麻煩。

---

## 其他常見的「假 TLD」也屬於不建議

| 假 TLD         | 備註                                             |
| -------------- | ------------------------------------------------ |
| `.corp`        | 也常見，但 `.corp` 已被 ICANN 保留，不適合再使用 |
| `.lan`         | 非標準 TLD，不推薦                               |
| `.localdomain` | 同樣不建議                                       |
| `.internal`    | 不標準、無法保證未來不被正式註冊                 |

---

## 現在微軟官方建議使用什麼？

👉 **使用你擁有的正式網域的子網域**

例如你的公司擁有：

```
example.com
```

推薦 AD Domain 設：

```
ad.example.com
corp.example.com
internal.example.com
```

這樣後續整合 Azure AD / O365 / SSO 會最順。

---

如果你還想知道為什麼 `.local` 會造成技術問題，我也可以詳細說明喔！
