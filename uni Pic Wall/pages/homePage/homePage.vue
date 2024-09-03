<template>
	<view :style="{top:getStatusBarHeight()+'px',height:getTitleBarHeight()+'px'}"></view>
	<view class="banner">
		<swiper indicator-dots indicator-color="rgba(255,255,255,0.5)" 
		   indicator-active-color="#fff" autoplay circular interval="4000">
			<swiper-item v-for="(item,index) in bannerList" :key="index">
				<image :src="item.url" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
	</view>
	<uni-load-more status="loading" v-if="!random.length"></uni-load-more>
	<!-- <view class="notice" >
		<uni-notice-bar showIcon scrollable speed:70 color="#000" 
		background-color="" 
		single text="[发光发热@通告] Pic-Wall 1.0 版本微信小程序正式发布,所有图片来源于公开网络/AI,如有侵权,请及时联系作者删除."></uni-notice-bar>
	</view> -->
	<view class="option">
		<scroll-view class="segmented-scroll" 
		 scroll-x="true" scroll-with-animation="true" style="white-space: nowrap;">
			<uni-segmented-control :current="current" 
				:values="items" @clickItem="onClickItem" 
				styleType="text" activeColor="#23ABF2"></uni-segmented-control>
		</scroll-view>
	    <view class="content">
	        <view v-if="current === 0 " class="content1">
	            <navigator :url="'/pages/preview/preview?id='+item.id" class="item"
				 v-for="item in random " :key="item.id" @click="clickRandom">
	            	<image :src="item.image_url" mode="aspectFill"></image>
	            </navigator>
	        </view>
	        <view v-if="current === 1" class="content1">
	            <navigator :url="'/pages/preview/preview?id='+item.id" class="item"  
				v-for="item in hot" :key="item.id" @click="clickHot">
	            	<image :src="item.image_url" mode="aspectFill"></image>
	            </navigator>
	        </view>
	        <view v-if="current === 2" class="content1">
	            <navigator :url="'/pages/preview/preview?id='+item.id" class="item"
				 v-for="item in animal" :key="item.id" @click="clickAnimals">
	            	<image :src="item.image_url" mode="aspectFill"></image>
	            </navigator>
	        </view>
			<view v-if="current === 3" class="content1">
			    <navigator :url="'/pages/preview/preview?id='+item.id" class="item"
				 v-for="item in ai" :key="item.id" @click="clickAI">
			    	<image :src="item.image_url" mode="aspectFill"></image>
			    </navigator>
			</view>
			<view v-if="current === 4" class="content1">
			    <navigator :url="'/pages/preview/preview?id='+item.id" class="item" 
				v-for="item in nature" :key="item.id" @click="clickNature">
			    	<image :src="item.image_url" mode="aspectFill"></image>
			    </navigator>
			</view>
	    </view>
	</view>
	<view>
		<uni-fab
			:pattern="data.pattern"
			:horizontal="data.horizontal"
			:vertical="data.vertical"
			:direction="data.direction"
			@fabClick="clickFab"
			:popMenu="false"
			v-if="position>=2"
		></uni-fab>
	</view>
</template>


<script setup>
import { ref } from 'vue';  
import {getStatusBarHeight,getTitleBarHeight} from '@/utils/system.js'
import {url} from '@/utils/request.js'
import { onReachBottom } from '@dcloudio/uni-app'

const data = ref({
	pattern: {
		icon:"arrow-up",
		buttonColor:"#34464F",
	},
	content: [],
	horizontal: "right",
	vertical: "bottom", 
	direction: "up"
});
let position = ref(0)
function clickFab(){
	uni.pageScrollTo({
		scrollTop: 0,
		duration: 300
	});
	position.value=0
}

// 创建响应式数据  ['自然','建筑','美女','AI','动漫','萌宠','运动','帅哥','其他']
const items = ref(['每日推荐', '热门精选', '可爱萌宠', 'AI美图','自然风景',]);
const current = ref(0); 

const hot = ref([])
let hot_page = 1

const animal = ref([])
let animal_page = 1

const ai = ref([])
let ai_page = 1

const nature = ref([])
let nature_page = 1

let currentIndex = 0
// 分段器点击显示不同页面  
function onClickItem(e) {  
    currentIndex = e.currentIndex; 
    if (current.value !== currentIndex) {  
        current.value = currentIndex;  
		position.value=0
		console.log('每日推荐：',random.value);
    }
	if (current.value == 1) { // 点击热门精选
		hot_page = 1;
		loadHotImages(true); // 初次加载第一页数据
		console.log('每日推荐：',random.value);
	}
    if (current.value == 2) { // 点击可爱萌宠时候
		animal_page = 1;
        loadAnimalImages(true); // 初次加载第一页数据
    }
	if (current.value == 3) { // 点击AI美图时候
		ai_page = 1;
	    loadAiImages(true); // 初次加载第一页数据
	}
	if (current.value == 4) { // 点击自然风景时候
		nature_page = 1;
	    loadNatureImages(true); // 初次加载第一页数据
	}
}

onReachBottom(() => {
	console.log('触底加载更多...');
	if (currentIndex == 1) {
		console.log("热门精选");
		loadHotImages(); // 加载更多数据
		position.value++
	}
	if (currentIndex == 2) {
		console.log("可爱萌宠");
		loadAnimalImages(); // 加载更多数据
		position.value++
	}
	if (currentIndex == 3) {
		console.log("AI美图");
		loadAiImages(); // 加载更多数据
		position.value++
	}
	if (currentIndex == 4) {
		console.log("自然风景");
		loadNatureImages(); // 加载更多数据
		position.value++
	}
})

function loadHotImages(initialLoad = false) {
	class_pic({
	    data: {
	        page: hot_page,
	        hot: 'true'
	    }
	}).then(data => {
	    if (initialLoad) {
	        hot.value = data; // 初次加载时直接覆盖数据
	    } else {
	        hot.value = [...hot.value, ...data]; // 加载更多时追加数据
	    }
	    hot_page++; // 成功加载后再增加页数
	    console.log(hot_page);
	}).catch(error => {
	    console.error('Failed to load images:', error);
	});
}

function loadAnimalImages(initialLoad = false) {
	class_pic({
	    data: {
	        page: animal_page,
	        category_id: 6
	    }
	}).then(data => {
	    if (initialLoad) {
	        animal.value = data; // 初次加载时直接覆盖数据
	    } else {
	        animal.value = [...animal.value, ...data]; // 加载更多时追加数据
	    }
	    animal_page++; // 成功加载后再增加页数
	    console.log(animal_page);
	}).catch(error => {
	    console.error('Failed to load images:', error);
	});
}

function loadAiImages(initialLoad = false) {
	class_pic({
	    data: {
	        page: ai_page,
	        category_id: 4
	    }
	}).then(data => {
	    if (initialLoad) {
	        ai.value = data; // 初次加载时直接覆盖数据
	    } else {
	        ai.value = [...ai.value, ...data]; // 加载更多时追加数据
	    }
	    ai_page++; // 成功加载后再增加页数
	    console.log(ai_page);
	}).catch(error => {
	    console.error('Failed to load images:', error);
	});
}

function loadNatureImages(initialLoad = false) {
	class_pic({
	    data: {
	        page: nature_page,
	        category_id: 1
	    }
	}).then(data => {
	    if (initialLoad) {
	        nature.value = data; // 初次加载时直接覆盖数据
	    } else {
	        nature.value = [...nature.value, ...data]; // 加载更多时追加数据
	    }
	    nature_page++; // 成功加载后再增加页数
	    console.log(nature_page);
	}).catch(error => {
	    console.error('Failed to load images:', error);
	});
}

function clickHot(){
	console.log('缓存热门精选');
	uni.setStorageSync('pic',hot.value)
}
function clickRandom(){
	console.log('缓存每日推荐');
	uni.setStorageSync('pic',random.value)
}
function clickAnimals(){
	console.log('缓存可爱萌宠');
	uni.setStorageSync('pic',animal.value)
}
function clickAI(){
	console.log('缓存AI美图');
	uni.setStorageSync('pic',ai.value)
}
function clickNature(){
	console.log('缓存自然风景');
	uni.setStorageSync('pic',nature.value)
}

const random = ref([])
//每日推荐9张图片
function random_pic(){
	uni.request({
	    url: url+'wallpapers', 
	    method: 'GET',
	    data: {
	        random: 'true' // 传递random参数来获取每日随机推荐的9张壁纸
	    },
	    success: function (res) {
	        if (res.statusCode === 200) {
	            // 请求成功，处理返回的随机壁纸数据
	            console.log('Random Wallpapers:', res.data);
				random.value = res.data
				// uni.setStorageSync('randompic',random.value)
	        } else {
	            // 请求失败，处理错误
	            console.error('Error:', res.data.message);
	            uni.showToast({
	                title: 'Failed to load wallpapers',
	                icon: 'none',
					duration:3000
	            });
	        }
	    },
	    fail: function (err) {
	        // 网络请求失败
	        console.error('Request failed:', err);
	        uni.showToast({
	            title: 'Request failed',
	            icon: 'none',
				duration:3000
	        });
	    }
	});
}
onLoad(()=>{
	random_pic()
})
//分类9张图片
function class_pic(config={}) {
    return new Promise((resolve, reject) => {
        let {
            data = {},
            method = "GET",  // 默认为GET
            header = {}
        } = config;

        uni.request({
            url: url + 'wallpapers',
            method: method,
            header: header,
            data: data,
            success: function (res) {
                if (res.statusCode === 200) {
                    // console.log('Random Wallpapers:', res.data);
                    resolve(res.data);
                } else {
                    console.error('Error:', res.data.message);
                    uni.showToast({
                        title: '没有更多图片了...',
                        icon: 'none',
                        duration: 2000
                    });
                    reject(res.data.message);
                }
            },
            fail: function (err) {
                console.error('Request failed:', err);
                uni.showToast({
                    title: 'Request failed',
                    icon: 'none',
                    duration: 3000
                });
                reject(err);
            }
        });
    });
}
const bannerList = ref([])
uni.request({
	url:"https://api.oioweb.cn/api/bing",
	success: (res) => {
		bannerList.value = res.data.result
		console.log('bannnerlist:',res.data.result);
	},
	fail: (err) => {
		uni.showToast({
		    title: '轮播图请求错误，请联系作者',
		    icon: 'none',
		    duration: 3000
		});
	}
})

//分享页面
onShareAppMessage((e)=>{
	return{
		title:'Pic-Wall',
		path:"/pages/index/login"
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
	
uni.request({  
	    url: 'https://httpbin.org/ip', // 获取公网IP
	    success: (res) => {  //ip获取成功
			console.log(res);
			uni.setStorageSync('ip',res.data.origin) 
	        console.log('IP:', res.data.origin);
			uni.request({ //查询ip归属地
				url:'https://api.oioweb.cn/api/ip/ipaddress?ip='+res.data.origin,
				success: (res) => {
					uni.setStorageSync('ip_adress',res.data.result.addr[0])
					console.log('ip地址:',res.data.result.addr[0]);
				}
			})
	    },  
	    fail: (err) => {  
	        console.error('获取公网IP失败:', err);
	    }  
	});
//获取分类九张图片封面
uni.request({
    url: url + 'random_category_wallpapers', // 替换为你的API地址
    method: 'GET',
    success: (res) => {
        if (res.statusCode === 200) {
            // 处理成功返回的数据
            uni.setStorageSync('nine',res.data);  // 这是一个包含9张图片信息的数组
            console.log('随机获取的9类壁纸数据:', res.data);
        } else {
            // 处理API返回的错误信息
            console.error('获取壁纸数据失败:', res.data.message);
            uni.showToast({
                title: '获取壁纸数据失败',
                icon: 'none'
            });
        }
    },
    fail: (err) => {
        console.error('请求失败:', err);
        uni.showToast({
            title: '请求失败',
            icon: 'none'
        });
    }
});
</script>

<style lang="scss" scoped>
.banner{
		width: 750rpx;
		padding: 10rpx 0rpx;
		background:
		/* 线性渐变，从上到下 */
		linear-gradient(to bottom,transparent,transparent 650rpx),
		/* 线性渐变，从左到右 */
		linear-gradient(to right,#c1fcfb 0%, #e2d1c3 100%);
		swiper{
			width: 750rpx;
			height: 422rpx;
			&-item{
				width: 100%;
				height: 100%;
				padding:0rpx 10rpx;
				image{
					width: 100%;
					height: 100%;
					border-radius: 15rpx;
				}
			}
		}
	}	

.notice {
	padding: 0rpx 10rpx;
	// background: #aaa;
}

.segmented-scroll {
	width: 100%; /* 使滚动视图占据全宽 */
	overflow-x: scroll; /* 启用横向滚动 */
}

.option {
	background:
	/* 线性渐变，从上到下 */
	linear-gradient(to bottom,transparent,#fff 650rpx),
	/* 线性渐变，从左到右 */
	linear-gradient(to right,#c1fcfb 0%, #e2d1c3 100%);
	.content{
		.content1{
			display: grid;
			grid-template-columns: repeat(3,1fr);
			gap:5rpx;
			padding: 5prx 0;
			.item{
				height: 440rpx;
				image{
					width: 100%;
					height: 100%;
					display: block;
					border-radius: 10rpx;
				}
			}
		}
	}
}

.content {
	padding: 20rpx;
}
</style>
