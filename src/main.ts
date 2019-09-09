import { app, BrowserWindow } from "electron";

app.on('window-all-closed', app.quit);

app.on('ready', (): void => {
    const win: Electron.BrowserWindow = new BrowserWindow({ 
        width: 1280, 
        height: 720, 
        icon: "./img/icon.png", 
        fullscreenable: false, 
        webPreferences: {
            nodeIntegration: true, 
            devTools: false
        }
    });

    win.setMenuBarVisibility(false);
    win.loadFile("../index.html");
});