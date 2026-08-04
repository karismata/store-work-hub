const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');

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
      sandbox: false
    }
  });

  const isDev = !app.isPackaged && process.env.NODE_ENV === 'development';

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Explicit Auto Update Notifications
  if (!isDev) {
    try {
      const { autoUpdater } = require('electron-updater');

      autoUpdater.on('update-available', (info) => {
        dialog.showMessageBox(win, {
          type: 'info',
          title: '새 버전 업데이트 감지',
          message: `새로운 최신 기능 버전(${info.version})이 출시되었습니다!`,
          detail: '최신 기능 패치를 자동으로 다운로드합니다. 완료 시 안내창이 나타납니다.',
          buttons: ['확인']
        });
      });

      autoUpdater.on('update-downloaded', (info) => {
        dialog.showMessageBox(win, {
          type: 'question',
          title: '업데이트 준비 완료',
          message: '최신 버전 업데이트 다운로드가 완료되었습니다.',
          detail: '지금 프로그램을 재시작하여 최신 기능을 적용하시겠습니까?',
          buttons: ['지금 재시작하여 최신버전 적용', '나중에 재시작']
        }).then((result) => {
          if (result.response === 0) {
            autoUpdater.quitAndInstall();
          }
        });
      });

      autoUpdater.checkForUpdatesAndNotify().catch(err => {
        console.log('Auto updater check note:', err);
      });
    } catch (e) {}
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
