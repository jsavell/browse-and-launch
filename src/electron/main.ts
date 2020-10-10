import {app, BrowserWindow, ipcMain} from 'electron';
import {IpcChannelInterface} from "./IPC/IpcChannelInterface";
import {MoviesChannel} from "./IPC/MoviesChannel";
import {LauncherChannel} from "./IPC/LauncherChannel";
const { is } = require('electron-util');
const TouchscreenWindow = require('electron-touchscreen');

class Main {
  private mainWindow: BrowserWindow;

  public init(ipcChannels: IpcChannelInterface[]) {
    require('dotenv').config();
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
    this.mainWindow = new TouchscreenWindow({
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
    this.mainWindow.loadFile(__dirname+'/../assets/html/index.html');
  }

  private registerIpcChannels(ipcChannels: IpcChannelInterface[]) {
    ipcChannels.forEach(channel => ipcMain.on(channel.getName(), (event, request) => channel.handle(event, request)));
  }
}

(new Main()).init([
  new MoviesChannel(),
  new LauncherChannel()
]);
