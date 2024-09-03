<!-- <template>
	<view class="layout">
		<view class="login" @click="login">
			<text>微信一键登录</text>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import {url} from '@/utils/request.js'

const userInfo = ref(null);
function login(){
	uni.showLoading({
		title:'登录中'
	})
	uni.login({
	    provider: 'weixin',
	    success: function (loginRes) {
	        // 登录成功，获取微信的code
	        const { code } = loginRes;
	        uni.getUserInfo({
	            provider: 'weixin',
	            success: function(info){
	                console.log(info); // 获取用户信息成功
	                userInfo.value = info.userInfo;
	                // 将code和用户信息发送到后端进行绑定
	                uni.request({
	                    url: url+'/user', // 替换为你的后端API地址
	                    method: 'POST',
	                    data: {
	                        code: code,
	                        userInfo: userInfo.value,
	                    },
	                    success: (res) => {
	                        if (res.statusCode === 200) {
	                            console.log('登录成功', res.data);
	                            // 在这里处理登录成功后的操作，例如保存用户信息或跳转页面
	                            uni.reLaunch({
	                                url: '/pages/homePage/homePage'  // 页面路径
	                            });
								uni.hideLoading()
	                        } else {
	                            console.log('登录失败', res.data);
								uni.hideLoading()
	                        }
	                    },
	                    fail: (err) => {
	                        console.log('请求失败', err);
							uni.hideLoading()
	                    },
	                });
	            }
	        });
	    },
	    fail: function (err) {
	        // 登录授权失败
	        console.log('err:', err);
			uni.hideLoading()
	    },
	}); 
}
</script>

<style lang="scss" scoped>  
.layout {  
  display: flex;  
  justify-content: center;  
  align-items: center;  
  height: 100vh; // 使用vh单位使布局占满整个视口高度  
  /* 背景图片 */
  background: 
  /* 线性渐变，从上到下 */
  linear-gradient(to bottom,transparent,transparent 750rpx),
  /* 线性渐变，从左到右 */
  linear-gradient(to right,#c1fcfb 0%, #e2d1c3 100%);
  .login {  
    display: flex;  
    justify-content: center;  
    align-items: center;  
    height: 100rpx; // 根据需要调整高度  
    width: 500rpx; // 根据需要调整宽度  
    background: forestgreen;  
    border-radius: 50rpx; // 添加圆角  
    padding: 20rpx; // 添加内边距
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.2); // 添加阴影  
    text {  
      font-size: 50rpx;  
      color: #fff; // 确保文本颜色在背景上清晰可见  
      text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.5); // 添加文本阴影  
    }   
    &:active {  
      background-color: darken(forestgreen, 10%); // 点击时稍微变暗  
    }  
  }  
}  
</style -->>
