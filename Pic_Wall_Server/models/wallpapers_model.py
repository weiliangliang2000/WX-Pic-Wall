from resources import db
from datetime import datetime
from sqlalchemy import Integer, String, Column, ForeignKey, TIMESTAMP, DateTime
from sqlalchemy.orm import relationship, mapped_column, Mapped, declarative_base
from sqlalchemy.sql import func

# address = 'http://127.0.0.1:1000/'

class Wallpapers(db.Model):  
    __tablename__ = 'wallpapers'  
  
    id: Mapped[int] = mapped_column(primary_key=True)
    tag: Mapped[str] = mapped_column(String(255),nullable=False)
    description: Mapped[str] = mapped_column(String(500))  # 添加 String 类型的描述字段
    image_url: Mapped[str] = mapped_column(String(255), nullable=False)  # 壁纸文件的存储路径或URL
    category_id: Mapped[int] = mapped_column(Integer, ForeignKey('categories.id'), nullable=False)
    created_time: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())
    downloads: Mapped[int] = mapped_column(Integer, default=0)  # 壁纸的下载次数

    def serialize(self):
        return {
            'id': self.id,
            'tag': self.tag,
            'description': self.description,
            # 'image_url': address + self.image_url,
            'image_url': self.image_url,
            'category_id': self.category_id,
            'created_time': self.created_time.isoformat(),
            'downloads': self.downloads
        }

class Categories(db.Model):
    __tablename__ = 'categories'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    created_time: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'created_time': self.created_time.isoformat()
        }


