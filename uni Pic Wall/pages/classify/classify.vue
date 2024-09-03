<template>
	<view :style="{top:getStatusBarHeight()+'px',height:getTitleBarHeight()+'px'}"></view>
	<view class="pabg">
		<view class="input">
			<uni-easyinput v-model="searchValue" @confirm="search" @clear="onfocus" @focus="onfocus" @cancel="onfocus" placeholder="请输入要搜索的图片ID,回车确认"></uni-easyinput>
		</view>
		<view class="searchimg" v-if="searchValue">
			<view class="img">
				<image :src="searchImg.image_url" mode="aspectFill" @click="imgpreview"></image>
			</view>
		</view>
		
		<view class="grid">
			<view class="content1">
			    <navigator url="" class="item" >
					<view class="position" @click="click(1)">
						<image :src="nineWapapers[0].image_url" mode="aspectFill"></image>
						<text>自然风景</text>
					</view>
			    </navigator>
				<navigator url="" class="item" >
					<view class="position" @click="click(2)">
						<image :src="nineWapapers[1].image_url" mode="aspectFill"></image>
						<text>建筑风格</text>
					</view>
				</navigator>
				<navigator url="" class="item" >
					<view class="position" @click="click(3)">
						<image :src="nineWapapers[2].image_url" mode="aspectFill"></image>
						<text>美女明星</text>
					</view>
				</navigator>
				<navigator url="" class="item" >
					<view class="position" @click="click(4)">
						<image :src="nineWapapers[3].image_url" mode="aspectFill"></image>
						<text>AI 美图</text>
					</view>
				</navigator>
				<navigator url="" class="item" >
					<view class="position" @click="click(5)">
						<image :src="nineWapapers[4].image_url" mode="aspectFill"></image>
						<text>动漫游戏</text>
					</view>
				</navigator>
				<navigator url="" class="item" >
					<view class="position" @click="click(6)">
						<image :src="nineWapapers[5].image_url" mode="aspectFill"></image>
						<text>可爱萌宠</text>
					</view>
				</navigator>
				<navigator url="" class="item" >
					<view class="position" @click="click(7)">
						<image :src="nineWapapers[6].image_url" mode="aspectFill"></image>
						<text>体育运动</text>
					</view>
				</navigator>
				<navigator url="" class="item" >
					<view class="position" @click="click(8)">
						<image :src="nineWapapers[7].image_url" mode="aspectFill"></image>
						<text>帅哥靓仔</text>
					</view>
				</navigator>
				<navigator url="" class="item" >
					<view class="position" @click="click(9)">
						<image :src="nineWapapers[8].image_url" mode="aspectFill"></image>
						<text>其他分类</text>
					</view>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import {getStatusBarHeight,getTitleBarHeight} from '@/utils/system.js'
import {url} from '@/utils/request.js'

function click(id){
	uni.navigateTo({
		url:"/pages/classify/classlist?id="+id
	})
}
const searchValue = ref('')
const searchImg = ref([])
function search(){
		console.log(searchValue.value);
		 uni.request({
		    url: url + 'wallpapers/'+searchValue.value,
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
	searchValue.value = null
}

const nineWapapers = ref([])
nineWapapers.value = uni.getStorageSync('nine')

</script>

<style lang="scss" scoped>
.pabg{
	background: 
	/* 线性渐变，从上到下 */
	linear-gradient(to bottom,transparent,#fff 750rpx),
	/* 线性渐变，从左到右 */
	linear-gradient(to right,#c1fcfb 0%, #e2d1c3 100%);
	min-height: 100vh;
	.input{
		padding: 15rpx 0rpx;
		padding-right: 50rpx;
		padding-left: 50rpx;
	}
	.searchimg {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10rpx 50rpx;
		.img{
			width: 450rpx;
			height: 900rpx;
			border-radius: 20rpx;
			image {
				width: 100%;
				height: 100%;
				border-radius: 20rpx;
			}
		}
	}
	.grid{
		padding: 10rpx 25rpx;
		.content1{
			display: grid;
			grid-template-columns: repeat(3,1fr);
			gap:10rpx;
			padding: 5prx 0;
			.item{
				height: 440rpx;
				.position{
					width: 100%;
					height: 100%;
					position: relative;
					border-radius: 10rpx;
					overflow: hidden;
					image{
						width: 100%;
						height: 100%;
						// display: block;
						border-radius: 10rpx;
					}
					text{
						position: absolute;
						font-size: 40rpx;
						font-weight: 600;
						bottom: 0rpx;
						left: 0rpx;
						width: 100%;
						height: 18%;
						background: transparent;
						display: flex;
						justify-content: center;
						align-items: center;
						color: #fff;
						backdrop-filter: blur(20rpx);
						text-shadow:
						    -1px -1px 0 #000,    
						     1px -1px 0 #000,  
						    -1px  1px 0 #000,  
						     1px  1px 0 #000;
					}
				}
			}
		}
	}
}
	       
</style>
