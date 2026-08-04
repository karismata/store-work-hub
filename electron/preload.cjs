const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  checkForUpdate: () => ipcRenderer.invoke('check-for-update'),
  quitAndInstall: () => ipcRenderer.invoke('quit-and-install'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', (event, info) => callback(info)),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', (event, info) => callback(info))
});
