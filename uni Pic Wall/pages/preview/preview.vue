<template>
	<view class="preview">
		<swiper circular @change="swiperChange" :current="currentIndex" duration=50>
			<swiper-item v-for="(item,index) in classlist" :key="item.id">
				<image v-if="readimg.includes(index)" @click="maskChange" :src="item.image_url" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<view class="mask" v-if="maskState">
			<view class="goBack"  @click="goBack"
			:style="{top:getStatusBarHeight()+'px',height:getTitleBarHeight()+'px'}">
				<uni-icons type="back" color="#fff" size="20"></uni-icons>
			</view>
			<view class="count">{{currentIndex+1}} / {{classlist.length}}</view>
			<view class="time">
				<uni-dateformat :date="new Date()" format="hh:mm"></uni-dateformat>
			</view>
			<view class="date">
				<uni-dateformat :date="new Date()" format="MM月dd日"></uni-dateformat>
			</view>
			<view class="footer">
				<view class="box" @click="message">
					<uni-icons type="info" size="28"></uni-icons>
					<view class="text">信息</view>
				</view>
				<view class="box" @click="download">
					<uni-icons type="download" size="23"></uni-icons>
					<view class="text">下载</view>
				</view>
			</view>
		</view>
		
		<!-- 蒙版弹窗 -->
		<uni-popup ref="infopopup" type="bottom">
			<view class="infopopup">
				<view class="popheader">
					<view></view>
					<view class="title">
						图片信息
					</view>
					<view class="close" @click="clickinfoclose">
						<uni-icons type="closeempty" size="18" color="#999"></uni-icons>
					</view>
				</view>
				<scroll-view scroll-y>
					<view class="content">
						<view class="row">
							<view class="label">壁纸ID：</view>
							<text selectable=true user-select=true class="value">{{currentInfo.id}}</text>
						</view>
		
						<view class="row">
							<view class="label">分类：</view>
							<text selectable class="value class">{{category[currentInfo.category_id]}}</text>
						</view>
		
						<view class="row">
							<view class="label">摘要：</view>
							<text selectable class="value">{{currentInfo.description}}</text>
						</view>
								
						<!-- <view class="row">
							<view class="label">标签：</view>
							<view class="value tabs">
								<view class="tab" v-for="(tag,index) in currentInfo.tag" :key="index">{{tag}}</view>
							</view>
						</view> -->
						
						<view class="row">
							<view class="label">下载量：</view>
							<text selectable class="value">{{currentInfo.downloads}}</text>
						</view>
						
						<view class="copyright">
							声明：图片来源于网络，免费公开分享，如有侵权，请及时联系作者及时删除。
						</view>
						<view class="safe-area-inset-bottom"></view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import {getStatusBarHeight,getTitleBarHeight} from "@/utils/system.js"
import {url} from '@/utils/request.js'
const maskState =ref(true);//遮罩层状态
const classlist = ref([])
const infopopup = ref('')

const category = ref(['','自然','建筑','美女','AI','动漫','萌宠','运动','帅哥','其他'])

const storage = uni.getStorageSync('pic') || []//获取缓存的数据
console.log("hotstorage:",storage);
classlist.value = storage//将缓存的数据赋予列表当中

const currentInfo = ref([])//当前壁纸的信息

const currentId = ref('')
const currentIndex = ref(0)
const readimg = ref([])
onLoad(async(e) => {//获取上个页面传递过来的id
		console.log(e);
		currentId.value = e.id  //传过来的参数id
		currentIndex.value = classlist.value.findIndex(item=>{
			return item.id == currentId.value//根据id找到索引值
		})
		//当前阅读图片的索引、上一张图片索引，下一张图片索引
		readimg.value.push(
		currentIndex.value<=0 ? classlist.value.length-1 : currentIndex.value-1 ,
		currentIndex.value,
		currentIndex.value>=classlist.value.length-1 ? 0 : currentIndex.value+1
		)
		console.log('匹配的索引：',currentIndex.value+1);
		currentInfo.value = classlist.value[currentIndex.value]//弹窗的信息
})

function swiperChange(e){
	currentIndex.value = e.detail.current
	//当前阅读图片的索引、上一张图片索引，下一张图片索引
	readimg.value.push(
	currentIndex.value<=0 ? classlist.value.length-1 : currentIndex.value-1 ,
	currentIndex.value,
	currentIndex.value>=classlist.value.length-1 ? 0 : currentIndex.value+1
	)
	currentInfo.value = classlist.value[currentIndex.value]//弹窗的信息
	readimg.value = [...new Set(readimg.value)]//数据降重，保持唯一性
	console.log('当前图片id：',currentInfo.value.id);
}

//点击信息弹窗
const message = ()=>{
	infopopup.value.open()
}
function clickinfoclose(){
	infopopup.value.close()
}
//下载
const download = ()=>{
	//点击下载
	async function clickDownload() {
		// #ifdef H5
		uni.showModal({
			content: "请长按保存壁纸",
			showCancel: false
		})
		// #endif
	
		// #ifndef H5
	
		try {
			uni.showLoading({
				title: "下载中",
				mask: true
			})
			uni.getImageInfo({
				src: currentInfo.value.image_url,
				success: (res) => {
					const savepic = res.path;
					console.log('获取到的图片路径:', savepic);
					// 检查路径是否正确
					if (!savepic) {
						console.error('获取的图片路径为空');
						return;
					}
					// 确保在获取到图片路径后再保存到相册  
					uni.saveImageToPhotosAlbum({
						filePath: savepic,
						success: (resAlbum) => {
							console.log('保存到相册成功', resAlbum);
							uni.showToast({
							    title: '下载成功',
							    icon: 'none',
							    duration: 1500
							});
							//下载量更新
							uni.request({
							    url: url + 'wallpapers',
							    method: 'POST',
							    data: {
							        id: currentInfo.value.id,  // The ID of the wallpaper being downloaded
							    },
							    success: (res) => {
							        if (res.statusCode === 200) {
							            console.log('Download count updated successfully:', res.data.downloads);
							        } else {
							            console.error('Failed to update download count:', res.data.message);
							        }
							    },
							    fail: (err) => {
							        console.error('API request failed:', err);
							    }
							});
							
						},
						fail: (err) => {
							console.error('保存到相册失败', err);
							if (err.errMsg == 'saveImageToPhotosAlbum:fail cancel') {
								uni.showToast({
									title: "保存失败，请点击重新下载",
									icon: 'none'
								});
								return; // 跳过运行下面代码
							}
							uni.showModal({
								title: "提示",
								content: "需要授权保存相册",
								success: (res) => {
									if (res.confirm) {
										uni.openSetting({
											success(setting) {
												if (setting.authSetting[
														'scope.writePhotosAlbum'
														]) {
													uni.showToast({
														title: "获取授权成功",
														icon: 'none'
													});
												} else {
													uni.showToast({
														title: "获取授权失败",
														icon: 'none'
													});
												}
											}
										});
									}
								}
							});
						},
						complete: () => {
							uni.hideLoading()
						}
					});
				},
				fail: (err) => {
					console.error('获取图片信息失败', err);
				}
			});
		} catch (err) {
			uni.hideLoading()
			console.log(err);
		}
		// #endif
	}
	clickDownload()
}

//分享页面
onShareAppMessage((e)=>{
	return{
		title:'Pic-Wall',
		path:"/pages/preview/preview?id="+currentId.value+"&type=share"
		}
	})
//分享朋友圈
onShareTimeline(()=>{
	return{
		title:'Pic-Wall',
		path:"/pages/index/index",
		query:"id="+currentId.value+"&type=share"
		}
	})
//遮罩层状态
const maskChange = ()=>{
	maskState.value = !maskState.value
}
//返回上一页
const goBack= ()=>{
	uni.navigateBack()
}
onUnload(() => {
    console.log('onUnload triggered');
    uni.removeStorageSync('pic'); // 清除缓存
});
</script>

<style lang="scss" scoped>
.preview{
	width: 100%;
	height: 100vh;	
	position: relative;
	swiper{
		width: 100%;
		height: 100%;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.mask{
		&>view{
			position: absolute;
			left:0;	
			margin:auto;
			color:#fff;			
			right:0;
			width: fit-content;
		}
		
		.goBack{
			width: 38px;
			height: 38px;
			background: rgba(0, 0, 0, 0.5);
			left: 30rpx;
			margin-left: 0;
			border-radius: 100px;
			top: 0;
			backdrop-filter: blur(10rpx);
			border:1rpx solid rgba(255,255,255,0.3);
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.count{			
			top:10vh;			
			background: rgba(0,0,0,0.3);
			font-size: 28rpx;
			border-radius: 40rpx;
			padding:8rpx 28rpx;
			backdrop-filter: blur(10rpx);
		}
		.time{			
			font-size: 140rpx;
			top:calc(10vh + 80rpx);		
			font-weight: 100;
			line-height: 1em;
			text-shadow: 0 4rpx rgba(0, 0, 0, 0.3);
		}
		.date{
			font-size: 34rpx;
			top: calc(10vh + 230rpx);
			text-shadow: 0 2rpx rgba(0, 0, 0, 0.3);
		}
		.footer{
			background: rgba(255,255,255,0.8);
			bottom:13vh;
			width: 50vw;
			height: 120rpx;
			border-radius: 120rpx;
			color:#000;
			display: flex;
			justify-content: space-around;
			align-items: center;
			box-shadow: 0 2rpx 0 rgba(0, 0, 0, 0.1);
			backdrop-filter: blur(20rpx);
			.box{
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding:2rpx 12rpx;				
				.text{
					font-size: 26rpx;
					color:#676767;
				}
			}
		}
	}

	.popHeader{
		display: flex;
		justify-content: space-between;
		align-items: center;
		.title{
			color:#676767;
			font-size: 26rpx;
		}
		.close{				
			padding:6rpx;
		}
	}
	
	.infopopup {
		background: #fff;
		padding: 30rpx;
		border-radius: 30rpx 30rpx 0 0;
		overflow: hidden;
		
		.popheader{
			display: flex;
			align-items: center;
			justify-content: space-between;
			.title{
				font-size: 30rpx;
				font-weight: 600;
			}
		}
	
		scroll-view {
			max-height: 60vh;
	
			.content {
				.row {
					display: flex;
					padding: 16rpx 0;
					font-size: 32rpx;
					line-height: 1.7rem;
	
					.label {
						color: #a7a7a7;
						width: 140rpx;
						text-align: right;
						font-size: 30rpx;
					}
	
					.value {
						flex: 1; //width=0时，元素初始化占用宽度为0 ，由flex来自动调整
						width: 0;
					}
	
					.rotebox {
						display: flex;
						align-items: center;
	
						.score {
							font-size: 26rpx;
							color: #676767;
							padding-left: 10rpx;
						}
					}
	
					.tabs {
						display: flex;
						flex-wrap: wrap; //自动换行
	
						.tab {
							border: 1rpx solid #28B389;
							color: #28B389;
							font-size: 22rpx;
							padding: 10rpx 30rpx;
							border-radius: 40rpx;
							line-height: 1em;
							margin: 0 10rpx 10rpx 0;
						}
					}
	
					.class {
						color: #28B389;
					}
				}
	
				.copyright {
					font-size: 28rpx;
					padding: 20rpx;
					background: #f6f6f6;
					color: #666;
					border-radius: 10rpx;
					margin: 20rpx 0;
					line-height: 1.6rem;
				}
			}
		}
	}
}
</style>
