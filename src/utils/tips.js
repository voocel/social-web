import { MessageBox } from "element-ui";
import { Message } from "element-ui";
import router from "@/router";
const tips = {
  /**
   * 重新登陆确认提示
   */
  reLoginTip() {
    MessageBox.confirm(
      "登录状态已过期，您可以继续留在该页面，或者重新登录",
      "系统提示",
      {
        confirmButtonText: "重新登陆",
        cancelButtonText: "取消",
        type: "warning"
      }
    )
      .then(() => {
        tips.toLogin();
      })
      .catch(() => {});
  },

  /**
   * 消息提示
   * 禁止点击蒙层、显示一秒后关闭
   */
  msgTip(msg) {
    Message({
      showClose: true,
      message: msg,
      duration: 2000,
      type: "warn"
    });
  },

  /**
   * 跳转登录页
   * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
   */
  toLogin() {
    console.log("重新登录..");
    router.replace({
      path: "/login",
      query: {
        redirect: router.currentRoute.fullPath
      }
    });
  }
};
export default tips;
