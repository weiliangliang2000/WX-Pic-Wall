"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_system = require("../../utils/system.js");
const utils_request = require("../../utils/request.js");
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  _easycom_uni_easyinput2();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
if (!Math) {
  _easycom_uni_easyinput();
}
const _sfc_main = {
  __name: "classify",
  setup(__props) {
    function click(id) {
      common_vendor.index.navigateTo({
        url: "/pages/classify/classlist?id=" + id
      });
    }
    const searchValue = common_vendor.ref("");
    const searchImg = common_vendor.ref([]);
    function search() {
      console.log(searchValue.value);
      common_vendor.index.request({
        url: utils_request.url + "wallpapers/" + searchValue.value,
        method: "GET",
        success: (res) => {
          if (res.statusCode === 200) {
            searchImg.value = res.data;
            common_vendor.index.setStorageSync("pic", res.data);
            searchImg.value = searchImg.value[0];
            console.log("搜索的图片信息：", searchImg.value[0]);
          } else {
            console.error("Error:", res.data.message);
            common_vendor.index.showToast({
              title: "Failed to search wallpapers",
              icon: "none",
              duration: 3e3
            });
          }
        }
      });
    }
    function imgpreview() {
      search();
      common_vendor.index.navigateTo({
        url: "/pages/preview/preview?id=" + searchImg.value.id
      });
      console.log("搜索图片的id：", searchImg.value.id);
    }
    function onfocus() {
      searchImg.value = null;
      searchValue.value = null;
    }
    const nineWapapers = common_vendor.ref([]);
    nineWapapers.value = common_vendor.index.getStorageSync("nine");
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(utils_system.getStatusBarHeight)() + "px",
        b: common_vendor.unref(utils_system.getTitleBarHeight)() + "px",
        c: common_vendor.o(search),
        d: common_vendor.o(onfocus),
        e: common_vendor.o(onfocus),
        f: common_vendor.o(onfocus),
        g: common_vendor.o(($event) => searchValue.value = $event),
        h: common_vendor.p({
          placeholder: "请输入要搜索的图片ID,回车确认",
          modelValue: searchValue.value
        }),
        i: searchValue.value
      }, searchValue.value ? {
        j: searchImg.value.image_url,
        k: common_vendor.o(imgpreview)
      } : {}, {
        l: nineWapapers.value[0].image_url,
        m: common_vendor.o(($event) => click(1)),
        n: nineWapapers.value[1].image_url,
        o: common_vendor.o(($event) => click(2)),
        p: nineWapapers.value[2].image_url,
        q: common_vendor.o(($event) => click(3)),
        r: nineWapapers.value[3].image_url,
        s: common_vendor.o(($event) => click(4)),
        t: nineWapapers.value[4].image_url,
        v: common_vendor.o(($event) => click(5)),
        w: nineWapapers.value[5].image_url,
        x: common_vendor.o(($event) => click(6)),
        y: nineWapapers.value[6].image_url,
        z: common_vendor.o(($event) => click(7)),
        A: nineWapapers.value[7].image_url,
        B: common_vendor.o(($event) => click(8)),
        C: nineWapapers.value[8].image_url,
        D: common_vendor.o(($event) => click(9))
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6bcfa975"]]);
wx.createPage(MiniProgramPage);
