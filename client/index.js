(function() {
  const syncBtn = document.querySelector("#sync");
  const clearBtn = document.querySelector("#clear");
  const textarea = document.querySelector("#textarea");
  let socket = io();

  // 同步按钮事件
  syncBtn.addEventListener("click", e => {
    e.preventDefault();
  });
  // 清楚按钮事件
  clearBtn.addEventListener("click", e => {
    e.preventDefault();
    textarea.value = "";
  });
  // 输入事件
  textarea.addEventListener("input", e => {
    socket.emit("input", textarea.value);
  });

  // 拒绝登录
  socket.on("refuse-login", () => {
    alert("Sorry, another user is logged in");
    window.history.go(-1);
  });
})();
