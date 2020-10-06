import {app, BrowserWindow, ipcMain} from 'electron';
import {IpcChannelInterface} from "./IPC/IpcChannelInterface";
import {MoviesChannel} from "./IPC/MoviesChannel";
import {DevicesChannel} from "./IPC/DevicesChannel";
import {LauncherChannel} from "./IPC/LauncherChannel";
const { is } = require('electron-util');

class Main {
  private mainWindow: BrowserWindow;

  public init(ipcChannels: IpcChannelInterface[]) {
    app.on('ready', this.createWindow);
    app.on('window-all-closed', this.onWindowAllClosed);
    app.on('activate', this.onActivate);

    this.registerIpcChannels(ipcChannels);
  }

  private onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }

  private onActivate() {
    if (!this.mainWindow) {
      this.createWindow();
    }
  }

  private createWindow() {
    this.mainWindow = new BrowserWindow({
      show: false,
      frame: false,
      title: `Movie Launcher`,
      webPreferences: {
        nodeIntegration: true,
        devTools: is.development
      }
    });
    this.mainWindow.maximize();
    this.mainWindow.show();
    if (is.development) {
      this.mainWindow.webContents.openDevTools();
    }
    this.mainWindow.loadFile('../../index.html');
  }

  private registerIpcChannels(ipcChannels: IpcChannelInterface[]) {
    ipcChannels.forEach(channel => ipcMain.on(channel.getName(), (event, request) => channel.handle(event, request)));
  }
}

(new Main()).init([
  new MoviesChannel(),
  new DevicesChannel(),
  new LauncherChannel()
]);
