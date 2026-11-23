const translations = {
  tr: {
    // Menu
    'menu.file': 'Dosya',
    'menu.newWindow': 'Yeni Pencere',
    'menu.settings': 'Ayarlar',
    'menu.quit': 'Çıkış',
    'menu.view': 'Görünüm',
    'menu.reload': 'Yenile',
    'menu.forceReload': 'Zorla Yenile',
    'menu.resetZoom': 'Varsayılan Yakınlaştırma',
    'menu.zoomIn': 'Yakınlaştır',
    'menu.zoomOut': 'Uzaklaştır',
    'menu.fullscreen': 'Tam Ekran',
    'menu.help': 'Yardım',
    'menu.about': 'Hakkında',
    'menu.website': 'inSCADA Web Sitesi',
    'menu.docs': 'Dokümantasyon',

    // Context menu
    'context.fullscreen': 'Tam Ekran',
    'context.exitFullscreen': 'Tam Ekrandan Çık',
    'context.zoomIn': 'Yakınlaştır',
    'context.zoomOut': 'Uzaklaştır',
    'context.resetZoom': 'Varsayılan Yakınlaştırma',

    // Tray
    'tray.open': 'Aç',
    'tray.toggleFullscreen': 'Tam Ekran Aç/Kapat',
    'tray.settings': 'Ayarlar',
    'tray.quit': 'Çıkış',

    // Window titles
    'title.settings': 'Ayarlar',
    'title.about': 'Hakkında',

    // Settings page
    'settings.title': 'Ayarlar',
    'settings.serverUrl': 'Sunucu URL',
    'settings.appLanguage': 'Uygulama Dili',
    'settings.browserLanguage': 'Tarayıcı Dili',
    'settings.autoStart': 'Windows başlangıcında otomatik aç',
    'settings.minimizeToTray': 'Kapatınca sistem tepsisine küçült',
    'settings.startMinimized': 'Küçültülmüş olarak başlat',
    'settings.cancel': 'İptal',
    'settings.save': 'Kaydet',

    // Connecting page
    'connecting.title': 'Bağlanıyor...',
    'connecting.info': 'Sunucu erişilebilir olduğunda otomatik bağlanılacak.',
    'connecting.certRejectedTitle': 'Sertifika Reddedildi',
    'connecting.certRejectedInfo': 'Sunucunun güvenlik sertifikasını reddettiniz. Yeniden denemek için Ayarlar\'dan bağlantıyı yenileyin.',

    // Certificate trust dialog
    'cert.title': 'Güvenilmeyen Sertifika',
    'cert.message': '{host} adresindeki sunucu güvenilir olmayan (self-signed) bir sertifika sunuyor. Bu sunucuya güvenip devam etmek istiyor musunuz?',
    'cert.fingerprint': 'Parmak İzi',
    'cert.warning': 'Bu sunucuyu tanımıyorsanız veya sertifikanın beklenmedik şekilde değiştiğini düşünüyorsanız devam etmeyin.',
    'cert.trust': 'Güven ve Bağlan',
    'cert.cancel': 'İptal',

    // Splash page
    'splash.loading': 'Yükleniyor...',

    // About page
    'about.description': 'Web tabanlı SCADA/HMI panellerinizi\nmasaüstü uygulaması olarak görüntüleyin.',
    'about.docs': 'Dokümantasyon',
    'about.copyright': '© 2025 inSCADA. Tüm hakları saklıdır.',
  },

  en: {
    // Menu
    'menu.file': 'File',
    'menu.newWindow': 'New Window',
    'menu.settings': 'Settings',
    'menu.quit': 'Quit',
    'menu.view': 'View',
    'menu.reload': 'Reload',
    'menu.forceReload': 'Force Reload',
    'menu.resetZoom': 'Reset Zoom',
    'menu.zoomIn': 'Zoom In',
    'menu.zoomOut': 'Zoom Out',
    'menu.fullscreen': 'Fullscreen',
    'menu.help': 'Help',
    'menu.about': 'About',
    'menu.website': 'inSCADA Website',
    'menu.docs': 'Documentation',

    // Context menu
    'context.fullscreen': 'Fullscreen',
    'context.exitFullscreen': 'Exit Fullscreen',
    'context.zoomIn': 'Zoom In',
    'context.zoomOut': 'Zoom Out',
    'context.resetZoom': 'Reset Zoom',

    // Tray
    'tray.open': 'Open',
    'tray.toggleFullscreen': 'Toggle Fullscreen',
    'tray.settings': 'Settings',
    'tray.quit': 'Quit',

    // Window titles
    'title.settings': 'Settings',
    'title.about': 'About',

    // Settings page
    'settings.title': 'Settings',
    'settings.serverUrl': 'Server URL',
    'settings.appLanguage': 'Application Language',
    'settings.browserLanguage': 'Browser Language',
    'settings.autoStart': 'Open automatically at Windows startup',
    'settings.minimizeToTray': 'Minimize to system tray on close',
    'settings.startMinimized': 'Start minimized',
    'settings.cancel': 'Cancel',
    'settings.save': 'Save',

    // Connecting page
    'connecting.title': 'Connecting...',
    'connecting.info': 'Will automatically connect when the server is available.',
    'connecting.certRejectedTitle': 'Certificate Rejected',
    'connecting.certRejectedInfo': 'You rejected the server\'s security certificate. Reconnect from Settings to try again.',

    // Certificate trust dialog
    'cert.title': 'Untrusted Certificate',
    'cert.message': 'The server at {host} is presenting an untrusted (self-signed) certificate. Do you want to trust this server and continue?',
    'cert.fingerprint': 'Fingerprint',
    'cert.warning': 'Do not continue if you do not recognize this server or believe the certificate has changed unexpectedly.',
    'cert.trust': 'Trust & Connect',
    'cert.cancel': 'Cancel',

    // Splash page
    'splash.loading': 'Loading...',

    // About page
    'about.description': 'View your web-based SCADA/HMI panels\nas a desktop application.',
    'about.docs': 'Documentation',
    'about.copyright': '© 2025 inSCADA. All rights reserved.',
  },
};

let currentLocale = 'tr';

function setLocale(lang) {
  if (translations[lang]) {
    currentLocale = lang;
  }
}

function getLocale() {
  return currentLocale;
}

function t(key) {
  const dict = translations[currentLocale] || translations.tr;
  return dict[key] || key;
}

function getStrings() {
  return { ...(translations[currentLocale] || translations.tr) };
}

module.exports = { setLocale, getLocale, t, getStrings };
