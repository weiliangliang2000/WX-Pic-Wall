from datetime import datetime
import requests
from flask import jsonify, request
# 导入Flask-RESTful模块中的Resource类
from flask_restful import Resource

from models.user_model import Users

from resources import app, api, db
import jwt

# 创建新用户的函数
def insert_user(username, password):
    with app.app_context():
        new_user = Users(username=username, password=password)# 创建用户对象
        db.session.add(new_user)# 添加到 session 中
        db.session.commit()# 提交事务
        return new_user.serialize()# 返回插入后的用户信息

WECHAT_APPID = 'wx83e630fcf207c61e'
WECHAT_SECRET = '111e1d85103230db90bfe11b708e1c91'

class user_resource(Resource):
    def post(self):#微信登录或创建新用户
        code = request.json.get('code')
        user_info = request.json.get('userInfo')
        # 使用 code 获取微信 OpenID 和 Session Key
        url = f"https://api.weixin.qq.com/sns/jscode2session?appid={WECHAT_APPID}&secret={WECHAT_SECRET}&js_code={code}&grant_type=authorization_code"
        resp = requests.get(url)
        if resp.status_code != 200:
            return {"error": "Failed to authenticate with WeChat"}, 400

        wechat_data = resp.json()
        openid = wechat_data.get('openid')

        # 检查用户是否已存在
        user = Users.query.filter_by(username=openid).first()
        if not user:
            # 如果用户不存在，创建一个新用户
            user = Users(
                username=openid,
                password= '' ,
            )
            db.session.add(user)
            db.session.commit()

        # 生成 JWT Token
        token = jwt.encode({'user_id': user.id}, app.config['SECRET_KEY'], algorithm='HS256')

        return {"token": token, "user": user.serialize()}, 200
    
api.add_resource(user_resource, '/user')









