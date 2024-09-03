from datetime import datetime
import os
import random
import requests
from flask import jsonify, request, send_file
# 导入Flask-RESTful模块中的Resource类
from flask_restful import Resource,reqparse
from sqlalchemy import desc, func
from werkzeug.datastructures import FileStorage

from models.wallpapers_model import Wallpapers,Categories

from resources import app, api, db
import jwt
from pathlib import Path

from flask_caching import Cache
from datetime import datetime, timedelta

address = ''
cache = Cache(app)
class WallpapersResource(Resource):
    def get(self, id=None):
        if id is not None:
            wallpaper = Wallpapers.query.get(id)
            if wallpaper is None:
                return {'message': 'Wallpaper not found'}, 400
            return [wallpaper.serialize()], 200
        random_request = request.args.get('random', default=None, type=str)
        if random_request is not None:
            cached_data = cache.get('random_wallpapers')
            if cached_data:
                return cached_data, 200
            today = datetime.now().strftime('%Y-%m-%d-%H')  # 每小时更新种子
            random.seed(today)
            random_images = Wallpapers.query.order_by(func.random()).limit(9).all()
            if not random_images:
                return {'message': 'No images available'}, 400
            serialized_images = [image.serialize() for image in random_images]
            cache.set('random_wallpapers', serialized_images, timeout=21600)  # 设置6小时缓存
            return serialized_images, 200

        hot_request = request.args.get('hot', default=None, type=str)
        page = request.args.get('page', default=1, type=int)
        per_page = 9
        offset = (page - 1) * per_page

        if hot_request is not None:
            total_images = Wallpapers.query.count()
            if offset >= total_images:
                return {'message': 'No more hot images available'}, 400

            hot_images = Wallpapers.query.order_by(desc(Wallpapers.downloads)) \
                .offset(offset).limit(per_page).all()

            if not hot_images:
                return {'message': 'No hot images available'}, 400

            serialized_images = [image.serialize() for image in hot_images]
            return serialized_images, 200

        category_id = request.args.get('category_id', default=None, type=int)
        if category_id is None:
            return {'message': 'Category ID is required'}, 400

        total_images = Wallpapers.query.filter_by(category_id=category_id).count()
        if offset >= total_images:
            return {'message': f'No more images available for this category'}, 400

        last_nine_images = Wallpapers.query.filter_by(category_id=category_id) \
            .order_by(desc(Wallpapers.id)).offset(offset).limit(per_page).all()

        if not last_nine_images:
            return {'message': f'No more images available for this category'}, 400

        serialized_images = [image.serialize() for image in last_nine_images]
        return serialized_images, 200
    
    def post(self):# 下载量更新
        data = request.get_json()
        wallpaper_id = data.get('id')
        wallpaper = Wallpapers.query.get(wallpaper_id)
        if not wallpaper:
            return {'message': 'Wallpaper not found'}, 400
        # Increment the download count by 1
        wallpaper.downloads += 1
        db.session.commit() 
        return {'message': 'Download count updated', 'downloads': wallpaper.downloads}, 200

class RandomCategoryWallpapersResource(Resource):
    def get(self):
        # 获取所有分类
        categories = Categories.query.all()
        if not categories:
            return {'message': 'No categories available'}, 400
        # 创建一个列表来存储每个分类中随机选中的图片
        selected_images = []
        for category in categories:
            # 从当前分类中随机选取一张图片
            random_image = Wallpapers.query.filter_by(category_id=category.id) \
                .order_by(func.random()).first()
            if random_image:
                selected_images.append(random_image.serialize())
        if len(selected_images) == 0:
            return {'message': 'No images available'}, 400
        # 如果分类少于 9 个，则可能选出的图片数量不足 9 张
        return selected_images, 200

# 注册资源并定义路由
api.add_resource(RandomCategoryWallpapersResource, '/random_category_wallpapers')

# http://127.0.0.1:5000/static/images/%E5%B0%8F%E6%82%9F%E7%A9%BA.jpg
# 注册资源并定义路由，注意这里增加了id参数
# 注册资源并定义路由，注意这里增加了对无id情况的支持
api.add_resource(WallpapersResource, '/wallpapers', '/wallpapers/<int:id>')
@app.route('/test')
def test_image():
    wallpaper = Wallpapers.query.get(13)# 查询数据库，查找与给定id对应的壁纸
    address = wallpaper.serialize()
    print("address:",address["image_url"])
    return send_file(address["image_url"])


