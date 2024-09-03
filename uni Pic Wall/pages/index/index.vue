<template>
	<view class="userlayout pagebg">
		<view :style="{top:getStatusBarHeight()+'px',height:getTitleBarHeight()+'px'}"></view>
		<view class="userinfo">
			<view class="avatar">
				<image :src=avatar mode="aspectFill"></image>
			</view>
			<view class="ip">{{ip}}</view>
			<view class="address">{{ip_adress}}</view>
		</view>
		<view class="row">
			<view class="column" @click="oneday">
				<view class="left">
					<uni-icons type="calendar-filled" size="35" color="#34464F"></uni-icons>
					<text>每日一言</text>
				</view>
				<view class="right">
					<uni-icons type="right" size="25" color="#aaa"></uni-icons>
				</view>
			</view>
			<view class="column">
				<view class="left">
					<uni-icons type="weixin" size="35" color="#34464F"></uni-icons>
					<text>联系客服</text>
					<button class="contact" open-type="contact">联系作者</button>
				</view>
				<view class="right">
					<uni-icons type="right" size="25" color="#aaa"></uni-icons>
				</view>
			</view>
			<view class="column" @click="rootLogin">
				<view class="left">
					<uni-icons type="contact-filled" size="35" color="#34464F"></uni-icons>
					<text>管理员</text>
				</view>
				<view class="right">
					<uni-icons type="right" size="25" color="#aaa"></uni-icons>
				</view>
			</view>
			<view class="column" @click="question">
				<view class="left">
					<uni-icons type="help-filled" size="35" color="#34464F"></uni-icons>
					<text>常见问题</text>
				</view>
				<view class="right">
					<uni-icons type="right" size="25" color="#aaa"></uni-icons>
				</view>
			</view>
			<view class="column">
				<view class="left">
					<uni-icons type="more-filled" size="35" color="#34464F"></uni-icons>
					<text>后续更新</text>
				</view>
				<view class="right">
					<uni-icons type="right" size="25" color="#aaa"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from "vue";
import {request} from "@/utils/request.js"
import {getStatusBarHeight,getTitleBarHeight} from '@/utils/system.js'
	
	const ip = ref('')
	const ip_adress = ref('')
	ip.value = uni.getStorageSync('ip')
	ip_adress.value = uni.getStorageSync('ip_adress')
	
	// 随机头像获取
	const avatar = ref('')
	uni.request({
		url:"https://api.oioweb.cn/api/picture/miyoushe_avatar",
		success: (res) => {
			avatar.value = res.data.result[4].list[getRandomInt(0,86)].icon
			console.log(avatar.value);	
		}
	})
	//随机生成数字
	function getRandomInt(min, max) {  
	  min = Math.ceil(min); // 最小值是固定的，这里只是确保它是整数  
	  max = Math.floor(max); // 最大值是固定的，向下取整  
	  return Math.floor(Math.random() * (max - min + 1)) + min;  
	}
	//管理员登录
	function rootLogin(){
		uni.showModal({
			title: '提示',
			editable: true,
			placeholderText: '请输入管理员密码',
			success: function (res) {
				if (res.confirm) {
					console.log('用户点击确定');
					console.log(res.content);
					if (res.content == "00000"){
						uni.navigateTo({
							url: '../upload_pic/upload_pic'
						});
					}else {
						uni.showToast({
							title: '密码错误',
							icon: 'error',
							duration: 2500
						});
					}
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
	}
	function oneday(){
		uni.navigateTo({
			url:'../onetext/onetext'
		})
	}
	function question(){
		uni.showModal({
			title:"常见问题",
			content:"所有图片资源来源于公开网络/AI,如有侵权,请联系客服删除.",
			showCancel:false
		})
	}
</script>

<style lang="scss" scoped>
.userlayout{
	.userinfo{
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 50rpx 0;
		.avatar{
			width: 175rpx;
			height: 175rpx;
			border-radius: 50%;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.ip{
			font-size: 40rpx;
			color:#777;
			padding: 25rpx 0 5rpx;
			font-weight: 550;
		}
		.address{
			font-size: 28rpx;
			color: #aaa;
		}
	}
	.row{
		width: 690rpx;
		margin: 50rpx auto;
		border: 1rpx solid #eee;
		border-radius: 10rpx;
		// 设置box-shadow属性，设置阴影的偏移量、模糊半径、阴影颜色
		box-shadow: 0 0 30rpx rgba(0,0,0,0.05);
		.column{
			display: flex;
			justify-content: space-between;
			align-items: center;
			background: #fff;
			padding: 0rpx 30rpx;
			height: 100rpx;
			border-bottom: 1rpx solid #eee;
			position: relative;
			&:last-child{border-bottom: 0;}
			.left{
				display: flex;
				align-items: center;
				text{
					padding-left: 20rpx;
					color: #666;
				}
				.contact{
					position: absolute;
					// 设置元素透明度为0
					opacity: 0;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
				}
			}
			.right{
				display: flex;
				align-items: center;
				text{
					padding-left: 10rpx;
					color: #666;
				}
			}
		}
	}
}
</style>
