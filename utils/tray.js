const { app, Tray, Menu, ipcMain } = require("electron");
const path = require('path');





function createTray() {
  appTray = new Tray(path.join(__dirname, "../images/logo_2x.png"));

  var contextMenu = Menu.buildFromTemplate([
    {
      label: "显示窗口",
      type: "normal",
      click: () => {
        ipcMain.emit('show-window');
      }
    },
    {
      label: "隐藏窗口",
      type: "normal",
      click: (menuItem, browserWindow, event) => {
        ipcMain.emit('hide-window')
      }
    },
    { type: "separator" },
    {
      label: "退出",
      type: "normal",
      click: (menuItem, browserWindow, event) => {
        app.quit();
      }
    }
  ]);

  appTray.setToolTip("T-Mobile2PC");
  appTray.setContextMenu(contextMenu);
  appTray.on("click", e => {
    ipcMain.emit('toggle-window-show');
  });
}


module.exports = createTray;