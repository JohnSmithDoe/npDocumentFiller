// noinspection JSIgnoredPromiseFromCall

import {app, BrowserWindow} from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import {NpAssistant} from './np-assistant';

let win: BrowserWindow = null;
const args  = process.argv.slice(1),
      serve = args.some(val => val === '--serve');

function createWindow(): NpAssistant {

  // Create the browser window.
  win = new BrowserWindow({
                            frame:           true,
                            autoHideMenuBar: true,
                            width:           1024,
                            height:          800,
                            backgroundColor: '#dedede',
                            center:          true,
                            webPreferences:  {
                              nodeIntegration:             true,
                              allowRunningInsecureContent: serve,
                              contextIsolation:            false,
                              devTools:                    serve,
                            },
                          });

  let indexUrl = 'http://localhost:4200';
  if (serve) {
    require('electron-debug')();
    require('electron-reloader')(module, {ignore: /data|[\/\\]\./, argv: []});
  } else {
    // Path when running electron executable
    let pathIndex = '../renderer/index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/renderer/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/renderer/index.html';
    }

    indexUrl = url.format({
                                pathname: path.join(__dirname, pathIndex),
                                protocol: 'file:',
                                slashes:  true,
                              });
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  win.webContents.on('did-fail-load', (event,errorCode, errorDesc, validatedURL, isMain) => {
    // ISSUE: Maybe due to routing or some path we have to redirect to the index page
    console.log('59: did-fail-load', errorCode, errorDesc, validatedURL, isMain);
    win.loadURL(indexUrl); // REDIRECT TO FIRST WEBPAGE AGAIN
  });
  win.webContents.on('will-navigate', (ev) => {
    console.log('59: will-navigate');
  })
  win.webContents.on('will-prevent-unload', (ev) => {
    // ev.preventDefault(); Prevents App Close as well...
    console.log('59: will-prevent-unload', ev);
  })
  win.webContents.on('will-redirect', (ev) => {
    console.log('59: will-redirect');
  })
  win.loadURL(indexUrl);
  return new NpAssistant(win);
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => createWindow());

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
