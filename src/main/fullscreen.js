const { BrowserWindow, ipcMain } = require('electron');
const { t } = require('./locale');

// Touch-friendly fullscreen control.
// The overlay button itself lives in preload.js (injected into the page);
// this module wires window events, keyboard shortcuts and the IPC it uses.

function toggle(win) {
  if (!win || win.isDestroyed()) return;
  win.setFullScreen(!win.isFullScreen());
}

function register(win) {
  const notify = () => {
    if (!win.isDestroyed()) win.webContents.send('fullscreen-changed', win.isFullScreen());
  };
  win.on('enter-full-screen', notify);
  win.on('leave-full-screen', notify);

  win.webContents.on('before-input-event', (event, input) => {
    if (input.type !== 'keyDown' || input.isAutoRepeat) return;
    if (input.key === 'F11') {
      // Prevent the menu's togglefullscreen accelerator from toggling a second time
      event.preventDefault();
      toggle(win);
    } else if (input.key === 'Escape' && win.isFullScreen()) {
      // Not prevented: the page still receives Esc (e.g. to close its own dialogs)
      win.setFullScreen(false);
    }
  });
}

let ipcRegistered = false;

function registerIpc() {
  if (ipcRegistered) return;
  ipcRegistered = true;

  ipcMain.on('fullscreen-toggle', (event) => {
    toggle(BrowserWindow.fromWebContents(event.sender));
  });

  ipcMain.handle('fullscreen-state', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    return {
      fullscreen: !!(win && !win.isDestroyed() && win.isFullScreen()),
      enterLabel: t('context.fullscreen'),
      exitLabel: t('context.exitFullscreen'),
    };
  });
}

module.exports = { register, registerIpc, toggle };
