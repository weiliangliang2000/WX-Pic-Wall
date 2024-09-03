"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  (_easycom_uni_easyinput2 + _easycom_uni_data_select2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_data_select)();
}
const _sfc_main = {
  __name: "upload_pic",
  setup(__props) {
    const category_candidates = common_vendor.ref([
      { value: 0, text: "自然风景" },
      { value: 1, text: "建筑风格" },
      { value: 2, text: "美女明星" },
      { value: 3, text: "AI美图" },
      { value: 4, text: "动漫游戏" },
      { value: 5, text: "可爱萌宠" },
      { value: 6, text: "体育运动" },
      { value: 7, text: "帅哥靓仔" },
      { value: 8, text: "其他" }
    ]);
    const list = [
      "自然风景",
      "建筑风格",
      "美女明星",
      "AI美图",
      "动漫游戏",
      "可爱萌宠",
      "体育运动",
      "帅哥靓仔",
      "其他"
    ];
    const category = common_vendor.ref("");
    const tag = common_vendor.ref("");
    const description = common_vendor.ref("");
    const delID = common_vendor.ref("");
    const tempFilePaths = common_vendor.ref([]);
    function change() {
      console.log("**********************:", list[category.value]);
    }
    function chooseFile() {
      tempFilePaths.value = [];
      common_vendor.index.chooseImage({
        count: 9,
        sizeType: ["original"],
        sourceType: ["album"],
        success: (res) => {
          res.tempFilePaths.forEach((filePath) => {
            tempFilePaths.value.push({ filePath, progress: 0 });
          });
          console.log("文件路径:", res);
          common_vendor.index.showLoading({
            title: "uploading",
            mask: true
          });
          let completedCount = 0;
          tempFilePaths.value.forEach((file, index) => {
            uploadFile(file.filePath, index, () => {
              completedCount++;
              if (completedCount === tempFilePaths.value.length) {
                common_vendor.index.hideLoading();
                common_vendor.index.showToast({
                  title: "上传成功",
                  icon: "success",
                  duration: 2e3
                });
                console.log("All files uploaded successfully");
              }
            });
          });
        }
      });
    }
    function uploadFile(filePath, index, callback) {
      const uploadTask = common_vendor.index.uploadFile({
        url: utils_request.url + "upload_pic",
        // 修改为你的服务器地址
        filePath,
        name: "file",
        // 后端接收的参数名
        timeout: 6e5,
        formData: {
          "tag": tag.value,
          // 如果有其他需要传递的数据，可以放在这里
          "category_id": list[category.value],
          "description": description.value
        },
        success: (uploadRes) => {
          console.log("upload success:", uploadRes.data, "for file:", filePath);
          tempFilePaths.value[index].progress = 100;
          callback();
        },
        fail: (err) => {
          console.error("upload fail:", err, "for file:", filePath);
          common_vendor.index.showToast({
            title: err,
            icon: "none",
            duration: 3e3
          });
          callback();
        }
      });
      uploadTask.onProgressUpdate((res) => {
        tempFilePaths.value[index].progress = res.progress;
        console.log("上传进度:", res.progress, "for file:", filePath);
      });
    }
    function deleteID() {
      console.log(delID.value);
      common_vendor.index.request({
        url: utils_request.url + "delete_pic",
        method: "GET",
        data: {
          id: delID.value
          // 将要删除的ID传递给后端
        },
        success: (res) => {
          common_vendor.index.showToast({
            title: "success delete",
            icon: "none",
            duration: 2e3
          });
        }
      });
    }
    const searchImg = common_vendor.ref([]);
    function search() {
      console.log(delID.value);
      common_vendor.index.request({
        url: utils_request.url + "wallpapers/" + delID.value,
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
      delID.value = null;
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(search),
        b: common_vendor.o(onfocus),
        c: common_vendor.o(onfocus),
        d: common_vendor.o(onfocus),
        e: common_vendor.o(($event) => delID.value = $event),
        f: common_vendor.p({
          placeholder: "请输入要删除的图片ID",
          modelValue: delID.value
        }),
        g: common_vendor.o(deleteID),
        h: delID.value
      }, delID.value ? {
        i: searchImg.value.image_url,
        j: common_vendor.o(imgpreview)
      } : {}, {
        k: common_vendor.f(tempFilePaths.value, (file, index, i0) => {
          return {
            a: file.filePath,
            b: file.progress + "%",
            c: common_vendor.t(file.progress),
            d: index
          };
        }),
        l: common_vendor.o(($event) => tag.value = $event),
        m: common_vendor.p({
          placeholder: "请输入图片标签",
          modelValue: tag.value
        }),
        n: common_vendor.o(($event) => description.value = $event),
        o: common_vendor.p({
          placeholder: "请输入图片描述",
          modelValue: description.value
        }),
        p: common_vendor.o(change),
        q: common_vendor.o(($event) => category.value = $event),
        r: common_vendor.p({
          placeholder: "请选择分类",
          localdata: category_candidates.value,
          modelValue: category.value
        }),
        s: common_vendor.o(chooseFile)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-55056642"]]);
wx.createPage(MiniProgramPage);
