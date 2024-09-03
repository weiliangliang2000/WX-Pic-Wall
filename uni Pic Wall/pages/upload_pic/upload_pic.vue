<template>
	<view class="pagebg">
		<view class="view_pic">
			<view class="tag">
				<view class="tag1"></view>
				<view class="deleteID">
					<uni-easyinput v-model="delID" @confirm="search" @clear="onfocus" @focus="onfocus" @cancel="onfocus" placeholder="请输入要删除的图片ID"></uni-easyinput>
				</view>
				<view class="tag1"></view>
			</view>
			<!-- 上传按钮 -->
			<button @click="deleteID" class="upload-button">删除图片</button>
			<view class="searchimg" v-if="delID">
				<view class="img">
					<image :src="searchImg.image_url" mode="aspectFit" @click="imgpreview"></image>
				</view>
			</view>
		</view>
		<view class="view_pic">
			<view v-for="(file, index) in tempFilePaths" :key="index" class="image-wrapper">
				<image :src="file.filePath" mode="widthFix"></image>
				<!-- 自定义进度条 -->
				<view class="progress-bar">
					<view :style="{ width: file.progress + '%' }" class="progress-inner"></view>
				</view>
				<!-- 显示上传进度的百分比 -->
				<text class="progress-text">{{ file.progress }}%</text>
			</view>
			<view class="tag">
				<view class="tag1"></view>
				<uni-easyinput v-model="tag" placeholder="请输入图片标签"></uni-easyinput>
				<view class="tag1"></view>
				<uni-easyinput v-model="description" placeholder="请输入图片描述"></uni-easyinput>
				<view class="tag1"></view>
				<view class="color">
					 <uni-data-select
						placeholder="请选择分类"
					   v-model="category"
					   :localdata="category_candidates"
					   @change="change"
					 ></uni-data-select>
				</view>
			</view>
			<!-- 上传按钮 -->
			<button @click="chooseFile" class="upload-button">上传图片</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { url } from '@/utils/request.js';

const category_candidates = ref([
	{ value: 0, text: "自然风景" },
	{ value: 1, text: "建筑风格" },
	{ value: 2, text: "美女明星" },
	{ value: 3, text: "AI美图" },
	{ value: 4, text: "动漫游戏" },
	{ value: 5, text: "可爱萌宠" },
	{ value: 6, text: "体育运动" },
	{ value: 7, text: "帅哥靓仔" },
	{ value: 8, text: "其他" },
]);
const list = [
	'自然风景',
	'建筑风格',
	'美女明星',
	'AI美图',
	'动漫游戏',
	'可爱萌宠',
	'体育运动',
	'帅哥靓仔',
	'其他']

const category = ref('');
const tag = ref('');
const description = ref('');
const delID = ref('')
// 用于存储选择的文件路径和进度
const tempFilePaths = ref([]);

function change(){
	console.log('**********************:',list[category.value]);
}

function chooseFile() {  // 选择图片上传
    tempFilePaths.value = [];
    uni.chooseImage({
        count: 9,
        sizeType: ['original'],
        sourceType: ['album'],
        success: (res) => {
            // 初始化每个文件的上传进度为0
            res.tempFilePaths.forEach(filePath => {
                tempFilePaths.value.push({ filePath, progress: 0 });
            });
            console.log("文件路径:", res);

            uni.showLoading({
                title: "uploading",
                mask: true
            });
            let completedCount = 0;  // 用于追踪完成的上传任务数量
            // 循环上传每个文件
            tempFilePaths.value.forEach((file, index) => {
                uploadFile(file.filePath, index, () => {
                    completedCount++;
                    if (completedCount === tempFilePaths.value.length) {
                        uni.hideLoading();  // 当所有文件上传完成时，隐藏加载提示
						uni.showToast({
							title: '上传成功',
							icon: 'success',
							duration: 2000
						});
                        console.log('All files uploaded successfully');
                    }
                });
            });
        }
    });
}

function uploadFile(filePath, index, callback) {
    const uploadTask = uni.uploadFile({
        url: url + 'upload_pic', // 修改为你的服务器地址
        filePath: filePath,
        name: 'file', // 后端接收的参数名
        timeout: 600000,
        formData: {
            'tag': tag.value, // 如果有其他需要传递的数据，可以放在这里
            'category_id': list[category.value],
            'description': description.value
        },
        success: (uploadRes) => {
            console.log('upload success:', uploadRes.data, 'for file:', filePath);
            // 上传成功后将进度设置为 100%
            tempFilePaths.value[index].progress = 100;
            callback();  // 调用回调函数，表示这个文件已经上传完成
        },
        fail: (err) => {
            console.error('upload fail:', err, 'for file:', filePath);
			uni.showToast({
				title:err,
				icon:'none',
				duration:3000
			})
            callback();  // 即使上传失败，也调用回调函数，以便进行下一步操作
        }
    });

    uploadTask.onProgressUpdate((res) => { // 监听上传进度
        // 更新进度条和百分比显示
        tempFilePaths.value[index].progress = res.progress;
        console.log('上传进度:', res.progress, 'for file:', filePath);
    });
}
//删除图片
function deleteID(){
	console.log(delID.value);
	 uni.request({
	    url: url + 'delete_pic',
	    method: 'GET',
	    data: {
	      id: delID.value // 将要删除的ID传递给后端
	    },
		success: (res) => {
			uni.showToast({
				title:"success delete",
				icon:'none',
				duration:2000
			})
		}
	});
}

const searchImg = ref([])
function search(){
		console.log(delID.value);
		 uni.request({
		    url: url + 'wallpapers/'+delID.value,
		    method: 'GET',
			success: (res) => {
				if (res.statusCode === 200){
					searchImg.value = res.data
					uni.setStorageSync('pic',res.data)
					searchImg.value = searchImg.value[0]
					console.log("搜索的图片信息：",searchImg.value[0]);
				}else{
					// 请求失败，处理错误
					console.error('Error:', res.data.message);
					uni.showToast({
					    title: 'Failed to search wallpapers',
					    icon: 'none',
						duration:3000
					});
				}
			}
		});
}
function imgpreview(){
	search()
	uni.navigateTo({
		url:'/pages/preview/preview?id='+searchImg.value.id
	})
	console.log("搜索图片的id：",searchImg.value.id);
}
function onfocus(){
	searchImg.value = null
	delID.value = null
}
</script>

<style lang="scss" scoped>
/* 容器样式，定义图片区域的布局 */
.view_pic {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
	.tag{
		width: 580rpx;
	}
	.searchimg {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10rpx 50rpx;
		.img{
			width: 450rpx;
			height: 700rpx;
			border-radius: 20rpx;
			image {
				width: 100%;
				height: 100%;
				border-radius: 20rpx;
			}
		}
	}
}
/* 单个图片容器样式 */
.image-wrapper {
	width: 30%;
	margin: 10rpx 5rpx;
	position: relative;
	box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
	border-radius: 10px;
	overflow: hidden;
	background-color: #f9f9f9;
}
/* 图片样式 */
image {
	width: 100%;
	height: auto;
	display: block;
}
/* 自定义进度条容器 */
.progress-bar {
	width: 100%;
	height: 8px;
	position: absolute;
	bottom: 30px;
	left: 0;
	background-color: #e0e0e0;
	border-radius: 4px;
	overflow: hidden;
}
/* 自定义进度条的内部 */
.progress-inner {
	height: 100%;
	background-color: #10AEFF;
	transition: width 0.3s ease; /* 动画效果 */
}
/* 进度文本样式 */
.progress-text {
	position: absolute;
	bottom: 10px;
	right: 10px;
	color: #000;
	font-size: 12px;
	text-shadow: 0px 0px 1px rgba(0, 0, 0, 0.8); /* 添加阴影 */
}
/* 上传按钮样式 */
.upload-button {
	width: 100%;
	padding: 10rpx;
	margin: 20rpx 80rpx;
	background-color: #42b983;
	color: white;
	border-radius: 5px;
	text-align: center;
	font-size: 18px;
	cursor: pointer;
	transition: background-color 0.3s;
}
/* 上传按钮悬停样式 */
.upload-button:hover {
	background-color: #369972;
}
.tag{
	padding-top: 10rpx;
	.color{
		background: #fff;
		border-radius: 15rpx;
	}
	.tag1{
		margin-bottom: 15rpx;
	}
	.deleteID{
		// padding-top: 300rpx;
		width: 580rpx;
	}
}
</style>
