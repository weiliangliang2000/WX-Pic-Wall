<template>  
    <view class="content">  
        <image @click="chooseFile" class="logo" src="/static/logo.png"></image>  
        <view class="text-area">  
            <text class="title">点击上传本地文件</text>  
        </view>
		  
		<image @click="login" class="logo" src="/static/logo.png"></image>
		<view class="text-area">  
		    <text class="title">点击登录</text>  
		</view> 
        <!-- 可以在这里添加一个区域来显示选择的文件预览，如果需要的话 -->  
    </view>  
</template>  
  
<script setup>  
import { ref } from 'vue';  
  
function login(){
	uni.login({
	    provider: 'weixin',
	    success: function (loginRes) {
	        // 登录成功
	        uni.getUserInfo({
	            provider: 'weixin',
	            success: function(info) {
	                console.log(info)// 获取用户信息成功, info.authResult保存用户信息
	            }
	        })
	    },
	    fail: function (err) {
	        // 登录授权失败
	        // err.code是错误码
			console.log('err:',err);
	    }
	}); 
}
  
const tempFilePaths = ref([]); // 用于存储选择的文件路径  
function chooseFile() {  
    uni.chooseImage({  
        count: 9,  
        sizeType: ['original'],  
        sourceType: ['album'],  
        success: (res) => {  
            tempFilePaths.value = res.tempFilePaths;
            console.log("文件路径:", res);
            // 循环上传每个文件
            tempFilePaths.value.forEach(filePath => {
                uploadFile(filePath);
            });
        }  
    });  
}  
function uploadFile(filePath) {  
    uni.uploadFile({  
        url: 'http://127.0.0.1:5000/attachments', // 修改为你的服务器地址  
        filePath: filePath,  
        name: 'file', // 后端接收的参数名
        formData: {  
            'user': 'test' // 如果有其他需要传递的数据，可以放在这里
        },  
        success: (uploadRes) => {  
            console.log('upload success:', uploadRes.data);  
            // 处理上传成功的逻辑，比如显示提示信息  
        },  
        fail: (err) => {  
            console.error('upload fail:', err);  
            // 处理上传失败的逻辑  
        }  
    });  
}  
</script>  

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
