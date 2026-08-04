document.addEventListener('DOMContentLoaded', async () => {
  const certRejected = new URLSearchParams(window.location.search).get('certRejected') === '1';

  if (window.inscada) {
    try {
      const status = await window.inscada.getConnectionStatus();
      document.getElementById('target-url').textContent = status.url || '';
    } catch {
      // Preload might not be available
    }

    try {
      const strings = await window.inscada.getLocaleStrings();
      document.getElementById('connecting-title').textContent = certRejected
        ? strings['connecting.certRejectedTitle']
        : strings['connecting.title'];
      document.getElementById('connecting-info').textContent = certRejected
        ? strings['connecting.certRejectedInfo']
        : strings['connecting.info'];
    } catch {
      // Locale might not be available
    }
  }

  if (certRejected) {
    document.getElementById('spinner').style.display = 'none';
    document.getElementById('status-icon').classList.add('warning');
  }
});
