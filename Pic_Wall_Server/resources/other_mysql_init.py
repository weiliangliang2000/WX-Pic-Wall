from apispec import APISpec
from apispec.ext.marshmallow import MarshmallowPlugin
from flask import Flask
from flask_apispec import FlaskApiSpec
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from flask_restful_swagger import swagger
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 允许跨域请求

api = swagger.docs(Api(app), apiVersion='0.1') # 使用swagger文档化API
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:123456@127.0.0.1/pic_wall' # 设置数据库URI
app.config['SECRET_KEY'] = 'liangliang'
app.config['CACHE_TYPE'] = 'simple' # 设置缓存类型为simple
app.config['CACHE_DEFAULT_TIMEOUT'] = 21600  # 默认缓存超时时间为6小时

db = SQLAlchemy(app) # 创建SQLAlchemy实例
# docs = FlaskApiSpec(app) # 创建FlaskApiSpec实例

from resources import user_resource
from resources import upload_pic_resource
from resources import wallpaper_resource