const electron = require('electron');
const path = require('path');
const url = require('url');

var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu;

// Electron part =======================================

let win;
function createWindow() {
  win = new BrowserWindow({width: 800, height: 675});
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'public', 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  win.on('closed', () => {
    win = null
  });
  require('./module/mac')(app, Menu);
  // win.webContents.openDevTools();
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

// ipc part =======================================
var ipc = electron.ipcMain;
const tx = require('./module/transaction');

ipc.on('stx', function(event, arg) {
  console.log("arg : ", arg);
  event.sender.send('stx-reply', tx.decodeTx(arg));
});

ipc.on('rtx', function(event, arg) {
  console.log("arg : ", arg);
  event.sender.send('rtx-reply', tx.checkTx(arg.stx, arg.rtx));
});
