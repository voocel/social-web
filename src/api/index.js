/**
 * api接口的统一出口
 */
import user from "@/api/user";
import group from "@/api/group";
import friend from "@/api/friend";

// 导出接口
export default {
  user,
  group,
  friend
};
