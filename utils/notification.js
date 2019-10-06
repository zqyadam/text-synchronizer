const notifier = require("node-notifier");
const path = require("path");
const isDev = require("electron-is-dev");
const Store = require("electron-store");

const configStore = new Store("config");

const notification = () => {
  const showNotification = configStore.get("showNotification");
  if (showNotification) {
    notifier.notify({
      title: "复制成功",
      message: "文字已复制到剪切板",
      id: 1,
      sound: false,
      icon: isDev
        ? path.join(__dirname, "../images/copy.png")
        : path.join(__dirname, "../../images/copy.png")
    });
  }
};

module.exports = notification;
