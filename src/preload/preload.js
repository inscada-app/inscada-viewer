const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('inscada', {
  getConnectionStatus: () => ipcRenderer.invoke('get-connection-status'),
  getVersion: () => ipcRenderer.invoke('app-version'),
  getLocaleStrings: () => ipcRenderer.invoke('get-locale-strings'),
});

// Bridge for the inSCADA web UI (inscada-react): lets the app's own right-click
// menu offer Fullscreen / Exit Fullscreen when running inside the Viewer. The UI
// feature-detects `window.inscadaViewer` and falls back to the browser Fullscreen
// API otherwise. Only this window's own fullscreen state can be read or changed.
const fullscreenListeners = new Set();
ipcRenderer.on('fullscreen-changed', (_e, fs) => {
  for (const cb of fullscreenListeners) {
    try { cb(!!fs); } catch { /* listener errors must not break others */ }
  }
});

contextBridge.exposeInMainWorld('inscadaViewer', {
  apiVersion: 1,
  isFullscreen: () => ipcRenderer.invoke('fullscreen-state').then((s) => !!s.fullscreen),
  toggleFullscreen: () => ipcRenderer.send('fullscreen-toggle'),
  setFullscreen: (on) => ipcRenderer.send('fullscreen-set', !!on),
  onFullscreenChange: (cb) => {
    if (typeof cb !== 'function') return () => {};
    fullscreenListeners.add(cb);
    return () => fullscreenListeners.delete(cb);
  },
});

// ---------------------------------------------------------------------------
// Touch-friendly fullscreen button.
// Swiping down from the top edge (touch / pen), or moving the mouse to the very
// top while in fullscreen, slides in a large "Exit Fullscreen" / "Fullscreen"
// button that hides itself after a few seconds. Nothing is exposed to the page:
// the button sits in a closed shadow root and only trusted input is honoured.
// The page's own taps near the top are never blocked; only a swipe shows it.
// ---------------------------------------------------------------------------
const EDGE_PX = 40; // a swipe must start within this distance of the top
const SWIPE_PX = 30; // and travel at least this far downward
const HIDE_MS = 4000;

function setupFullscreenButton() {
  if (window.top !== window || document.getElementById('__inscada-fs-host')) return;

  const host = document.createElement('div');
  host.id = '__inscada-fs-host';
  host.style.cssText =
    'position:fixed;top:0;left:0;width:0;height:0;z-index:2147483647;pointer-events:none;';
  const root = host.attachShadow({ mode: 'closed' });
  root.innerHTML = `
    <style>
      .pill {
        position: fixed; left: 50%; top: 12px;
        transform: translate(-50%, -160%);
        transition: transform .22s ease-out;
        display: flex; align-items: center; gap: 10px;
        min-height: 52px; padding: 0 24px; border: 0; border-radius: 999px;
        background: rgba(20, 26, 34, .92); color: #fff;
        font: 600 16px "Segoe UI", system-ui, sans-serif;
        box-shadow: 0 6px 24px rgba(0, 0, 0, .4);
        cursor: pointer; overflow: hidden; pointer-events: none;
        touch-action: manipulation; -webkit-user-select: none; user-select: none;
      }
      .pill.show { transform: translate(-50%, 0); pointer-events: auto; }
      .pill svg { width: 22px; height: 22px; flex: none; }
      .timer {
        position: absolute; left: 0; bottom: 0; height: 3px; width: 100%;
        background: #e8631a; transform-origin: left;
      }
      .pill.show .timer { animation: drain ${HIDE_MS}ms linear forwards; }
      @keyframes drain { to { transform: scaleX(0); } }
      @media (prefers-reduced-motion: reduce) {
        .pill { transition: none; }
        .pill.show .timer { animation: none; }
      }
    </style>
    <button class="pill" type="button" tabindex="-1">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round"><path class="ico"/></svg>
      <span class="label"></span>
      <span class="timer"></span>
    </button>`;

  const pill = root.querySelector('.pill');
  const label = root.querySelector('.label');
  const ico = root.querySelector('.ico');
  const ICON_EXIT = 'M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5';
  const ICON_ENTER = 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5';

  let hideTimer = null;
  let isFullscreen = false;

  async function show() {
    try {
      const state = await ipcRenderer.invoke('fullscreen-state');
      isFullscreen = state.fullscreen;
      label.textContent = isFullscreen ? state.exitLabel : state.enterLabel;
      ico.setAttribute('d', isFullscreen ? ICON_EXIT : ICON_ENTER);
    } catch {
      return;
    }
    pill.classList.remove('show');
    void pill.offsetWidth; // restart the countdown animation
    pill.classList.add('show');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, HIDE_MS);
  }

  function hide() {
    clearTimeout(hideTimer);
    pill.classList.remove('show');
  }

  pill.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.isTrusted) return;
    hide();
    ipcRenderer.send('fullscreen-toggle');
  });

  // Touch: use touch events so the gesture still registers while the page scrolls
  let touchStartY = null;
  window.addEventListener('touchstart', (e) => {
    if (!e.isTrusted || e.touches.length !== 1) { touchStartY = null; return; }
    const y = e.touches[0].clientY;
    touchStartY = y <= EDGE_PX ? y : null;
  }, { capture: true, passive: true });

  window.addEventListener('touchmove', (e) => {
    if (touchStartY === null || !e.isTrusted) return;
    if (e.touches[0].clientY - touchStartY >= SWIPE_PX) {
      touchStartY = null;
      show();
    }
  }, { capture: true, passive: true });

  window.addEventListener('touchend', () => { touchStartY = null; }, { capture: true, passive: true });

  // Pen: same swipe via pointer events. Mouse: touching the top edge in fullscreen.
  let penStartY = null;
  window.addEventListener('pointerdown', (e) => {
    if (!e.isTrusted) return;
    if (e.pointerType === 'pen') penStartY = e.clientY <= EDGE_PX ? e.clientY : null;
    // Tapping anywhere else dismisses the button early
    if (pill.classList.contains('show') && !e.composedPath().includes(pill)) hide();
  }, { capture: true, passive: true });

  window.addEventListener('pointermove', (e) => {
    if (!e.isTrusted) return;
    if (e.pointerType === 'pen' && penStartY !== null && e.clientY - penStartY >= SWIPE_PX) {
      penStartY = null;
      show();
    } else if (e.pointerType === 'mouse' && isFullscreen && e.clientY <= 1 && !pill.classList.contains('show')) {
      show();
    }
  }, { capture: true, passive: true });

  window.addEventListener('pointerup', () => { penStartY = null; }, { capture: true, passive: true });

  ipcRenderer.on('fullscreen-changed', (_e, fs) => {
    isFullscreen = fs;
    hide();
  });
  ipcRenderer.invoke('fullscreen-state').then((s) => { isFullscreen = s.fullscreen; }).catch(() => {});

  // Attach to <html> rather than <body> so SPA body swaps don't remove it
  document.documentElement.appendChild(host);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupFullscreenButton, { once: true });
} else {
  setupFullscreenButton();
}
