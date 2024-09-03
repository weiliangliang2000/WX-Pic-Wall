from apispec import APISpec
from apispec.ext.marshmallow import MarshmallowPlugin
from flask import Flask
from flask_apispec import FlaskApiSpec
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from flask_restful_swagger import swagger
from flask_cors import CORS
from sqlalchemy import inspect

app = Flask(__name__)
CORS(app)

api = swagger.docs(Api(app), apiVersion='0.1')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pic_wall1.db'
print("Database URI:", app.config['SQLALCHEMY_DATABASE_URI'])
app.config['SECRET_KEY'] = 'liangliang'
app.config['CACHE_TYPE'] = 'simple'
app.config['CACHE_DEFAULT_TIMEOUT'] = 21600

db = SQLAlchemy(app)

# 确保在此处导入模型
from models.wallpapers_model import Wallpapers,Categories
from models.user_model import Users,serachHistory

""" # 插入一些初始的分类数据，第一次运行，取消注释
def insert_initial_categories():
    initial_categories = [
        Categories(name='自然风景'),
        Categories(name='建筑风格'),
        Categories(name='美女明星'),
        Categories(name='AI美图'),
        Categories(name='动漫游戏'),
        Categories(name='可爱萌宠'),
        Categories(name='体育运动'),
        Categories(name='帅哥靓仔'),
        Categories(name='其他')
    ]
    db.session.add_all(initial_categories)
    db.session.commit()

with app.app_context():
    print("Creating all tables...")
    db.create_all()
    print("Tables created successfully.")
    inspector = inspect(db.engine)
    print("Tables in the database:", inspector.get_table_names())
    insert_initial_categories()   """

from resources import user_resource
from resources import upload_pic_resource
from resources import wallpaper_resource
