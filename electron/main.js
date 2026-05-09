const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minimizable: false,
    resizable: false,
    kiosk: false,
    fullscreen: true,
    autoHideMenuBar: true,

    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js') // 👈 ADDED
    }
  });

  // Open maximized
  win.maximize();

  // Prevent unmaximize
  win.on('unmaximize', () => {
    win.maximize();
  });

  // Load Angular app
  win.loadURL('http://localhost:4200');
}


// 👇 ADDED: Silent print handler
ipcMain.handle('print-receipt', async () => {
  if (win) {
    win.webContents.print({
      silent: true,
      printBackground: true
    });
  }
});


app.whenReady().then(() => {
  createWindow();
});