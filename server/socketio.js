const { ipcMain } = require("electron");
let hasUserLoggedIn = false;
const socketio = io => {
  io.on("connection", socket => {
    console.log(hasUserLoggedIn)
    if (hasUserLoggedIn) {
      socket.emit("refuse-login");
      return;
    }
    console.log("a user connected");
    ipcMain.emit("user-scanned-qrcode");
    hasUserLoggedIn = true;
    socket.on("input", data => {
      ipcMain.emit("receive-data", data);
    });
    socket.on("disconnect", () => {
      console.log("a user disconnected");
      hasUserLoggedIn = false;
      ipcMain.emit("user-exit");
    });
  });
};

module.exports = socketio;
