// Penangkap tes webhook CJ Kreasi v2 — SEMENTARA, hanya untuk diagnosis.
// GET: echo hub.challenge kalau verify token cocok (verifikasi Meta).
// POST: teruskan body ke webhook.site; balas 'forwarded' kalau terusannya 2xx, 'forward-failed' kalau tidak.
// HAPUS file ini + kembalikan webhook ke bot setelah tes selesai.
const https = require('https');
const FORWARD_URL = 'https://webhook.site/0c1c0353-c27e-451a-914a-ee19b53a9853';
const VERIFY_TOKEN = 'cj-kreasi-verify';

function forward(body) {
  return new Promise((resolve) => {
    let u;
    try { u = new URL(FORWARD_URL); } catch (e) { resolve(false); return; }
    const req = https.request({ hostname: u.hostname, path: u.pathname + (u.search || ''), method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, (res) => { res.resume(); res.on('end', () => resolve(res.statusCode >= 200 && res.statusCode < 300)); });
    req.on('error', () => resolve(false));
    req.setTimeout(8000, () => { req.destroy(); resolve(false); });
    req.end(body);
  });
}

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const q = req.query || {};
    if (q['hub.mode'] === 'subscribe' && q['hub.verify_token'] === VERIFY_TOKEN) {
      res.status(200).send(q['hub.challenge'] || '');
      return;
    }
    res.status(200).send('catcher ok v2');
    return;
  }
  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
    const ok = await forward(body);
    res.status(200).send(ok ? 'forwarded' : 'forward-failed');
    return;
  }
  res.status(405).send('method not allowed');
};
