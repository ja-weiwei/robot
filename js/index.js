// 验证是否登录，如果没有登录，跳转到登录页
(async function () {
  const resp = await API.profile();
  const user = resp.data;

  //   console.log(user);
  if (!user) {
    alert(resp.msg);
    location.href = "./login.html";
    return;
  }

  const doms = {
    aside: {
      nickname: $("#nickname"),
      loginId: $("#loginId"),
    },
    close: $(".close"),
    chatContainer: $(".chat-container"),
    txtMsg: $("#txtMsg"),
    messageContainer: $(".msg-container"),
  };
  //   //下面的代码环境是登录状态
  setUserInfo();
  //   注销事件
  doms.close.onclick = function () {
    API.loginOut();
    location.href = "./login.html";
  };

  //  设置用户信息
  function setUserInfo() {
    doms.aside.nickname.innerText = user.nickname;
    doms.aside.loginId.innerText = user.loginId;
  }

  //   根据消息对象，将其添加到页面中
  function addChat(chatInfo) {
    const div = $$$("div");
    div.classList.add("chat-item");
    if (chatInfo.from) {
      div.classList.add("me");
    }
    const img = $$$("img");
    img.className = "chat-avatar";
    img.src = chatInfo.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";

    const content = $$$("div");
    content.className = "chat-content";
    content.innerText = chatInfo.content;

    const date = $$$("div");
    date.className = "chat-date";
    date.innerText = formatDate(chatInfo.createdAt);
    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(date);
    doms.chatContainer.appendChild(div);
  }

  //   时间戳转换函数
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, 0);
    const day = date.getDate().toString().padStart(2, 0);
    const hour = date.getHours().toString().padStart(2, 0);
    const minute = date.getMinutes().toString().padStart(2, 0);
    const second = date.getSeconds().toString().padStart(2, 0);
    return `${year}-${month}-${day}-${hour}-${minute}-${second}`;
  }

  //   加载历史记录
  await loadHistory();
  async function loadHistory() {
    const resp = await API.getHistory();
    for (const item of resp.data) {
      //apis.tianapi.com/robot/index
      //   console.log(item);
      https: addChat(item);
    }
    scrollBottom();
  }

  //   让聊天区域的滚动条到底
  function scrollBottom() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
    // console.log(doms.chatContainer.scrollHeight);
  }

  async function sendChat() {
    const content = doms.txtMsg.value.trim();
    if (!content) {
      return;
    }
    // 我发的
    addChat({
      from: user.loginId,
      to: null,
      createdAt: Date.now(),
      content,
    });
    doms.txtMsg.value = "";
    scrollBottom();
    const resp = await API.sendChat(content);
    // 机器人回的
    addChat({
      form: null,
      to: user.loginId,
      ...resp.data,
    });
    scrollBottom();
  }
  doms.messageContainer.onsubmit = function (e) {
    e.preventDefault();
    sendChat();
  };
})();
