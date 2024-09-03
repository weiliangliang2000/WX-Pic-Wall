"use strict";
const common_vendor = require("../common/vendor.js");
let SYSTEM_INFO = common_vendor.index.getSystemInfoSync();
const getStatusBarHeight = () => SYSTEM_INFO.statusBarHeight || 15;
const getTitleBarHeight = () => {
  if (typeof common_vendor.index.getMenuButtonBoundingClientRect === "function") {
    let { top, height } = common_vendor.index.getMenuButtonBoundingClientRect();
    let titlebarheight = (top - getStatusBarHeight()) * 2 + height;
    return titlebarheight;
  } else {
    return 40;
  }
};
exports.getStatusBarHeight = getStatusBarHeight;
exports.getTitleBarHeight = getTitleBarHeight;
