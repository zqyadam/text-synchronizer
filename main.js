// Modules to control application life and create native browser window
const { app, ipcMain, Notification, Menu } = require("electron");
const portfinder = require("portfinder");
const { getIPAddress } = require("./utils/utils");
const expressApp = require("./server/server.js");
const server = require("http").createServer(expressApp);
const io = require("socket.io")(server, {
  pingTimeout: 600000
});
const AppWindow = require("./utils/AppWindow");
const createTray = require("./utils/tray");
require("./server/socketio")(io);

// window
let qrWindow;
let mainWindow;

// server info
let serverPort;
let serverIP;

Menu.setApplicationMenu(null);

// 启动服务器
const startServer = () => {
  serverIP = getIPAddress();

  portfinder
    .getPortPromise({ port: 5000, stopPort: 8000 })
    .then(port => {
      serverPort = port;
      server.listen(port, () => {
        console.log(`listening on port ${port}`);
        createQrWindow();
      });
    })
    .catch(err => {
      console.log("获取空闲端口失败");
    });

  createTray();
};

function createQrWindow() {
  qrWindow = new AppWindow(
    {
      width: 400,
      height: 460
    },
    "./renderer/qrWindow.html"
  );
  qrWindow.on("closed", function() {
    qrWindow = null;
  });

}

function createMainWindow() {
  mainWindow = new AppWindow(
    {
      width: 600,
      height: 800
    },
    "./renderer/mainWindow.html"
  );

  mainWindow.on("closed", function() {
    mainWindow = null;
  });
}

/* ipcMain事件 */
// 请求服务器相关信息
ipcMain.on("request-server-info", e => {
  e.reply("reply-server-info", {
    ip: serverIP,
    port: serverPort
  });
});

// 用户扫描二维码成功，关闭qrWindow,显示mainWindow
ipcMain.on("user-scanned-qrcode", e => {
  qrWindow.hide();
  createMainWindow();
  qrWindow.close();
});

// 将数据发送给mainWindow
ipcMain.on("receive-data", data => {
  mainWindow.webContents.send("received-data", data);
});

// 用户退出，关闭mainWindow，重新显示二维码窗口
ipcMain.on("user-exit", e => {
  console.log("userExit");
  createQrWindow();
  if (mainWindow) {
    mainWindow.close();
  }
});

// 隐藏窗口
ipcMain.on("hide-window", e => {
  if (mainWindow) {
    mainWindow.hide();
    return;
  }

  if (qrWindow) {
    qrWindow.hide();
    return;
  }
});

// 显示窗口
ipcMain.on("show-window", e => {
  if (mainWindow) {
    mainWindow.show();
    return;
  }

  if (qrWindow) {
    qrWindow.show();
    return;
  }
});

ipcMain.on("toggle-window-show", e => {
  if (mainWindow) {
    if (mainWindow.isVisible()) {
      ipcMain.emit("hide-window");
    } else {
      ipcMain.emit("show-window");
    }
    return;
  }

  if (qrWindow) {
    if (qrWindow.isVisible()) {
      ipcMain.emit("hide-window");
    } else {
      ipcMain.emit("show-window");
    }
    return;
  }
});

app.on("ready", startServer);

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
  if (qrWindow === null) createWindow();
});

// app.setAppUserModelId("text-synchronizer");
