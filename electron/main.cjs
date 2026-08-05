const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');
const path = require('path');

// Enforce Single Instance Lock: prevents multiple duplicate instances from running
const gotTheLock = app.requestSingleInstanceLock();
let mainWindow = null;

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: '매장 관리 업무 Hub',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  mainWindow = win;

  // Open all external links in system default browser (Chrome/Edge), never white popup window
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  const isDev = !app.isPackaged && process.env.NODE_ENV === 'development';

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Handle open external IPC
  ipcMain.handle('open-external', async (event, url) => {
    if (url) shell.openExternal(url);
  });

  // Explicit Auto Update System with GitHub Feed URL
  if (!isDev) {
    try {
      const { autoUpdater } = require('electron-updater');

      autoUpdater.setFeedURL({
        provider: 'github',
        owner: 'karismata',
        repo: 'store-work-hub'
      });

      autoUpdater.autoDownload = true;
      autoUpdater.autoInstallOnAppQuit = true;

      ipcMain.handle('check-for-update', async () => {
        try {
          return await autoUpdater.checkForUpdates();
        } catch (e) {
          console.log('IPC check update error:', e.message);
        }
      });

      ipcMain.handle('quit-and-install', () => {
        autoUpdater.quitAndInstall(true, true);
      });

      autoUpdater.on('update-available', (info) => {
        win.webContents.send('update-available', info);
      });

      autoUpdater.on('update-not-available', (info) => {
        win.webContents.send('update-not-available', info);
      });

      autoUpdater.on('download-progress', (progressObj) => {
        win.webContents.send('download-progress', progressObj);
      });

      autoUpdater.on('update-downloaded', (info) => {
        win.webContents.send('update-downloaded', info);
        dialog.showMessageBox(win, {
          type: 'question',
          title: '🎉 업데이트 준비 완료',
          message: `최신 버전(v${info.version}) 패치가 무인 다운로드 완료되었습니다.`,
          detail: '지금 즉시 기존 앱을 자동 종료하고 최신 버전으로 1초 재시작하시겠습니까?',
          buttons: ['지금 즉시 자동 재시작하여 적용', '나중에 적용']
        }).then((result) => {
          if (result.response === 0) {
            autoUpdater.quitAndInstall(true, true);
          }
        });
      });

      autoUpdater.on('error', (err) => {
        console.log('AutoUpdater error:', err.message);
      });

      // Check for updates automatically on startup
      setTimeout(() => {
        autoUpdater.checkForUpdatesAndNotify().catch(err => {
          console.log('Auto updater check note:', err);
        });
      }, 2000);
    } catch (e) {
      console.log('Auto updater init note:', e);
    }
  }
}

app.whenReady().then(() => {
  if (gotTheLock) {
    createWindow();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0 && gotTheLock) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
