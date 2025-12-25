
const { app, BrowserWindow } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    minWidth: 1024,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // For simple interaction in this demo structure
    },
    title: "KisanID Pro Software Suite",
    // icon: path.join(__dirname, 'public/icon.png') // Uncomment if you have an icon
  });

  // Remove the default menu bar for a software-like feel
  mainWindow.setMenuBarVisibility(false);

  // Load the app
  // In development, we load from the Vite dev server
  // In production, we load the built index.html
  const isDev = !app.isPackaged;
  
  if (isDev) {
    // Wait a bit for Vite to start if running concurrently
    setTimeout(() => {
        mainWindow.loadURL('http://localhost:5173');
    }, 1000);
    // mainWindow.webContents.openDevTools(); // Uncomment to debug
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
