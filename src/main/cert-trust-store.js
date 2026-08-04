const fs = require('fs');
const path = require('path');
const { app } = require('electron');

let filePath;

function getFilePath() {
  if (!filePath) {
    filePath = path.join(app.getPath('userData'), 'trusted-certs.json');
  }
  return filePath;
}

function load() {
  try {
    const data = fs.readFileSync(getFilePath(), 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function save(store) {
  fs.writeFileSync(getFilePath(), JSON.stringify(store, null, 2), 'utf-8');
}

function isTrusted(hostPort, fingerprint) {
  const store = load();
  return store[hostPort] === fingerprint;
}

function trust(hostPort, fingerprint) {
  const store = load();
  store[hostPort] = fingerprint;
  save(store);
}

module.exports = { isTrusted, trust };
