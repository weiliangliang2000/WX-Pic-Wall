from datetime import datetime
import json
import requests
from flask import jsonify, request
# 导入Flask-RESTful模块中的Resource类
from flask_restful import Resource,reqparse
from werkzeug.datastructures import FileStorage

from models.wallpapers_model import Wallpapers,Categories

from resources import app, api, db
import jwt
from pathlib import Path
import os

def upload_file(file_path):
    try:
        with open(file_path, 'rb') as file:
            files = {'file': file}
            response = requests.post('https://www.256923.xyz/upload', files=files)
    
            # 检查请求是否成功
            if response.status_code == 200:
                print("File uploaded successfully!")
                print("Server Response:", response.text)
                # 解析服务器返回的 JSON 字符串
                response_json = json.loads(response.text)
                # 提取字典中的 'src' 字段
                file_url = response_json[0]['src']
                # 处理反斜杠
                file_url = file_url.replace('\\', '/')
                full_url = 'https://www.256923.xyz' + file_url
                print("File URL:", full_url)
                return full_url
            else:
                print("File upload failed. Status code:", response.status_code)
                print("Server Response:", response.text)
                return None
    except requests.exceptions.RequestException as e:
        # 捕获所有请求异常
        print(f"An error occurred during the request: {e}")
        return None
    except json.JSONDecodeError:
        # 捕获 JSON 解析错误
        print("Failed to decode the server's response as JSON.")
        return None
    except Exception as e:
        # 捕获所有其他异常
        print(f"An unexpected error occurred: {e}")
        return None

# 上传新的图片信息到数据库
def insert_new_paper(tag, description, category_id, path):
    with app.app_context():
        # 生成图片的相对路径
        # relative_path = f'static/images/{Path(path).name}'
        print(f"Inserting new paper: tag={tag}, description={description}, category_id={category_id}, image_url={path}")
        new_pic = Wallpapers(tag=tag, description=description, category_id=category_id, image_url=path)
        db.session.add(new_pic)
        try:
            db.session.commit()
            print("Insertion successful")
            return new_pic.serialize()
        except Exception as e:
            db.session.rollback()
            print(f"Insertion failed: {e}")
            return {"error": "Insertion failed"}, 400

# 获取附件路径
def get_attachment_path():
    home_path = Path(__file__).parent.parent# 获取当前文件所在目录的父目录
    attachment_path = home_path.joinpath('resources/static/images')# 在父目录下创建一个文件夹
    if not attachment_path.exists():# 如果attachments文件夹不存在，则创建
        attachment_path.mkdir(parents=True)
    return attachment_path # 返回attachments文件夹的路径

class upLoadPic_resource(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()# 处理请求的参数
        self.parser.add_argument("file",
                                 type=FileStorage,
                                 location="files",
                                 required=True, # 是否必填
                                 help="Attachment is required")# 提示信息
  
    def post(self):
        # 获取请求中的附件文件
        attachment_file = self.parser.parse_args().get("file")
        print("路径打印：",attachment_file)
        file_path = get_attachment_path().joinpath(attachment_file.filename)# 获取附件文件的保存路径
        attachment_file.save(file_path)# 保存附件文件
        # 获取其他表单数据
        tag = request.form.get("tag")  # 获取用户信息，表单中传递的数据
        category_id = request.form.get("category_id")  # 获取用户信息，表单中传递的数据
        # 判断分类id是否存在，不存在返回报错，分类id必填
        if not category_id:
            return {"error": "Category ID does not exist"}, 400
        description = request.form.get("description")  # 获取图片描述信息，表单中传递的数据
        # 定义一个映射字典
        id = {'自然风景':1,'建筑风格':2,'美女明星':3,'AI美图':4,'动漫游戏':5,'可爱萌宠':6,'体育运动':7,'帅哥靓仔':8,'其他':9}
        print("图片信息：",tag,id[category_id],"static/images/"+attachment_file.filename)
        # 将附件信息保存到数据库中
        file_path1 = "resources/static/images/"+attachment_file.filename
        url = upload_file(file_path1)
        print("上传图片的url：",url)
        new_pic = insert_new_paper(tag, description,id[category_id],url)
        os.remove(file_path)  # 删除文件
        # new_pic = insert_new_paper(tag, description,id[category_id],"static/images/"+attachment_file.filename)
        return new_pic, 200

class DeletePic_resource(Resource):
    def get(self):
        pic_id = request.args.get('id')  # 获取传入的id参数
        # 在数据库中查找对应的记录
        pic_to_delete = Wallpapers.query.get(pic_id)
        if not pic_to_delete:
            return {"error": "No record found with the given id"}, 400
        # 打印数据库中存储的 image_url 值，检查其格式
        print("数据库存储的 image_url:", pic_to_delete.image_url)
        """ # 将 URL 转换为相对路径，去掉前缀部分
        relative_path = pic_to_delete.image_url.replace('static/images/', '')  # 例如 'preview2.jpg'
        print("相对路径:", relative_path)
        # 将相对路径拼接为文件的完整路径
        file_path = Path('resources/static/images').joinpath(relative_path).resolve()
        print("文件绝对路径:", file_path)
        # 使用 os.path.exists() 检查文件是否存在
        if os.path.exists(file_path):
            try:
                os.remove(file_path)  # 删除文件
                print(f"文件 {file_path} 删除成功")
            except Exception as e:
                print(f"删除文件失败：{e}")
                return {"error": f"File could not be deleted: {str(e)}"}, 400
        else:
            print(f"文件未找到: {file_path}")
            return {"error": "File not found"}, 400 """
        # 从数据库中删除记录
        db.session.delete(pic_to_delete)
        db.session.commit()
        return {"message": f"Record with id {pic_id} and corresponding file have been deleted successfully."}, 200

api.add_resource(DeletePic_resource, '/delete_pic')
api.add_resource(upLoadPic_resource, '/upload_pic')

