// electron-builder calls this function for every .exe that wants signing — the
// main app .exe and the NSIS installer itself. Each call invokes
// scripts/sign-one.ps1, which delegates to signtool with the GlobalSign EV cert
// on the SafeNet eToken.
//
// SafeNet caches the PIN for the rest of the session after the first dialog, so
// a full build prompts the operator exactly once. That is also why the release
// build cannot run on a hosted CI runner: the token has to be physically
// present. See README — releases are cut locally.

const path = require('path');
const { execFileSync } = require('child_process');

exports.default = async function sign(configuration) {
  const target = configuration.path;
  if (!target) return;
  if (process.env.SKIP_SIGNING === '1') {
    console.log(`[sign] SKIP_SIGNING=1 — leaving ${path.basename(target)} unsigned`);
    return;
  }
  const script = path.join(__dirname, 'sign-one.ps1');
  try {
    execFileSync(
      'powershell.exe',
      ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', script, '-ExePath', target],
      { stdio: 'inherit' }
    );
  } catch (e) {
    throw new Error(`Sign failed for ${target}: ${e.message}`);
  }
};
