<template>
	<!-- <view :style="{top:getStatusBarHeight()+'px',height:getTitleBarHeight()+'px'}"></view> -->
	<view class="pabg">
		<view class="grid">
			<view class="content1">
			    <navigator url="" class="item" v-for="item in imgList" :key="item.id">
					<view class="position" @click="goPreview(item.id)">
						<image :src="item.image_url" mode="aspectFill"></image>
						<!-- <text>自然风景</text> -->
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

let page = 1
const id = ref('')
const imgList = ref([])
onLoad((e)=>{
	id.value = parseInt(e.id, 10); // 第二个参数10表示十进制 
	console.log(id.value);
	loadimg(true)
	// loadimg()
})

function goPreview(ID){
	uni.setStorageSync('pic',imgList.value)
	uni.navigateTo({
		url:"/pages/preview/preview?id="+ID
	})
}

onReachBottom(() => {
	console.log('触底加载更多...');
	loadimg()
})

function loadimg(initialLoad = false){
	class_pic({
	    data: {
	        page: page,
	        category_id: id.value
	    }
	}).then(data => {
	    if (initialLoad) {
	        imgList.value = data; // 初次加载时直接覆盖数据
	    } else {
	        imgList.value = [...imgList.value, ...data]; // 加载更多时追加数据
	    }
	    page++; // 成功加载后再增加页数
	    console.log(page);
	}).catch(error => {
	    console.error('Failed to load images:', error);
	});
}

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

</script>

<style lang="scss" scoped>
.pabg{
	background: 
	/* 线性渐变，从上到下 */
	linear-gradient(to bottom,transparent,#fff 750rpx),
	/* 线性渐变，从左到右 */
	linear-gradient(to right,#c1fcfb 0%, #e2d1c3 100%);
	min-height: 100vh;
	.grid{
		padding: 10rpx 10rpx;
		.content1{
			display: grid;
			grid-template-columns: repeat(3,1fr);
			gap:10rpx;
			padding: 10rpx 0;
			.item{
				height: 440rpx;
				.position{
					width: 100%;
					height: 100%;
					border-radius: 10rpx;
					overflow: hidden;
					image{
						width: 100%;
						height: 100%;
						// display: block;
						border-radius: 10rpx;
					}
				}
			}
		}
	}
}
	       
</style>
