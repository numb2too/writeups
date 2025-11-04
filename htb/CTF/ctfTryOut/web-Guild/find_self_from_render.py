"""
從 Flask render_template_string 追蹤到 Jinja2 self 的完整路徑
展示每一步的調用鏈和源碼位置
"""

import inspect
from flask import Flask, render_template_string

print("=" * 80)
print("追蹤路徑: Flask render_template_string → Jinja2 self")
print("=" * 80)

# ============================================================================
# 第一步: Flask 的 render_template_string
# ============================================================================
print("\n" + "=" * 80)
print("第一步: Flask 的 render_template_string 在哪裡?")
print("=" * 80)

print(f"函數對象: {render_template_string}")
print(f"定義位置: {inspect.getfile(render_template_string)}")
print(f"所屬模塊: {render_template_string.__module__}")

# 查看源碼
print("\n源碼:")
print("-" * 80)
source = inspect.getsource(render_template_string)
print(source)
print("-" * 80)

print("\n關鍵觀察:")
print("1. render_template_string 定義在 flask/templating.py")
print("2. 它調用了 _render(template, context, ctx.app)")
print("3. template 來自 current_app.jinja_env.from_string(source)")

# ============================================================================
# 第二步: current_app.jinja_env 是什麼?
# ============================================================================
print("\n" + "=" * 80)
print("第二步: current_app.jinja_env 是什麼?")
print("=" * 80)

app = Flask(__name__)

with app.app_context():
    jinja_env = app.jinja_env
    print(f"jinja_env 類型: {type(jinja_env)}")
    print(f"jinja_env 類名: {jinja_env.__class__.__name__}")
    print(f"jinja_env 模塊: {jinja_env.__class__.__module__}")
    print(f"定義位置: {inspect.getfile(jinja_env.__class__)}")
    
    print("\n關鍵發現:")
    print("→ jinja_env 是 jinja2.Environment 的實例")
    print("→ Flask 使用 Jinja2 作為模板引擎")

from flask.templating import Environment as FlaskEnvironment
from jinja2 import Environment as Jinja2Environment

print("\n" + "=" * 80)
print("查看類的繼承關係 (MRO - Method Resolution Order)")
print("=" * 80)

print(f"Flask Environment 類: {FlaskEnvironment}")
print(f"Jinja2 Environment 類: {Jinja2Environment}")

print("\nFlask Environment 的繼承鏈 (MRO):")
for i, cls in enumerate(FlaskEnvironment.__mro__):
    print(f"  {i}. {cls.__module__}.{cls.__name__}")

print("\n關鍵發現:")
print("→ flask.templating.Environment 繼承自 jinja2.Environment")
print("→ 這是 Python 的類繼承機制")

########======


# ============================================================================
# 第三步: Environment.from_string() 做了什麼?
# ============================================================================
print("\n" + "=" * 80)
print("第三步: Environment.from_string() 做了什麼?")
print("=" * 80)

env = Jinja2Environment()
# Jinja2 的源碼
source = inspect.getsource(env.from_string)

with app.app_context():
    jinja_env = app.jinja_env
    print(f"from_string 方法(jinja): {env.from_string}")
    print(f"from_string 方法(flask): {jinja_env.from_string}")
    print(f"定義位置(jinja): {inspect.getfile(env.from_string)}")
    print(f"定義位置(flask): {inspect.getfile(jinja_env.from_string)}")
    if inspect.getsource(jinja_env.from_string) == source:
        print("\njinja 與 flask 源碼相同:")
        print("-" * 80)
        print(source)
        print("-" * 80)

print("\n關鍵觀察:")
print("1. from_string 創建 Template 對象")
print("2. Template 對象有 render() 方法")

# ============================================================================
# 第四步: Template.render() 做了什麼?
# ============================================================================
print("\n" + "=" * 80)
print("第四步: Template.render() 做了什麼?")
print("=" * 80)

template = env.from_string("{{ name }}")
print(f"Template 類型: {type(template)}")
print(f"Template 模塊: {template.__class__.__module__}")
print(f"定義位置: {inspect.getfile(template.__class__)}")

print("\nTemplate.render 源碼:")
print("-" * 80)
source = inspect.getsource(template.render)
print(source)
print("-" * 80)

print("\n關鍵觀察:")
print("1. render() 調用了 self.environment.handle_exception()")
print("2. 實際渲染由 root_render_func 執行")
print("3. root_render_func 是編譯後的模板函數")

# ============================================================================
# 第五步: 模板編譯時發生了什麼?
# ============================================================================
print("\n" + "=" * 80)
print("第五步: 模板是如何編譯的?")
print("=" * 80)

print("當你調用 env.from_string() 時,Jinja2 會:")
print("1. 解析模板字符串 (Parser)")
print("2. 生成 AST (抽象語法樹)")
print("3. 編譯成 Python 代碼")
print("4. 執行生成的代碼創建 render 函數")

# 查看編譯後的代碼
template_str = "Hello {{ name }}! Self is: {{ self }}"
template = env.from_string(template_str)

print(f"\n編譯後的模塊:")
print(f"模塊對象: {template.module}")
print(f"模塊名稱: {template.module.__name__}")

# 嘗試獲取生成的源碼
print("\n生成的 Python 代碼 (反編譯):")
print("-" * 80)
try:
    # Jinja2 編譯後的代碼
    source_code = template.module.__loader__.get_source(None, template.module.__name__)[0]
    print(source_code)
except:
    print("無法直接獲取,但可以通過 generate 方法查看")
    
    # 使用 generate 方法查看編譯過程
    from jinja2 import Environment
    env2 = Environment()
    code = env2.parse("{{ self }}")
    from jinja2.compiler import generate
    result = generate(code, env2, "template", "template")
    print(result)
print("-" * 80)

# ============================================================================
# 第六步: 'self' 是在哪裡注入的?
# ============================================================================
print("\n" + "=" * 80)
print("第六步: 'self' 是在哪裡注入到模板命名空間的?")
print("=" * 80)

print("查看 jinja2/runtime.py 的 Context 類:")

from jinja2.runtime import Context
print(f"Context 類位置: {inspect.getfile(Context)}")

print("\n關鍵代碼片段 (來自 jinja2/runtime.py):")
print("-" * 80)
print("""
class Context:
    def __init__(self, environment, parent, name, blocks):
        self.parent = parent
        self.vars = {}
        self.environment = environment
        # ... 其他初始化
        
        # 'self' 變量的來源!
        self.blocks = blocks
        
    # 當模板需要 'self' 時,會創建 TemplateReference
    # 並返回給模板使用
""")
print("-" * 80)

print("\n查看 TemplateReference 類:")
from jinja2.runtime import TemplateReference

print(f"TemplateReference 位置: {inspect.getfile(TemplateReference)}")
print("\n源碼:")
print("-" * 80)
source = inspect.getsource(TemplateReference)
print(source)
print("-" * 80)

# ============================================================================
# 第七步: 實際追蹤渲染過程
# ============================================================================
print("\n" + "=" * 80)
print("第七步: 實際追蹤一個模板的渲染過程")
print("=" * 80)

# 創建一個簡單的追蹤器
class TracingEnvironment(Environment):
    def from_string(self, source, globals=None, template_class=None):
        print(f"\n→ Environment.from_string() 被調用")
        print(f"   模板內容: {source}")
        result = super().from_string(source, globals, template_class)
        print(f"   返回: {result}")
        return result

# 創建追蹤環境
trace_env = TracingEnvironment()

# 渲染模板
print("\n開始渲染:")
template = trace_env.from_string("{{ self }}")
print(f"\n→ Template.render() 被調用")
result = template.render()
print(f"   結果: {result}")

# ============================================================================
# 第八步: 完整的調用鏈
# ============================================================================
print("\n" + "=" * 80)
print("第八步: 完整的調用鏈總結")
print("=" * 80)

call_chain = """
1. Flask 層
   flask.render_template_string(source)
   └─ 定義在: flask/templating.py
   └─ 調用: current_app.jinja_env.from_string(source)

2. Jinja2 Environment 層
   Environment.from_string(source)
   └─ 定義在: jinja2/environment.py
   └─ 調用: Template(self.compile(source), self, ...)
   
3. Jinja2 編譯層
   Environment.compile(source)
   └─ 定義在: jinja2/environment.py
   └─ 調用: self.parse(source) → generate() → compile()
   └─ 生成: root_render_func (Python 函數)

4. Jinja2 Template 層
   Template(compiled_code, environment, ...)
   └─ 定義在: jinja2/environment.py
   └─ 存儲: root_render_func

5. 渲染層
   Template.render(**kwargs)
   └─ 定義在: jinja2/environment.py
   └─ 調用: self.root_render_func(self.new_context(**kwargs))

6. Context 創建層
   Template.new_context(**kwargs)
   └─ 定義在: jinja2/environment.py
   └─ 創建: Context(environment, parent, name, blocks)
   └─ 定義在: jinja2/runtime.py

7. 'self' 注入層
   在編譯後的 root_render_func 中:
   └─ 創建: TemplateReference(context)
   └─ 定義在: jinja2/runtime.py
   └─ 變量名: 'self'
   └─ 包含: __context 屬性 (Context 對象)
"""

print(call_chain)

# ============================================================================
# 第九步: 手動模擬整個過程
# ============================================================================
print("\n" + "=" * 80)
print("第九步: 手動模擬從 Flask 到 self 的過程")
print("=" * 80)

print("\n模擬代碼:")
print("-" * 80)
simulation = """
# 1. Flask 層
def render_template_string(source, **context):
    template = current_app.jinja_env.from_string(source)
    return _render(template, context, current_app)

# 2. Jinja2 層
class Environment:
    def from_string(self, source):
        code = self.compile(source)  # 編譯模板
        return Template(code, self)   # 創建 Template

# 3. Template 渲染
class Template:
    def render(self, **kwargs):
        context = self.new_context(**kwargs)
        return self.root_render_func(context)
    
    def new_context(self, **kwargs):
        return Context(self.environment, None, self.name, {}, kwargs)

# 4. Context 和 TemplateReference
class Context:
    def __init__(self, environment, parent, name, blocks, vars):
        self.vars = vars
        self.environment = environment
        self.blocks = blocks
        # self 變量會在渲染時創建

class TemplateReference:
    def __init__(self, context):
        self.__context = context  # 這就是 _TemplateReference__context 的來源!

# 5. 編譯後的模板函數 (簡化版)
def root_render_func(context):
    # Jinja2 編譯器會生成類似這樣的代碼:
    __self = TemplateReference(context)  # 創建 self!
    
    # 模板中的 {{ self }} 會被編譯成:
    return str(__self)
"""
print(simulation)
print("-" * 80)

# ============================================================================
# 第十步: 實際驗證
# ============================================================================
print("\n" + "=" * 80)
print("第十步: 實際驗證整個流程")
print("=" * 80)

app = Flask(__name__)

@app.route('/test')
def test():
    # 這會觸發整個調用鏈
    return render_template_string("{{ self }}")

with app.test_client() as client:
    print("發送請求到 Flask...")
    response = client.get('/test')
    print(f"響應: {response.data.decode()}")
    print("\n這個響應來自 TemplateReference 對象的字符串表示")

# 驗證 __context
with app.app_context():
    result = render_template_string("{{ self._TemplateReference__context }}")
    print(f"\n訪問 __context: {result}")
    
    result2 = render_template_string("{{ self._TemplateReference__context.keys() }}")
    print(f"__context 的 keys: {result2}")

# ============================================================================
# 總結: 源碼位置清單
# ============================================================================
print("\n" + "=" * 80)
print("總結: 關鍵源碼位置清單")
print("=" * 80)

source_locations = """
1. Flask 層
   flask/templating.py
   └─ render_template_string() 函數
   └─ _render() 函數

2. Jinja2 Environment
   jinja2/environment.py
   └─ Environment 類
   └─ Environment.from_string() 方法
   └─ Environment.compile() 方法
   └─ Template 類

3. Jinja2 Runtime
   jinja2/runtime.py
   └─ Context 類 (包含模板變量)
   └─ TemplateReference 類 (就是 'self')
      └─ __init__(self, context)
      └─ self.__context = context  ← 關鍵!

4. Jinja2 編譯器
   jinja2/compiler.py
   └─ generate() 函數 (生成 Python 代碼)
   └─ 這裡會生成創建 TemplateReference 的代碼

5. Jinja2 默認變量
   jinja2/defaults.py
   └─ DEFAULT_NAMESPACE (包含 lipsum, cycler 等)

追蹤方法:
1. 從 flask.render_template_string 開始
2. 看它調用 app.jinja_env.from_string
3. 看 Environment.from_string 如何編譯模板
4. 看編譯後如何創建 Context
5. 看如何創建 TemplateReference (self)
6. 查看 TemplateReference.__init__ 中的 __context 賦值
"""

print(source_locations)

print("\n" + "=" * 80)
print("如何實際查看這些源碼?")
print("=" * 80)

print("""
方法 1: 使用 Python 找到文件位置
import flask
import jinja2
print(flask.__file__)  # Flask 安裝位置
print(jinja2.__file__)  # Jinja2 安裝位置

方法 2: 使用 inspect 模塊
import inspect
from jinja2.runtime import TemplateReference
print(inspect.getfile(TemplateReference))
print(inspect.getsource(TemplateReference))

方法 3: 直接看 GitHub
Flask: https://github.com/pallets/flask
Jinja2: https://github.com/pallets/jinja

方法 4: 使用 IDE 的 "Go to Definition" 功能
在 VSCode/PyCharm 中:
- 點擊 render_template_string
- 按 F12 或 Cmd+Click
- 一步步追蹤每個函數調用
""")