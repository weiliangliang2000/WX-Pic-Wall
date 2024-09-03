"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_system = require("../../utils/system.js");
const utils_request = require("../../utils/request.js");
if (!Array) {
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_uni_segmented_control2 = common_vendor.resolveComponent("uni-segmented-control");
  const _easycom_uni_fab2 = common_vendor.resolveComponent("uni-fab");
  (_easycom_uni_load_more2 + _easycom_uni_segmented_control2 + _easycom_uni_fab2)();
}
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_uni_segmented_control = () => "../../uni_modules/uni-segmented-control/components/uni-segmented-control/uni-segmented-control.js";
const _easycom_uni_fab = () => "../../uni_modules/uni-fab/components/uni-fab/uni-fab.js";
if (!Math) {
  (_easycom_uni_load_more + _easycom_uni_segmented_control + _easycom_uni_fab)();
}
const _sfc_main = {
  __name: "homePage",
  setup(__props) {
    const data = common_vendor.ref({
      pattern: {
        icon: "arrow-up",
        buttonColor: "#34464F"
      },
      content: [],
      horizontal: "right",
      vertical: "bottom",
      direction: "up"
    });
    let position = common_vendor.ref(0);
    function clickFab() {
      common_vendor.index.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
      position.value = 0;
    }
    const items = common_vendor.ref(["每日推荐", "热门精选", "可爱萌宠", "AI美图", "自然风景"]);
    const current = common_vendor.ref(0);
    const hot = common_vendor.ref([]);
    let hot_page = 1;
    const animal = common_vendor.ref([]);
    let animal_page = 1;
    const ai = common_vendor.ref([]);
    let ai_page = 1;
    const nature = common_vendor.ref([]);
    let nature_page = 1;
    let currentIndex = 0;
    function onClickItem(e) {
      currentIndex = e.currentIndex;
      if (current.value !== currentIndex) {
        current.value = currentIndex;
        position.value = 0;
        console.log("每日推荐：", random.value);
      }
      if (current.value == 1) {
        hot_page = 1;
        loadHotImages(true);
        console.log("每日推荐：", random.value);
      }
      if (current.value == 2) {
        animal_page = 1;
        loadAnimalImages(true);
      }
      if (current.value == 3) {
        ai_page = 1;
        loadAiImages(true);
      }
      if (current.value == 4) {
        nature_page = 1;
        loadNatureImages(true);
      }
    }
    common_vendor.onReachBottom(() => {
      console.log("触底加载更多...");
      if (currentIndex == 1) {
        console.log("热门精选");
        loadHotImages();
        position.value++;
      }
      if (currentIndex == 2) {
        console.log("可爱萌宠");
        loadAnimalImages();
        position.value++;
      }
      if (currentIndex == 3) {
        console.log("AI美图");
        loadAiImages();
        position.value++;
      }
      if (currentIndex == 4) {
        console.log("自然风景");
        loadNatureImages();
        position.value++;
      }
    });
    function loadHotImages(initialLoad = false) {
      class_pic({
        data: {
          page: hot_page,
          hot: "true"
        }
      }).then((data2) => {
        if (initialLoad) {
          hot.value = data2;
        } else {
          hot.value = [...hot.value, ...data2];
        }
        hot_page++;
        console.log(hot_page);
      }).catch((error) => {
        console.error("Failed to load images:", error);
      });
    }
    function loadAnimalImages(initialLoad = false) {
      class_pic({
        data: {
          page: animal_page,
          category_id: 6
        }
      }).then((data2) => {
        if (initialLoad) {
          animal.value = data2;
        } else {
          animal.value = [...animal.value, ...data2];
        }
        animal_page++;
        console.log(animal_page);
      }).catch((error) => {
        console.error("Failed to load images:", error);
      });
    }
    function loadAiImages(initialLoad = false) {
      class_pic({
        data: {
          page: ai_page,
          category_id: 4
        }
      }).then((data2) => {
        if (initialLoad) {
          ai.value = data2;
        } else {
          ai.value = [...ai.value, ...data2];
        }
        ai_page++;
        console.log(ai_page);
      }).catch((error) => {
        console.error("Failed to load images:", error);
      });
    }
    function loadNatureImages(initialLoad = false) {
      class_pic({
        data: {
          page: nature_page,
          category_id: 1
        }
      }).then((data2) => {
        if (initialLoad) {
          nature.value = data2;
        } else {
          nature.value = [...nature.value, ...data2];
        }
        nature_page++;
        console.log(nature_page);
      }).catch((error) => {
        console.error("Failed to load images:", error);
      });
    }
    function clickHot() {
      console.log("缓存热门精选");
      common_vendor.index.setStorageSync("pic", hot.value);
    }
    function clickRandom() {
      console.log("缓存每日推荐");
      common_vendor.index.setStorageSync("pic", random.value);
    }
    function clickAnimals() {
      console.log("缓存可爱萌宠");
      common_vendor.index.setStorageSync("pic", animal.value);
    }
    function clickAI() {
      console.log("缓存AI美图");
      common_vendor.index.setStorageSync("pic", ai.value);
    }
    function clickNature() {
      console.log("缓存自然风景");
      common_vendor.index.setStorageSync("pic", nature.value);
    }
    const random = common_vendor.ref([]);
    function random_pic() {
      common_vendor.index.request({
        url: utils_request.url + "wallpapers",
        method: "GET",
        data: {
          random: "true"
          // 传递random参数来获取每日随机推荐的9张壁纸
        },
        success: function(res) {
          if (res.statusCode === 200) {
            console.log("Random Wallpapers:", res.data);
            random.value = res.data;
          } else {
            console.error("Error:", res.data.message);
            common_vendor.index.showToast({
              title: "Failed to load wallpapers",
              icon: "none",
              duration: 3e3
            });
          }
        },
        fail: function(err) {
          console.error("Request failed:", err);
          common_vendor.index.showToast({
            title: "Request failed",
            icon: "none",
            duration: 3e3
          });
        }
      });
    }
    common_vendor.onLoad(() => {
      random_pic();
    });
    function class_pic(config = {}) {
      return new Promise((resolve, reject) => {
        let {
          data: data2 = {},
          method = "GET",
          // 默认为GET
          header = {}
        } = config;
        common_vendor.index.request({
          url: utils_request.url + "wallpapers",
          method,
          header,
          data: data2,
          success: function(res) {
            if (res.statusCode === 200) {
              resolve(res.data);
            } else {
              console.error("Error:", res.data.message);
              common_vendor.index.showToast({
                title: "没有更多图片了...",
                icon: "none",
                duration: 2e3
              });
              reject(res.data.message);
            }
          },
          fail: function(err) {
            console.error("Request failed:", err);
            common_vendor.index.showToast({
              title: "Request failed",
              icon: "none",
              duration: 3e3
            });
            reject(err);
          }
        });
      });
    }
    const bannerList = common_vendor.ref([]);
    common_vendor.index.request({
      url: "https://api.oioweb.cn/api/bing",
      success: (res) => {
        bannerList.value = res.data.result;
        console.log("bannnerlist:", res.data.result);
      },
      fail: (err) => {
        common_vendor.index.showToast({
          title: "轮播图请求错误，请联系作者",
          icon: "none",
          duration: 3e3
        });
      }
    });
    common_vendor.onShareAppMessage((e) => {
      return {
        title: "Pic-Wall",
        path: "/pages/index/login"
      };
    });
    common_vendor.onShareTimeline(() => {
      return {
        title: "Pic-Wall",
        path: "/pages/index/index",
        query: "id=" + currentId.value + "&type=share"
      };
    });
    common_vendor.index.request({
      url: "https://httpbin.org/ip",
      // 获取公网IP
      success: (res) => {
        console.log(res);
        common_vendor.index.setStorageSync("ip", res.data.origin);
        console.log("IP:", res.data.origin);
        common_vendor.index.request({
          //查询ip归属地
          url: "https://api.oioweb.cn/api/ip/ipaddress?ip=" + res.data.origin,
          success: (res2) => {
            common_vendor.index.setStorageSync("ip_adress", res2.data.result.addr[0]);
            console.log("ip地址:", res2.data.result.addr[0]);
          }
        });
      },
      fail: (err) => {
        console.error("获取公网IP失败:", err);
      }
    });
    common_vendor.index.request({
      url: utils_request.url + "random_category_wallpapers",
      // 替换为你的API地址
      method: "GET",
      success: (res) => {
        if (res.statusCode === 200) {
          common_vendor.index.setStorageSync("nine", res.data);
          console.log("随机获取的9类壁纸数据:", res.data);
        } else {
          console.error("获取壁纸数据失败:", res.data.message);
          common_vendor.index.showToast({
            title: "获取壁纸数据失败",
            icon: "none"
          });
        }
      },
      fail: (err) => {
        console.error("请求失败:", err);
        common_vendor.index.showToast({
          title: "请求失败",
          icon: "none"
        });
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(utils_system.getStatusBarHeight)() + "px",
        b: common_vendor.unref(utils_system.getTitleBarHeight)() + "px",
        c: common_vendor.f(bannerList.value, (item, index, i0) => {
          return {
            a: item.url,
            b: index
          };
        }),
        d: !random.value.length
      }, !random.value.length ? {
        e: common_vendor.p({
          status: "loading"
        })
      } : {}, {
        f: common_vendor.o(onClickItem),
        g: common_vendor.p({
          current: current.value,
          values: items.value,
          styleType: "text",
          activeColor: "#23ABF2"
        }),
        h: current.value === 0
      }, current.value === 0 ? {
        i: common_vendor.f(random.value, (item, k0, i0) => {
          return {
            a: item.image_url,
            b: "/pages/preview/preview?id=" + item.id,
            c: item.id,
            d: common_vendor.o(clickRandom, item.id)
          };
        })
      } : {}, {
        j: current.value === 1
      }, current.value === 1 ? {
        k: common_vendor.f(hot.value, (item, k0, i0) => {
          return {
            a: item.image_url,
            b: "/pages/preview/preview?id=" + item.id,
            c: item.id,
            d: common_vendor.o(clickHot, item.id)
          };
        })
      } : {}, {
        l: current.value === 2
      }, current.value === 2 ? {
        m: common_vendor.f(animal.value, (item, k0, i0) => {
          return {
            a: item.image_url,
            b: "/pages/preview/preview?id=" + item.id,
            c: item.id,
            d: common_vendor.o(clickAnimals, item.id)
          };
        })
      } : {}, {
        n: current.value === 3
      }, current.value === 3 ? {
        o: common_vendor.f(ai.value, (item, k0, i0) => {
          return {
            a: item.image_url,
            b: "/pages/preview/preview?id=" + item.id,
            c: item.id,
            d: common_vendor.o(clickAI, item.id)
          };
        })
      } : {}, {
        p: current.value === 4
      }, current.value === 4 ? {
        q: common_vendor.f(nature.value, (item, k0, i0) => {
          return {
            a: item.image_url,
            b: "/pages/preview/preview?id=" + item.id,
            c: item.id,
            d: common_vendor.o(clickNature, item.id)
          };
        })
      } : {}, {
        r: common_vendor.unref(position) >= 2
      }, common_vendor.unref(position) >= 2 ? {
        s: common_vendor.o(clickFab),
        t: common_vendor.p({
          pattern: data.value.pattern,
          horizontal: data.value.horizontal,
          vertical: data.value.vertical,
          direction: data.value.direction,
          popMenu: false
        })
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-49339ec8"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
