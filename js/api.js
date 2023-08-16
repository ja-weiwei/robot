var API = (function () {
  const BASE_URL = "https://study.duyiedu.com";
  const TOKEN_KEY = "token";

  // 封装get请求
  function get(path) {
    const headers = {};
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, { headers });
  }

  // 封装post请求
  function post(path, bodyObj) {
    const headers = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, {
      headers,
      method: "POST",
      body: JSON.stringify(bodyObj),
    });
  }

  // 注册账号
  async function reg(userInfo) {
    return await post("/api/user/reg", userInfo).then((resp) => resp.json());
  }
  // 登录账号
  async function login(loginInfo) {
    const resp = await post("/api/user/login", loginInfo);
    const result = await resp.json();
    if (result.code === 0) {
      const token = resp.headers.get("Authorization");
      localStorage.setItem(TOKEN_KEY, token);
    }
    return result;
  }

  // 验证账号是否存在
  async function exists(loginId) {
    const resp = await get("/api/user/exists?loginId=" + loginId);
    return await resp.json();
  }

  // 获取当前登录的用户信息
  async function profile() {
    const resp = await get("/api/user/profile");
    return await resp.json();
  }

  // 发送聊天消息
  async function sendChat(content) {
    const resp = await post("/api/chat", { content });
    return await resp.json();
  }

  // 获取聊天记录
  async function getHistory() {
    const resp = await get("/api/chat/history");
    return await resp.json();
  }

  // 退出登录
  function loginOut() {
    localStorage.removeItem(TOKEN_KEY);
  }
  return {
    reg,
    login,
    exists,
    profile,
    sendChat,
    getHistory,
    loginOut,
  };
})();
