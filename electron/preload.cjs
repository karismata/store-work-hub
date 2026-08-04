const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  checkForUpdate: () => ipcRenderer.invoke('check-for-update'),
  quitAndInstall: () => ipcRenderer.invoke('quit-and-install'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', (event, info) => callback(info)),
  onDownloadProgress: (callback) => ipcRenderer.on('download-progress', (event, progressObj) => callback(progressObj)),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', (event, info) => callback(info))
});
