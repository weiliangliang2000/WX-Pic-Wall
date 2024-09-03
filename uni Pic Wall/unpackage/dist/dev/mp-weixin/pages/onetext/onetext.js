"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  _easycom_uni_dateformat2();
}
const _easycom_uni_dateformat = () => "../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
if (!Math) {
  _easycom_uni_dateformat();
}
const _sfc_main = {
  __name: "onetext",
  setup(__props) {
    const yiyan = common_vendor.ref({});
    common_vendor.index.request({
      url: "https://api.oioweb.cn/api/common/yiyan",
      success: (res) => {
        console.log(res);
        yiyan.value = res.data.result;
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          date: Date.now(),
          format: "yyyy-MM-dd hh:mm:ss"
        }),
        b: yiyan.value.pic_url,
        c: common_vendor.t(yiyan.value.content),
        d: common_vendor.t(yiyan.value.author)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-34e4fe25"]]);
wx.createPage(MiniProgramPage);
