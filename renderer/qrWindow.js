const { ipcRenderer } = require("electron");
const QRCode = require("qrcode");
const canvas = document.getElementById("canvas");

document.addEventListener("DOMContentLoaded", e => {
  console.log(e);
  ipcRenderer.send("request-server-info");
});

ipcRenderer.on("reply-server-info", (event, serverInfo) => {
  console.log(serverInfo);
  const url = `http://${serverInfo.ip}:${serverInfo.port}`;
  generateQRCode(url);
  const ipInfo = document.querySelector("#ip-info");
  ipInfo.textContent = url;
});

function generateQRCode(text) {
  QRCode.toCanvas(canvas, text, function(error) {
    if (error) console.error(error);
    console.log("qrcode generate success!");
  });
}
