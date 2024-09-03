from sqlalchemy import create_engine, DateTime, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import func

# 使用 SQLite 数据库文件，文件名为 pic_wall.db，如果文件不存在会自动创建
engine = create_engine('sqlite:///pic_wall1.db', echo=True)
Base = declarative_base()

class Wallpapers(Base):  
    __tablename__ = 'wallpapers'
  
    id = Column(Integer, primary_key=True)  
    tag = Column(String(255), nullable=False)  
    description = Column(String(500))  # 添加 String 类型的描述字段
    image_url = Column(String(255), nullable=False)  # 壁纸文件的存储路径或URL
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=False)  # 关联到 categories 表中的分类ID
    created_time = Column(DateTime, nullable=False, server_default=func.now())  # 壁纸上传的日期时间
    downloads = Column(Integer, default=0)  # 壁纸的下载次数

class Categories(Base):
    __tablename__ = 'categories'
    
    id = Column(Integer, primary_key=True)  # 分类的唯一标识
    name = Column(String(255), unique=True, nullable=False)  # 分类名称
    created_time = Column(DateTime, nullable=False, server_default=func.now())  # 分类创建的日期时间

class Users(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)  # 用户的唯一标识
    username = Column(String(255), unique=True, nullable=False)  # 用户名
    password = Column(String(255), nullable=False)  # 用户密码的哈希值
    created_time = Column(DateTime, nullable=False, server_default=func.now())  # 用户创建的日期时间

class SearchHistory(Base):
    __tablename__ = 'search_history'
    
    id = Column(Integer, primary_key=True)  # 搜索记录的唯一标识
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)  # 关联到 users 表中的用户ID
    search_term = Column(String(255), nullable=False)  # 用户搜索的关键词
    search_date = Column(DateTime, nullable=False, server_default=func.now())  # 搜索的日期时间

# 创建所有表
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)

# 创建session
session = Session()

# 插入多条数据
categories = [
    Categories(name='自然'),
    Categories(name='建筑'),
    Categories(name='美女'),
    Categories(name='AI'),
    Categories(name='动漫'),
    Categories(name='萌宠'),
    Categories(name='运动'),
    Categories(name='帅哥'),
    Categories(name='其他')
]

# 添加到session并提交
session.add_all(categories)
session.commit()

# 关闭session
session.close()
