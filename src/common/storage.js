//本地缓存服务
const PREFIX = "chat_";

const USER_PREFIX = `${PREFIX}user_`;
const USER_TOKEN = `${USER_PREFIX}token`;
const USER_INFO = `${USER_PREFIX}info`;

const set = (key, value) => {
  localStorage.setItem(key, value);
};

const get = key => localStorage.getItem(key);

const del = key => {
  localStorage.removeItem(key);
};

export default {
  set,
  get,
  del,
  USER_TOKEN,
  USER_INFO
};
