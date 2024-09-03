<template>
	<view class="noticelayout pagebg">
		<view class="title">
			<view class="font">每日一言</view>
		</view>
		<view class="info">
			<view class="item">作者：发光发热@Pic-Wall</view>
			<view class="item">
				<uni-dateformat :date="Date.now()" format="yyyy-MM-dd hh:mm:ss"></uni-dateformat>
			</view>
		</view>
		<view class="content">
			<image :src="yiyan.pic_url" mode="aspectFit"></image>
		</view>
		<view class="textone">
			{{yiyan.content}}<br>
			<view class="auth">
				----{{yiyan.author}}
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
const yiyan = ref({})
uni.request({
	url:"https://api.oioweb.cn/api/common/yiyan",
	success: (res) => {
		console.log(res);
		yiyan.value = res.data.result
	}
})
</script>

<style lang="scss" scoped>
.noticelayout{
	padding: 30rpx;
	.title{
		font-size: 40rpx;
		color: #111;
		line-height: 1.6rem;
		padding-bottom: 30rpx;
		display: flex;
		.tag{
			transform: scale(0.8);
			transform-origin: left center;
			flex-shrink: 0;
		}
		.font{
			padding-left: 6rpx;
		}
	}
	.info{
		display: flex;
		align-items: center;
		color: #999;
		font-size: 28rpx;
		.item{
			padding-right: 20rpx;
		}
	}
	.content{
		padding-top: 10rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		image{
			width:100%;
			// height: 100%;
			border-radius: 50rpx; /* 添加圆角，同样注意 'rpx' 单位的适用性 */  
			box-shadow: 0 2rpx 8px rgba(#a5a4a4,0.5); /* 添加阴影效果 */  
		}
	}
	.textone{
		padding: 20rpx 0rpx;
		.auth{
			text-align: right;
		}
	}
}

</style>

