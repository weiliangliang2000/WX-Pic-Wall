let SYSTEM_INFO = uni.getSystemInfoSync();
//和微信小程序小胶囊高度一致
export const getStatusBarHeight = () => SYSTEM_INFO.statusBarHeight || 15; // 获取不到时 等于0
//和胶囊对齐在一条线上
export const getTitleBarHeight = () => {
    // 判断当前环境是否支持 getMenuButtonBoundingClientRect
    if (typeof uni.getMenuButtonBoundingClientRect === 'function') {
        let { top, height } = uni.getMenuButtonBoundingClientRect();
        let titlebarheight = (top - getStatusBarHeight()) * 2 + height;
        return titlebarheight;
    } else {
        // 在 H5 环境中提供默认值
        return 40;
    }
};

export const getNavBarHeight = () => getTitleBarHeight() + getStatusBarHeight();


