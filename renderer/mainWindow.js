const { ipcRenderer, clipboard } = require("electron");
const notification = require("../utils/notification");
const Store = require("electron-store");

const configStore = new Store("config");

document.addEventListener("DOMContentLoaded", function() {
  var elems = document.querySelectorAll(".tooltipped");
  var modalNode = document.querySelector("#modal1");
  M.Tooltip.init(elems);
  let modalInst = M.Modal.init(modalNode);
  console.log(modalInst);
  // 请求服务器信息
  ipcRenderer.send("request-server-info");

  const copyBtn = document.querySelector("#copy");
  const clearBtn = document.querySelector("#clear");
  const settingsBtn = document.querySelector("#settings");
  const textarea = document.querySelector("#textarea");

  copyBtn.addEventListener("click", () => {
    let text = textarea.value.trim();
    if (text) {
      copyToClipboard(text);
      notification();
    }
  });

  clearBtn.addEventListener("click", () => {
    textarea.value = "";
  });

  settingsBtn.addEventListener("click", () => {
    let showNotification = configStore.get("showNotification");
    document.querySelector("#show-notification").checked = showNotification;
    modalInst.open();
  });

  /* Modal Action */
  const btnSaveSetting = document.querySelector("#btn-save-setting");

  btnSaveSetting.addEventListener("click", e => {
    const showNotification = document.querySelector("#show-notification")
      .checked;
    console.log(showNotification);
    configStore.set("showNotification", showNotification);
  });
});

// 接收到消息，显示在textarea中
let clipboardTimer = false;

const handleTimeOut = () => {
  notification();
  clipboardTimer = false;
};

ipcRenderer.on("received-data", (e, data) => {
  let text = data.trim();
  document.querySelector("#textarea").value = text;
  copyToClipboard(text);

  // 清除未执行的代码，重置回初始化状态
  clearTimeout(clipboardTimer);
  clipboardTimer = setTimeout(handleTimeOut, 2000);
});

function copyToClipboard(text) {
  console.log("copy to clipboard");
  clipboard.writeText(text);
}

ipcRenderer.on("reply-server-info", (event, serverInfo) => {
  console.log(serverInfo);
  const url = `http://${serverInfo.ip}:${serverInfo.port}`;

  document.title = `Text-Mobile2PC PC端(${url})`;
});

// notifier.notify({
//   title: "复制成功",
//   message: "文字已复制到剪切板",
//   id: 1,
//   sound: false,
//   icon: path.join(__dirname, "../../images/copy.png")
// });

// console.log(__dirname)
