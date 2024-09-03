from resources import db
from datetime import datetime
from sqlalchemy import Integer, String, Column, ForeignKey, TIMESTAMP, DateTime
from sqlalchemy.orm import relationship, mapped_column, Mapped, declarative_base
from sqlalchemy.sql import func

class Users(db.Model):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    created_time: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())  # 用户创建的日期时间

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'password': self.password,
            'created_at': self.created_time.isoformat()
        }
    
class serachHistory(db.Model):
    __tablename__ = 'search_history'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    search_term: Mapped[str] = mapped_column(String(255), nullable=False)
    search_date: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())  # 搜索的日期时间