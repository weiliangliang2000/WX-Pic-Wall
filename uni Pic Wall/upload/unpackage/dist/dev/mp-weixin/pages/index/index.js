"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    function login() {
      common_vendor.index.login({
        provider: "weixin",
        success: function(loginRes) {
          common_vendor.index.getUserInfo({
            provider: "weixin",
            success: function(info) {
              console.log(info);
            }
          });
        },
        fail: function(err) {
          console.log("err:", err);
        }
      });
    }
    const tempFilePaths = common_vendor.ref([]);
    function chooseFile() {
      common_vendor.index.chooseImage({
        count: 9,
        sizeType: ["original"],
        sourceType: ["album"],
        success: (res) => {
          tempFilePaths.value = res.tempFilePaths;
          console.log("文件路径:", res);
          tempFilePaths.value.forEach((filePath) => {
            uploadFile(filePath);
          });
        }
      });
    }
    function uploadFile(filePath) {
      common_vendor.index.uploadFile({
        url: "http://127.0.0.1:5000/attachments",
        // 修改为你的服务器地址  
        filePath,
        name: "file",
        // 后端接收的参数名
        formData: {
          "user": "test"
          // 如果有其他需要传递的数据，可以放在这里
        },
        success: (uploadRes) => {
          console.log("upload success:", uploadRes.data);
        },
        fail: (err) => {
          console.error("upload fail:", err);
        }
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(chooseFile),
        b: common_assets._imports_0,
        c: common_vendor.o(login),
        d: common_assets._imports_0
      };
    };
  }
};
wx.createPage(_sfc_main);
