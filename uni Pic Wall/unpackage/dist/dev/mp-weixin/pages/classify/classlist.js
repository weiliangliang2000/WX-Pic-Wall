"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../utils/system.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  __name: "classlist",
  setup(__props) {
    let page = 1;
    const id = common_vendor.ref("");
    const imgList = common_vendor.ref([]);
    common_vendor.onLoad((e) => {
      id.value = parseInt(e.id, 10);
      console.log(id.value);
      loadimg(true);
    });
    function goPreview(ID) {
      common_vendor.index.setStorageSync("pic", imgList.value);
      common_vendor.index.navigateTo({
        url: "/pages/preview/preview?id=" + ID
      });
    }
    common_vendor.onReachBottom(() => {
      console.log("触底加载更多...");
      loadimg();
    });
    function loadimg(initialLoad = false) {
      class_pic({
        data: {
          page,
          category_id: id.value
        }
      }).then((data) => {
        if (initialLoad) {
          imgList.value = data;
        } else {
          imgList.value = [...imgList.value, ...data];
        }
        page++;
        console.log(page);
      }).catch((error) => {
        console.error("Failed to load images:", error);
      });
    }
    function class_pic(config = {}) {
      return new Promise((resolve, reject) => {
        let {
          data = {},
          method = "GET",
          // 默认为GET
          header = {}
        } = config;
        common_vendor.index.request({
          url: utils_request.url + "wallpapers",
          method,
          header,
          data,
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
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(imgList.value, (item, k0, i0) => {
          return {
            a: item.image_url,
            b: common_vendor.o(($event) => goPreview(item.id), item.id),
            c: item.id
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c872f49c"]]);
wx.createPage(MiniProgramPage);
