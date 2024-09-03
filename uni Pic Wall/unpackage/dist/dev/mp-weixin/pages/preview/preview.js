"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_system = require("../../utils/system.js");
const utils_request = require("../../utils/request.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _easycom_uni_dateformat2 + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_dateformat = () => "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_dateformat + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "preview",
  setup(__props) {
    const maskState = common_vendor.ref(true);
    const classlist = common_vendor.ref([]);
    const infopopup = common_vendor.ref("");
    const category = common_vendor.ref(["", "自然", "建筑", "美女", "AI", "动漫", "萌宠", "运动", "帅哥", "其他"]);
    const storage = common_vendor.index.getStorageSync("pic") || [];
    console.log("hotstorage:", storage);
    classlist.value = storage;
    const currentInfo = common_vendor.ref([]);
    const currentId = common_vendor.ref("");
    const currentIndex = common_vendor.ref(0);
    const readimg = common_vendor.ref([]);
    common_vendor.onLoad(async (e) => {
      console.log(e);
      currentId.value = e.id;
      currentIndex.value = classlist.value.findIndex((item) => {
        return item.id == currentId.value;
      });
      readimg.value.push(
        currentIndex.value <= 0 ? classlist.value.length - 1 : currentIndex.value - 1,
        currentIndex.value,
        currentIndex.value >= classlist.value.length - 1 ? 0 : currentIndex.value + 1
      );
      console.log("匹配的索引：", currentIndex.value + 1);
      currentInfo.value = classlist.value[currentIndex.value];
    });
    function swiperChange(e) {
      currentIndex.value = e.detail.current;
      readimg.value.push(
        currentIndex.value <= 0 ? classlist.value.length - 1 : currentIndex.value - 1,
        currentIndex.value,
        currentIndex.value >= classlist.value.length - 1 ? 0 : currentIndex.value + 1
      );
      currentInfo.value = classlist.value[currentIndex.value];
      readimg.value = [...new Set(readimg.value)];
      console.log("当前图片id：", currentInfo.value.id);
    }
    const message = () => {
      infopopup.value.open();
    };
    function clickinfoclose() {
      infopopup.value.close();
    }
    const download = () => {
      async function clickDownload() {
        try {
          common_vendor.index.showLoading({
            title: "下载中",
            mask: true
          });
          common_vendor.index.getImageInfo({
            src: currentInfo.value.image_url,
            success: (res) => {
              const savepic = res.path;
              console.log("获取到的图片路径:", savepic);
              if (!savepic) {
                console.error("获取的图片路径为空");
                return;
              }
              common_vendor.index.saveImageToPhotosAlbum({
                filePath: savepic,
                success: (resAlbum) => {
                  console.log("保存到相册成功", resAlbum);
                  common_vendor.index.showToast({
                    title: "下载成功",
                    icon: "none",
                    duration: 1500
                  });
                  common_vendor.index.request({
                    url: utils_request.url + "wallpapers",
                    method: "POST",
                    data: {
                      id: currentInfo.value.id
                      // The ID of the wallpaper being downloaded
                    },
                    success: (res2) => {
                      if (res2.statusCode === 200) {
                        console.log("Download count updated successfully:", res2.data.downloads);
                      } else {
                        console.error("Failed to update download count:", res2.data.message);
                      }
                    },
                    fail: (err) => {
                      console.error("API request failed:", err);
                    }
                  });
                },
                fail: (err) => {
                  console.error("保存到相册失败", err);
                  if (err.errMsg == "saveImageToPhotosAlbum:fail cancel") {
                    common_vendor.index.showToast({
                      title: "保存失败，请点击重新下载",
                      icon: "none"
                    });
                    return;
                  }
                  common_vendor.index.showModal({
                    title: "提示",
                    content: "需要授权保存相册",
                    success: (res2) => {
                      if (res2.confirm) {
                        common_vendor.index.openSetting({
                          success(setting) {
                            if (setting.authSetting["scope.writePhotosAlbum"]) {
                              common_vendor.index.showToast({
                                title: "获取授权成功",
                                icon: "none"
                              });
                            } else {
                              common_vendor.index.showToast({
                                title: "获取授权失败",
                                icon: "none"
                              });
                            }
                          }
                        });
                      }
                    }
                  });
                },
                complete: () => {
                  common_vendor.index.hideLoading();
                }
              });
            },
            fail: (err) => {
              console.error("获取图片信息失败", err);
            }
          });
        } catch (err) {
          common_vendor.index.hideLoading();
          console.log(err);
        }
      }
      clickDownload();
    };
    common_vendor.onShareAppMessage((e) => {
      return {
        title: "Pic-Wall",
        path: "/pages/preview/preview?id=" + currentId.value + "&type=share"
      };
    });
    common_vendor.onShareTimeline(() => {
      return {
        title: "Pic-Wall",
        path: "/pages/index/index",
        query: "id=" + currentId.value + "&type=share"
      };
    });
    const maskChange = () => {
      maskState.value = !maskState.value;
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    common_vendor.onUnload(() => {
      console.log("onUnload triggered");
      common_vendor.index.removeStorageSync("pic");
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(classlist.value, (item, index, i0) => {
          return common_vendor.e({
            a: readimg.value.includes(index)
          }, readimg.value.includes(index) ? {
            b: common_vendor.o(maskChange, item.id),
            c: item.image_url
          } : {}, {
            d: item.id
          });
        }),
        b: common_vendor.o(swiperChange),
        c: currentIndex.value,
        d: maskState.value
      }, maskState.value ? {
        e: common_vendor.p({
          type: "back",
          color: "#fff",
          size: "20"
        }),
        f: common_vendor.o(goBack),
        g: common_vendor.unref(utils_system.getStatusBarHeight)() + "px",
        h: common_vendor.unref(utils_system.getTitleBarHeight)() + "px",
        i: common_vendor.t(currentIndex.value + 1),
        j: common_vendor.t(classlist.value.length),
        k: common_vendor.p({
          date: /* @__PURE__ */ new Date(),
          format: "hh:mm"
        }),
        l: common_vendor.p({
          date: /* @__PURE__ */ new Date(),
          format: "MM月dd日"
        }),
        m: common_vendor.p({
          type: "info",
          size: "28"
        }),
        n: common_vendor.o(message),
        o: common_vendor.p({
          type: "download",
          size: "23"
        }),
        p: common_vendor.o(download)
      } : {}, {
        q: common_vendor.p({
          type: "closeempty",
          size: "18",
          color: "#999"
        }),
        r: common_vendor.o(clickinfoclose),
        s: common_vendor.t(currentInfo.value.id),
        t: common_vendor.t(category.value[currentInfo.value.category_id]),
        v: common_vendor.t(currentInfo.value.description),
        w: common_vendor.t(currentInfo.value.downloads),
        x: common_vendor.sr(infopopup, "2dad6c07-5", {
          "k": "infopopup"
        }),
        y: common_vendor.p({
          type: "bottom"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2dad6c07"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
