"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_system = require("../../utils/system.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const ip = common_vendor.ref("");
    const ip_adress = common_vendor.ref("");
    ip.value = common_vendor.index.getStorageSync("ip");
    ip_adress.value = common_vendor.index.getStorageSync("ip_adress");
    const avatar = common_vendor.ref("");
    common_vendor.index.request({
      url: "https://api.oioweb.cn/api/picture/miyoushe_avatar",
      success: (res) => {
        avatar.value = res.data.result[4].list[getRandomInt(0, 86)].icon;
        console.log(avatar.value);
      }
    });
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function rootLogin() {
      common_vendor.index.showModal({
        title: "提示",
        editable: true,
        placeholderText: "请输入管理员密码",
        success: function(res) {
          if (res.confirm) {
            console.log("用户点击确定");
            console.log(res.content);
            if (res.content == "00000") {
              common_vendor.index.navigateTo({
                url: "../upload_pic/upload_pic"
              });
            } else {
              common_vendor.index.showToast({
                title: "密码错误",
                icon: "error",
                duration: 2500
              });
            }
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    }
    function oneday() {
      common_vendor.index.navigateTo({
        url: "../onetext/onetext"
      });
    }
    function question() {
      common_vendor.index.showModal({
        title: "常见问题",
        content: "所有图片资源来源于公开网络/AI,如有侵权,请联系客服删除.",
        showCancel: false
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.unref(utils_system.getStatusBarHeight)() + "px",
        b: common_vendor.unref(utils_system.getTitleBarHeight)() + "px",
        c: avatar.value,
        d: common_vendor.t(ip.value),
        e: common_vendor.t(ip_adress.value),
        f: common_vendor.p({
          type: "calendar-filled",
          size: "35",
          color: "#34464F"
        }),
        g: common_vendor.p({
          type: "right",
          size: "25",
          color: "#aaa"
        }),
        h: common_vendor.o(oneday),
        i: common_vendor.p({
          type: "weixin",
          size: "35",
          color: "#34464F"
        }),
        j: common_vendor.p({
          type: "right",
          size: "25",
          color: "#aaa"
        }),
        k: common_vendor.p({
          type: "contact-filled",
          size: "35",
          color: "#34464F"
        }),
        l: common_vendor.p({
          type: "right",
          size: "25",
          color: "#aaa"
        }),
        m: common_vendor.o(rootLogin),
        n: common_vendor.p({
          type: "help-filled",
          size: "35",
          color: "#34464F"
        }),
        o: common_vendor.p({
          type: "right",
          size: "25",
          color: "#aaa"
        }),
        p: common_vendor.o(question),
        q: common_vendor.p({
          type: "more-filled",
          size: "35",
          color: "#34464F"
        }),
        r: common_vendor.p({
          type: "right",
          size: "25",
          color: "#aaa"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
